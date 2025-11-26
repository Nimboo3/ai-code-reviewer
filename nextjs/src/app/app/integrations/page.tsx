'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useToast } from '@/components/ui/toast';
import { useSearchParams } from 'next/navigation';

interface GitHubConnection {
  connected: boolean;
  username: string | null;
  avatar: string | null;
  connectedAt: string | null;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'connected' | 'available' | 'coming-soon';
  connectedAccount: string | null;
  connectedRepos: number | null;
  lastSync: string | null;
  features: string[];
}

// Static integrations data (non-GitHub)
const staticIntegrations: Integration[] = [
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Integrate with GitLab for merge request analysis and CI/CD pipeline integration.',
    icon: '🦊',
    category: 'Source Control',
    status: 'coming-soon',
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
    status: 'coming-soon',
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
    status: 'coming-soon',
    connectedAccount: null,
    connectedRepos: null,
    lastSync: null,
    features: ['Review notifications', 'Security alerts', 'Daily digests', 'Commands'],
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send notifications and updates to your Discord server channels.',
    icon: '🎮',
    category: 'Communication',
    status: 'coming-soon',
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
    status: 'coming-soon',
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
    status: 'coming-soon',
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

// Separate component for handling search params
function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'github_connected') {
      console.log('GitHub connected successfully!');
    }

    if (error) {
      console.error('OAuth error:', error);
    }
  }, [searchParams]);

  return null;
}

function IntegrationsContent() {
  const { showComingSoon } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [githubConnection, setGithubConnection] = useState<GitHubConnection>({
    connected: false,
    username: null,
    avatar: null,
    connectedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchGitHubStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/github/connect');
      if (res.ok) {
        const data = await res.json();
        setGithubConnection(data);
      }
    } catch (err) {
      console.error('Failed to fetch GitHub status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubStatus();
  }, [fetchGitHubStatus]);

  const handleGitHubConnect = async () => {
    setActionLoading('github');
    try {
      const res = await fetch('/api/github/connect', { method: 'POST' });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to initiate OAuth');
      }
    } catch (err) {
      console.error('GitHub connect error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleGitHubDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect GitHub? This will remove access to all connected repositories.')) {
      return;
    }

    setActionLoading('github');
    try {
      const res = await fetch('/api/github/connect', { method: 'DELETE' });
      if (res.ok) {
        setGithubConnection({
          connected: false,
          username: null,
          avatar: null,
          connectedAt: null,
        });
      }
    } catch (err) {
      console.error('GitHub disconnect error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Build GitHub integration object dynamically
  const githubIntegration: Integration = {
    id: 'github',
    name: 'GitHub',
    description: 'Connect your GitHub repositories to enable PR analysis, code reviews, and webhook integrations.',
    icon: '🐙',
    category: 'Source Control',
    status: githubConnection.connected ? 'connected' : 'available',
    connectedAccount: githubConnection.username,
    connectedRepos: null,
    lastSync: githubConnection.connectedAt ? new Date(githubConnection.connectedAt).toLocaleString() : null,
    features: ['PR webhooks', 'Code analysis', 'Status checks', 'Auto-review'],
  };

  // Combine GitHub with static integrations
  const allIntegrations = [githubIntegration, ...staticIntegrations];

  const filteredIntegrations = allIntegrations.filter(
    int => selectedCategory === 'All' || int.category === selectedCategory
  );

  const connectedCount = allIntegrations.filter(i => i.status === 'connected').length;

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected
          </span>
        );
      case 'available':
        return <span className="px-2 py-1 rounded text-xs bg-slate-800/60 text-slate-400 border border-slate-700/50">Not Connected</span>;
      case 'coming-soon':
        return <span className="px-2 py-1 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Integrations</h1>
        <p className="text-slate-400">Connect your tools and services to enhance your workflow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#151820] rounded-xl p-4 border border-slate-800/60">
          <div className="text-sm text-slate-400 mb-1">Connected</div>
          <div className="text-2xl font-bold text-emerald-400">{connectedCount}</div>
        </div>
        <div className="bg-[#151820] rounded-xl p-4 border border-slate-800/60">
          <div className="text-sm text-slate-400 mb-1">Available</div>
          <div className="text-2xl font-bold text-slate-100">{allIntegrations.filter(i => i.status === 'available').length}</div>
        </div>
        <div className="bg-[#151820] rounded-xl p-4 border border-slate-800/60">
          <div className="text-sm text-slate-400 mb-1">Coming Soon</div>
          <div className="text-2xl font-bold text-amber-400">{allIntegrations.filter(i => i.status === 'coming-soon').length}</div>
        </div>
        <div className="bg-[#151820] rounded-xl p-4 border border-slate-800/60">
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
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-[#2e333d] text-slate-400 hover:text-slate-200 hover:bg-[#363c48] border border-slate-700/40'
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
            className={`bg-[#2e333d] rounded-xl p-5 border transition-all ${
              integration.status === 'connected'
                ? 'border-emerald-500/30'
                : 'border-slate-800/60 hover:border-slate-700/60'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-slate-100 font-medium">{integration.name}</h3>
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
              <div className="mb-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
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
                  className="px-2 py-1 rounded-full text-xs bg-slate-800/60 text-slate-400 border border-slate-700/40"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {integration.id === 'github' ? (
                // GitHub-specific actions
                integration.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => window.location.href = '/app/projects'}
                      className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors border border-cyan-500/30"
                    >
                      View Repos
                    </button>
                    <button
                      onClick={handleGitHubDisconnect}
                      disabled={actionLoading === 'github'}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border border-red-500/20"
                    >
                      {actionLoading === 'github' ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGitHubConnect}
                    disabled={actionLoading === 'github'}
                    className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border border-cyan-500/30"
                  >
                    {actionLoading === 'github' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Connecting...
                      </span>
                    ) : (
                      'Connect GitHub'
                    )}
                  </button>
                )
              ) : integration.status === 'connected' ? (
                <>
                  <button
                    onClick={() => showComingSoon()}
                    className="flex-1 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700/50"
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => showComingSoon()}
                    className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700/50"
                  >
                    Sync
                  </button>
                  <button
                    onClick={() => showComingSoon()}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                  >
                    Disconnect
                  </button>
                </>
              ) : integration.status === 'available' ? (
                <button
                  onClick={() => showComingSoon()}
                  className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors border border-cyan-500/30"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={() => showComingSoon()}
                  className="flex-1 px-4 py-2 bg-slate-800/60 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed border border-slate-700/50"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API Section */}
      <div className="mt-8 bg-[#2e333d] rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-100 font-medium text-lg mb-1">API Access</h3>
            <p className="text-slate-400 text-sm">Use our REST API to build custom integrations</p>
          </div>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700/50"
          >
            View Documentation
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">API Key</span>
              <button
                onClick={() => showComingSoon()}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Regenerate
              </button>
            </div>
            <code className="block font-mono text-sm text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700/30">
              sk_live_••••••••••••••••••••••••
            </code>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Webhook Secret</span>
              <button
                onClick={() => showComingSoon()}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Regenerate
              </button>
            </div>
            <code className="block font-mono text-sm text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700/30">
              whsec_••••••••••••••••••••••••
            </code>
          </div>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="mt-6 bg-[#2e333d] rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-100 font-medium text-lg mb-1">Webhooks</h3>
            <p className="text-slate-400 text-sm">Configure webhook endpoints for real-time events</p>
          </div>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors border border-cyan-500/30"
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

// Default export with Suspense boundary for useSearchParams
export default function IntegrationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <SearchParamsHandler />
      <IntegrationsContent />
    </Suspense>
  );
}
