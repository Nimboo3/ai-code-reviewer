'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import type { Tables, StructuredReview } from '@/lib/types'
import { ScoreBadge } from '@/components/code-review/ScoreBadge'
import { IssueCard } from '@/components/code-review/IssueCard'
import { MetricsChart } from '@/components/code-review/MetricsChart'

type CodeReview = Tables<'code_reviews'>

type FilterSeverity = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'info'
type FilterCategory = 'all' | 'bug' | 'security' | 'performance' | 'maintainability' | 'style' | 'best-practice'

export default function CodeReviewDetailPage() {
  const params = useParams()
  const [review, setReview] = useState<CodeReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterSeverity>('all')
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/code-review?id=${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setReview(data.item)
      } catch (error) {
        console.error('Failed to fetch review:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReview()
  }, [params.id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/[0.05] rounded w-1/4"></div>
          <div className="h-64 bg-white/[0.05] rounded"></div>
        </div>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Review not found
        </div>
        <Link href="/app/code-review" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to reviews
        </Link>
      </div>
    )
  }

  // Parse structured data
  let structured: StructuredReview | null = null
  try {
    if (review.structured_data) {
      // Handle both object and string formats
      if (typeof review.structured_data === 'string') {
        structured = JSON.parse(review.structured_data) as StructuredReview
      } else {
        structured = review.structured_data as unknown as StructuredReview
      }
      
      // Validate the structure
      if (!structured?.summary || !structured?.issues || !structured?.metrics) {
        console.warn('Invalid structured data format, falling back to markdown')
        structured = null
      } else {
        console.log('✅ Loaded structured review data successfully')
      }
    }
  } catch (e) {
    console.error('Failed to parse structured data:', e)
    structured = null
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter issues by both severity and category
  const filteredIssues = structured?.issues.filter(issue => {
    const severityMatch = filter === 'all' || issue.severity === filter
    const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter
    return severityMatch && categoryMatch
  }) || []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/app/code-review" className="text-sm text-cyan-400 hover:text-cyan-300 mb-2 inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to reviews
          </Link>
          <h1 className="text-3xl font-bold text-white">{review.file_name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(review.created_at).toLocaleString()} • {review.language || 'unknown'} • {review.model}
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/[0.1] hover:bg-white/10 rounded-lg text-sm font-medium text-gray-300 transition-colors"
        >
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
      </div>

      {/* Dashboard View (if structured data available) */}
      {structured ? (
        <>
          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="lg:col-span-1 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent rounded-xl p-6 border border-cyan-500/20">
              <div className="flex flex-col items-center text-center">
                <ScoreBadge 
                  grade={structured.summary.grade} 
                  score={structured.summary.overallScore}
                  size="lg"
                />
                <h2 className="text-lg font-semibold text-white mt-4">Overall Quality</h2>
                <p className="text-sm text-gray-500">Code quality assessment</p>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/[0.06]">
              <h2 className="text-xl font-bold text-white mb-4">Issues Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="text-3xl font-bold text-red-400">{structured.summary.criticalCount}</div>
                  <div className="text-xs text-red-400/80 mt-1">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <div className="text-3xl font-bold text-orange-400">{structured.summary.highCount}</div>
                  <div className="text-xs text-orange-400/80 mt-1">High</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="text-3xl font-bold text-yellow-400">{structured.summary.mediumCount}</div>
                  <div className="text-xs text-yellow-400/80 mt-1">Medium</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400">{structured.summary.lowCount}</div>
                  <div className="text-xs text-blue-400/80 mt-1">Low</div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Total: <span className="font-bold text-white">{structured.summary.totalIssues} issues found</span>
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/[0.06]">
            <h2 className="text-xl font-bold text-white mb-6">Code Metrics</h2>
            <MetricsChart metrics={structured.metrics} />
          </div>

          {/* Strengths Section */}
          {structured.strengths.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-6 border border-emerald-500/20">
              <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <span>✨</span> Strengths
              </h2>
              <ul className="space-y-2">
                {structured.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues Section */}
          {structured.issues.length > 0 && (
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/[0.06]">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Issues Found</h2>
                
                {/* Filter Controls */}
                <div className="space-y-3">
                  {/* Severity Filter - Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-400 mr-2">Severity:</span>
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === 'all' 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/[0.08]'
                      }`}
                    >
                      All ({structured.issues.length})
                    </button>
                    {(['critical', 'high', 'medium', 'low'] as const).map(severity => {
                      const count = structured.issues.filter(i => i.severity === severity).length
                      if (count === 0) return null
                      return (
                        <button
                          key={severity}
                          onClick={() => setFilter(severity)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            filter === severity 
                              ? 'bg-cyan-500 text-white' 
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/[0.08]'
                          }`}
                        >
                          {severity.charAt(0).toUpperCase() + severity.slice(1)} ({count})
                        </button>
                      )
                    })}
                  </div>

                  {/* Category Filter - Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-400">
                      Category:
                    </label>
                    <select
                      id="category-filter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as FilterCategory)}
                      className="px-4 py-2 bg-[#0a0c0f] border border-white/[0.1] rounded-lg text-sm font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-colors cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      <option value="bug">Bug</option>
                      <option value="security">Security</option>
                      <option value="performance">Performance</option>
                      <option value="maintainability">Maintainability</option>
                      <option value="style">Style</option>
                      <option value="best-practice">Best Practice</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredIssues.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No issues in this category</p>
                ) : (
                  filteredIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {structured.recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-xl p-6 border border-blue-500/20">
              <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <span>💡</span> Recommendations
              </h2>
              <ul className="space-y-2">
                {structured.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-400 flex-shrink-0">→</span>
                    <span className="text-gray-300 flex-1">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        /* Fallback Markdown View (if no structured data) */
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/[0.06]">
          <h2 className="text-xl font-bold text-white mb-4">Review Report</h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{review.report_md || 'No report available.'}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Raw Report Toggle (for debugging or preference) */}
      {structured && review.report_md && (
        <details className="bg-white/[0.02] rounded-lg border border-white/[0.06]">
          <summary className="px-4 py-3 cursor-pointer font-medium text-gray-400 hover:bg-white/[0.02]">
            View Raw Markdown Report
          </summary>
          <div className="px-4 pb-4 prose prose-invert max-w-none">
            <ReactMarkdown>{review.report_md}</ReactMarkdown>
          </div>
        </details>
      )}
    </div>
  )
}
