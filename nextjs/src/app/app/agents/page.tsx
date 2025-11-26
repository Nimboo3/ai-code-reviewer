'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';

// Mock agents data
const mockAgents = [
  {
    id: 1,
    name: 'Architecture Auditor',
    description: 'Continuously monitors your codebase architecture and identifies anti-patterns, circular dependencies, and architectural drift.',
    icon: '🏗️',
    category: 'Architecture',
    status: 'available',
    installs: 1250,
    rating: 4.8,
    features: ['Anti-pattern detection', 'Dependency analysis', 'Architecture scoring', 'Drift alerts'],
    pricing: 'included',
  },
  {
    id: 2,
    name: 'Security Scout',
    description: 'Scans your code for security vulnerabilities, secret leaks, and compliance issues. Integrates with OWASP standards.',
    icon: '🔒',
    category: 'Security',
    status: 'available',
    installs: 2340,
    rating: 4.9,
    features: ['Vulnerability scanning', 'Secret detection', 'OWASP compliance', 'CVE tracking'],
    pricing: 'included',
  },
  {
    id: 3,
    name: 'Test Generator',
    description: 'Automatically generates unit tests, integration tests, and edge cases based on your code changes and coverage gaps.',
    icon: '🧪',
    category: 'Testing',
    status: 'available',
    installs: 890,
    rating: 4.6,
    features: ['Unit test generation', 'Edge case detection', 'Coverage analysis', 'Snapshot tests'],
    pricing: 'pro',
  },
  {
    id: 4,
    name: 'Migration Agent',
    description: 'Helps migrate your codebase between frameworks, languages, or major version upgrades with minimal manual intervention.',
    icon: '🚀',
    category: 'Migration',
    status: 'coming-soon',
    installs: 0,
    rating: 0,
    features: ['Framework migration', 'Version upgrades', 'Breaking change detection', 'Auto-fix suggestions'],
    pricing: 'enterprise',
  },
  {
    id: 5,
    name: 'Documentation Bot',
    description: 'Generates and maintains API documentation, README files, and inline code comments based on your codebase.',
    icon: '📝',
    category: 'Documentation',
    status: 'available',
    installs: 567,
    rating: 4.5,
    features: ['API docs generation', 'README updates', 'JSDoc/TSDoc', 'Changelog automation'],
    pricing: 'included',
  },
  {
    id: 6,
    name: 'Performance Profiler',
    description: 'Analyzes code for performance bottlenecks, memory leaks, and optimization opportunities.',
    icon: '⚡',
    category: 'Performance',
    status: 'available',
    installs: 432,
    rating: 4.7,
    features: ['Bottleneck detection', 'Memory analysis', 'Bundle size tracking', 'Optimization tips'],
    pricing: 'pro',
  },
  {
    id: 7,
    name: 'Dependency Guardian',
    description: 'Monitors your dependencies for updates, security patches, and license compliance.',
    icon: '📦',
    category: 'Dependencies',
    status: 'available',
    installs: 1123,
    rating: 4.8,
    features: ['Update notifications', 'Security patches', 'License compliance', 'Breaking change alerts'],
    pricing: 'included',
  },
  {
    id: 8,
    name: 'Code Style Enforcer',
    description: 'Ensures consistent code style across your team with customizable rules and auto-formatting.',
    icon: '✨',
    category: 'Code Quality',
    status: 'available',
    installs: 789,
    rating: 4.4,
    features: ['Style enforcement', 'Auto-formatting', 'Custom rules', 'Team presets'],
    pricing: 'included',
  },
];

const categories = ['All', 'Architecture', 'Security', 'Testing', 'Migration', 'Documentation', 'Performance', 'Dependencies', 'Code Quality'];

export default function AgentsPage() {
  const { showComingSoon } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = mockAgents.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Available</span>;
      case 'coming-soon':
        return <span className="px-2 py-1 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">Coming Soon</span>;
      case 'installed':
        return <span className="px-2 py-1 rounded text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Installed</span>;
      default:
        return null;
    }
  };

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'included':
        return <span className="text-xs text-emerald-400">Included</span>;
      case 'pro':
        return <span className="text-xs text-violet-400">Pro</span>;
      case 'enterprise':
        return <span className="text-xs text-amber-400">Enterprise</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Agents Marketplace</h1>
        <p className="text-slate-400">Extend your code review capabilities with AI-powered agents</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#2e333d] border border-slate-700/40 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-[#2e333d] text-slate-400 hover:text-slate-200 hover:bg-[#363c48] border border-slate-700/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#2e333d] rounded-xl p-4 border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Total Agents</div>
          <div className="text-2xl font-bold text-slate-100">{mockAgents.length}</div>
        </div>
        <div className="bg-[#2e333d] rounded-xl p-4 border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Available</div>
          <div className="text-2xl font-bold text-emerald-400">{mockAgents.filter(a => a.status === 'available').length}</div>
        </div>
        <div className="bg-[#2e333d] rounded-xl p-4 border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Coming Soon</div>
          <div className="text-2xl font-bold text-amber-400">{mockAgents.filter(a => a.status === 'coming-soon').length}</div>
        </div>
        <div className="bg-[#2e333d] rounded-xl p-4 border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Total Installs</div>
          <div className="text-2xl font-bold text-cyan-400">{mockAgents.reduce((acc, a) => acc + a.installs, 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-[#2e333d] rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-2xl">
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-slate-100 font-medium">{agent.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{agent.category}</span>
                    <span className="text-slate-600">•</span>
                    {getPricingBadge(agent.pricing)}
                  </div>
                </div>
              </div>
              {getStatusBadge(agent.status)}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {agent.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {agent.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs bg-slate-800/60 text-slate-400 border border-slate-700/40"
                >
                  {feature}
                </span>
              ))}
              {agent.features.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs bg-slate-800/60 text-slate-500 border border-slate-700/40">
                  +{agent.features.length - 3} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                {agent.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    {agent.rating}
                  </span>
                )}
                {agent.installs > 0 && (
                  <span>{agent.installs.toLocaleString()} installs</span>
                )}
              </div>
              {agent.status === 'available' ? (
                <button
                  onClick={() => showComingSoon()}
                  className="px-4 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors border border-cyan-500/30"
                >
                  Install
                </button>
              ) : agent.status === 'coming-soon' ? (
                <button
                  onClick={() => showComingSoon()}
                  className="px-4 py-1.5 bg-slate-800/60 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed border border-slate-700/50"
                >
                  Notify Me
                </button>
              ) : (
                <button
                  onClick={() => showComingSoon()}
                  className="px-4 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700/50"
                >
                  Configure
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-slate-100 mb-2">No agents found</h3>
          <p className="text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors border border-cyan-500/30"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Request Agent CTA */}
      <div className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-6 border border-slate-700/40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-slate-100 font-medium text-lg mb-1">Can&apos;t find what you need?</h3>
            <p className="text-slate-400 text-sm">Request a custom agent or suggest a new feature for the marketplace.</p>
          </div>
          <button
            onClick={() => showComingSoon()}
            className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-600/50"
          >
            Request Agent
          </button>
        </div>
      </div>
    </div>
  );
}
