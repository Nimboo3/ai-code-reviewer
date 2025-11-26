"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Key, 
    Files, 
    Code, 
    Hexagon,
    FolderGit2,
    LayoutDashboard,
    Plug,
    Bot,
    CreditCard,
    Search,
    Bell,
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";
import PricingModal from "@/components/PricingModal";
import { ToastProvider, useToast } from "@/components/ui/toast";

// Inner component that uses toast
function AppLayoutInner({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { showComingSoon } = useToast();

    const { user } = useGlobal();

    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleChangePassword = async () => {
        router.push('/app/user-settings')
    };

    const getInitials = (email: string) => {
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    };

    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'CodeReview.ai';

    // Original navigation - keeping existing tabs
    const coreNavigation = [
        { name: 'Home', href: '/app', icon: Home },
        { name: 'Code Review', href: '/app/code-review', icon: Code },
        { name: 'All Reviews', href: '/app/code-review/archive', icon: Files },
        { name: 'User Settings', href: '/app/user-settings', icon: User },
    ];

    // New PR Reviewer navigation
    const reviewerNavigation = [
        { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
        { name: 'Projects', href: '/app/projects', icon: FolderGit2 },
        { name: 'Agents', href: '/app/agents', icon: Bot },
        { name: 'Integrations', href: '/app/integrations', icon: Plug },
        { name: 'Billing', href: '/app/billing', icon: CreditCard },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Check if path starts with given href (for nested routes)
    const isActiveRoute = (href: string) => {
        if (href === '/app') return pathname === '/app';
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-[#101318]">
            {/* Subtle neutral gradient background - lighter */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(148,163,184,0.03),transparent_50%)]" />
            <div className="fixed inset-0 bg-grid-pattern-small opacity-[0.01]" />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar - Light Dark Theme */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-[#12151a] border-r border-white/[0.06] transform transition-all duration-300 ease-out z-30 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06]">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                            <Hexagon className="w-4 h-4 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold text-white">{productName}</span>
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-3 flex-1 overflow-y-auto">
                    {/* Core Section */}
                    <div className="mb-6">
                        <p className="px-4 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Core</p>
                        <div className="space-y-1">
                            {coreNavigation.map((item) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white/[0.08] text-white'
                                                : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-4 w-4 transition-all duration-200 ${
                                                isActive ? 'text-slate-300' : 'text-gray-500 group-hover:text-gray-300'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* PR Reviewer Section */}
                    <div className="mb-6">
                        <p className="px-4 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">PR Reviewer</p>
                        <div className="space-y-1">
                            {reviewerNavigation.map((item) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white/[0.08] text-white'
                                                : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-4 w-4 transition-all duration-200 ${
                                                isActive ? 'text-slate-300' : 'text-gray-500 group-hover:text-gray-300'
                                            }`}
                                        />
                                        {item.name}
                                        {/* New badge for new features */}
                                        {['Dashboard', 'Projects', 'Agents'].includes(item.name) && (
                                            <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-violet-500/20 text-violet-400 rounded">
                                                NEW
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </div>

            <div className="lg:pl-64 relative z-10">
                {/* Header - Light Dark Theme */}
                <div className="sticky top-0 z-40 flex items-center justify-between h-14 bg-[#12151a]/90 backdrop-blur-xl border-b border-white/[0.06] px-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <Menu className="h-5 w-5"/>
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <button 
                            onClick={() => showComingSoon('Global Search')}
                            className="flex items-center gap-2 w-full px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-gray-500 text-sm hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                        >
                            <Search className="h-4 w-4" />
                            <span>Search repos, PRs...</span>
                            <kbd className="ml-auto hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.05] rounded text-[10px] text-gray-500">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    <div className="relative ml-auto flex items-center gap-2 z-50">
                        {/* Notifications */}
                        <button
                            onClick={() => showComingSoon('Notifications')}
                            className="relative p-2 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
                        </button>

                        {/* Free Tier Badge */}
                        <button
                            onClick={() => setIsPricingModalOpen(true)}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/20 rounded-full text-xs font-semibold text-slate-300 transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            FREE TIER
                        </button>
                        
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-all duration-200 group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/10 group-hover:shadow-slate-500/20 transition-shadow duration-200">
                                    <span className="text-white font-semibold text-xs">
                                        {user ? getInitials(user.email) : '??'}
                                    </span>
                                </div>
                                <span className="font-medium hidden sm:inline">{user?.email || 'Loading...'}</span>
                                <ChevronDown className="h-4 w-4 text-gray-500"/>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-card border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="p-4 border-b border-white/[0.06] bg-white/[0.02]">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Signed in as</p>
                                        <p className="text-sm font-semibold text-white truncate mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setUserDropdownOpen(false);
                                                handleChangePassword()
                                            }}
                                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/[0.04] hover:text-white transition-colors duration-150"
                                        >
                                            <Key className="mr-3 h-4 w-4 text-gray-500"/>
                                            User Settings
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setUserDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                                        >
                                            <LogOut className="mr-3 h-4 w-4"/>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <main className="p-4 md:p-6 min-h-screen">
                    {children}
                </main>
            </div>

            {/* Pricing Modal */}
            <PricingModal 
                isOpen={isPricingModalOpen} 
                onClose={() => setIsPricingModalOpen(false)} 
            />
        </div>
    );
}

// Wrapper component with ToastProvider
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AppLayoutInner>{children}</AppLayoutInner>
        </ToastProvider>
    );
}