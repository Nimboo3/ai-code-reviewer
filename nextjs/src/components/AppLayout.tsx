"use client";
import React, { useState } from 'react';
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
    const pathname = usePathname();
    const router = useRouter();


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

    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'CodeReviewAI';

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

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 glass-dark shadow-2xl transform transition-all duration-300 ease-out z-30 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    <span className="text-xl font-bold gradient-text">{productName}</span>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? 'gradient-bg-primary text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                                        isActive ? 'text-white scale-110' : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

            </div>

            <div className="lg:pl-64">
                <div className="sticky top-0 z-10 flex items-center justify-between h-16 glass px-6">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <Menu className="h-6 w-6"/>
                    </button>

                    <div className="relative ml-auto flex items-center gap-3">
                        {/* Free Tier Badge */}
                        <Link 
                            href="/#pricing"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 rounded-full text-xs font-bold text-blue-700 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group"
                        >
                            <svg className="w-3.5 h-3.5 text-blue-500 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            FREE TIER
                        </Link>
                        
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                    <span className="text-white font-bold text-sm">
                                        {user ? getInitials(user.email) : '??'}
                                    </span>
                                </div>
                                <span className="font-medium hidden sm:inline">{user?.email || 'Loading...'}</span>
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"/>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-72 glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in z-50">
                                <div className="p-4 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Signed in as</p>
                                    <p className="text-sm font-bold text-gray-900 truncate mt-1">
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
                                        <Key className="mr-3 h-5 w-5 text-gray-400"/>
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setUserDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    >
                                        <LogOut className="mr-3 h-5 w-5 text-red-400"/>
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