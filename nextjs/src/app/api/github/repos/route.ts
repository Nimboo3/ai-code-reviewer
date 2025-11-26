import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/server'

/**
 * GitHub Repositories API
 * 
 * GET /api/github/repos - List user's repositories (from GitHub)
 * POST /api/github/repos - Connect a repository for monitoring
 */

interface GitHubRepo {
    id: number
    name: string
    full_name: string
    description: string | null
    private: boolean
    html_url: string
    default_branch: string
    language: string | null
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    pushed_at: string
    created_at: string
    updated_at: string
    owner: {
        login: string
        avatar_url: string
    }
}

// List repositories from GitHub
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
            .single() as { data: { access_token: string } | null; error: Error | null }

        if (connectionError || !connection) {
            return NextResponse.json({ 
                error: 'GitHub not connected. Please connect your GitHub account first.' 
            }, { status: 400 })
        }

        const accessToken = connection.access_token

        // Fetch repositories from GitHub
        // We'll fetch both personal repos and org repos the user has access to
        const perPage = 100
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
        const type = request.nextUrl.searchParams.get('type') || 'all' // all, owner, member

        const githubResponse = await fetch(
            `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&type=${type}&sort=pushed`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'AI-Code-Reviewer',
                },
            }
        )

        if (!githubResponse.ok) {
            if (githubResponse.status === 401) {
                // Token is invalid/expired - user needs to reconnect
                return NextResponse.json({ 
                    error: 'GitHub token expired. Please reconnect your GitHub account.' 
                }, { status: 401 })
            }
            throw new Error(`GitHub API error: ${githubResponse.status}`)
        }

        const repos: GitHubRepo[] = await githubResponse.json()

        // Get connected repos from database to mark which ones are monitored
        const { data: connectedRepos } = await supabase
            .from('github_repositories')
            .select('github_repo_id')
            .eq('user_id', user.id) as { data: Array<{ github_repo_id: number }> | null }

        const connectedRepoIds = new Set(connectedRepos?.map(r => r.github_repo_id) || [])

        // Transform response
        const transformedRepos = repos.map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            isPrivate: repo.private,
            url: repo.html_url,
            defaultBranch: repo.default_branch,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            openIssues: repo.open_issues_count,
            pushedAt: repo.pushed_at,
            owner: repo.owner.login,
            ownerAvatar: repo.owner.avatar_url,
            isConnected: connectedRepoIds.has(repo.id),
        }))

        return NextResponse.json({ 
            repos: transformedRepos,
            page,
            perPage,
            hasMore: repos.length === perPage,
        })

    } catch (err) {
        console.error('GitHub repos error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// Connect a repository for monitoring
export async function POST(request: NextRequest) {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { repoId, repoName, repoFullName, defaultBranch, language, isPrivate, ownerLogin } = body

        if (!repoId || !repoName || !repoFullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Insert repository
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('github_repositories')
            .insert({
                user_id: user.id,
                github_repo_id: repoId,
                repo_name: repoName,
                repo_full_name: repoFullName,
                default_branch: defaultBranch || 'main',
                language: language,
                is_private: isPrivate || false,
                owner_login: ownerLogin,
                auto_review_enabled: true,
                last_synced_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Repository already connected' }, { status: 400 })
            }
            throw error
        }

        return NextResponse.json({ 
            success: true, 
            repository: data 
        })

    } catch (err) {
        console.error('Connect repo error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// Disconnect a repository
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const repoId = request.nextUrl.searchParams.get('repoId')
        
        if (!repoId) {
            return NextResponse.json({ error: 'Missing repoId' }, { status: 400 })
        }

        const { error } = await supabase
            .from('github_repositories')
            .delete()
            .eq('user_id', user.id)
            .eq('github_repo_id', parseInt(repoId))

        if (error) {
            throw error
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('Disconnect repo error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
