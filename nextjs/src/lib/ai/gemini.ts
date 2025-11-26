/**
 * Gemini AI Integration - Optimized for Free Tier
 * 
 * Free Tier Limits (as of Nov 2025):
 * 
 * Recommended for code review:
 * - Gemini 2.0 Flash-Lite: 30 RPM, 1M TPM, 200 RPD
 * - Gemini 2.0 Flash: 15 RPM, 1M TPM, 200 RPD  
 * - Gemini 2.5 Flash-Lite: 15 RPM, 250K TPM, 1000 RPD
 * - Gemini 2.5 Flash: 10 RPM, 250K TPM, 250 RPD
 * - Gemini 2.5 Pro: 2 RPM, 125K TPM, 50 RPD (best quality but limited)
 * 
 * Optimization Strategies:
 * 1. Token-efficient prompts (minimal system instructions)
 * 2. Truncate code to fit within token limits
 * 3. Request JSON output directly
 * 4. Retry with exponential backoff on rate limits
 * 5. Cache results by content hash
 * 6. Default to Gemini 2.0 Flash-Lite for best RPM/RPD balance
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { StructuredReview } from '@/lib/types'

// Gemini 2.0 Flash-Lite has 1M TPM - can handle larger inputs
const MAX_INPUT_CHARS = 8000
const MAX_RETRIES = 3
const BASE_RETRY_DELAY_MS = 5000

// Available Gemini models for code review (free tier)
export const GEMINI_MODELS = {
  // Best balance of speed and daily limits
  'gemini-2.0-flash-lite': { rpm: 30, tpm: 1000000, rpd: 200, name: 'Gemini 2.0 Flash-Lite' },
  'gemini-2.0-flash': { rpm: 15, tpm: 1000000, rpd: 200, name: 'Gemini 2.0 Flash' },
  // Higher daily limits but lower TPM
  'gemini-2.5-flash-lite': { rpm: 15, tpm: 250000, rpd: 1000, name: 'Gemini 2.5 Flash-Lite' },
  'gemini-2.5-flash': { rpm: 10, tpm: 250000, rpd: 250, name: 'Gemini 2.5 Flash' },
  // Best quality but very limited
  'gemini-2.5-pro': { rpm: 2, tpm: 125000, rpd: 50, name: 'Gemini 2.5 Pro' },
} as const

export type GeminiModelId = keyof typeof GEMINI_MODELS
export const DEFAULT_GEMINI_MODEL: GeminiModelId = 'gemini-2.0-flash-lite'

interface ReviewCodeOptions {
    code: string
    filename: string
    context?: string
    model?: GeminiModelId
}

interface ReviewResult {
    structured: StructuredReview | null
    markdown: string
    model: string
    tokens: number | null
}

// Sleep helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Review code using Gemini API with free tier optimizations
 */
export async function reviewCodeWithGemini(opts: ReviewCodeOptions): Promise<ReviewResult> {
    const { code, filename, context, model: modelId = DEFAULT_GEMINI_MODEL } = opts

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not set. Get one at https://aistudio.google.com/apikey')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const modelConfig = GEMINI_MODELS[modelId] || GEMINI_MODELS[DEFAULT_GEMINI_MODEL]
    
    // Use selected Gemini model
    const model = genAI.getGenerativeModel({ 
        model: modelId,
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2500,
        }
    })

    // Truncate code to save tokens
    const truncated = code.length > MAX_INPUT_CHARS ? code.slice(0, MAX_INPUT_CHARS) : code

    // Compact prompt optimized for token efficiency
    const prompt = buildReviewPrompt(truncated, filename, context)

    // Retry loop with exponential backoff
    let lastError: Error | null = null

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const result = await model.generateContent(prompt)
            const response = result.response
            let text = response.text().trim()

            // Clean up JSON from markdown code blocks
            text = cleanJsonResponse(text)

            // Parse tokens if available
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

            return parseReviewResponse(text, modelConfig.name, tokens)

        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err))
            
            // Check if rate limited
            const isRateLimit = isRateLimitError(err)
            
            if (isRateLimit && attempt < MAX_RETRIES - 1) {
                // Exponential backoff
                const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt)
                console.warn(`Gemini rate limit hit, waiting ${delay}ms before retry...`)
                await sleep(delay)
                continue
            }

            break
        }
    }

    // All retries exhausted
    throw lastError || new Error('Gemini API request failed')
}

/**
 * Build an optimized review prompt
 */
