"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
    Home,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Key, Files, Code,
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [shouldScrollToPricing, setShouldScrollToPricing] = useState(false);
    const pathname = usePathname();
    const router = useRouter();


    const { user } = useGlobal();

    // Effect to handle scrolling to pricing section
    useEffect(() => {
        if (shouldScrollToPricing && pathname === '/') {
            const timer = setTimeout(() => {
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setShouldScrollToPricing(false);
                }
            }, 300); // Increased timeout to ensure content is loaded
            return () => clearTimeout(timer);
        }
    }, [pathname, shouldScrollToPricing]);

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

    const navigation = [
        { name: 'Home', href: '/app', icon: Home },
        { name: 'Code Review', href: '/app/code-review', icon: Code },
        { name: 'All Reviews', href: '/app/code-review/archive', icon: Files },
        { name: 'User Settings', href: '/app/user-settings', icon: User },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen mesh-background">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar - Minimal Light Design */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-all duration-300 ease-out z-30 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{productName}</span>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 transition-all duration-200 ${
                                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

            </div>

            <div className="lg:pl-64">
                {/* Header - Minimal Light Design */}
                <div className="sticky top-0 z-40 flex items-center justify-between h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 shadow-sm">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <Menu className="h-5 w-5"/>
                    </button>

                    <div className="relative ml-auto flex items-center gap-3 z-50">
                        {/* Free Tier Badge - Minimalist */}
                        <button
                            onClick={() => {
                                // If already on homepage, just scroll
                                if (pathname === '/') {
                                    const pricingSection = document.getElementById('pricing');
                                    if (pricingSection) {
                                        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                } else {
                                    // Navigate to homepage and trigger scroll via useEffect
                                    setShouldScrollToPricing(true);
                                    router.push('/');
                                }
                            }}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 transition-all duration-200 group cursor-pointer"
                        >
                            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            FREE TIER
                        </button>
                        
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                    <span className="text-white font-semibold text-xs">
                                        {user ? getInitials(user.email) : '??'}
                                    </span>
                                </div>
                                <span className="font-medium hidden sm:inline text-gray-700">{user?.email || 'Loading...'}</span>
                                <ChevronDown className="h-4 w-4 text-gray-400"/>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-scale-in z-50">
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Signed in as</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate mt-1">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            handleChangePassword()
                                        }}
                                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <Key className="mr-3 h-4 w-4 text-gray-400"/>
                                        User Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setUserDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-red-500"/>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>

                <main className="p-6 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}