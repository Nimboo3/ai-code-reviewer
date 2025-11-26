'use client';

import { useState, useEffect } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle, Key } from 'lucide-react';

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Check if we have a valid recovery session
    useEffect(() => {
        const checkSession = async () => {
            try {
                const supabase = await createSPASassClient();
                const { data: { user }, error } = await supabase.getSupabaseClient().auth.getUser();

                if (error || !user) {
                    setError('Invalid or expired reset link. Please request a new password reset.');
                }
            } catch {
                setError('Failed to verify reset session');
            }
        };

        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.getSupabaseClient().auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push('/app');
            }, 3000);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to reset password');
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
                        Password reset successful
                    </h2>

                    <p className="text-gray-400 text-sm">
                        Your password has been successfully reset.
                        You will be redirected to the app in a moment.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-8 rounded-xl">
            <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Key className="h-6 w-6 text-cyan-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                    Create new password
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                    </label>
                    <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                    />
                </div>

                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Password must be at least 6 characters long
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center rounded-lg bg-white py-3 px-4 text-sm font-bold text-black hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Resetting password...' : 'Reset password'}
                </button>
            </form>
        </div>
    );
}