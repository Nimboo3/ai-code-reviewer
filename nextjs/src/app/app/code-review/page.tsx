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
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/code-review', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to review')
      form.reset()
      await fetchItems()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">AI Code Review</h1>
      <form onSubmit={onSubmit} className="bg-white p-4 rounded-md border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload source file</label>
          <input name="file" type="file" required className="block w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select name="model" defaultValue="gpt-4o-mini" className="block w-full border rounded px-2 py-1">
            <optgroup label="OpenAI">
              <option value="gpt-4o-mini">gpt-4o-mini (OpenAI)</option>
            </optgroup>
            <optgroup label="Local (Ollama)">
              <option value="qwen2.5-coder:7b">qwen2.5-coder:7b (local)</option>
              <option value="llama3.2:3b">llama3.2:3b (local)</option>
              <option value="llama3.1:8b">llama3.1:8b (local)</option>
            </optgroup>
          </select>
          <p className="text-xs text-gray-500 mt-1">Local models require Ollama + (optional) LiteLLM proxy running on your machine.</p>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded">
            {loading ? 'Analyzing…' : 'Run Review'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <div className="bg-white rounded-md border">
        <div className="p-4 border-b font-medium">Recent Reviews</div>
        <ul>
          {items.map((it) => (
            <li key={it.id} className="p-4 border-t flex items-center justify-between">
              <div>
                <div className="font-medium">{it.file_name}</div>
                <div className="text-sm text-gray-500">{new Date(it.created_at).toLocaleString()} • {it.language || 'unknown'}</div>
              </div>
              <a className="text-primary-600 hover:underline" href={`/app/code-review/${it.id}`}>View</a>
            </li>
          ))}
          {items.length === 0 && !loading && (
            <li className="p-4 text-gray-500">No reviews yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
