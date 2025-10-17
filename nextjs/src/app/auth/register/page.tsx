'use client';

import {createSPASassClient} from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from "@/components/SSOButtons";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!acceptedTerms) {
            setError('You must accept the Terms of Service and Privacy Policy');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.registerEmail(email, password);

            if (error) throw error;

            router.push('/auth/verify-email');
        } catch (err: Error | unknown) {
            if(err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-2xl shadow-2xl animate-fade-in">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">Create your CodeReviewAI account</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Start a free trial and run your first AI-powered review in minutes.</p>
            </div>
            {error && (
                <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-up">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full appearance-none rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full appearance-none rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                        Confirm Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full appearance-none rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all duration-200 cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-sm leading-relaxed">
                            <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                                I agree to the{' '}
                                <Link
                                    href="/legal/terms"
                                    className="font-semibold text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline transition-all duration-200"
                                    target="_blank"
                                >
                                    terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="/legal/privacy"
                                    className="font-semibold text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline transition-all duration-200"
                                    target="_blank"
                                >
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center items-center rounded-xl border border-transparent gradient-bg-primary py-3.5 px-4 text-sm font-bold text-white shadow-lg hover-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </button>
                </div>
            </form>

            <SSOButtons onError={setError}/>

            <div className="mt-8 text-center text-sm">
                <span className="text-gray-600">Already have an account?</span>
                {' '}
                <Link href="/auth/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    Sign in
                </Link>
            </div>
        </div>
    );
}