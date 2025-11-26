'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

// Mock project data
const mockProject = {
  id: 'ai-code-reviewer',
  name: 'ai-code-reviewer',
  fullName: 'Nimboo3/ai-code-reviewer',
  description: 'AI-powered code review and architecture analysis tool',
  language: 'TypeScript',
  architectureScore: 87,
  lastAnalyzed: '2 hours ago',
  totalPRs: 47,
  openPRs: 3,
  contributors: 5,
  branches: 12,
  defaultBranch: 'main',
  techDebtScore: 23,
  securityScore: 94,
  testCoverage: 78,
};

// Mock PRs for this project
const mockPRs = [
  { id: 1, number: 142, title: 'Add authentication flow', author: 'tanmay', status: 'open', riskScore: 72, created: '1 hour ago', reviewStatus: 'pending' },
  { id: 2, number: 141, title: 'Refactor database queries', author: 'alex', status: 'open', riskScore: 45, created: '3 hours ago', reviewStatus: 'approved' },
  { id: 3, number: 140, title: 'Update dependencies', author: 'sarah', status: 'merged', riskScore: 18, created: '1 day ago', reviewStatus: 'approved' },
  { id: 4, number: 139, title: 'Fix memory leak in worker', author: 'tanmay', status: 'merged', riskScore: 85, created: '2 days ago', reviewStatus: 'approved' },
  { id: 5, number: 138, title: 'Add rate limiting middleware', author: 'mike', status: 'closed', riskScore: 32, created: '3 days ago', reviewStatus: 'rejected' },
];

// Mock architecture snapshots
const mockArchitectureSnapshots = [
  { id: 1, version: 'v2.3.0', date: '2 hours ago', score: 87, changes: 12, status: 'current' },
  { id: 2, version: 'v2.2.0', date: '1 week ago', score: 84, changes: 28, status: 'archived' },
  { id: 3, version: 'v2.1.0', date: '2 weeks ago', score: 81, changes: 45, status: 'archived' },
  { id: 4, version: 'v2.0.0', date: '1 month ago', score: 76, changes: 102, status: 'archived' },
];

// Mock tech debt items
const mockTechDebt = [
  { id: 1, title: 'Migrate to React 19', severity: 'medium', effort: '4 hours', category: 'dependencies', file: 'package.json' },
  { id: 2, title: 'Remove deprecated API usage', severity: 'high', effort: '8 hours', category: 'code-quality', file: 'src/lib/api.ts' },
  { id: 3, title: 'Add missing type definitions', severity: 'low', effort: '2 hours', category: 'type-safety', file: 'src/types/' },
  { id: 4, title: 'Refactor monolithic component', severity: 'high', effort: '12 hours', category: 'architecture', file: 'src/components/Dashboard.tsx' },
  { id: 5, title: 'Update test coverage', severity: 'medium', effort: '6 hours', category: 'testing', file: 'src/__tests__/' },
];

// Mock agents for this project
const mockProjectAgents = [
  { id: 1, name: 'Architecture Auditor', status: 'active', lastRun: '2 hours ago', findings: 3 },
  { id: 2, name: 'Security Scout', status: 'active', lastRun: '1 hour ago', findings: 0 },
  { id: 3, name: 'Test Generator', status: 'paused', lastRun: '1 week ago', findings: 12 },
];

