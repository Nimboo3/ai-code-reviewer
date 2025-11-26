'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

// Mock PR data
const mockPR = {
  number: 142,
  title: 'Add authentication flow with MFA support',
  description: 'This PR implements a complete authentication flow including login, registration, password reset, and multi-factor authentication using TOTP.',
  author: 'tanmay',
  authorAvatar: 'T',
  status: 'open',
  created: '1 hour ago',
  updated: '30 minutes ago',
  baseBranch: 'main',
  headBranch: 'feature/auth-mfa',
  commits: 8,
  filesChanged: 12,
  additions: 847,
  deletions: 123,
  riskScore: 72,
  reviewStatus: 'pending',
};

// Mock diff data with inline comments
const mockDiffFiles = [
  {
    path: 'src/lib/auth/mfa.ts',
    status: 'added',
    additions: 156,
    deletions: 0,
    riskLevel: 'high',
    hunks: [
      {
        header: '@@ -0,0 +1,156 @@',
        lines: [
          { type: 'add', number: 1, content: "import { createClient } from '@supabase/supabase-js';" },
          { type: 'add', number: 2, content: "import * as OTPAuth from 'otpauth';" },
          { type: 'add', number: 3, content: '' },
          { type: 'add', number: 4, content: 'export interface MFAConfig {' },
          { type: 'add', number: 5, content: '  issuer: string;' },
          { type: 'add', number: 6, content: '  algorithm: string;' },
          { type: 'add', number: 7, content: '  digits: number;' },
          { type: 'add', number: 8, content: '  period: number;' },
          { type: 'add', number: 9, content: '}' },
          { type: 'add', number: 10, content: '' },
          { type: 'add', number: 11, content: 'export async function generateTOTPSecret(userId: string): Promise<string> {', hasComment: true },
          { type: 'add', number: 12, content: '  const secret = new OTPAuth.Secret();' },
          { type: 'add', number: 13, content: '  // TODO: Store encrypted secret in database' },
          { type: 'add', number: 14, content: '  return secret.base32;' },
          { type: 'add', number: 15, content: '}' },
        ],
        comments: [
          { line: 11, author: 'AI Review', content: 'Consider adding rate limiting to prevent brute-force attacks on TOTP generation.', severity: 'warning' }
        ]
      }
    ]
  },
  {
    path: 'src/components/MFASetup.tsx',
    status: 'added',
    additions: 234,
    deletions: 0,
    riskLevel: 'medium',
    hunks: [
      {
        header: '@@ -0,0 +1,234 @@',
        lines: [
          { type: 'add', number: 1, content: "'use client';" },
          { type: 'add', number: 2, content: '' },
          { type: 'add', number: 3, content: "import { useState } from 'react';" },
          { type: 'add', number: 4, content: "import { QRCodeSVG } from 'qrcode.react';" },
          { type: 'add', number: 5, content: '' },
          { type: 'add', number: 6, content: 'interface MFASetupProps {' },
          { type: 'add', number: 7, content: '  onComplete: () => void;' },
          { type: 'add', number: 8, content: '  onCancel: () => void;' },
          { type: 'add', number: 9, content: '}' },
        ],
        comments: []
      }
    ]
  },
  {
    path: 'src/middleware.ts',
    status: 'modified',
    additions: 45,
    deletions: 12,
    riskLevel: 'high',
    hunks: [
      {
        header: '@@ -15,12 +15,45 @@',
        lines: [
          { type: 'context', number: 15, content: "import { NextResponse } from 'next/server';" },
          { type: 'context', number: 16, content: "import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';" },
          { type: 'remove', number: 17, content: '' },
          { type: 'remove', number: 18, content: 'export async function middleware(req: NextRequest) {' },
          { type: 'add', number: 17, content: "import { checkMFAStatus } from './lib/auth/mfa';" },
          { type: 'add', number: 18, content: '' },
          { type: 'add', number: 19, content: 'const PROTECTED_ROUTES = ["/app", "/api/protected"];', hasComment: true },
          { type: 'add', number: 20, content: 'const MFA_REQUIRED_ROUTES = ["/app/settings", "/app/billing"];' },
          { type: 'add', number: 21, content: '' },
          { type: 'add', number: 22, content: 'export async function middleware(req: NextRequest) {' },
        ],
        comments: [
          { line: 19, author: 'AI Review', content: 'Consider moving route configuration to a separate config file for better maintainability.', severity: 'suggestion' }
        ]
      }
    ]
  }
];

