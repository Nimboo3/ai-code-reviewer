import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { StructuredReview } from '@/lib/types'

function isLocalModel(model: string) {
  return (
    model.startsWith('llama') || 
    model.startsWith('qwen') || 
    model.startsWith('gemma') || 
    model.startsWith('deepseek') ||
    model.startsWith('gpt-oss') ||
    model.includes(':')
  )
}

function isGeminiModel(model: string) {
  return model.startsWith('gemini')
}

export function getOpenAIClient(selectedModel?: string) {
  if (selectedModel && isGeminiModel(selectedModel)) {
    throw new Error('Use reviewCodeWithGemini() for Gemini models')
  }

  if (selectedModel && isLocalModel(selectedModel)) {
    const baseURL =
      process.env.OPENAI_LOCAL_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'http://localhost:11434/v1'
    const apiKey = process.env.OPENAI_LOCAL_API_KEY || 'sk-local'
    
    return new OpenAI({ apiKey, baseURL })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')
  const baseURL = process.env.OPENAI_BASE_URL || undefined
  return new OpenAI({ apiKey, baseURL })
}

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gemini-1.5-flash-latest'

const MODEL_ALLOWLIST = new Set<string>([
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4o',
  'gpt-4-turbo',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro-002',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash-thinking-exp-1219',
  'gemma3:1b',
  'gemma3:4b',
  'qwen3:4b',
  'qwen3:8b',
  'deepseek-rl:8b',
  'llama3.2:3b',
  'qwen2.5-coder:7b',
])

export function pickModel(requested?: string | null) {
  return requested && MODEL_ALLOWLIST.has(requested) ? requested : DEFAULT_MODEL
}

type ReviewResult = { 
  structured: StructuredReview | null
  markdown: string
  model: string
  tokens: number | null 
}

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

// Parse LLM response into structured format with fallback to markdown
function parseReviewResponse(text: string, model: string, tokens: number | null): ReviewResult {
  let structured: StructuredReview | null = null
  let markdown = text

  try {
    // Try to extract JSON from response (LLM might wrap it in markdown code blocks)
    let jsonText = text.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/i, '').replace(/\s*```$/,'')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    // Parse JSON
    const parsed = JSON.parse(jsonText) as StructuredReview
    
    // Validate required fields
    if (parsed.summary && parsed.issues && parsed.metrics && 
        typeof parsed.summary.overallScore === 'number') {
      structured = parsed
      
      // Generate markdown from structured data as fallback
      markdown = generateMarkdownFromStructured(parsed)
    }
  } catch {
    // JSON parsing failed, keep text as markdown
  }

  return {
    structured,
    markdown,
    model,
    tokens,
  }
}

// Generate markdown from structured review data
function generateMarkdownFromStructured(review: StructuredReview): string {
  const { summary, issues, metrics, strengths, recommendations } = review
  
  let md = `# Code Review Summary\n\n`
  md += `**Grade:** ${summary.grade} (${summary.overallScore}/100)\n`
  md += `**Total Issues:** ${summary.totalIssues} (Critical: ${summary.criticalCount}, High: ${summary.highCount}, Medium: ${summary.mediumCount}, Low: ${summary.lowCount})\n\n`
  
  md += `## Metrics\n\n`
  md += `- **Complexity:** ${metrics.complexity}/10\n`
  md += `- **Maintainability:** ${metrics.maintainability}/100\n`
  md += `- **Readability:** ${metrics.readability}/100\n`
  md += `- **Testability:** ${metrics.testability}/100\n`
  md += `- **Security:** ${metrics.security}/100\n\n`
  
  if (strengths.length > 0) {
    md += `## Strengths\n\n`
    strengths.forEach(s => md += `- ${s}\n`)
    md += `\n`
  }
  
  if (issues.length > 0) {
    md += `## Issues\n\n`
    const grouped = issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = []
      acc[issue.severity].push(issue)
      return acc
    }, {} as Record<string, typeof issues>)
    
    for (const severity of ['critical', 'high', 'medium', 'low', 'info'] as const) {
      const items = grouped[severity]
      if (items && items.length > 0) {
        md += `### ${severity.toUpperCase()}\n\n`
        items.forEach(issue => {
          md += `#### ${issue.title}\n`
          md += `**Category:** ${issue.category}\n`
          md += `${issue.description}\n\n`
          md += `**Suggestion:** ${issue.suggestion}\n`
          md += `**Impact:** ${issue.impact}\n\n`
        })
      }
    }
  }
  
  if (recommendations.length > 0) {
    md += `## Recommendations\n\n`
    recommendations.forEach(r => md += `- ${r}\n`)
    md += `\n`
  }
  
  return md
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

  const prompt = `You are a senior software engineer performing code reviews. Analyze the code and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON).

The JSON must follow this exact structure:
{
  "summary": {
    "overallScore": <number 0-100>,
    "grade": "<A+, A, B, C, D, or F>",
    "totalIssues": <number>,
    "criticalCount": <number>,
    "highCount": <number>,
    "mediumCount": <number>,
    "lowCount": <number>
  },
  "issues": [
    {
      "id": "<unique-id>",
      "severity": "<critical|high|medium|low|info>",
      "category": "<bug|security|performance|maintainability|style|best-practice>",
      "title": "<short title>",
      "description": "<detailed description>",
      "lineNumber": <number or null>,
      "codeSnippet": "<relevant code or null>",
      "suggestion": "<how to fix>",
      "impact": "<why this matters>"
    }
  ],
  "metrics": {
    "complexity": <number 1-10>,
    "maintainability": <number 0-100>,
    "readability": <number 0-100>,
    "testability": <number 0-100>,
    "security": <number 0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}

Note: Security metric (0-100) should assess production readiness, secrets detection, hardcoded credentials, auth vulnerabilities, and security best practices. Higher is better.

Analyze this code:
File: ${filename}

\`\`\`
${truncated}
\`\`\`

Return ONLY the JSON object, nothing else.`

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

      return parseReviewResponse(text, model, tokens)
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
        const waitSeconds = 30
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

  if (isGeminiModel(model)) {
    return reviewCodeWithGemini({ code, filename, model })
  }

  const client = getOpenAIClient(model)

  // Input and output limits
  const MAX_INPUT_CHARS = 3500
  const MAX_OUTPUT_TOKENS = 1500

  const truncated = code.length > MAX_INPUT_CHARS ? code.slice(0, MAX_INPUT_CHARS) : code

  const system = 'You are a senior software engineer performing code reviews. Return only valid JSON objects.'
  const user = `Analyze this code and return a valid JSON object following this structure:
{
  "summary": {
    "overallScore": <number 0-100>,
    "grade": "<A+, A, B, C, D, or F>",
    "totalIssues": <number>,
    "criticalCount": <number>,
    "highCount": <number>,
    "mediumCount": <number>,
    "lowCount": <number>
  },
  "issues": [
    {
      "id": "<unique-id>",
      "severity": "<critical|high|medium|low|info>",
      "category": "<bug|security|performance|maintainability|style|best-practice>",
      "title": "<short title>",
      "description": "<detailed description>",
      "lineNumber": <number or null>,
      "codeSnippet": "<relevant code or null>",
      "suggestion": "<how to fix>",
      "impact": "<why this matters>"
    }
  ],
  "metrics": {
    "complexity": <number 1-10>,
    "maintainability": <number 0-100>,
    "readability": <number 0-100>,
    "testability": <number 0-100>,
    "security": <number 0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}

Note: Security metric (0-100) should assess production readiness, secrets detection, hardcoded credentials, auth vulnerabilities, and security best practices. Higher is better.

Analyze this code:
File: ${filename}

\`\`\`
${truncated}
\`\`\`

Return ONLY the JSON object, nothing else.`

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
      const tokens = (resp.usage?.total_tokens as number) || null
      return parseReviewResponse(choice, model, tokens)
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
        
        waitSeconds = Math.min(60, Math.max(1, waitSeconds))
        
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
    // Rate limit handling
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
