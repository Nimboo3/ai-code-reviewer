import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Detect if a given model should be routed to a local provider (Ollama/LiteLLM)
function isLocalModel(model: string) {
  const isLocal = (
    model.startsWith('llama') || 
    model.startsWith('qwen') || 
    model.startsWith('gemma') || 
    model.startsWith('deepseek') ||
    model.startsWith('gpt-oss') ||
    model.includes(':')  // Ollama models typically have format like "qwen3:4b"
  )
  
  // Debug logging
  console.log(`🔍 [isLocalModel] Input: "${model}" -> Result: ${isLocal}`)
  
  return isLocal
}

// Detect if a given model is a Gemini model
function isGeminiModel(model: string) {
  const isGemini = model.startsWith('gemini')
  console.log(`🔍 [isGeminiModel] Input: "${model}" -> Result: ${isGemini}`)
  return isGemini
}

// Create an OpenAI-compatible client based on selected model
export function getOpenAIClient(selectedModel?: string) {
  console.log(`🔧 [getOpenAIClient] Called with selectedModel: "${selectedModel}"`)
  
  // Gemini models are handled separately with native SDK (not OpenAI-compatible)
  if (selectedModel && isGeminiModel(selectedModel)) {
    throw new Error('Use reviewCodeWithGemini() for Gemini models')
  }

  // If the selected model is local, route to local endpoint with a placeholder key
  if (selectedModel && isLocalModel(selectedModel)) {
    const baseURL =
      process.env.OPENAI_LOCAL_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'http://localhost:11434/v1'
    const apiKey = process.env.OPENAI_LOCAL_API_KEY || 'sk-local'
    
    console.log(`✅ [getOpenAIClient] Using LOCAL Ollama endpoint: ${baseURL}`)
    return new OpenAI({ apiKey, baseURL })
  }

  // Default: use OpenAI project key and optional global base URL (for hosted proxies if any)
  console.log(`☁️ [getOpenAIClient] Using OPENAI cloud endpoint`)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')
  const baseURL = process.env.OPENAI_BASE_URL || undefined
  return new OpenAI({ apiKey, baseURL })
}

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

// Allow a few safe/dev models; expand via env if needed
const MODEL_ALLOWLIST = new Set<string>([
  // OpenAI models (cloud, pay-per-use)
  'gpt-4o-mini',           // Cheapest OpenAI model (~$0.15/1M tokens)
  'gpt-4o-mini-2024-07-18',
  'gpt-4o',                // More expensive (~$2.50/1M tokens) - use sparingly
  'gpt-4-turbo',           // Expensive (~$10/1M tokens) - removed below
  
  // Google Gemini models (cloud, free tier: 1500 req/day)
  'gemini-1.5-flash-latest',  // RECOMMENDED: Fast & free
  'gemini-1.5-pro-latest',    // Better quality, same free tier
  'gemini-1.5-flash-002',
  'gemini-1.5-pro-002',
  'gemini-2.0-flash-exp',     // Experimental (latest, most advanced)
  'gemini-2.0-flash-thinking-exp-1219', // Experimental with thinking mode
  
  // Local Ollama models - OPTIMIZED FOR YOUR SPECS (16GB RAM, CPU only)
  'gemma3:1b',          // Fastest (1-2s), basic quality, 2GB RAM
  'gemma3:4b',          // ⭐ RECOMMENDED: Fast (3-5s), good quality, 4-5GB RAM
  'qwen3:4b',           // ⭐ RECOMMENDED: Fast (3-5s), great for code, 4-5GB RAM
  'qwen3:8b',           // Better quality (8-12s), 8GB RAM
  'deepseek-rl:8b',     // Code-focused (8-12s), 8GB RAM
  
  // Legacy/manual installs
  'llama3.2:3b',
  'qwen2.5-coder:7b',
])