// Mock macro review data
const mockMacroReview = {
  summary: 'This PR introduces a comprehensive MFA implementation. While the core logic is sound, there are several security considerations and architectural improvements recommended.',
  impactAreas: [
    { area: 'Authentication', impact: 'high', description: 'New MFA flow affects all login processes' },
    { area: 'User Sessions', impact: 'medium', description: 'Session handling modified for MFA state' },
    { area: 'Database', impact: 'low', description: 'New columns added for MFA secrets' },
    { area: 'API Routes', impact: 'medium', description: 'New endpoints for MFA setup/verify' },
  ],
  architectureNotes: [
    'MFA module is well-isolated with clear interfaces',
    'Consider extracting auth providers to separate modules',
    'Database schema changes are backward compatible',
  ],
  riskFactors: [
    { factor: 'Security sensitive code', weight: 30 },
    { factor: 'Middleware modifications', weight: 25 },
    { factor: 'New dependencies', weight: 10 },
    { factor: 'Large number of changes', weight: 7 },
  ],
  suggestions: [
    { title: 'Add rate limiting', priority: 'high', description: 'Implement rate limiting on MFA verification endpoint to prevent brute-force attacks.' },
    { title: 'Encrypt TOTP secrets', priority: 'high', description: 'TOTP secrets should be encrypted at rest using AES-256.' },
    { title: 'Add recovery codes', priority: 'medium', description: 'Consider adding backup recovery codes for account recovery.' },
    { title: 'Audit logging', priority: 'medium', description: 'Add audit logs for all MFA-related actions.' },
  ],
  testCoverage: {
    current: 45,
    required: 80,
    missing: ['MFA setup flow', 'TOTP verification', 'Recovery flow', 'Session management']
  }
};

