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
    bug: 'text-red-600',
    security: 'text-purple-600',
    performance: 'text-orange-600',
    maintainability: 'text-blue-600',
    style: 'text-gray-600',
    'best-practice': 'text-green-600',
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <SeverityBadge severity={issue.severity} />
              <span className={`text-sm font-medium ${categoryColors[issue.category]}`}>
                {issue.category.replace('-', ' ').toUpperCase()}
              </span>
              {issue.lineNumber && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Line {issue.lineNumber}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
            {!expanded && (
              <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4 bg-gray-50">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600">{issue.description}</p>
          </div>

          {issue.codeSnippet && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Code Snippet</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                <code>{issue.codeSnippet}</code>
              </pre>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-1">💡 Suggestion</h4>
            <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
              {issue.suggestion}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-orange-700 mb-1">⚠️ Impact</h4>
            <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
              {issue.impact}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
