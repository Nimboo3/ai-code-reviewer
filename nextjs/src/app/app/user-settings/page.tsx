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
                <h1 className="text-3xl font-bold text-white">User Settings</h1>
                <p className="mt-2 text-gray-400">Manage your account settings and preferences</p>
            </div>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/[0.06] space-y-6 hover:border-white/[0.1] transition-colors">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                            <User className="h-5 w-5 text-cyan-400" />
                            User Details
                        </h2>
                        <p className="text-sm text-gray-500">Your account information</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400">User ID</label>
                            <p className="mt-1 text-sm text-gray-300 font-mono bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg">{user?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-400">Email</label>
                            <p className="mt-1 text-sm text-gray-300 bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/[0.06] space-y-6 hover:border-white/[0.1] transition-colors">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                            <Key className="h-5 w-5 text-blue-400" />
                            Change Password
                        </h2>
                        <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-semibold text-gray-400 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#0a0c0f] border border-white/[0.1] 
                                           rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 
                                           focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-400 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#0a0c0f] border border-white/[0.1] 
                                           rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 
                                           focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg 
                                       hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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