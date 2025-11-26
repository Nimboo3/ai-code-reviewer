import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/server'
import crypto from 'crypto'

/**
 * GitHub OAuth - Connect/Disconnect endpoints
 * 
 * POST /api/github/connect - Initiates GitHub OAuth flow
 * DELETE /api/github/connect - Disconnects GitHub account
 * GET /api/github/connect - Check connection status
 */

// Generate a random state for CSRF protection
function generateState(): string {
    return crypto.randomBytes(32).toString('hex')
}

// Initiate GitHub OAuth
export async function POST(request: NextRequest) {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const clientId = process.env.GITHUB_CLIENT_ID
        if (!clientId) {
            return NextResponse.json({ error: 'GitHub OAuth not configured' }, { status: 500 })
        }

        // Generate CSRF state token
        const state = generateState()
        
        // Store state in session/cookie for verification (optional enhancement)
        // For now, we'll skip state verification for simplicity

        // Build GitHub OAuth URL
        // Scopes needed:
        // - repo: Full access to private and public repos (for reading code, PRs)
        // - read:user: Read user profile
        // - user:email: Read user email
        const scopes = ['repo', 'read:user', 'user:email']
        const redirectUri = `${request.nextUrl.origin}/api/github/callback`

        const authUrl = new URL('https://github.com/login/oauth/authorize')
        authUrl.searchParams.set('client_id', clientId)
        authUrl.searchParams.set('redirect_uri', redirectUri)
        authUrl.searchParams.set('scope', scopes.join(' '))
        authUrl.searchParams.set('state', state)

        return NextResponse.json({ 
            url: authUrl.toString(),
            state: state 
        })

    } catch (err) {
        console.error('GitHub connect error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// Disconnect GitHub account
export async function DELETE() {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Delete GitHub connection
        const { error: deleteError } = await supabase
            .from('github_connections')
            .delete()
            .eq('user_id', user.id)

        if (deleteError) {
            throw new Error('Failed to disconnect GitHub')
        }

        // Also remove associated repositories
        await supabase
            .from('github_repositories')
            .delete()
            .eq('user_id', user.id)

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('GitHub disconnect error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// Get connection status
export async function GET() {
    try {
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user has GitHub connected
        const { data: connection, error: connectionError } = await supabase
            .from('github_connections')
            .select('github_username, github_avatar_url, connected_at, scope')
            .eq('user_id', user.id)
            .single() as { data: { github_username: string; github_avatar_url: string | null; connected_at: string; scope: string | null } | null; error: Error | null }

        if (connectionError && (connectionError as { code?: string }).code !== 'PGRST116') {
            // PGRST116 = no rows returned (not an error, just not connected)
            throw connectionError
        }

        if (!connection) {
            return NextResponse.json({ 
                connected: false,
                username: null,
                avatar: null 
            })
        }

        return NextResponse.json({
            connected: true,
            username: connection.github_username,
            avatar: connection.github_avatar_url,
            connectedAt: connection.connected_at,
            scope: connection.scope,
        })

    } catch (err) {
        console.error('GitHub status check error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
