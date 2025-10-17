import { NextRequest, NextResponse } from 'next/server'
import { reviewCode } from '@/lib/ai/openai'
import { createSSRClient } from '@/lib/supabase/server'
import type { TablesInsert } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const supabase = await createSSRClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (id) {
    const { data, error } = await supabase
      .from('code_reviews')
      .select('*')
      .eq('owner', user.id)
      .eq('id', Number(id))
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ item: data })
  }

  // Support limit and offset for pagination/archive
  const limit = req.nextUrl.searchParams.get('limit')
  const offset = req.nextUrl.searchParams.get('offset')
  
  let query = supabase
    .from('code_reviews')
    .select('*')
    .eq('owner', user.id)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(Number(limit))
  }
  if (offset) {
    query = query.range(Number(offset), Number(offset) + (limit ? Number(limit) : 100) - 1)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(request: Request) {
  try {
    // Check authentication first
    const supabase = await createSSRClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Frontend sends FormData, not JSON
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const model = formData.get('model') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // File size validation (500KB max for Free tier)
    const MAX_FILE_SIZE = 500 * 1024 // 500KB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large for Free tier. Your file is ${(file.size / 1024).toFixed(1)}KB but Free tier supports up to ${MAX_FILE_SIZE / 1024}KB. Upgrade to Premium for 10MB file uploads!`,
        type: 'file_too_large',
        upgradeToPremium: true
      }, { status: 413 })
    }

    // Read file content
    const code = await file.text()
    const filename = file.name

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
    }

    // Character length validation (prevents extremely large files)
    const MAX_CODE_LENGTH = 50000 // 50k characters (~12.5k tokens) for Free tier
    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ 
        error: `Code too long for Free tier. Your code has ${code.length.toLocaleString()} characters but Free tier supports up to ${MAX_CODE_LENGTH.toLocaleString()} characters. Upgrade to Premium for unlimited code length!`,
        type: 'code_too_long',
        upgradeToPremium: true
      }, { status: 413 })
    }

    // Rate limiting check - Query user's recent reviews (Free tier: 10/day)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentReviews, error: countError } = await supabase
      .from('code_reviews')
      .select('id', { count: 'exact', head: false })
      .eq('owner', user.id)
      .gte('created_at', oneDayAgo)

    if (countError) {
      // Continue anyway - don't block on rate limit check failure
    } else {
      const RATE_LIMIT_PER_DAY = 10 // Free tier: 10 reviews per day
      const reviewCount = recentReviews?.length || 0
      
      if (reviewCount >= RATE_LIMIT_PER_DAY) {
        return NextResponse.json({ 
          error: `Free tier rate limit reached! You've used ${reviewCount}/${RATE_LIMIT_PER_DAY} reviews today. Upgrade to Premium for unlimited reviews with no waiting!`,
          type: 'rate_limit_exceeded',
          retryAfter: 86400, // seconds (24 hours)
          upgradeToPremium: true
        }, { status: 429 })
      }
    }

    const result = await reviewCode({ code, filename, model: model || undefined })

    // Store in database (user already authenticated at top of function)
    // The database schema uses different column names than the API
    // ReviewResult type: { structured, markdown, model, tokens }
    const row: TablesInsert<'code_reviews'> = {
      owner: user.id,
      file_name: filename,
      source_preview: code,
      report_md: result.markdown,
      model: result.model,
      tokens: result.tokens ?? 0,
      status: 'completed',
      // Add structured data if available
      structured_data: result.structured ? JSON.parse(JSON.stringify(result.structured)) : null,
      overall_score: result.structured?.summary.overallScore ?? null,
      grade: result.structured?.summary.grade ?? null,
      critical_issues: result.structured?.summary.criticalCount ?? 0,
      high_issues: result.structured?.summary.highCount ?? 0,
      medium_issues: result.structured?.summary.mediumCount ?? 0,
      low_issues: result.structured?.summary.lowCount ?? 0,
      total_issues: result.structured?.summary.totalIssues ?? 0,
      security_score: result.structured?.metrics.security ?? null,
    }

    const { data, error } = await supabase
      .from('code_reviews')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(row as any)
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return result with database ID
    return NextResponse.json({ 
      markdown: result.markdown,
      model: result.model,
      tokens: result.tokens,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (data as any)?.id 
    })
  } catch (error: unknown) {
    const err = error as {
      status?: number
      message?: string
      headersSnapshot?: Record<string, string | null>
      errorType?: string
    }
    if (err.status === 429) {
      // Rate limit handling
    }
    return NextResponse.json(
      {
        error: err?.message || 'LLM request failed',
        type: err?.errorType || (err.status === 429 ? 'rate_limit' : 'unknown'),
        limits: err?.headersSnapshot ?? undefined,
      },
      { status: err?.status === 429 ? 429 : 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSSRClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

  // Delete only if owned by user
  const { error } = await supabase
    .from('code_reviews')
    .delete()
    .eq('id', Number(id))
    .eq('owner', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