export default function PRViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showComingSoon } = useToast();
  const [selectedFile, setSelectedFile] = useState(mockDiffFiles[0].path);
  const [showMacroPanel, setShowMacroPanel] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-green-400';
      case 'modified': return 'text-yellow-400';
      case 'removed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const selectedDiff = mockDiffFiles.find(f => f.path === selectedFile);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] bg-[#151922]/80 backdrop-blur-sm">
        <button
          onClick={() => router.push(`/app/projects/${params.id}`)}
          className="text-slate-400 hover:text-slate-200 text-sm mb-2 flex items-center gap-1"
        >
          ← Back to Project
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
              {mockPR.status}
            </span>
            <h1 className="text-xl font-bold text-white">
              #{mockPR.number} {mockPR.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <div className={`text-lg font-bold ${mockPR.riskScore >= 70 ? 'text-red-400' : mockPR.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                Risk: {mockPR.riskScore}
              </div>
              <div className="text-xs text-slate-500">
                {mockPR.filesChanged} files • +{mockPR.additions} -{mockPR.deletions}
              </div>
            </div>
            <button
              onClick={() => setShowMacroPanel(!showMacroPanel)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showMacroPanel ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {showMacroPanel ? 'Hide' : 'Show'} Analysis
            </button>
            <button
              onClick={() => showComingSoon()}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => showComingSoon()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Request Changes
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-xs text-white">
              {mockPR.authorAvatar}
            </div>
            {mockPR.author}
          </span>
          <span>wants to merge</span>
          <code className="px-2 py-0.5 bg-[#101318] rounded text-cyan-400">{mockPR.headBranch}</code>
          <span>into</span>
          <code className="px-2 py-0.5 bg-[#101318] rounded text-slate-300">{mockPR.baseBranch}</code>
          <span className="text-slate-500">• {mockPR.commits} commits • Updated {mockPR.updated}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Diff View */}
        <div className={`flex-1 flex flex-col overflow-hidden ${showMacroPanel ? 'border-r border-white/[0.06]' : ''}`}>
          {/* File Tree */}
          <div className="p-3 border-b border-white/[0.06] bg-[#151922]/50">
            <div className="flex items-center gap-2 overflow-x-auto">
              {mockDiffFiles.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file.path)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    selectedFile === file.path
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className={getStatusColor(file.status)}>
                    {file.status === 'added' ? '+' : file.status === 'removed' ? '-' : '~'}
                  </span>
                  <span className="font-mono text-xs">{file.path.split('/').pop()}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs border ${getRiskColor(file.riskLevel)}`}>
                    {file.riskLevel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Diff Content */}
          <div className="flex-1 overflow-auto p-4">
            {selectedDiff && (
              <div className="bg-[#151922] rounded-xl border border-white/[0.06] overflow-hidden">
                {/* File Header */}
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${getStatusColor(selectedDiff.status)}`}>
                      {selectedDiff.status === 'added' ? 'New file' : selectedDiff.status === 'modified' ? 'Modified' : 'Deleted'}
                    </span>
                    <span className="font-mono text-sm text-slate-200">{selectedDiff.path}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-400">+{selectedDiff.additions}</span>
                    <span className="text-red-400">-{selectedDiff.deletions}</span>
                  </div>
                </div>

                {/* Diff Lines */}
                <div className="font-mono text-sm">
                  {selectedDiff.hunks.map((hunk, hunkIndex) => (
                    <div key={hunkIndex}>
                      <div className="px-4 py-2 bg-[#1a1f29] text-slate-500 border-b border-white/[0.04]">
                        {hunk.header}
                      </div>
                      {hunk.lines.map((line, lineIndex) => (
                        <div key={lineIndex}>
                          <div
                            className={`flex ${
                              line.type === 'add' ? 'bg-green-500/10' :
                              line.type === 'remove' ? 'bg-red-500/10' :
                              ''
                            }`}
                          >
                            <div className="w-12 px-2 py-1 text-right text-slate-500 border-r border-white/[0.04] select-none">
                              {line.number}
                            </div>
                            <div className="w-8 px-2 py-1 text-center border-r border-white/[0.04] select-none">
                              <span className={
                                line.type === 'add' ? 'text-green-400' :
                                line.type === 'remove' ? 'text-red-400' :
                                'text-slate-600'
                              }>
                                {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                              </span>
                            </div>
                            <div className="flex-1 px-4 py-1">
                              <span className={
                                line.type === 'add' ? 'text-green-300' :
                                line.type === 'remove' ? 'text-red-300' :
                                'text-slate-300'
                              }>
                                {line.content || ' '}
                              </span>
                            </div>
                            {line.hasComment && (
                              <div className="px-2 py-1">
                                <span className="text-yellow-400">💬</span>
                              </div>
                            )}
                          </div>
                          {/* Inline Comment */}
                          {hunk.comments.find(c => c.line === line.number) && (
                            <div className="mx-12 my-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-yellow-400">
                                  {hunk.comments.find(c => c.line === line.number)?.author}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-xs ${
                                  hunk.comments.find(c => c.line === line.number)?.severity === 'warning'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {hunk.comments.find(c => c.line === line.number)?.severity}
                                </span>
                              </div>
                              <p className="text-sm text-slate-300">
                                {hunk.comments.find(c => c.line === line.number)?.content}
                              </p>
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={() => showComingSoon()}
                                  className="text-xs text-slate-400 hover:text-slate-200"
                                >
                                  Reply
                                </button>
                                <button
                                  onClick={() => showComingSoon()}
                                  className="text-xs text-slate-400 hover:text-slate-200"
                                >
                                  Resolve
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Add Comment Button */}
                <div className="p-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => showComingSoon()}
                    className="w-full py-2 border border-dashed border-white/[0.1] rounded-lg text-slate-400 hover:text-slate-200 hover:border-white/[0.2] transition-colors text-sm"
                  >
                    + Add a comment to this file
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Macro Review */}
        {showMacroPanel && (
          <div className="w-[450px] overflow-auto bg-[#0d1015]">
            <div className="p-4 space-y-4">
              {/* Summary */}
              <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                  <span>🤖</span> AI Summary
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {mockMacroReview.summary}
                </p>
              </div>

              {/* Risk Score Breakdown */}
              <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-medium mb-3">Risk Score Breakdown</h3>
                <div className="space-y-2">
                  {mockMacroReview.riskFactors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#101318] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"
                            style={{ width: `${factor.weight * 3}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">+{factor.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-sm text-slate-300">Total Risk Score</span>
                  <span className={`text-lg font-bold ${mockPR.riskScore >= 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {mockPR.riskScore}
                  </span>
                </div>
              </div>

              {/* Impact Areas */}
              <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-medium mb-3">Impact Map</h3>
                <div className="space-y-2">
                  {mockMacroReview.impactAreas.map((area, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[#101318]">
                      <div className={`w-2 h-2 rounded-full ${
                        area.impact === 'high' ? 'bg-red-400' :
                        area.impact === 'medium' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm text-slate-200">{area.area}</div>
                        <div className="text-xs text-slate-500">{area.description}</div>
                      </div>
                      <span className={`text-xs ${getImpactColor(area.impact)}`}>
                        {area.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Notes */}
              <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-medium mb-3">Architecture Notes</h3>
                <ul className="space-y-2">
                  {mockMacroReview.architectureNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-medium mb-3">Refactor Suggestions</h3>
                <div className="space-y-3">
                  {mockMacroReview.suggestions.map((suggestion, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-200">{suggestion.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          suggestion.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{suggestion.description}</p>
                      <button
                        onClick={() => showComingSoon()}
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        Apply fix →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Coverage */}
              <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-white font-medium mb-3">Test Coverage</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Current</span>
                      <span className="text-red-400">{mockMacroReview.testCoverage.current}%</span>
                    </div>
                    <div className="h-2 bg-[#101318] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${mockMacroReview.testCoverage.current}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-slate-500">→</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Required</span>
                      <span className="text-green-400">{mockMacroReview.testCoverage.required}%</span>
                    </div>
                    <div className="h-2 bg-[#101318] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${mockMacroReview.testCoverage.required}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="text-slate-400">Missing tests:</span>{' '}
                  {mockMacroReview.testCoverage.missing.join(', ')}
                </div>
                <button
                  onClick={() => showComingSoon()}
                  className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Generate Missing Tests
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
