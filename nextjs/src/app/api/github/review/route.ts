import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/server'
import { reviewCode } from '@/lib/ai/openai'

/**
 * PR Review API
 * 
 * POST /api/github/review - Review a pull request
 * 
 * This endpoint:
 * 1. Fetches the PR diff from GitHub
 * 2. Analyzes changed files using Gemini API
 * 3. Caches the review to avoid re-analyzing the same commit
 * 4. Returns structured review data
 * 
 * Rate Limiting Strategy for Gemini Free Tier:
 * - Per-user limit: 10 reviews/day (free tier)
 * - Smart caching: Don't re-review if head SHA hasn't changed
 * - File-level caching: Cache reviews by file content hash
 * - Truncation: Only analyze first 3500 chars per file
 */

const MAX_FILES_TO_REVIEW = 10 // Limit files per PR to save API calls
const MAX_REVIEWS_PER_DAY = 10 // Free tier limit

interface Issue {
    id: string
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
    category: string
    title: string
    description: string
    lineNumber: number | null
    codeSnippet: string | null
    suggestion: string
    impact: string
}

interface FileReview {
    filename: string
    status: 'added' | 'modified' | 'removed'
    issues: Array<{
        severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
        category: string
        title: string
        description: string
        line?: number
        suggestion: string
    }>
    score: number
}

interface PRReviewResult {
    prNumber: number
    repo: string
    headSha: string
    overallScore: number
    grade: string
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    summary: string
    fileReviews: FileReview[]
    totalIssues: number
    criticalCount: number
    highCount: number
    mediumCount: number
    lowCount: number
    reviewedAt: string
    model: string
    cached: boolean
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { repo, prNumber } = body

        if (!repo || !prNumber) {
            return NextResponse.json({ error: 'Missing repo or prNumber' }, { status: 400 })
        }

        // Check rate limit
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const { data: recentReviews, error: countError } = await supabase
            .from('pr_reviews')
            .select('id', { count: 'exact', head: false })
            .eq('user_id', user.id)
            .gte('created_at', oneDayAgo)

        if (!countError && (recentReviews?.length || 0) >= MAX_REVIEWS_PER_DAY) {
            return NextResponse.json({
                error: `Daily limit reached (${MAX_REVIEWS_PER_DAY}/day). Upgrade to Premium for unlimited reviews.`,
                type: 'rate_limit',
                upgradeToPremium: true,
            }, { status: 429 })
        }

        // Get GitHub access token
        const { data: connection } = await supabase
            .from('github_connections')
            .select('access_token')
            .eq('user_id', user.id)
            .single()

