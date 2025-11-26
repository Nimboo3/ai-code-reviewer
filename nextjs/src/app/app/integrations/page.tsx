'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';

// Mock integrations data
const mockIntegrations = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect your GitHub repositories to enable PR analysis, code reviews, and webhook integrations.',
    icon: '🐙',
    category: 'Source Control',
    status: 'connected',
    connectedAccount: 'Nimboo3',
    connectedRepos: 5,
    lastSync: '5 minutes ago',
    features: ['PR webhooks', 'Code analysis', 'Status checks', 'Comments'],
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Integrate with GitLab for merge request analysis and CI/CD pipeline integration.',
    icon: '🦊',
    category: 'Source Control',
    status: 'available',
    connectedAccount: null,
    connectedRepos: 0,
    lastSync: null,
    features: ['MR webhooks', 'Code analysis', 'Pipeline integration', 'Comments'],
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    description: 'Connect Bitbucket Cloud or Server for pull request reviews and pipeline integration.',
    icon: '🪣',
    category: 'Source Control',
    status: 'available',
    connectedAccount: null,
    connectedRepos: 0,
    lastSync: null,
    features: ['PR webhooks', 'Code analysis', 'Pipelines', 'Comments'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified about PR reviews, security alerts, and architecture changes directly in Slack.',
    icon: '💬',
    category: 'Communication',
    status: 'connected',
    connectedAccount: 'CodeReview Workspace',
    connectedRepos: null,
    lastSync: '1 hour ago',
    features: ['Review notifications', 'Security alerts', 'Daily digests', 'Commands'],
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send notifications and updates to your Discord server channels.',
    icon: '🎮',
    category: 'Communication',
    status: 'available',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Notifications', 'Webhooks', 'Bot commands', 'Embeds'],
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Link PRs to Jira issues, auto-update ticket status, and track code changes.',
    icon: '📋',
    category: 'Project Management',
    status: 'available',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Issue linking', 'Status updates', 'Smart commits', 'Reports'],
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Connect Linear for automatic issue linking and status synchronization.',
    icon: '📐',
    category: 'Project Management',
    status: 'coming-soon',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Issue linking', 'Auto-close', 'Branch tracking', 'Mentions'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync architecture documentation and review summaries to Notion pages.',
    icon: '📓',
    category: 'Documentation',
    status: 'coming-soon',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Doc sync', 'Review logs', 'Wikis', 'Databases'],
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Install our VS Code extension for inline review comments and quick fixes.',
    icon: '💻',
    category: 'IDE',
    status: 'available',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Inline comments', 'Quick fixes', 'Diagnostics', 'Commands'],
  },
  {
    id: 'jetbrains',
    name: 'JetBrains IDEs',
    description: 'Plugin for IntelliJ, WebStorm, and other JetBrains IDEs.',
    icon: '🧠',
    category: 'IDE',
    status: 'coming-soon',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Inspections', 'Quick fixes', 'Tool windows', 'Intentions'],
  },
];

const categories = ['All', 'Source Control', 'Communication', 'Project Management', 'Documentation', 'IDE'];

export default function IntegrationsPage() {
  const { showComingSoon } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIntegrations = mockIntegrations.filter(
    int => selectedCategory === 'All' || int.category === selectedCategory
  );

  const connectedCount = mockIntegrations.filter(i => i.status === 'connected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Connected
          </span>
        );
      case 'available':
        return <span className="px-2 py-1 rounded text-xs bg-slate-500/20 text-slate-400">Not Connected</span>;
      case 'coming-soon':
        return <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Integrations</h1>
        <p className="text-slate-400">Connect your tools and services to enhance your workflow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Connected</div>
          <div className="text-2xl font-bold text-green-400">{connectedCount}</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Available</div>
          <div className="text-2xl font-bold text-white">{mockIntegrations.filter(i => i.status === 'available').length}</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Coming Soon</div>
          <div className="text-2xl font-bold text-yellow-400">{mockIntegrations.filter(i => i.status === 'coming-soon').length}</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-4 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Sync Status</div>
          <div className="text-2xl font-bold text-cyan-400">Healthy</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-cyan-600 text-white'
                : 'bg-[#151922] text-slate-400 hover:text-white hover:bg-[#1a1f29]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className={`bg-[#151922] rounded-xl p-5 border transition-all ${
              integration.status === 'connected'
                ? 'border-green-500/30'
                : 'border-white/[0.06] hover:border-cyan-500/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#101318] border border-white/[0.06] flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">{integration.name}</h3>
                  <span className="text-xs text-slate-500">{integration.category}</span>
                </div>
              </div>
              {getStatusBadge(integration.status)}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-4">
              {integration.description}
            </p>

            {/* Connected Info */}
            {integration.status === 'connected' && (
              <div className="mb-4 p-3 rounded-lg bg-[#101318] border border-white/[0.04]">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-400">Account:</span>{' '}
                    <span className="text-slate-200">{integration.connectedAccount}</span>
                  </div>
                  {integration.connectedRepos !== null && (
                    <div>
                      <span className="text-slate-400">Repos:</span>{' '}
                      <span className="text-slate-200">{integration.connectedRepos}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Last synced {integration.lastSync}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {integration.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs bg-[#101318] text-slate-400 border border-white/[0.04]"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {integration.status === 'connected' ? (
                <>
                  <button
                    onClick={() => showComingSoon()}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => showComingSoon()}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Sync
                  </button>
                  <button
                    onClick={() => showComingSoon()}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : integration.status === 'available' ? (
                <button
                  onClick={() => showComingSoon()}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={() => showComingSoon()}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API Section */}
      <div className="mt-8 bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-lg mb-1">API Access</h3>
            <p className="text-slate-400 text-sm">Use our REST API to build custom integrations</p>
          </div>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            View Documentation
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#101318] border border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">API Key</span>
              <button
                onClick={() => showComingSoon()}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Regenerate
              </button>
            </div>
            <code className="block font-mono text-sm text-slate-300 bg-[#0d1015] p-2 rounded">
              sk_live_••••••••••••••••••••••••
            </code>
          </div>
          <div className="p-4 rounded-lg bg-[#101318] border border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Webhook Secret</span>
              <button
                onClick={() => showComingSoon()}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Regenerate
              </button>
            </div>
            <code className="block font-mono text-sm text-slate-300 bg-[#0d1015] p-2 rounded">
              whsec_••••••••••••••••••••••••
            </code>
          </div>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="mt-6 bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-lg mb-1">Webhooks</h3>
            <p className="text-slate-400 text-sm">Configure webhook endpoints for real-time events</p>
          </div>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Webhook
          </button>
        </div>
        <div className="text-center py-8 text-slate-400">
          <div className="text-3xl mb-2">🔗</div>
          <p className="text-sm">No webhooks configured yet</p>
          <p className="text-xs text-slate-500 mt-1">Add a webhook to receive real-time events</p>
        </div>
      </div>
    </div>
  );
}
