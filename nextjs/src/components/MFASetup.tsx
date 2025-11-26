import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createSPASassClient } from '@/lib/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import {Factor} from "@supabase/auth-js";
import { MFAEnrollTOTPParams } from '@supabase/auth-js';


interface MFASetupProps {
    onStatusChange?: () => void;
}

export function MFASetup({ onStatusChange }: MFASetupProps) {
    const [factors, setFactors] = useState<Factor[]>([]);
    const [step, setStep] = useState<'list' | 'name' | 'enroll'>('list');
    const [factorId, setFactorId] = useState('');
    const [qr, setQR] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [friendlyName, setFriendlyName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState(false);

    const fetchFactors = async () => {
        try {
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.getSupabaseClient().auth.mfa.listFactors();

            if (error) throw error;

            setFactors(data.all || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching MFA factors:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch MFA status');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFactors();
    }, []);

    const startEnrollment = async () => {
        if (!friendlyName.trim()) {
            setError('Please provide a name for this authentication method');
            return;
        }

        setError('');
        setActionInProgress(true);

        try {
            const supabase = await createSPASassClient();
            const enrollParams: MFAEnrollTOTPParams = {
                factorType: 'totp',
                friendlyName: friendlyName.trim()
            };

            const { data, error } = await supabase.getSupabaseClient().auth.mfa.enroll(enrollParams);

            if (error) throw error;

            setFactorId(data.id);
            setQR(data.totp.qr_code);
            setStep('enroll');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start MFA enrollment');
            setStep('name');
        } finally {
            setActionInProgress(false);
        }
    };

    const verifyFactor = async () => {
        setError('');
        setActionInProgress(true);

        try {
            const supabase = await createSPASassClient();
            const client = supabase.getSupabaseClient();

            const challenge = await client.auth.mfa.challenge({ factorId });
            if (challenge.error) throw challenge.error;

            const verify = await client.auth.mfa.verify({
                factorId,
                challengeId: challenge.data.id,
                code: verifyCode
            });
            if (verify.error) throw verify.error;

            await fetchFactors();
            resetEnrollment();
            onStatusChange?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify MFA code');
        } finally {
            setActionInProgress(false);
        }
    };

    const unenrollFactor = async (factorId: string) => {
        setError('');
        setActionInProgress(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.getSupabaseClient().auth.mfa.unenroll({ factorId });

            if (error) throw error;

            await fetchFactors();
            onStatusChange?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to unenroll MFA factor');
        } finally {
            setActionInProgress(false);
        }
    };

    const resetEnrollment = () => {
        setStep('list');
        setFactorId('');
        setQR('');
        setVerifyCode('');
        setFriendlyName('');
        setError('');
    };

    if (loading) {
        return (
            <div className="bg-[#2e333d] rounded-xl border border-slate-700/50 p-6">
                <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#2e333d] rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="p-6 border-b border-slate-800/60">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-1">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    Two-Factor Authentication (2FA)
                </h2>
                <p className="text-sm text-slate-400">
                    Add an additional layer of security to your account
                </p>
            </div>
            <div className="p-6 space-y-4">
                {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {factors.length > 0 && step === 'list' && (
                    <div className="space-y-4">
                        {factors.map((factor) => (
                            <div key={factor.id} className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {factor.status === 'verified' ? (
                                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    )}
                                    <div>
                                        <p className="font-medium text-slate-100">
                                            {factor.friendly_name || 'Authenticator App'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Added on {new Date(factor.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => unenrollFactor(factor.id)}
                                    disabled={actionInProgress}
                                    className="px-3 py-1 text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {step === 'name' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="friendly-name" className="block text-sm font-medium text-slate-400">
                                Device Name
                            </label>
                            <input
                                id="friendly-name"
                                type="text"
                                value={friendlyName}
                                onChange={(e) => setFriendlyName(e.target.value)}
                                className="mt-1 block w-full rounded-lg bg-slate-900/60 border border-slate-700/50 px-4 py-2.5 text-slate-200 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                                placeholder="e.g., Work Phone, Personal iPhone"
                                autoFocus
                            />
                            <p className="text-sm text-slate-500">
                                Give this authentication method a name to help you identify it later
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={resetEnrollment}
                                disabled={actionInProgress}
                                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:border-slate-600/60 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startEnrollment}
                                disabled={actionInProgress || !friendlyName.trim()}
                                className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-500/40 transition-all disabled:opacity-50"
                            >
                                {actionInProgress ? 'Processing...' : 'Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'enroll' && (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            {qr && (
                                <Image
                                    src={qr}
                                    alt="QR Code"
                                    width={192}
                                    height={192}
                                    className="border border-slate-700/50 rounded-lg p-2 bg-white"
                                    unoptimized
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="verify-code" className="block text-sm font-medium text-slate-400">
                                Verification Code
                            </label>
                            <input
                                id="verify-code"
                                type="text"
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value.trim())}
                                className="mt-1 block w-full rounded-lg bg-slate-900/60 border border-slate-700/50 px-4 py-2.5 text-slate-200 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                                placeholder="Enter code from your authenticator app"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={resetEnrollment}
                                disabled={actionInProgress}
                                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:border-slate-600/60 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyFactor}
                                disabled={actionInProgress || verifyCode.length === 0}
                                className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-500/40 transition-all disabled:opacity-50"
                            >
                                {actionInProgress ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'list' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">
                            {factors.length === 0
                                ? 'Protect your account with two-factor authentication. When enabled, you\'ll need to enter a code from your authenticator app in addition to your password when signing in.'
                                : 'You can add additional authentication methods or remove existing ones.'}
                        </p>
                        <button
                            onClick={() => setStep('name')}
                            disabled={actionInProgress}
                            className="w-full py-3 px-6 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold rounded-lg 
                                       hover:bg-cyan-500/30 hover:border-cyan-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionInProgress ? 'Processing...' : 'Add New Authentication Method'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}