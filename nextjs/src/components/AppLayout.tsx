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
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";
import PricingModal from "@/components/PricingModal";
import NotificationsDropdown from "@/components/NotificationsDropdown";
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
        <div className="min-h-screen bg-[#1e2128]">
            {/* Subtle gradient background */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(100,116,139,0.08),transparent_50%)]" />
            <div className="fixed inset-0 bg-grid-pattern-small opacity-[0.03]" />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar - Lighter Slate Theme */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-[#272b34] border-r border-slate-700/40 transform transition-all duration-300 ease-out z-30 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-14 flex items-center justify-between px-6 border-b border-slate-700/40">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-300 rounded-lg flex items-center justify-center shadow-sm">
                            <Hexagon className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold text-slate-100">{productName}</span>
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-slate-500 hover:text-slate-200 transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-3 flex-1 overflow-y-auto">
                    {/* Core Section */}
                    <div className="mb-6">
                        <p className="px-4 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Core</p>
                        <div className="space-y-1">
                            {coreNavigation.map((item) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-slate-700/50 text-slate-100'
                                                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-4 w-4 transition-all duration-200 ${
                                                isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'
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
                        <p className="px-4 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">PR Reviewer</p>
                        <div className="space-y-1">
                            {reviewerNavigation.map((item) => {
                                const isActive = isActiveRoute(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-slate-700/50 text-slate-100'
                                                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-4 w-4 transition-all duration-200 ${
                                                isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </div>

            <div className="lg:pl-64 relative z-10">
                {/* Header - Lighter Slate Theme */}
                <div className="sticky top-0 z-40 flex items-center justify-between h-14 bg-[#272b34]/95 backdrop-blur-xl border-b border-slate-700/40 px-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                        <Menu className="h-5 w-5"/>
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <button 
                            onClick={() => showComingSoon('Global Search')}
                            className="flex items-center gap-2 w-full px-3 py-1.5 bg-slate-700/40 border border-slate-600/40 rounded-lg text-slate-400 text-sm hover:bg-slate-700/60 hover:border-slate-500/50 transition-all"
                        >
                            <Search className="h-4 w-4" />
                            <span>Search repos, PRs...</span>
                            <kbd className="ml-auto hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-600/40 rounded text-[10px] text-slate-400 border border-slate-500/30">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    <div className="relative ml-auto flex items-center gap-2 z-50">
                        {/* Notifications */}
                        <NotificationsDropdown />

                        {/* Free Tier Badge */}
                        <button
                            onClick={() => setIsPricingModalOpen(true)}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/40 rounded-full text-xs font-semibold text-slate-300 transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            FREE TIER
                        </button>
                        
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center space-x-3 text-sm text-slate-300 hover:text-slate-100 transition-all duration-200 group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                    <span className="text-slate-100 font-semibold text-xs">
                                        {user ? getInitials(user.email) : '??'}
                                    </span>
                                </div>
                                <span className="font-medium hidden sm:inline">{user?.email || 'Loading...'}</span>
                                <ChevronDown className="h-4 w-4 text-slate-500"/>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-[#2e333d] border border-slate-600/40 rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-600/40 bg-slate-700/20">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Signed in as</p>
                                        <p className="text-sm font-semibold text-slate-100 truncate mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setUserDropdownOpen(false);
                                                handleChangePassword()
                                            }}
                                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors duration-150"
                                        >
                                            <Key className="mr-3 h-4 w-4 text-slate-500"/>
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