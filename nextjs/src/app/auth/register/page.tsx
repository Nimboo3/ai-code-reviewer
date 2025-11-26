'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from "@/components/SSOButtons";
import { Check, X } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const router = useRouter();

    // Password strength validation
    const passwordValidation = useMemo(() => {
        const checks = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        const passedChecks = Object.values(checks).filter(Boolean).length;
        let strength: 'weak' | 'medium' | 'strong' = 'weak';
        
        if (passedChecks >= 5) strength = 'strong';
        else if (passedChecks >= 3) strength = 'medium';

        return { checks, strength, passedChecks };
    }, [password]);

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

        // Check password strength
        if (!passwordValidation.checks.minLength) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (passwordValidation.passedChecks < 3) {
            setError('Password is too weak. Please meet at least 3 of the strength requirements.');
            return;
        }

        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.registerEmail(email, password);

            if (error) throw error;

            router.push('/auth/verify-email');
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-6 rounded-xl">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-white">Create your account</h2>
                <p className="mt-1 text-sm text-gray-400">Start your free AI-powered code review trial.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
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
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                        placeholder="••••••••"
                    />
                    
                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-300 ${
                                            passwordValidation.strength === 'strong' 
                                                ? 'bg-emerald-500 w-full' 
                                                : passwordValidation.strength === 'medium' 
                                                    ? 'bg-yellow-500 w-2/3' 
                                                    : 'bg-red-500 w-1/3'
                                        }`}
                                    />
                                </div>
                                <span className={`text-xs font-medium ${
                                    passwordValidation.strength === 'strong' 
                                        ? 'text-emerald-400' 
                                        : passwordValidation.strength === 'medium' 
                                            ? 'text-yellow-400' 
                                            : 'text-red-400'
                                }`}>
                                    {passwordValidation.strength === 'strong' ? 'Strong' : passwordValidation.strength === 'medium' ? 'Medium' : 'Weak'}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
                                {[
                                    { check: passwordValidation.checks.minLength, label: '8+ characters' },
                                    { check: passwordValidation.checks.hasUpperCase, label: 'Uppercase' },
                                    { check: passwordValidation.checks.hasLowerCase, label: 'Lowercase' },
                                    { check: passwordValidation.checks.hasNumber, label: 'Number' },
                                    { check: passwordValidation.checks.hasSpecialChar, label: 'Special char' },
                                ].map((item, idx) => (
                                    <div key={idx} className={`flex items-center gap-1 ${item.check ? 'text-emerald-400' : 'text-gray-500'}`}>
                                        {item.check ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-relaxed">
                        <label htmlFor="terms" className="text-gray-400 cursor-pointer">
                            I agree to the{' '}
                            <Link href="/legal/terms" className="font-medium text-cyan-400 hover:text-cyan-300" target="_blank">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/legal/privacy" className="font-medium text-cyan-400 hover:text-cyan-300" target="_blank">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center rounded-lg bg-white py-2.5 px-4 text-sm font-bold text-black hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Creating account...
                        </>
                    ) : (
                        'Create account'
                    )}
                </button>
            </form>

            <SSOButtons onError={setError}/>

            <div className="mt-5 text-center text-sm">
                <span className="text-gray-400">Already have an account?</span>
                {' '}
                <Link href="/auth/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                    Sign in
                </Link>
            </div>
        </div>
    );
}