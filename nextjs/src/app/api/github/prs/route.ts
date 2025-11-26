import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/server'

/**
 * GitHub Pull Requests API
 * 
 * GET /api/github/prs - List PRs for a repository
 * GET /api/github/prs?prNumber=123&repo=owner/repo - Get specific PR details
 */

interface GitHubPR {
    id: number
    number: number
    title: string
    body: string | null
    state: 'open' | 'closed'
    html_url: string
    diff_url: string
    patch_url: string
    created_at: string
    updated_at: string
    merged_at: string | null
    head: {
        ref: string
        sha: string
    }
    base: {
        ref: string
        sha: string
    }
    user: {
        login: string
        avatar_url: string
    }
    changed_files: number
    additions: number
    deletions: number
    mergeable: boolean | null
}

interface GitHubFile {
    filename: string
    status: 'added' | 'removed' | 'modified' | 'renamed'
    additions: number
    deletions: number
    changes: number
    patch?: string
    raw_url: string
    sha: string
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get GitHub access token
        const { data: connection, error: connectionError } = await supabase
            .from('github_connections')
            .select('access_token')
            .eq('user_id', user.id)
            .single()

        if (connectionError || !connection) {
            return NextResponse.json({ 
                error: 'GitHub not connected' 
            }, { status: 400 })
        }

        // Type assertion for the connection data
        const accessToken = (connection as { access_token: string }).access_token
        const repo = request.nextUrl.searchParams.get('repo') // format: owner/repo
        const prNumber = request.nextUrl.searchParams.get('prNumber')
        const state = request.nextUrl.searchParams.get('state') || 'open'
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
        const perPage = 30

        if (!repo) {
            return NextResponse.json({ error: 'Missing repo parameter' }, { status: 400 })
        }

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AI-Code-Reviewer',
        }

        // If prNumber is specified, get specific PR details
        if (prNumber) {
            // Fetch PR details
            const prResponse = await fetch(
                `https://api.github.com/repos/${repo}/pulls/${prNumber}`,
                { headers }
            )

            if (!prResponse.ok) {
                if (prResponse.status === 404) {
                    return NextResponse.json({ error: 'PR not found' }, { status: 404 })
                }
                throw new Error(`GitHub API error: ${prResponse.status}`)
            }

            const pr: GitHubPR = await prResponse.json()

            // Fetch PR files (changed files in this PR)
            const filesResponse = await fetch(
                `https://api.github.com/repos/${repo}/pulls/${prNumber}/files?per_page=100`,
                { headers }
            )

            let files: GitHubFile[] = []
            if (filesResponse.ok) {
                files = await filesResponse.json()
            }

            // Check if we have a cached review for this PR
            const { data: existingReview } = await supabase
                .from('pr_reviews')
                .select('*')
                .eq('pr_number', parseInt(prNumber))
                .eq('repo_full_name', repo)
                .eq('head_sha', pr.head.sha)
                .single()

            return NextResponse.json({
                pr: {
                    id: pr.id,
                    number: pr.number,
                    title: pr.title,
                    body: pr.body,
                    state: pr.state,
                    url: pr.html_url,
                    createdAt: pr.created_at,
                    updatedAt: pr.updated_at,
                    mergedAt: pr.merged_at,
                    headBranch: pr.head.ref,
                    headSha: pr.head.sha,
                    baseBranch: pr.base.ref,
                    baseSha: pr.base.sha,
                    author: pr.user.login,
                    authorAvatar: pr.user.avatar_url,
                    changedFiles: pr.changed_files,
                    additions: pr.additions,
                    deletions: pr.deletions,
                    isMergeable: pr.mergeable,
                },
                files: files.map(f => ({
                    filename: f.filename,
                    status: f.status,
                    additions: f.additions,
                    deletions: f.deletions,
                    changes: f.changes,
                    patch: f.patch,
                    sha: f.sha,
                })),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cachedReview: existingReview ? (existingReview as any) : null,
            })
        }

        // List PRs for the repository
        const prsResponse = await fetch(
            `https://api.github.com/repos/${repo}/pulls?state=${state}&per_page=${perPage}&page=${page}&sort=updated&direction=desc`,
            { headers }
        )

        if (!prsResponse.ok) {
            if (prsResponse.status === 404) {
                return NextResponse.json({ error: 'Repository not found or no access' }, { status: 404 })
            }
            throw new Error(`GitHub API error: ${prsResponse.status}`)
        }

        const prs: GitHubPR[] = await prsResponse.json()

        return NextResponse.json({
            prs: prs.map(pr => ({
                id: pr.id,
                number: pr.number,
                title: pr.title,
                state: pr.state,
                url: pr.html_url,
                createdAt: pr.created_at,
                updatedAt: pr.updated_at,
                headBranch: pr.head.ref,
                baseBranch: pr.base.ref,
                author: pr.user.login,
                authorAvatar: pr.user.avatar_url,
            })),
            page,
            perPage,
            hasMore: prs.length === perPage,
        })

    } catch (err) {
        console.error('GitHub PRs error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