export function pickModel(requested?: string | null) {
  const picked = requested && MODEL_ALLOWLIST.has(requested) ? requested : DEFAULT_MODEL
  console.log(`🎯 [pickModel] Requested: "${requested}" -> Picked: "${picked}" (in allowlist: ${requested ? MODEL_ALLOWLIST.has(requested) : 'N/A'})`)
  return picked
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

// Review code using Google Gemini's native SDK
async function reviewCodeWithGemini(opts: { code: string; filename: string; model: string }): Promise<ReviewResult> {
  const { code, filename, model } = opts
  
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set. Get one at https://aistudio.google.com/apikey')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const genModel = genAI.getGenerativeModel({ model })

  // Cost guards (similar to OpenAI)
  const MAX_INPUT_CHARS = 3500
  const truncated = code.length > MAX_INPUT_CHARS ? code.slice(0, MAX_INPUT_CHARS) : code

  const prompt = `You are a senior software engineer performing code reviews. Be concise and actionable.

Review this code for readability, modularity, best practices, and potential bugs. Then provide a prioritized list of improvement suggestions. Return Markdown with sections: Summary, Issues, Suggestions, Potential Bugs, and Refactoring Opportunities.

File: ${filename}

<code>
${truncated}
</code>`

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // Retry logic for free tier rate limits
  let lastErr: unknown
  const MAX_ATTEMPTS = 3
  
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await genModel.generateContent(prompt)
      const response = result.response
      const text = response.text()
      
      // Try to get token count if available
      let tokens: number | null = null
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const usage = (response as any).usageMetadata
        if (usage?.totalTokenCount) {
          tokens = usage.totalTokenCount
        }
      } catch {
        // Token info not available
      }

      return {
        model,
        tokens,
        markdown: text,
      }
    } catch (e: unknown) {
      lastErr = e
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = e as any
      
      // Check if it's a rate limit error (429 or RESOURCE_EXHAUSTED)
      const isRateLimit = 
        err?.status === 429 || 
        err?.statusCode === 429 ||
        err?.code === 'RESOURCE_EXHAUSTED' ||
        (err?.message && err.message.includes('quota'))

      if (isRateLimit && attempt + 1 < MAX_ATTEMPTS) {
        // Gemini free tier: wait 20-60s
        const waitSeconds = 30
        console.log(`Gemini rate limit hit. Retrying in ${waitSeconds}s (attempt ${attempt + 1}/${MAX_ATTEMPTS})`)
        await sleep(waitSeconds * 1000)
        continue
      }
      
      // Don't retry on other errors
      break
    }
  }

  // Handle errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = lastErr as any
  const isRateLimit = 
    err?.status === 429 || 
    err?.statusCode === 429 ||
    err?.code === 'RESOURCE_EXHAUSTED' ||
    (err?.message && err.message.includes('quota'))

  const msg = isRateLimit
    ? 'Gemini rate limit reached (free tier: 1500 requests/day). Please wait and try again, or check your quota at https://aistudio.google.com/'
    : (err?.message || 'Gemini API request failed')
  
  throw new Error(msg)
}

