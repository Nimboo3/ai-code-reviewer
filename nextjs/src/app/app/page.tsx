"use client";
import React from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { CalendarDays, Settings, Code, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardContent() {
    const { loading, user } = useGlobal();

    const getDaysSinceRegistration = () => {
        if (!user?.registered_at) return 0;
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - user.registered_at.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-500 border-t-transparent"></div>
            </div>
        );
    }

    const daysSinceRegistration = getDaysSinceRegistration();
    const username = user?.email?.split('@')[0] || 'there';

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-transparent border border-slate-700/40 p-8 md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(100,116,139,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                
                <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
                            <Sparkles className="h-7 w-7 text-slate-200" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-1">
                                Welcome back, {username}! 👋
                            </h1>
                            <div className="flex items-center gap-2 text-slate-400">
                                <CalendarDays className="h-4 w-4" />
                                <span className="text-sm">Member for {daysSinceRegistration} days</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-400 mt-4 max-w-2xl">
                        Ready to improve your code? Let&apos;s catch bugs, enhance security, and ship with confidence.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-100">Quick Actions</h2>
                    <p className="text-slate-500 mt-1 text-sm">Jump into your most-used features</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Code Review Card */}
                    <Link
                        href="/app/code-review"
                        className="group relative overflow-hidden rounded-xl bg-[#2e333d] border border-slate-700/50 p-6 hover:bg-[#363c48] hover:border-slate-700/60 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(6,182,212,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <Code className="h-6 w-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                                Code Review
                                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Upload your code and get instant AI-powered analysis with security checks, bug detection, and quality metrics
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                                    <span>Instant analysis</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Security scan</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* User Settings Card */}
                    <Link
                        href="/app/user-settings"
                        className="group relative overflow-hidden rounded-xl bg-[#2e333d] border border-slate-700/50 p-6 hover:bg-[#363c48] hover:border-slate-700/60 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(100,116,139,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-600/20 to-slate-700/20 border border-slate-600/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <Settings className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                                User Settings
                                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Manage your account, update passwords, enable two-factor authentication, and customize your preferences
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>2FA available</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Settings className="h-3.5 w-3.5 text-cyan-400" />
                                    <span>Full control</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-cyan-400" />
                        </div>
                        <h3 className="font-semibold text-slate-100">Free Tier Active</h3>
                    </div>
                    <p className="text-sm text-slate-500">10 reviews/day • 500KB files</p>
                </div>

                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-slate-100">Security First</h3>
                    </div>
                    <p className="text-sm text-slate-500">Every review includes security scanning</p>
                </div>

                <div className="bg-[#2e333d] border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-violet-400" />
                        </div>
                        <h3 className="font-semibold text-slate-100">Multi-AI Models</h3>
                    </div>
                    <p className="text-sm text-slate-500">Choose from Gemini, GPT, Ollama</p>
                </div>
            </div>
        </div>
    );
}