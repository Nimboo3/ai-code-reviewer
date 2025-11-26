"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type ReviewItem = {
  id: number
  created_at: string
  file_name: string
  language: string | null
  status: string
  grade: string | null
  overall_score: number | null
  total_issues: number | null
}

export default function CodeReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp') // Default to latest recommended
  const [successNotification, setSuccessNotification] = useState<{
    show: boolean
    reportId: number | null
    fileName: string | null
  }>({ show: false, reportId: null, fileName: null })

  // Check if running in local development
  const isLocalDev = process.env.NODE_ENV === 'development'

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/code-review?limit=5', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setItems(json.items || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const file = fd.get('file') as File
    const fileName = file?.name || 'Unknown file'
    
    // Client-side file size validation (500KB max for Free tier)
    const MAX_FILE_SIZE = 500 * 1024 // 500KB
    if (file && file.size > MAX_FILE_SIZE) {
      setError(`File too large for Free tier! Your file is ${(file.size / 1024).toFixed(1)}KB but Free tier supports up to ${MAX_FILE_SIZE / 1024}KB. Upgrade to Premium for 10MB file uploads!`)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/code-review', { method: 'POST', body: fd })
      const json = await res.json()
      
      // Handle different error types with specific messages
      if (!res.ok) {
        if (res.status === 429 || res.status === 413) {
          // Rate limit or file size error - might have upgrade prompt
          const errorMsg = json.error || 'Failed to review'
          const hasUpgradePrompt = json.upgradeToPremium
          
          if (hasUpgradePrompt) {
            // Show error with upgrade suggestion
            throw new Error(errorMsg + ' 🚀')
          } else {
            throw new Error(errorMsg)
          }
        } else {
          throw new Error(json.error || 'Failed to review')
        }
      }
      
      // Show success notification with report ID
      setSuccessNotification({
        show: true,
        reportId: json.id,
        fileName: fileName,
      })
      
      form.reset()
      await fetchItems()
      
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        setSuccessNotification({ show: false, reportId: null, fileName: null })
      }, 10000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Success Notification Toast */}
      {successNotification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up">
          <div className="bg-[#0f1117]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-emerald-500/30 max-w-md">
            <div className="flex items-start gap-4">
              {/* Success Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white mb-1">
                  ✨ Review Complete!
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  <span className="font-semibold text-white">{successNotification.fileName}</span> has been analyzed successfully.
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/app/code-review?id=${successNotification.reportId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Report
                  </a>
                  <button
                    onClick={() => setSuccessNotification({ show: false, reportId: null, fileName: null })}
                    className="inline-flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setSuccessNotification({ show: false, reportId: null, fileName: null })}
                className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-white">AI Code Review</h1>
        <p className="mt-2 text-gray-400">Upload your code and get instant AI-powered feedback</p>
      </div>
      
      <form onSubmit={onSubmit} className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/[0.06] space-y-6 hover:border-white/[0.1] transition-colors">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Upload source file
            <span className="ml-2 text-xs font-normal text-gray-500">(Max 500KB)</span>
          </label>
          <div className="relative">
            <input 
              name="file" 
              type="file" 
              required 
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white
                file:cursor-pointer file:hover:shadow-lg file:hover:shadow-cyan-500/25 file:transition-all file:duration-200
                cursor-pointer" 
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Rate limit: 10 reviews per day • File size: max 500KB • Code length: max 50k characters</span>
            </p>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white mb-2">AI Model</label>
          <select
            name="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0c0f] border border-white/[0.1] 
                       rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 
                       focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all
                       hover:border-white/[0.15] cursor-pointer"
          >
            <optgroup label="─── Recommended ───" className="bg-[#0a0c0f] text-gray-300">
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash — Fastest, latest model</option>
              <option value="gemini-2.0-flash-thinking-exp-1219">Gemini 2.0 Flash Thinking — Extended reasoning</option>
            </optgroup>
            
            <optgroup label="─── Google Gemini ───" className="bg-[#0a0c0f] text-gray-300">
              <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash — 1500 free per day</option>
              <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro — 1500 free per day</option>
            </optgroup>
            
            <optgroup label="─── OpenAI ───" className="bg-[#0a0c0f] text-gray-300">
              <option value="gpt-4o-mini">GPT-4o Mini — $0.15 per 1M tokens</option>
              <option value="gpt-4o">GPT-4o — $2.50 per 1M tokens</option>
            </optgroup>
            
            {/* Only show Ollama models in local development */}
            {isLocalDev && (
              <>
                <optgroup label="─── Local (Fast) ───" className="bg-[#0a0c0f] text-gray-300">
                  <option value="gemma3:1b">Gemma 3 1B — Fastest, 1-2 seconds</option>
                  <option value="gemma3:4b">Gemma 3 4B — Balanced, 3-5 seconds</option>
                  <option value="qwen3:4b">Qwen 3 4B — Best for code, 3-5 seconds</option>
                </optgroup>
                
                <optgroup label="─── Local (Quality) ───" className="bg-[#0a0c0f] text-gray-300">
                  <option value="qwen3:8b">Qwen 3 8B — Better quality, 8-12 seconds</option>
                  <option value="deepseek-rl:8b">DeepSeek RL 8B — Code-focused, 8-12 seconds</option>
                  <option value="qwen2.5-coder:7b">Qwen 2.5 Coder 7B — Legacy</option>
                  <option value="llama3.2:3b">Llama 3.2 3B — General purpose</option>
                </optgroup>
              </>
            )}
          </select>
          {isLocalDev ? (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Local models require Ollama running on your machine</span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cloud-hosted models - no setup required</span>
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={loading} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Analyzing…
              </span>
            ) : (
              'Run Review'
            )}
          </button>
        </div>
        
        {error && (
          <>
            {error.includes('🚀') ? (
              // Upgrade prompt for Free tier limits
              <div className="relative bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/20 p-6 rounded-xl animate-slide-up">
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    UPGRADE AVAILABLE
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/25">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Free Tier Limit Reached</h3>
                    <p className="text-gray-400 text-sm mb-4">{error.replace(' 🚀', '')}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        href="/#pricing"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        View Premium Features
                      </Link>
                      
                      <button 
                        onClick={() => setError(null)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm text-gray-300 font-medium rounded-lg border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/10 transition-all duration-200"
                      >
                        Dismiss
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                      <p className="text-xs text-gray-400 font-medium mb-2">✨ Premium Benefits:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Unlimited reviews
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          10MB file uploads
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Priority processing
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Advanced security
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Regular error display
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg animate-slide-up">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
          </>
        )}
      </form>

      <div className="bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/[0.06]">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-bold text-white flex items-center gap-2">
            ⏱️ Recent Reviews
            <span className="text-sm font-normal text-gray-500">(Last 5)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            View or delete reviews from the <Link href="/app/code-review/archive" className="text-cyan-400 hover:underline font-medium">All Reviews</Link> section
          </p>
        </div>
        <ul className="divide-y divide-white/[0.04]">
          {items.map((it, idx) => (
            <li 
              key={it.id} 
              className="p-6 hover:bg-white/[0.02] transition-colors duration-200 group animate-fade-in"
              style={{animationDelay: `${idx * 0.05}s`}}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {it.file_name}
                    </div>
                    {it.grade && (
                      <div className={`
                        px-2 py-0.5 rounded-md text-xs font-bold
                        ${it.grade === 'A+' || it.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
                        ${it.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                        ${it.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                        ${it.grade === 'D' || it.grade === 'F' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                      `}>
                        {it.grade} {it.overall_score !== null && `(${it.overall_score}/100)`}
                      </div>
                    )}
                    {it.total_issues !== null && it.total_issues > 0 && (
                      <div className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-md text-xs font-medium">
                        {it.total_issues} issue{it.total_issues !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{new Date(it.created_at).toLocaleString()}</span>
                    <span className="text-gray-600">•</span>
                    <span className="px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded-md text-xs font-medium text-gray-400">{it.language || 'unknown'}</span>
                  </div>
                </div>
                <a 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 flex-shrink-0" 
                  href={`/app/code-review/${it.id}`}
                >
                  View Report
                </a>
              </div>
            </li>
          ))}
          {items.length === 0 && !loading && (
            <li className="p-8 text-center">
              <div className="text-gray-500 text-sm">
                <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium text-gray-400">No reviews yet</p>
                <p className="text-xs mt-1 text-gray-500">Upload a file above to get started</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
