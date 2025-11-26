'use client'

import { useState } from 'react'
import type { ReviewIssue } from '@/lib/types'
import { SeverityBadge } from './SeverityBadge'

interface IssueCardProps {
  issue: ReviewIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false)

  const categoryColors = {
    bug: 'text-red-400',
    security: 'text-purple-400',
    performance: 'text-orange-400',
    maintainability: 'text-blue-400',
    style: 'text-gray-400',
    'best-practice': 'text-emerald-400',
  }

  return (
    <div className="border border-white/[0.08] rounded-lg overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <SeverityBadge severity={issue.severity} />
              <span className={`text-sm font-medium ${categoryColors[issue.category]}`}>
                {issue.category.replace('-', ' ').toUpperCase()}
              </span>
              {issue.lineNumber && (
                <span className="text-xs text-gray-500 bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded">
                  Line {issue.lineNumber}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white mb-1">{issue.title}</h3>
            {!expanded && (
              <p className="text-sm text-gray-400 line-clamp-2">{issue.description}</p>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/[0.06] pt-4 bg-white/[0.01]">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-1">Description</h4>
            <p className="text-sm text-gray-300">{issue.description}</p>
          </div>

          {issue.codeSnippet && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-1">Code Snippet</h4>
              <pre className="bg-[#0a0c0f] text-gray-300 p-3 rounded-lg overflow-x-auto text-xs border border-white/[0.06]">
                <code>{issue.codeSnippet}</code>
              </pre>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-emerald-400 mb-1">💡 Suggestion</h4>
            <p className="text-sm text-gray-300 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              {issue.suggestion}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-orange-400 mb-1">⚠️ Impact</h4>
            <p className="text-sm text-gray-300 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
              {issue.impact}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