function buildReviewPrompt(code: string, filename: string, context?: string): string {
    return `Analyze this code. Return ONLY valid JSON, no markdown.

${context ? `Context: ${context}\n` : ''}File: ${filename}

\`\`\`
${code}
\`\`\`

Return JSON:
{
  "summary": {
    "overallScore": <0-100>,
    "grade": "<A+|A|B|C|D|F>",
    "totalIssues": <n>,
    "criticalCount": <n>,
    "highCount": <n>,
    "mediumCount": <n>,
    "lowCount": <n>
  },
  "issues": [
    {
      "id": "<unique-id>",
      "severity": "<critical|high|medium|low|info>",
      "category": "<bug|security|performance|maintainability|style|best-practice>",
      "title": "<short>",
      "description": "<details>",
      "lineNumber": <n or null>,
      "codeSnippet": "<code or null>",
      "suggestion": "<fix>",
      "impact": "<why>"
    }
  ],
  "metrics": {
    "complexity": <1-10>,
    "maintainability": <0-100>,
    "readability": <0-100>,
    "testability": <0-100>,
    "security": <0-100>
  },
  "strengths": ["<s1>", "<s2>"],
  "recommendations": ["<r1>", "<r2>"]
}`
}

/**
 * Clean JSON response from markdown formatting
 */
function cleanJsonResponse(text: string): string {
    // Remove markdown code blocks
    if (text.startsWith('```json')) {
        text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\s*/, '').replace(/\s*```$/, '').trim()
    }
    return text
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(err: unknown): boolean {
    if (!err) return false
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any
    
    return (
        error?.status === 429 ||
        error?.statusCode === 429 ||
        error?.code === 'RESOURCE_EXHAUSTED' ||
        (error?.message && (
            error.message.includes('quota') ||
            error.message.includes('rate limit') ||
            error.message.includes('429')
        ))
    )
}

/**
 * Parse LLM response into structured format
 */
function parseReviewResponse(text: string, model: string, tokens: number | null): ReviewResult {
    let structured: StructuredReview | null = null
    let markdown = ''

    try {
        const parsed = JSON.parse(text) as StructuredReview

        // Validate required fields
        if (
            parsed?.summary &&
            typeof parsed.summary.overallScore === 'number' &&
            typeof parsed.summary.grade === 'string' &&
            Array.isArray(parsed.issues) &&
            parsed.metrics &&
            typeof parsed.metrics.security === 'number'
        ) {
            structured = parsed
            markdown = generateMarkdownFromStructured(parsed)
        } else {
            console.warn('Parsed JSON but validation failed')
            markdown = '# Code Review\n\nParsing failed. Raw response:\n\n```json\n' + text + '\n```'
        }
    } catch (error) {
        console.warn('JSON parsing failed:', error instanceof Error ? error.message : 'Unknown')
        
        // If text looks like JSON, show parse error
        if (text.trim().startsWith('{')) {
            markdown = '# Code Review\n\n⚠️ Parse error. Raw response:\n\n```json\n' + text + '\n```'
        } else {
            markdown = text
        }
    }

    return {
        structured,
        markdown: markdown || '# Code Review\n\nNo content generated.',
        model,
        tokens,
    }
}

/**
 * Generate markdown from structured review
 */
function generateMarkdownFromStructured(review: StructuredReview): string {
    const { summary, issues, metrics, strengths, recommendations } = review

    let md = `# Code Review Summary\n\n`
    md += `**Grade:** ${summary.grade} (${summary.overallScore}/100)\n`
    md += `**Total Issues:** ${summary.totalIssues}\n\n`

    md += `## Metrics\n\n`
    md += `| Metric | Score |\n|--------|-------|\n`
    md += `| Complexity | ${metrics.complexity}/10 |\n`
    md += `| Maintainability | ${metrics.maintainability}/100 |\n`
    md += `| Readability | ${metrics.readability}/100 |\n`
    md += `| Testability | ${metrics.testability}/100 |\n`
    md += `| Security | ${metrics.security}/100 |\n\n`

    if (strengths.length > 0) {
        md += `## Strengths\n\n`
        strengths.forEach((s: string) => md += `- ${s}\n`)
        md += `\n`
    }

    if (issues.length > 0) {
        md += `## Issues\n\n`
        const grouped: Record<string, typeof issues> = {}
        issues.forEach((i: typeof issues[0]) => {
            if (!grouped[i.severity]) grouped[i.severity] = []
            grouped[i.severity].push(i)
        })

        for (const sev of ['critical', 'high', 'medium', 'low', 'info']) {
            const items = grouped[sev]
            if (items?.length) {
                md += `### ${sev.toUpperCase()}\n\n`
                items.forEach((i: typeof issues[0]) => {
                    md += `**${i.title}** (${i.category})\n`
                    md += `${i.description}\n`
                    md += `> 💡 ${i.suggestion}\n\n`
                })
            }
        }
    }

    if (recommendations.length > 0) {
        md += `## Recommendations\n\n`
        recommendations.forEach((r: string) => md += `- ${r}\n`)
    }

    return md
}

/**
 * Get hash of code for caching
 */
export function getCodeHash(code: string): string {
    // Simple hash for caching
    let hash = 0
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
}
