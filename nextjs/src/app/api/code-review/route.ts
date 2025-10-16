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

export async function POST(req: NextRequest) {
  const supabase = await createSSRClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const fileEntry = form.get('file')
  const requestedModel = form.get('model')?.toString()

  if (!(fileEntry instanceof Blob)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  const arrayBuffer = await fileEntry.arrayBuffer()
  const source = Buffer.from(arrayBuffer).toString('utf8')
  const fileName = (fileEntry as unknown as { name?: string }).name || 'unknown.txt'
  const language = fileName.includes('.') ? fileName.split('.').pop() : null

  try {
    const { markdown, model, tokens } = await reviewCode({
      code: source,
      filename: fileName,
      model: requestedModel,
    })

    // Type the row explicitly
    const row: TablesInsert<'code_reviews'> = {
      owner: user.id,
      file_name: fileName,
      language: language ?? null,
      source_preview: source.slice(0, 4000),
      report_md: markdown,
      status: 'completed',
      model,
      tokens: tokens ?? null,
    }

    // Insert with a localized cast to satisfy untyped client
    const { data, error } = await supabase
      .from('code_reviews')
      .insert([row] as never[])
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ item: data })
  } catch (e: unknown) {
    const err = e as {
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
