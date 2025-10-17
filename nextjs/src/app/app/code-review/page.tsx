"use client"
import React, { useEffect, useState } from 'react'

type ReviewItem = {
  id: number
  created_at: string
  file_name: string
  language: string | null
  status: string
}

export default function CodeReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash-latest') // Free tier default
  const [successNotification, setSuccessNotification] = useState<{
    show: boolean
    reportId: number | null
    fileName: string | null
  }>({ show: false, reportId: null, fileName: null })

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/code-review', { cache: 'no-store' })
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
    const fileName = (fd.get('file') as File)?.name || 'Unknown file'
    
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/code-review', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to review')
      
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
          <div className="glass p-4 rounded-2xl shadow-2xl border-2 border-green-200 max-w-md">
            <div className="flex items-start gap-4">
              {/* Success Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  ✨ Review Complete!
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">{successNotification.fileName}</span> has been analyzed successfully.
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`/app/code-review?id=${successNotification.reportId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Report
                  </a>
                  <button
                    onClick={() => setSuccessNotification({ show: false, reportId: null, fileName: null })}
                    className="inline-flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setSuccessNotification({ show: false, reportId: null, fileName: null })}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
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
        <h1 className="text-4xl font-bold gradient-text">AI Code Review</h1>
        <p className="mt-2 text-gray-600">Upload your code and get instant AI-powered feedback</p>
      </div>
      
      <form onSubmit={onSubmit} className="glass p-6 rounded-2xl space-y-6 hover-lift">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Upload source file</label>
          <div className="relative">
            <input 
              name="file" 
              type="file" 
              required 
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-3 file:px-6
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:gradient-bg-primary file:text-white
                file:cursor-pointer file:hover-scale file:transition-all file:duration-200
                hover:file:shadow-lg
                cursor-pointer" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">AI Model</label>
          <select
            name="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 
                       rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                       focus:border-indigo-500 transition-all"
          >
            <optgroup label="🌟 Recommended (Free Tier)">
              <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (1500 free/day) ⭐</option>
              <option value="gemma3:4b">Gemma3 4B (Local - No limits) ⭐</option>
              <option value="qwen3:4b">Qwen3 4B (Local - Best for code) ⭐</option>
            </optgroup>
            
            <optgroup label="💰 Cloud Models (Paid/Limited)">
              <option value="gpt-4o-mini">GPT-4o Mini ($0.15/1M tokens)</option>
              <option value="gpt-4o">GPT-4o ($2.50/1M tokens)</option>
              <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro (1500 free/day)</option>
            </optgroup>
            
            <optgroup label="🚀 Latest Experimental (Free Tier)">
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash ⚡ (Fastest, Latest)</option>
              <option value="gemini-2.0-flash-thinking-exp-1219">Gemini 2.0 Flash Thinking 🧠 (Extended reasoning)</option>
            </optgroup>
            
            <optgroup label="💻 Local Ollama (Fast CPU Models)">
              <option value="gemma3:1b">Gemma3 1B (Fastest - 1-2s)</option>
              <option value="gemma3:4b">Gemma3 4B (Balanced - 3-5s) ⭐</option>
              <option value="qwen3:4b">Qwen3 4B (Best for code - 3-5s) ⭐</option>
            </optgroup>
            
            <optgroup label="🐌 Local Ollama (Slower, Better Quality)">
              <option value="qwen3:8b">Qwen3 8B (Better quality - 8-12s)</option>
              <option value="deepseek-rl:8b">DeepSeek-RL 8B (Code-focused - 8-12s)</option>
              <option value="qwen2.5-coder:7b">Qwen2.5-Coder 7B (Legacy)</option>
              <option value="llama3.2:3b">Llama3.2 3B (General purpose)</option>
            </optgroup>
          </select>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            Local models require Ollama + (optional) LiteLLM proxy running on your machine.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={loading} 
            className="gradient-bg-primary text-white px-6 py-3 rounded-xl font-semibold hover-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-slide-up">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
      </form>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent">
          <h2 className="font-bold text-gray-900">Recent Reviews</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {items.map((it, idx) => (
            <li 
              key={it.id} 
              className="p-6 hover:bg-gray-50/50 transition-colors duration-200 group animate-fade-in"
              style={{animationDelay: `${idx * 0.05}s`}}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{it.file_name}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>{new Date(it.created_at).toLocaleString()}</span>
                    <span className="text-gray-300">•</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium">{it.language || 'unknown'}</span>
                  </div>
                </div>
                <a 
                  className="gradient-bg-accent text-white px-4 py-2 rounded-lg font-medium hover-glow transition-all duration-200 shadow-sm" 
                  href={`/app/code-review/${it.id}`}
                >
                  View Report
                </a>
              </div>
            </li>
          ))}
          {items.length === 0 && !loading && (
            <li className="p-8 text-center">
              <div className="text-gray-400 text-sm">
                <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium">No reviews yet</p>
                <p className="text-xs mt-1">Upload a file above to get started</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
