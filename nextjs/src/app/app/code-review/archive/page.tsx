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

export default function CodeReviewArchivePage() {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; item: ReviewItem | null }>({
    show: false,
    item: null,
  })
  const [deleting, setDeleting] = useState(false)

  const fetchArchive = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch ALL reviews (no limit or offset)
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

  useEffect(() => { fetchArchive() }, [])

  const handleDeleteClick = (item: ReviewItem) => {
    setDeleteModal({ show: true, item })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/code-review?id=${deleteModal.item.id}`, { 
        method: 'DELETE' 
      })
      if (!res.ok) throw new Error('Failed to delete')
      
      // Remove from list
      setItems(items.filter(it => it.id !== deleteModal.item!.id))
      setDeleteModal({ show: false, item: null })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, item: null })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/app/code-review" className="text-sm text-cyan-400 hover:text-cyan-300 mb-2 inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Code Review
        </Link>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">All Reviews</h1>
        <p className="text-slate-400">
          Complete history of all your code reviews. Delete reviews as needed.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Archive List */}
      <div className="bg-[#2e333d] backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50">
        <div className="px-6 py-4 border-b border-slate-800/60">
          <h2 className="font-bold text-slate-100 flex items-center gap-2">
            📚 All Reviews
            {!loading && <span className="text-sm font-normal text-slate-500">({items.length} total)</span>}
          </h2>
        </div>

        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-800/40 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800/40">
            {items.map((it, idx) => (
              <li 
                key={it.id} 
                className="p-6 hover:bg-slate-800/30 transition-colors duration-200 group animate-fade-in"
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {it.file_name}
                      </div>
                      {it.grade && (
                        <div className={`
                          px-2 py-0.5 rounded-md text-xs font-bold
                          ${it.grade === 'A+' || it.grade === 'A' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                          ${it.grade === 'B' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                          ${it.grade === 'C' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                          ${it.grade === 'D' || it.grade === 'F' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                        `}>
                          {it.grade} {it.overall_score !== null && `(${it.overall_score}/100)`}
                        </div>
                      )}
                      {it.total_issues !== null && it.total_issues > 0 && (
                        <div className="px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-xs font-medium">
                          {it.total_issues} issue{it.total_issues !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span>{new Date(it.created_at).toLocaleString()}</span>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 bg-slate-800/60 border border-slate-700/50 rounded-md text-xs font-medium text-slate-400">{it.language || 'unknown'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a 
                      className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-500/30 transition-all duration-200 border border-cyan-500/30" 
                      href={`/app/code-review/${it.id}`}
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteClick(it)}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {items.length === 0 && !loading && (
              <li className="p-8 text-center">
                <div className="text-slate-500 text-sm">
                  <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium text-slate-400">No reviews yet</p>
                  <p className="text-xs mt-1 text-slate-500">Upload a file from the Code Review page to get started</p>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#2e333d] border border-slate-600/40 rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Delete Review?</h3>
                  <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-slate-100 mb-1">{deleteModal.item?.file_name}</p>
                <p className="text-xs text-slate-500">
                  {deleteModal.item && new Date(deleteModal.item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-slate-800/60 border border-slate-700/50 text-slate-300 rounded-lg font-medium hover:bg-slate-700/60 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors duration-200 disabled:opacity-50 border border-red-500/30"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
