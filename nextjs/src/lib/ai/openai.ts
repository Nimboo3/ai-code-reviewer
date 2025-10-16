import OpenAI from 'openai'

// Detect if a given model should be routed to a local provider (Ollama/LiteLLM)
function isLocalModel(model: string) {
  return model.startsWith('llama') || model.startsWith('qwen')
}

// Create an OpenAI-compatible client based on selected model
export function getOpenAIClient(selectedModel?: string) {
  // If the selected model is local, route to local endpoint with a placeholder key
  if (selectedModel && isLocalModel(selectedModel)) {
    // Prefer explicit local base URL, fall back to global override, then common default for LiteLLM
    const baseURL =
      process.env.OPENAI_LOCAL_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'http://127.0.0.1:4000/v1'
    const apiKey = process.env.OPENAI_LOCAL_API_KEY || 'sk-local'
    return new OpenAI({ apiKey, baseURL })
  }

  // Default: use OpenAI project key and optional global base URL (for hosted proxies if any)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')
  const baseURL = process.env.OPENAI_BASE_URL || undefined
  return new OpenAI({ apiKey, baseURL })
}

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

// Allow a few safe/dev models; expand via env if needed
const MODEL_ALLOWLIST = new Set<string>([
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  // Local/dev examples if using OPENAI_BASE_URL with Ollama/OpenRouter:
  'llama3.1:8b',
  'llama3.2:3b',
  'qwen2.5-coder:7b',
])

export function pickModel(requested?: string | null) {
  return requested && MODEL_ALLOWLIST.has(requested) ? requested : DEFAULT_MODEL
}

type ReviewResult = { markdown: string; model: string; tokens: number | null }

interface HttpErrorLike {
  status?: number
  message?: string
  // Accept both Headers and plain objects from proxy providers
  headers?: Headers | Record<string, string | null | undefined>
  response?: { status?: number; headers?: Headers | Record<string, string | null | undefined> }
  error?: { type?: string }
}

// Helper to read headers whether Headers or plain object
function headerGet(
  headers: Headers | Record<string, string | null | undefined> | undefined,
  name: string
): string | null {
  if (!headers) return null
  if (headers instanceof Headers) {
    try { return headers.get(name) ?? null } catch { return null }
  }
  // Plain object: case-insensitive lookup
  const obj = headers as Record<string, string | null | undefined>
  const key = Object.keys(obj).find(k => k.toLowerCase() === name.toLowerCase())
  const val = key ? obj[key] : undefined
  return val == null ? null : String(val)
}

export async function reviewCode(opts: { code: string; filename: string; model?: string }): Promise<ReviewResult> {
  const { code, filename, model } = opts
  const selectedModel = pickModel(model)

  // Cost guards (tight for dev; keeps under default RPM/TPM)
  const MAX_INPUT_CHARS = 3500
  const MAX_OUTPUT_TOKENS = 500

  const truncated = code.length > MAX_INPUT_CHARS ? code.slice(0, MAX_INPUT_CHARS) : code
  const client = getOpenAIClient(selectedModel)

  const system = 'You are a senior software engineer performing code reviews. Be concise and actionable.'
  const user = `Review this code for readability, modularity, best practices, and potential bugs. Then provide a prioritized list of improvement suggestions. Return Markdown with sections: Summary, Issues, Suggestions, Potential Bugs, and Refactoring Opportunities.

File: ${filename}

<code>
${truncated}
</code>`

  async function call() {
    return client.chat.completions.create({
      model: selectedModel,
      temperature: 0.2,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // Minimal retries (default limits ~3 RPM)
  let lastErr: unknown
  const MAX_ATTEMPTS = 1 // initial + 1 retry
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const resp = await call()
      const choice = resp.choices?.[0]?.message?.content || 'No response'
      return {
        model: selectedModel,
        tokens: (resp.usage?.total_tokens as number) || null,
        markdown: choice,
      }
    } catch (e: unknown) {
      const err = e as HttpErrorLike
      const status = err?.status ?? err?.response?.status
      if (status === 429 && attempt + 1 < MAX_ATTEMPTS) {
        const headers = err.headers || err.response?.headers
        const resetReq = headerGet(headers, 'x-ratelimit-reset-requests')
        const resetTok = headerGet(headers, 'x-ratelimit-reset-tokens')
        const seconds =
          (resetReq && Number(resetReq)) ||
          (resetTok && Number(resetTok)) ||
          2
        await sleep(Math.max(1, seconds) * 1000)
        continue
      }
      lastErr = e
      break
    }
  }

  const err = lastErr as HttpErrorLike
  const status = err?.status ?? err?.response?.status
  const headers = err?.headers || err?.response?.headers
  const errorType = err?.error?.type

  if (status === 429 && headers) {
    try {
      console.warn('OpenAI rate limit/quota info', {
        type: errorType,
        requestsRemaining: headerGet(headers, 'x-ratelimit-remaining-requests'),
        tokensRemaining: headerGet(headers, 'x-ratelimit-remaining-tokens'),
        resetRequests: headerGet(headers, 'x-ratelimit-reset-requests'),
        resetTokens: headerGet(headers, 'x-ratelimit-reset-tokens'),
      })
    } catch {
      // noop
    }
  }

  const msg =
    status === 429
      ? 'LLM quota/rate limit reached. Try again shortly or reduce input size.'
      : (err?.message || 'LLM request failed')
  const error = new Error(msg) as Error & {
    status?: number
    headersSnapshot?: Record<string, string | null>
    errorType?: string
  }
  error.status = status
  if (headers) {
    error.headersSnapshot = {
      'x-ratelimit-remaining-requests': headerGet(headers, 'x-ratelimit-remaining-requests'),
      'x-ratelimit-remaining-tokens': headerGet(headers, 'x-ratelimit-remaining-tokens'),
      'x-ratelimit-reset-requests': headerGet(headers, 'x-ratelimit-reset-requests'),
      'x-ratelimit-reset-tokens': headerGet(headers, 'x-ratelimit-reset-tokens'),
    }
  }
  if (errorType) error.errorType = errorType
  throw error
}
