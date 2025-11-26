"use client";
import { useState, useEffect } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from "next/link";

export default function AuthAwareButtons({ variant = 'primary' }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = await createSPASassClient();
                const { data: { user } } = await supabase.getSupabaseClient().auth.getUser();
                setIsAuthenticated(!!user);
            } catch (error) {
                console.error('Error checking auth status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return null;
    }

    // Navigation buttons for the header
    if (variant === 'nav') {
        return isAuthenticated ? (
            <Link
                href="/app"
                className="bg-white text-black px-4 py-2 rounded-sm font-medium hover:bg-gray-200 transition-colors text-sm"
            >
                Dashboard
            </Link>
        ) : (
            <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Login
                </Link>
                <Link
                    href="/auth/register"
                    className="bg-white text-black px-4 py-2 rounded-sm font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                    Get Started
                </Link>
            </div>
        );
    }

    // Primary buttons for the hero section
    return isAuthenticated ? (
        <Link
            href="/app"
            className="inline-flex items-center px-8 py-4 rounded-sm bg-white text-black font-bold hover:bg-gray-200 transition-all"
        >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
    ) : (
        <div className="flex flex-col sm:flex-row gap-4">
            <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 rounded-sm bg-white text-black font-bold hover:bg-gray-200 transition-all"
            >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 rounded-sm border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
            >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
        </div>
    );
}