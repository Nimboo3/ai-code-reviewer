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
                className="gradient-bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover-glow transition-all duration-200 shadow-md"
            >
                Dashboard
            </Link>
        ) : (
            <>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
                    Login
                </Link>
                <Link
                    href="/auth/register"
                    className="gradient-bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover-glow transition-all duration-200 shadow-md"
                >
                    Get Started
                </Link>
            </>
        );
    }

    // Primary buttons for the hero section
    return isAuthenticated ? (
        <Link
            href="/app"
            className="inline-flex items-center px-8 py-4 rounded-xl gradient-bg-primary text-white font-bold hover-glow hover-scale transition-all duration-300 shadow-xl"
        >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
    ) : (
        <>
            <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 rounded-xl gradient-bg-primary text-white font-bold hover-glow hover-scale transition-all duration-300 shadow-xl"
            >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
                href="#features"
                className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
        </>
    );
}