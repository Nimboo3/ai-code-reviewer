'use client';

import { useState } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.getSupabaseClient().auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-8 rounded-xl">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-emerald-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Check your email
                    </h2>

                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        We have sent a password reset link to your email address.
                        Please check your inbox and follow the instructions.
                    </p>

                    <Link 
                        href="/auth/login" 
                        className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-8 rounded-xl">
            <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-cyan-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Reset your password
                </h2>
                <p className="text-sm text-gray-400">
                    Enter your email address and we&apos;ll send you a reset link.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                        placeholder="you@example.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center rounded-lg bg-white py-3 px-4 text-sm font-bold text-black hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending reset link...' : 'Send reset link'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">Remember your password?</span>
                {' '}
                <Link href="/auth/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}