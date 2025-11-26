"use client";

import React, { useState } from 'react';
import { 
    GitBranch, 
    Search,
    Plus,
    Clock,
    AlertTriangle,
    CheckCircle2,
    MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

// Mock data for UI demonstration
// TODO: Replace with actual data from Supabase projects table
const mockProjects = [
    { 
        id: 'proj_1',
        name: 'frontend-app',
        owner: 'acme-corp',
        lastSnapshot: '2 hours ago',
        architectureScore: 78,
        scoreTrend: 'up',
        scoreChange: '+3',
        openPRs: 5,
        highRiskPRs: 2,
        status: 'active',
        language: 'TypeScript',
    },
    { 
        id: 'proj_2',
        name: 'api-service',
        owner: 'acme-corp',
        lastSnapshot: '5 hours ago',
        architectureScore: 82,
        scoreTrend: 'down',
        scoreChange: '-2',
        openPRs: 3,
        highRiskPRs: 1,
        status: 'active',
        language: 'Python',
    },
    { 
        id: 'proj_3',
        name: 'media-processor',
        owner: 'acme-corp',
        lastSnapshot: '1 day ago',
        architectureScore: 65,
        scoreTrend: 'up',
        scoreChange: '+5',
        openPRs: 8,
        highRiskPRs: 3,
        status: 'needs-attention',
        language: 'Go',
    },
    { 
        id: 'proj_4',
        name: 'mobile-app',
        owner: 'acme-corp',
        lastSnapshot: '3 days ago',
        architectureScore: 71,
        scoreTrend: 'stable',
        scoreChange: '0',
        openPRs: 2,
        highRiskPRs: 0,
        status: 'active',
        language: 'React Native',
    },
    { 
        id: 'proj_5',
        name: 'data-pipeline',
        owner: 'acme-corp',
        lastSnapshot: 'Never',
        architectureScore: null,
        scoreTrend: null,
        scoreChange: null,
        openPRs: 0,
        highRiskPRs: 0,
        status: 'pending-setup',
        language: 'Python',
    },
];

export default function ProjectsPage() {
    const { showComingSoon } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-slate-500';
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="flex items-center gap-1 text-[10px] text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Active</span>;
            case 'needs-attention':
                return <span className="flex items-center gap-1 text-[10px] text-amber-400"><AlertTriangle className="h-3 w-3" /> Needs Attention</span>;
            case 'pending-setup':
                return <span className="flex items-center gap-1 text-[10px] text-slate-400"><Clock className="h-3 w-3" /> Pending Setup</span>;
            default:
                return null;
        }
    };

    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.owner.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your connected repositories and view their health</p>
                </div>
                <button 
                    onClick={() => showComingSoon('Connect Repository')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 font-medium rounded-lg text-sm hover:bg-white transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Connect Repository
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#2e333d] border border-slate-700/40 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#2e333d] border border-slate-700/40 rounded-lg p-1">
                        {['all', 'active', 'needs-attention', 'pending-setup'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    filterStatus === status 
                                        ? 'bg-slate-700/70 text-slate-100' 
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                    <Link
                        key={project.id}
                        href={`/app/projects/${project.id}`}
                        className="group bg-[#2e333d] border border-slate-700/50 rounded-xl p-5 hover:bg-[#363c48] hover:border-slate-700/60 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-700/40">
                                    <GitBranch className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-100 group-hover:text-slate-50 transition-colors">{project.name}</h3>
                                    <p className="text-xs text-slate-500">{project.owner}</p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    showComingSoon('Project Actions');
                                }}
                                className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded transition-all"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4">
                            {getStatusBadge(project.status)}
                        </div>

                        {/* Score & Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg border border-slate-700/20">
                                <div className={`text-xl font-bold ${getScoreColor(project.architectureScore)}`}>
                                    {project.architectureScore ?? '—'}
                                </div>
                                <p className="text-[10px] text-slate-500">Score</p>
                                {project.scoreTrend && (
                                    <span className={`text-[10px] ${project.scoreTrend === 'up' ? 'text-emerald-400' : project.scoreTrend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
                                        {project.scoreChange}
                                    </span>
                                )}
                            </div>
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg border border-slate-700/20">
                                <div className="text-xl font-bold text-slate-100">{project.openPRs}</div>
                                <p className="text-[10px] text-slate-500">Open PRs</p>
                            </div>
                            <div className="text-center p-2 bg-slate-700/30 rounded-lg border border-slate-700/20">
                                <div className={`text-xl font-bold ${project.highRiskPRs > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                    {project.highRiskPRs}
                                </div>
                                <p className="text-[10px] text-slate-500">High Risk</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>Snapshot: {project.lastSnapshot}</span>
                            </div>
                            <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-700/40 rounded border border-slate-700/20">
                                {project.language}
                            </span>
                        </div>
                    </Link>
                ))}

                {/* Add New Project Card */}
                <button 
                    onClick={() => showComingSoon('Connect Repository')}
                    className="bg-[#2e333d] border border-dashed border-slate-700/40 rounded-xl p-5 hover:bg-[#363c48] hover:border-slate-600/50 transition-all flex flex-col items-center justify-center min-h-[240px] group"
                >
                    <div className="w-12 h-12 bg-slate-700/40 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-600/40 transition-colors border border-slate-700/40">
                        <Plus className="h-6 w-6 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Connect New Repository</p>
                    <p className="text-xs text-slate-600 mt-1">Via GitHub App</p>
                </button>
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-12 text-center">
                    <GitBranch className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">No projects found</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        {searchQuery ? 'Try adjusting your search query' : 'Connect your first repository to get started'}
                    </p>
                    <button 
                        onClick={() => showComingSoon('Connect Repository')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 font-medium rounded-lg text-sm hover:bg-white transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Connect Repository
                    </button>
                </div>
            )}
        </div>
    );
}