        if (!connection) {
            return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 })
        }

        // Type assertion
        const accessToken = (connection as { access_token: string }).access_token

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AI-Code-Reviewer',
        }

        // Fetch PR details
        const prResponse = await fetch(
            `https://api.github.com/repos/${repo}/pulls/${prNumber}`,
            { headers }
        )

        if (!prResponse.ok) {
            return NextResponse.json({ error: 'PR not found' }, { status: 404 })
        }

        const pr = await prResponse.json()
        const headSha = pr.head.sha

        // Check cache - if we already reviewed this exact commit, return cached result
        const { data: cachedReview } = await supabase
            .from('pr_reviews')
            .select('*')
            .eq('pr_number', prNumber)
            .eq('repo_full_name', repo)
            .eq('head_sha', headSha)
            .single()

        if (cachedReview) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cached = cachedReview as any
            return NextResponse.json({
                ...cached.review_data,
                cached: true,
            })
        }

        // Fetch PR files
        const filesResponse = await fetch(
            `https://api.github.com/repos/${repo}/pulls/${prNumber}/files?per_page=100`,
            { headers }
        )

        if (!filesResponse.ok) {
            throw new Error('Failed to fetch PR files')
        }

        const files = await filesResponse.json()

        // Filter to reviewable files (code files only)
        const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.c', '.cpp', '.h', '.cs', '.rs', '.swift', '.kt']
        const reviewableFiles = files.filter((f: { filename: string }) => 
            codeExtensions.some(ext => f.filename.endsWith(ext))
        ).slice(0, MAX_FILES_TO_REVIEW)

        if (reviewableFiles.length === 0) {
            return NextResponse.json({
                error: 'No code files to review in this PR',
                type: 'no_code_files',
            }, { status: 400 })
        }

        // Review each file
        const fileReviews: FileReview[] = []
        let totalScore = 0
        let totalIssues = 0
        let criticalCount = 0
        let highCount = 0
        let mediumCount = 0
        let lowCount = 0

        for (const file of reviewableFiles) {
            try {
                // Get file content (patch/diff)
                const content = file.patch || ''
                
                if (!content || content.length < 10) {
                    continue // Skip files without meaningful changes
                }

                // Review the file
                const review = await reviewCode({
                    code: content,
                    filename: file.filename,
                    model: 'gemini-2.0-flash',
                })

                const issues: Issue[] = review.structured?.issues || []
                const fileScore = review.structured?.summary.overallScore || 70

                fileReviews.push({
                    filename: file.filename,
                    status: file.status,
                    issues: issues.map((i: Issue) => ({
                        severity: i.severity,
                        category: i.category,
                        title: i.title,
                        description: i.description,
                        line: i.lineNumber ?? undefined,
                        suggestion: i.suggestion,
                    })),
                    score: fileScore,
                })

                totalScore += fileScore
                totalIssues += issues.length
                criticalCount += issues.filter((i: Issue) => i.severity === 'critical').length
                highCount += issues.filter((i: Issue) => i.severity === 'high').length
                mediumCount += issues.filter((i: Issue) => i.severity === 'medium').length
                lowCount += issues.filter((i: Issue) => i.severity === 'low').length

                // Rate limit - wait between API calls to stay under 15 RPM
                if (reviewableFiles.indexOf(file) < reviewableFiles.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 4500)) // ~13 RPM to be safe
                }

            } catch (fileError) {
                console.error(`Error reviewing file ${file.filename}:`, fileError)
                // Continue with other files
            }
        }

        // Calculate overall metrics
        const overallScore = fileReviews.length > 0 
            ? Math.round(totalScore / fileReviews.length) 
            : 70

        const grade = 
            overallScore >= 90 ? 'A+' :
            overallScore >= 80 ? 'A' :
            overallScore >= 70 ? 'B' :
            overallScore >= 60 ? 'C' :
            overallScore >= 50 ? 'D' : 'F'

        const riskLevel: 'low' | 'medium' | 'high' | 'critical' = 
            criticalCount > 0 ? 'critical' :
            highCount > 2 ? 'high' :
            mediumCount > 5 ? 'medium' : 'low'

        // Generate summary
        const summary = generateSummary(fileReviews, totalIssues, criticalCount, highCount)

        const reviewResult: PRReviewResult = {
            prNumber,
            repo,
            headSha,
            overallScore,
            grade,
            riskLevel,
            summary,
            fileReviews,
            totalIssues,
            criticalCount,
            highCount,
            mediumCount,
            lowCount,
            reviewedAt: new Date().toISOString(),
            model: 'gemini-2.0-flash',
            cached: false,
        }

        // Store the review in database for caching
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from('pr_reviews')
            .insert({
                user_id: user.id,
                repo_full_name: repo,
                pr_number: prNumber,
                pr_title: pr.title,
                head_sha: headSha,
                base_sha: pr.base.sha,
                overall_score: overallScore,
                grade,
                risk_level: riskLevel,
                total_issues: totalIssues,
                critical_issues: criticalCount,
                high_issues: highCount,
                medium_issues: mediumCount,
                low_issues: lowCount,
                review_data: reviewResult,
                model: 'gemini-2.0-flash',
            })

        return NextResponse.json(reviewResult)

    } catch (err) {
        console.error('PR review error:', err)
        
        // Check if it's a rate limit error from Gemini
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        if (errMsg.includes('rate limit') || errMsg.includes('quota')) {
            return NextResponse.json({
                error: 'AI rate limit reached. Please wait a moment and try again.',
                type: 'ai_rate_limit',
            }, { status: 429 })
        }

        return NextResponse.json(
            { error: errMsg },
            { status: 500 }
        )
    }
}

function generateSummary(
    fileReviews: FileReview[],
    totalIssues: number,
    criticalCount: number,
    highCount: number
): string {
    if (fileReviews.length === 0) {
        return 'No code files were reviewed in this PR.'
    }

    if (criticalCount > 0) {
        return `⚠️ Found ${criticalCount} critical issue(s) that need immediate attention. ${totalIssues} total issues across ${fileReviews.length} files.`
    }

    if (highCount > 0) {
        return `Found ${highCount} high-priority issue(s) to address. ${totalIssues} total issues across ${fileReviews.length} files.`
    }

    if (totalIssues > 0) {
        return `Found ${totalIssues} issue(s) across ${fileReviews.length} files. Review the suggestions to improve code quality.`
    }

    return `✅ Great job! No significant issues found in ${fileReviews.length} reviewed files.`
}