export async function reviewCode(opts: {
  code: string
  filename: string
  model?: string
}): Promise<ReviewResult> {
  const { code, filename, model: requestedModel } = opts
  const model = pickModel(requestedModel)
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📋 [reviewCode] CODE REVIEW REQUEST`)
  console.log(`${'='.repeat(60)}`)
  console.log(`📥 Requested model: "${requestedModel}"`)
  console.log(`✅ Picked model: "${model}"`)
  console.log(`🔍 Is Gemini?: ${isGeminiModel(model)}`)
  console.log(`🔍 Is Local?: ${isLocalModel(model)}`)
  console.log(`🌐 OPENAI_LOCAL_BASE_URL: ${process.env.OPENAI_LOCAL_BASE_URL || '(not set)'}`)
  console.log(`🔑 OPENAI_LOCAL_API_KEY: ${process.env.OPENAI_LOCAL_API_KEY || '(not set)'}`)
  console.log(`🔑 OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'SET' : '(not set)'}`)
  console.log(`${'='.repeat(60)}\n`)

  // Route to Gemini if it's a Gemini model
  if (isGeminiModel(model)) {
    console.log(`🚀 [reviewCode] Routing to Gemini handler`)
    return reviewCodeWithGemini({ code, filename, model })
  }

  // For OpenAI and Ollama models (both use OpenAI SDK)
  console.log(`🚀 [reviewCode] Getting OpenAI SDK client for model: "${model}"`)
  const client = getOpenAIClient(model)

  // Cost guards (tight for dev; keeps under default RPM/TPM)
  const MAX_INPUT_CHARS = 3500
  const MAX_OUTPUT_TOKENS = 500

  const truncated = code.length > MAX_INPUT_CHARS ? code.slice(0, MAX_INPUT_CHARS) : code

  const system = 'You are a senior software engineer performing code reviews. Be concise and actionable.'
  const user = `Review this code for readability, modularity, best practices, and potential bugs. Then provide a prioritized list of improvement suggestions. Return Markdown with sections: Summary, Issues, Suggestions, Potential Bugs, and Refactoring Opportunities.

File: ${filename}

<code>
${truncated}
</code>`

  async function call() {
    return client.chat.completions.create({
      model: model,
      temperature: 0.2,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // Retry logic for free tier (3 RPM limit)
  let lastErr: unknown
  const MAX_ATTEMPTS = 3 // Total attempts: initial + 2 retries
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const resp = await call()
      const choice = resp.choices?.[0]?.message?.content || 'No response'
      return {
        model: model,
        tokens: (resp.usage?.total_tokens as number) || null,
        markdown: choice,
      }
    } catch (e: unknown) {
      const err = e as HttpErrorLike
      const status = err?.status ?? err?.response?.status
      
      // Retry on 429 (rate limit) if we have attempts left
      if (status === 429 && attempt + 1 < MAX_ATTEMPTS) {
        const headers = err.headers || err.response?.headers
        const resetReq = headerGet(headers, 'x-ratelimit-reset-requests')
        const resetTok = headerGet(headers, 'x-ratelimit-reset-tokens')
        
        // Parse reset time (can be timestamp or seconds)
        let waitSeconds = 20 // default wait for free tier
        if (resetReq) {
          const resetVal = Number(resetReq)
          // If it's a Unix timestamp (large number), calculate diff
          if (resetVal > 100000) {
            waitSeconds = Math.max(1, resetVal - Math.floor(Date.now() / 1000))
          } else {
            waitSeconds = resetVal
          }
        } else if (resetTok) {
          const resetVal = Number(resetTok)
          if (resetVal > 100000) {
            waitSeconds = Math.max(1, resetVal - Math.floor(Date.now() / 1000))
          } else {
            waitSeconds = resetVal
          }
        }
        
        // Cap wait time at 60 seconds for UX
        waitSeconds = Math.min(60, Math.max(1, waitSeconds))
        
        console.log(`Rate limit hit. Retrying in ${waitSeconds}s (attempt ${attempt + 1}/${MAX_ATTEMPTS})`)
        await sleep(waitSeconds * 1000)
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
      const remaining = headerGet(headers, 'x-ratelimit-remaining-requests')
      const resetReq = headerGet(headers, 'x-ratelimit-reset-requests')
      console.warn('OpenAI rate limit info:', {
        type: errorType,
        requestsRemaining: remaining,
        tokensRemaining: headerGet(headers, 'x-ratelimit-remaining-tokens'),
        resetRequests: resetReq,
        resetTokens: headerGet(headers, 'x-ratelimit-reset-tokens'),
      })
    } catch {
      // noop
    }
  }

  const msg =
    status === 429
      ? 'OpenAI rate limit reached (free tier: 3 requests/min). Please wait 20-60 seconds and try again, or upgrade your OpenAI account for higher limits.'
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
