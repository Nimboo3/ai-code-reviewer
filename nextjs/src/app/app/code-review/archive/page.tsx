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
        <Link href="/app/code-review" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Code Review
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Reviews</h1>
        <p className="text-gray-600">
          Complete history of all your code reviews. Delete reviews as needed.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Archive List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            � All Reviews
            {!loading && <span className="text-sm font-normal text-gray-500">({items.length} total)</span>}
          </h2>
        </div>

        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((it, idx) => (
              <li 
                key={it.id} 
                className="p-6 hover:bg-gray-50/50 transition-colors duration-200 group animate-fade-in"
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {it.file_name}
                      </div>
                      {it.grade && (
                        <div className={`
                          px-2 py-0.5 rounded-md text-xs font-bold
                          ${it.grade === 'A+' || it.grade === 'A' ? 'bg-green-100 text-green-700' : ''}
                          ${it.grade === 'B' ? 'bg-blue-100 text-blue-700' : ''}
                          ${it.grade === 'C' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${it.grade === 'D' || it.grade === 'F' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {it.grade} {it.overall_score !== null && `(${it.overall_score}/100)`}
                        </div>
                      )}
                      {it.total_issues !== null && it.total_issues > 0 && (
                        <div className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
                          {it.total_issues} issue{it.total_issues !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{new Date(it.created_at).toLocaleString()}</span>
                      <span className="text-gray-300">•</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium">{it.language || 'unknown'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a 
                      className="gradient-bg-accent text-white px-4 py-2 rounded-lg font-medium hover-glow transition-all duration-200 shadow-sm" 
                      href={`/app/code-review/${it.id}`}
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteClick(it)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
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
                  <p className="text-xs mt-1">Upload a file from the Code Review page to get started</p>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Review?</h3>
                  <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-900 mb-1">{deleteModal.item?.file_name}</p>
                <p className="text-xs text-gray-500">
                  {deleteModal.item && new Date(deleteModal.item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
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