// Mock history/audit log
const mockHistory = [
  { id: 1, action: 'PR #142 created', user: 'tanmay', timestamp: '1 hour ago', type: 'pr' },
  { id: 2, action: 'Architecture analysis completed', user: 'system', timestamp: '2 hours ago', type: 'analysis' },
  { id: 3, action: 'Security scan passed', user: 'system', timestamp: '2 hours ago', type: 'security' },
  { id: 4, action: 'PR #141 reviewed', user: 'alex', timestamp: '3 hours ago', type: 'review' },
  { id: 5, action: 'Agent "Security Scout" enabled', user: 'tanmay', timestamp: '1 day ago', type: 'agent' },
  { id: 6, action: 'Branch "feature/auth" created', user: 'tanmay', timestamp: '1 day ago', type: 'branch' },
];

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'prs', label: 'Pull Requests', icon: '🔀' },
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'dependencies', label: 'Dependencies', icon: '📦' },
  { id: 'tech-debt', label: 'Tech Debt', icon: '💳' },
  { id: 'agents', label: 'Agents', icon: '🤖' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showComingSoon } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400';
      case 'merged': return 'bg-purple-500/20 text-purple-400';
      case 'closed': return 'bg-slate-500/20 text-slate-400';
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Architecture Score</div>
          <div className="text-3xl font-bold text-green-400">{mockProject.architectureScore}</div>
          <div className="text-xs text-slate-500 mt-1">+3 from last week</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Tech Debt Score</div>
          <div className="text-3xl font-bold text-yellow-400">{mockProject.techDebtScore}</div>
          <div className="text-xs text-slate-500 mt-1">-5 from last week</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Security Score</div>
          <div className="text-3xl font-bold text-green-400">{mockProject.securityScore}</div>
          <div className="text-xs text-slate-500 mt-1">No change</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Test Coverage</div>
          <div className="text-3xl font-bold text-blue-400">{mockProject.testCoverage}%</div>
          <div className="text-xs text-slate-500 mt-1">+2% from last week</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <h3 className="text-white font-medium mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockHistory.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="text-slate-300 flex-1">{item.action}</span>
                <span className="text-slate-500">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <h3 className="text-white font-medium mb-4">Project Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Repository</span>
              <span className="text-slate-200">{mockProject.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Language</span>
              <span className="text-slate-200">{mockProject.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Default Branch</span>
              <span className="text-slate-200">{mockProject.defaultBranch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Contributors</span>
              <span className="text-slate-200">{mockProject.contributors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Branches</span>
              <span className="text-slate-200">{mockProject.branches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Analyzed</span>
              <span className="text-slate-200">{mockProject.lastAnalyzed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Open PRs Preview */}
      <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Open Pull Requests</h3>
          <button
            onClick={() => setActiveTab('prs')}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            View all →
          </button>
        </div>
        <div className="space-y-2">
          {mockPRs.filter(pr => pr.status === 'open').map((pr) => (
            <div
              key={pr.id}
              onClick={() => router.push(`/app/projects/${params.id}/prs/${pr.number}`)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#101318] hover:bg-[#1a1f29] cursor-pointer transition-colors border border-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400">#{pr.number}</span>
                <span className="text-slate-200">{pr.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${getRiskColor(pr.riskScore)}`}>
                  Risk: {pr.riskScore}
                </span>
                <span className="text-slate-500 text-sm">{pr.created}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPRs = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search pull requests..."
            className="w-full px-4 py-2.5 bg-[#151922] border border-white/[0.08] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <select className="px-4 py-2.5 bg-[#151922] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="merged">Merged</option>
          <option value="closed">Closed</option>
        </select>
        <select className="px-4 py-2.5 bg-[#151922] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50">
          <option value="recent">Most Recent</option>
          <option value="risk">Highest Risk</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* PR List */}
      <div className="space-y-3">
        {mockPRs.map((pr) => (
          <div
            key={pr.id}
            onClick={() => router.push(`/app/projects/${params.id}/prs/${pr.number}`)}
            className="bg-[#151922] rounded-xl p-4 border border-white/[0.06] hover:border-cyan-500/30 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(pr.status)}`}>
                  {pr.status}
                </span>
                <span className="text-slate-400 font-mono">#{pr.number}</span>
                <span className="text-white font-medium">{pr.title}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className={`text-sm font-medium ${getRiskColor(pr.riskScore)}`}>
                    Risk Score: {pr.riskScore}
                  </div>
                  <div className="text-xs text-slate-500">
                    {pr.reviewStatus === 'approved' ? '✓ Approved' : pr.reviewStatus === 'rejected' ? '✗ Changes requested' : '○ Pending review'}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-slate-400">{pr.author}</div>
                  <div className="text-slate-500">{pr.created}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderArchitecture = () => (
    <div className="space-y-6">
      {/* Current Architecture */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Current Architecture</h3>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Run Analysis
          </button>
        </div>
        
        {/* Architecture Diagram Placeholder */}
        <div className="bg-[#101318] rounded-lg p-8 border border-white/[0.04] mb-6">
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="text-6xl mb-4">🏗️</div>
            <div className="text-lg font-medium mb-2">Architecture Diagram</div>
            <div className="text-sm text-slate-500">Visual representation of your codebase structure</div>
            <button
              onClick={() => showComingSoon()}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              View Full Diagram
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#101318] rounded-lg p-4 border border-white/[0.04]">
            <div className="text-2xl font-bold text-green-400">12</div>
            <div className="text-sm text-slate-400">Modules</div>
          </div>
          <div className="bg-[#101318] rounded-lg p-4 border border-white/[0.04]">
            <div className="text-2xl font-bold text-blue-400">48</div>
            <div className="text-sm text-slate-400">Components</div>
          </div>
          <div className="bg-[#101318] rounded-lg p-4 border border-white/[0.04]">
            <div className="text-2xl font-bold text-yellow-400">156</div>
            <div className="text-sm text-slate-400">Dependencies</div>
          </div>
          <div className="bg-[#101318] rounded-lg p-4 border border-white/[0.04]">
            <div className="text-2xl font-bold text-purple-400">89%</div>
            <div className="text-sm text-slate-400">Modularity</div>
          </div>
        </div>
      </div>

      {/* Architecture Snapshots */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <h3 className="text-white font-medium text-lg mb-4">Architecture Snapshots</h3>
        <div className="space-y-3">
          {mockArchitectureSnapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[#101318] border border-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs ${snapshot.status === 'current' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {snapshot.status}
                </span>
                <span className="text-white font-medium">{snapshot.version}</span>
                <span className="text-slate-400">{snapshot.date}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-green-400">Score: {snapshot.score}</div>
                  <div className="text-xs text-slate-500">{snapshot.changes} changes</div>
                </div>
                <button
                  onClick={() => showComingSoon()}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
                >
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDependencies = () => (
    <div className="space-y-6">
      {/* Dependency Graph Placeholder */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Dependency Graph</h3>
          <div className="flex gap-2">
            <button
              onClick={() => showComingSoon()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => showComingSoon()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Analyze
            </button>
          </div>
        </div>
        
        <div className="bg-[#101318] rounded-lg p-8 border border-white/[0.04]">
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <div className="text-6xl mb-4">📦</div>
            <div className="text-lg font-medium mb-2">Interactive Dependency Graph</div>
            <div className="text-sm text-slate-500 text-center max-w-md">
              Visualize all package dependencies, their versions, and relationships.
              Identify circular dependencies and outdated packages.
            </div>
            <button
              onClick={() => showComingSoon()}
              className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm transition-colors"
            >
              Launch Interactive View
            </button>
          </div>
        </div>
      </div>

      {/* Dependency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-2">Total Dependencies</div>
          <div className="text-3xl font-bold text-white">156</div>
          <div className="text-xs text-slate-500 mt-1">47 direct, 109 transitive</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-2">Outdated</div>
          <div className="text-3xl font-bold text-yellow-400">12</div>
          <div className="text-xs text-slate-500 mt-1">3 major, 9 minor updates</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-2">Vulnerabilities</div>
          <div className="text-3xl font-bold text-red-400">2</div>
          <div className="text-xs text-slate-500 mt-1">0 critical, 2 moderate</div>
        </div>
      </div>

      {/* Dependency List */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <h3 className="text-white font-medium text-lg mb-4">Key Dependencies</h3>
        <div className="space-y-2">
          {['next@15.0.0', 'react@19.0.0', 'typescript@5.3.0', 'tailwindcss@3.4.0', '@supabase/supabase-js@2.39.0'].map((dep, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
              <span className="text-slate-200 font-mono text-sm">{dep}</span>
              <span className="text-green-400 text-sm">✓ Up to date</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTechDebt = () => (
    <div className="space-y-6">
      {/* Tech Debt Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Total Debt Items</div>
          <div className="text-3xl font-bold text-white">{mockTechDebt.length}</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">High Priority</div>
          <div className="text-3xl font-bold text-red-400">{mockTechDebt.filter(d => d.severity === 'high').length}</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Est. Total Effort</div>
          <div className="text-3xl font-bold text-yellow-400">32h</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Debt Score</div>
          <div className="text-3xl font-bold text-yellow-400">{mockProject.techDebtScore}</div>
        </div>
      </div>

      {/* Tech Debt Items */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Tech Debt Items</h3>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-3">
          {mockTechDebt.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[#101318] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(item.severity)}`}>
                  {item.severity}
                </span>
                <div>
                  <div className="text-white font-medium">{item.title}</div>
                  <div className="text-sm text-slate-500">{item.file}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded">{item.category}</span>
                <span className="text-sm text-slate-400">~{item.effort}</span>
                <button
                  onClick={() => showComingSoon()}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
                >
                  Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      {/* Active Agents */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Active Agents</h3>
          <button
            onClick={() => router.push('/app/agents')}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Browse Marketplace →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockProjectAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-[#101318] rounded-lg p-4 border border-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{agent.name}</span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <div className="text-sm text-slate-400 mb-3">
                Last run: {agent.lastRun}
              </div>
              <div className="text-sm text-slate-400 mb-4">
                Findings: {agent.findings}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => showComingSoon()}
                  className="flex-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm transition-colors"
                >
                  Run Now
                </button>
                <button
                  onClick={() => showComingSoon()}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
                >
                  Config
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent History */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <h3 className="text-white font-medium text-lg mb-4">Recent Agent Runs</h3>
        <div className="space-y-2">
          {mockHistory.filter(h => h.type === 'agent' || h.type === 'analysis' || h.type === 'security').map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-slate-200">{item.action}</span>
              </div>
              <span className="text-slate-500 text-sm">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-lg">Audit Log</h3>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 bg-[#101318] border border-white/[0.08] rounded text-slate-200 text-sm focus:outline-none">
            <option value="all">All Types</option>
            <option value="pr">Pull Requests</option>
            <option value="analysis">Analysis</option>
            <option value="agent">Agents</option>
          </select>
          <button
            onClick={() => showComingSoon()}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
          >
            Export
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {mockHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-lg bg-[#101318] border border-white/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                item.type === 'pr' ? 'bg-purple-500/20 text-purple-400' :
                item.type === 'analysis' ? 'bg-blue-500/20 text-blue-400' :
                item.type === 'security' ? 'bg-green-500/20 text-green-400' :
                item.type === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                item.type === 'agent' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {item.type === 'pr' ? '🔀' :
                 item.type === 'analysis' ? '📊' :
                 item.type === 'security' ? '🔒' :
                 item.type === 'review' ? '👀' :
                 item.type === 'agent' ? '🤖' :
                 '📁'}
              </div>
              <div>
                <div className="text-slate-200">{item.action}</div>
                <div className="text-sm text-slate-500">by {item.user}</div>
              </div>
            </div>
            <span className="text-slate-500 text-sm">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <h3 className="text-white font-medium text-lg mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Project Name</label>
            <input
              type="text"
              defaultValue={mockProject.name}
              className="w-full px-4 py-2.5 bg-[#101318] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Description</label>
            <textarea
              defaultValue={mockProject.description}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#101318] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Default Branch</label>
            <select className="w-full px-4 py-2.5 bg-[#101318] border border-white/[0.08] rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50">
              <option value="main">main</option>
              <option value="master">master</option>
              <option value="develop">develop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis Settings */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <h3 className="text-white font-medium text-lg mb-4">Analysis Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
            <div>
              <div className="text-slate-200">Auto-analyze PRs</div>
              <div className="text-sm text-slate-500">Automatically run analysis on new pull requests</div>
            </div>
            <button
              onClick={() => showComingSoon()}
              className="relative w-12 h-6 bg-cyan-600 rounded-full transition-colors"
            >
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
            <div>
              <div className="text-slate-200">Security Scanning</div>
              <div className="text-sm text-slate-500">Enable automated security vulnerability scanning</div>
            </div>
            <button
              onClick={() => showComingSoon()}
              className="relative w-12 h-6 bg-cyan-600 rounded-full transition-colors"
            >
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
            <div>
              <div className="text-slate-200">Architecture Snapshots</div>
              <div className="text-sm text-slate-500">Save architecture snapshots on each release</div>
            </div>
            <button
              onClick={() => showComingSoon()}
              className="relative w-12 h-6 bg-slate-600 rounded-full transition-colors"
            >
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#151922] rounded-xl p-6 border border-red-500/20">
        <h3 className="text-red-400 font-medium text-lg mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#101318] border border-red-500/10">
          <div>
            <div className="text-slate-200">Remove Project</div>
            <div className="text-sm text-slate-500">This will remove all analysis data for this project</div>
          </div>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => showComingSoon()}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'prs': return renderPRs();
      case 'architecture': return renderArchitecture();
      case 'dependencies': return renderDependencies();
      case 'tech-debt': return renderTechDebt();
      case 'agents': return renderAgents();
      case 'history': return renderHistory();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/app/projects')}
          className="text-slate-400 hover:text-slate-200 text-sm mb-3 flex items-center gap-1"
        >
          ← Back to Projects
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{mockProject.fullName}</h1>
            <p className="text-slate-400">{mockProject.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showComingSoon()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View on GitHub
            </button>
            <button
              onClick={() => showComingSoon()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Run Full Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 border-b border-white/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
