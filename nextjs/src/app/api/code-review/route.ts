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

  const { data, error } = await supabase
    .from('code_reviews')
    .select('*')
    .eq('owner', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(request: Request) {
  try {
    // Frontend sends FormData, not JSON
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const model = formData.get('model') as string | null

    // ADD DEBUG LOGGING HERE (new code only)
    console.log(`\n${'*'.repeat(60)}`)
    console.log(`🌐 [API /code-review] Received request`)
    console.log(`${'*'.repeat(60)}`)
    console.log(`📄 File: ${file?.name || 'No file'}`)
    console.log(`📏 File size: ${file?.size || 0} bytes`)
    console.log(`🤖 Model from client: "${model || 'default'}"`)
    console.log(`${'*'.repeat(60)}\n`)
    // END DEBUG LOGGING

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
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

    const result = await reviewCode({ code, filename, model: model || undefined })

    // ADD DEBUG LOGGING HERE (new code only)
    console.log(`✅ [API /code-review] Review completed successfully with model: ${result.model}`)
    // END DEBUG LOGGING

    // Store in database
    const supabase = await createSSRClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // The database schema uses different column names than the API
    // ReviewResult type: { markdown: string; model: string; tokens: number | null }
    const row: TablesInsert<'code_reviews'> = {
      owner: user.id,
      file_name: filename,
      source_preview: code,
      report_md: result.markdown,           // Use markdown property from result
      model: result.model,
      tokens: result.tokens ?? 0,           // Use tokens property from result
      status: 'completed',
    }

    // TypeScript workaround for Supabase insert type inference issue
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
    console.error('❌ [API /code-review] Error:', error)
    const err = error as {
      status?: number
      message?: string
      headersSnapshot?: Record<string, string | null>
      errorType?: string
    }
    if (err.status === 429) {
      console.warn('OpenAI 429', { type: err.errorType, ...err.headersSnapshot })
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
