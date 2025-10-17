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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const daysSinceRegistration = getDaysSinceRegistration();
    const username = user?.email?.split('@')[0] || 'there';

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                Welcome back, {username}! 👋
                            </h1>
                            <div className="flex items-center gap-2 text-white/90">
                                <CalendarDays className="h-5 w-5" />
                                <span className="text-lg">Member for {daysSinceRegistration} days</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xl text-white/90 mt-4 max-w-2xl">
                        Ready to improve your code? Let&apos;s catch bugs, enhance security, and ship with confidence.
                    </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Quick Actions</h2>
                        <p className="text-gray-600 mt-1">Jump into your most-used features</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Code Review Card */}
                    <Link
                        href="/app/code-review"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl group-hover:bg-blue-300/40 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <Code className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                Code Review
                                <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Upload your code and get instant AI-powered analysis with security checks, bug detection, and quality metrics
                            </p>
                            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Zap className="h-4 w-4 text-yellow-600" />
                                    <span>Instant analysis</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span>Security scan</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* User Settings Card */}
                    <Link
                        href="/app/user-settings"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl group-hover:bg-purple-300/40 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <Settings className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                User Settings
                                <ArrowRight className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Manage your account, update passwords, enable two-factor authentication, and customize your preferences
                            </p>
                            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span>2FA enabled</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Settings className="h-4 w-4 text-purple-600" />
                                    <span>Full control</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Stats or Tips Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">Free Tier Active</h3>
                    </div>
                    <p className="text-sm text-gray-600">7 reviews/day • 500KB files</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">Security First</h3>
                    </div>
                    <p className="text-sm text-gray-600">Every review includes security scanning</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">Multi-AI Models</h3>
                    </div>
                    <p className="text-sm text-gray-600">Choose from Gemini, GPT, Ollama</p>
                </div>
            </div>
        </div>
    );
}