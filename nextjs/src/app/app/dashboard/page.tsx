"use client";

import React from 'react';
import { 
    GitPullRequest, 
    AlertTriangle, 
    TrendingUp, 
    Activity,
    ArrowRight,
    Clock,
    Zap,
    RefreshCw,
    Plus,
    ExternalLink,
    ChevronRight,
    BarChart3,
    GitBranch,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

// Mock data for UI demonstration
// TODO: Replace with actual data from Supabase once backend is implemented
const mockActivePRs = [
    { 
        id: 1, 
        title: 'feat: Add user authentication flow', 
        repo: 'frontend-app', 
        author: 'sarah.dev',
        impactScore: 'high',
        riskScore: 85,
        timeAgo: '2h ago',
        status: 'needs-review'
    },
    { 
        id: 2, 
        title: 'fix: Database connection pooling issue', 
        repo: 'api-service', 
        author: 'mike.eng',
        impactScore: 'critical',
        riskScore: 92,
        timeAgo: '4h ago',
        status: 'reviewing'
    },
    { 
        id: 3, 
        title: 'refactor: Optimize image processing pipeline', 
        repo: 'media-processor', 
        author: 'alex.ops',
        impactScore: 'medium',
        riskScore: 45,
        timeAgo: '1d ago',
        status: 'needs-review'
    },
];

const mockSnapshots = [
    { id: 1, repo: 'frontend-app', score: 78, trend: 'up', change: '+3', date: 'Today' },
    { id: 2, repo: 'api-service', score: 82, trend: 'down', change: '-2', date: 'Yesterday' },
    { id: 3, repo: 'media-processor', score: 65, trend: 'up', change: '+5', date: '2 days ago' },
];

const mockNotifications = [
    { id: 1, type: 'warning', message: 'High-risk PR detected in api-service', time: '10m ago' },
    { id: 2, type: 'info', message: 'Architecture snapshot completed for frontend-app', time: '1h ago' },
    { id: 3, type: 'success', message: 'Security scan passed for media-processor', time: '3h ago' },
];

export default function DashboardPage() {
    const { showComingSoon } = useToast();

    const getImpactBadgeStyle = (impact: string) => {
        switch (impact) {
            case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'high': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'medium': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-600/20';
        }
    };

    const getRiskColor = (score: number) => {
        if (score >= 80) return 'text-red-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-emerald-400';
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor your PRs and architecture health across all projects</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => showComingSoon('Manual Analysis')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-700/40 rounded-lg text-sm text-slate-300 hover:bg-slate-600/60 hover:text-slate-100 transition-all"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Run Analysis
                    </button>
                    <button 
                        onClick={() => showComingSoon('Connect Repository')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-900 font-medium rounded-lg text-sm hover:bg-white transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Connect Repo
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                            <GitPullRequest className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100">12</p>
                            <p className="text-xs text-slate-500">Active PRs</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100">3</p>
                            <p className="text-xs text-slate-500">High Risk</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <BarChart3 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100">76</p>
                            <p className="text-xs text-slate-500">Avg Score</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
                            <Activity className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100">847</p>
                            <p className="text-xs text-slate-500">Reviews Today</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                {/* Active PRs - Takes 2 columns */}
                <div className="lg:col-span-2 bg-[#2e333d] border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <GitPullRequest className="h-5 w-5 text-slate-400" />
                            <h2 className="font-semibold text-slate-100">Active PRs Requiring Attention</h2>
                        </div>
                        <Link 
                            href="/app/projects"
                            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                        >
                            View All <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-700/30">
                        {mockActivePRs.map((pr) => (
                            <div 
                                key={pr.id} 
                                className="p-4 hover:bg-slate-700/30 transition-colors cursor-pointer"
                                onClick={() => showComingSoon('PR Review View')}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-slate-500">{pr.repo}</span>
                                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${getImpactBadgeStyle(pr.impactScore)}`}>
                                                {pr.impactScore.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-200 truncate">{pr.title}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {pr.timeAgo}
                                            </span>
                                            <span>by {pr.author}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={`text-lg font-bold ${getRiskColor(pr.riskScore)}`}>
                                            {pr.riskScore}
                                        </div>
                                        <p className="text-[10px] text-slate-500">Risk Score</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-slate-400" />
                            <h2 className="font-semibold text-slate-100">Activity</h2>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-700/30">
                        {mockNotifications.map((notif) => (
                            <div key={notif.id} className="p-3 hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-start gap-3">
                                    {notif.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />}
                                    {notif.type === 'info' && <Activity className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />}
                                    {notif.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-300">{notif.message}</p>
                                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-slate-700/30">
                        <button 
                            onClick={() => showComingSoon('Notifications')}
                            className="text-xs text-slate-400 hover:text-slate-200 transition-colors w-full text-center"
                        >
                            View All Activity
                        </button>
                    </div>
                </div>
            </div>

            {/* Architecture Snapshots & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Architecture Snapshots */}
                <div className="lg:col-span-2 bg-[#2e333d] border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-slate-400" />
                            <h2 className="font-semibold text-slate-100">Recent Architecture Snapshots</h2>
                        </div>
                        <button 
                            onClick={() => showComingSoon('Snapshot History')}
                            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                        >
                            View History <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="divide-y divide-slate-700/30">
                        {mockSnapshots.map((snapshot) => (
                            <div 
                                key={snapshot.id} 
                                className="p-4 hover:bg-slate-700/30 transition-colors cursor-pointer"
                                onClick={() => showComingSoon('Architecture View')}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-700/40">
                                            <GitBranch className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{snapshot.repo}</p>
                                            <p className="text-xs text-slate-500">{snapshot.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg font-bold text-slate-100">{snapshot.score}</span>
                                                <span className={`text-xs font-medium ${snapshot.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {snapshot.change}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500">Architecture Score</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-4">
                    <h2 className="font-semibold text-slate-100 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <button 
                            onClick={() => showComingSoon('Connect Repository')}
                            className="w-full flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg transition-all group"
                        >
                            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                <Plus className="h-4 w-4 text-cyan-400" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-medium text-slate-200">Connect Repository</p>
                                <p className="text-xs text-slate-500">Add a new GitHub repo</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </button>
                        <button 
                            onClick={() => showComingSoon('Run Analysis')}
                            className="w-full flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg transition-all group"
                        >
                            <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
                                <RefreshCw className="h-4 w-4 text-violet-400" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-medium text-slate-200">Run Manual Analysis</p>
                                <p className="text-xs text-slate-500">Trigger architecture scan</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </button>
                        <button 
                            onClick={() => showComingSoon('Install Agent')}
                            className="w-full flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg transition-all group"
                        >
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <Zap className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-medium text-slate-200">Install Agent</p>
                                <p className="text-xs text-slate-500">Setup review automation</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </button>
                        <Link 
                            href="/app/integrations"
                            className="w-full flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg transition-all group"
                        >
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <ExternalLink className="h-4 w-4 text-amber-400" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-medium text-slate-200">Manage Integrations</p>
                                <p className="text-xs text-slate-500">GitHub, Slack, Jira</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tech Debt Trend (Placeholder Chart) */}
            <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-slate-400" />
                        <h2 className="font-semibold text-slate-100">Tech Debt Trend</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {['7d', '30d', '90d'].map((period) => (
                            <button 
                                key={period}
                                onClick={() => showComingSoon('Tech Debt Analytics')}
                                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-all"
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Placeholder chart area */}
                <div 
                    className="h-48 bg-slate-700/30 rounded-lg border border-dashed border-slate-700/40 flex items-center justify-center cursor-pointer hover:bg-slate-700/40 transition-colors"
                    onClick={() => showComingSoon('Tech Debt Analytics')}
                >
                    <div className="text-center">
                        <BarChart3 className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Tech debt trend chart will appear here</p>
                        <p className="text-xs text-slate-600 mt-1">Click to explore analytics</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
