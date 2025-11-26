'use client';

import { Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from "react";
import { createSPASassClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const resendVerificationEmail = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const supabase = await createSPASassClient();
            const { error } = await supabase.resendVerificationEmail(email);
            if (error) {
                setError(error.message);
                return;
            }
            setSuccess(true);
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-8 rounded-xl">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Mail className="h-8 w-8 text-cyan-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Check your email
                </h2>

                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    We&apos;ve sent you an email with a verification link.
                    Please check your inbox and click the link to verify your account.
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Didn&apos;t receive the email? Check your spam folder or enter your email to resend:
                    </p>

                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Verification email has been resent successfully.
                        </div>
                    )}

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200 text-sm"
                    />

                    <button
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={resendVerificationEmail}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Click here to resend'}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <Link
                        href="/auth/login"
                        className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        </div>
    );
}