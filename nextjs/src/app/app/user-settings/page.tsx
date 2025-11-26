"use client";
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import { Key, User, CheckCircle } from 'lucide-react';
import { MFASetup } from '@/components/MFASetup';

export default function UserSettingsPage() {
    const { user } = useGlobal();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');



    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const supabase = await createSPASassClient();
            const client = supabase.getSupabaseClient();

            const { error } = await client.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setSuccess('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                console.error('Error updating password:', err);
                setError(err.message);
            } else {
                console.error('Error updating password:', err);
                setError('Failed to update password');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">User Settings</h1>
                <p className="mt-2 text-slate-400">Manage your account settings and preferences</p>
            </div>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                <div className="bg-[#2e333d] backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 space-y-6 hover:border-slate-600/50 transition-colors">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-1">
                            <User className="h-5 w-5 text-cyan-400" />
                            User Details
                        </h2>
                        <p className="text-sm text-slate-500">Your account information</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-400">User ID</label>
                            <p className="mt-1 text-sm text-slate-300 font-mono bg-slate-800/40 border border-slate-700/40 px-3 py-2 rounded-lg">{user?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-400">Email</label>
                            <p className="mt-1 text-sm text-slate-300 bg-slate-800/40 border border-slate-700/40 px-3 py-2 rounded-lg">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#2e333d] backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 space-y-6 hover:border-slate-600/50 transition-colors">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-1">
                            <Key className="h-5 w-5 text-blue-400" />
                            Change Password
                        </h2>
                        <p className="text-sm text-slate-500">Update your account password</p>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-semibold text-slate-400 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/50 
                                           rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 
                                           focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-400 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/50 
                                           rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 
                                           focus:border-cyan-500/50 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-cyan-500/20 text-cyan-400 font-semibold rounded-lg border border-cyan-500/30
                                       hover:bg-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                <MFASetup
                    onStatusChange={() => {
                        setSuccess('Two-factor authentication settings updated successfully');
                    }}
                />
            </div>
        </div>
    );
}