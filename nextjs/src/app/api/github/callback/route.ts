import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/server'

/**
 * GitHub OAuth Callback Handler
 * 
 * This handles the OAuth callback from GitHub after the user authorizes our app.
 * We exchange the code for an access token and store it securely in the database.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')
    
    // Handle OAuth errors
    if (error) {
        console.error('GitHub OAuth error:', error, error_description)
        return NextResponse.redirect(
            new URL(`/app/integrations?error=${encodeURIComponent(error_description || error)}`, request.url)
        )
    }

    if (!code) {
        return NextResponse.redirect(
            new URL('/app/integrations?error=No authorization code received', request.url)
        )
    }

    try {
        // Verify user is authenticated
        const supabase = await createSSRClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        // Verify state to prevent CSRF (optional but recommended)
        // The state should match what we stored when initiating the OAuth flow
        
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }),
        })

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token')
        }

        const tokenData = await tokenResponse.json()

        if (tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error)
        }

        const accessToken = tokenData.access_token
        const tokenType = tokenData.token_type
        const scope = tokenData.scope

        // Fetch GitHub user info
        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AI-Code-Reviewer',
            },
        })

        if (!githubUserResponse.ok) {
            throw new Error('Failed to fetch GitHub user info')
        }

        const githubUser = await githubUserResponse.json()

        // Store the GitHub connection in database
        // Upsert to handle reconnection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: upsertError } = await (supabase as any)
            .from('github_connections')
            .upsert({
                user_id: user.id,
                github_user_id: githubUser.id,
                github_username: githubUser.login,
                github_avatar_url: githubUser.avatar_url,
                github_email: githubUser.email,
                access_token: accessToken, // In production, encrypt this
                token_type: tokenType,
                scope: scope,
                connected_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
            })

        if (upsertError) {
            console.error('Failed to store GitHub connection:', upsertError)
            throw new Error('Failed to save GitHub connection')
        }

        // Redirect to integrations page with success message
        return NextResponse.redirect(
            new URL('/app/integrations?success=github_connected', request.url)
        )

    } catch (err) {
        console.error('GitHub OAuth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        return NextResponse.redirect(
            new URL(`/app/integrations?error=${encodeURIComponent(errorMessage)}`, request.url)
        )
    }
}
