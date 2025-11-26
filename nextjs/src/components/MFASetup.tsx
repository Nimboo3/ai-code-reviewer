import React, { useState, useEffect } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
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
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/[0.06] p-6">
                <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
            <div className="p-6 border-b border-white/[0.06]">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-1">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    Two-Factor Authentication (2FA)
                </h2>
                <p className="text-sm text-gray-500">
                    Add an additional layer of security to your account
                </p>
            </div>
            <div className="p-6 space-y-4">
                {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {factors.length > 0 && step === 'list' && (
                    <div className="space-y-4">
                        {factors.map((factor) => (
                            <div key={factor.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                                <div className="flex items-center gap-3">
                                    {factor.status === 'verified' ? (
                                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    )}
                                    <div>
                                        <p className="font-medium text-white">
                                            {factor.friendly_name || 'Authenticator App'}
                                        </p>
                                        <p className="text-sm text-gray-500">
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
                            <label htmlFor="friendly-name" className="block text-sm font-medium text-gray-400">
                                Device Name
                            </label>
                            <input
                                id="friendly-name"
                                type="text"
                                value={friendlyName}
                                onChange={(e) => setFriendlyName(e.target.value)}
                                className="mt-1 block w-full rounded-lg bg-[#0a0c0f] border border-white/[0.1] px-4 py-2.5 text-white text-sm
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                                placeholder="e.g., Work Phone, Personal iPhone"
                                autoFocus
                            />
                            <p className="text-sm text-gray-500">
                                Give this authentication method a name to help you identify it later
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={resetEnrollment}
                                disabled={actionInProgress}
                                className="px-4 py-2 text-sm font-medium text-gray-400 bg-white/5 border border-white/[0.1] rounded-lg hover:bg-white/10 hover:border-white/[0.15] transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startEnrollment}
                                disabled={actionInProgress || !friendlyName.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
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
                                <img
                                    src={qr}
                                    alt="QR Code"
                                    className="w-48 h-48 border border-white/[0.1] rounded-lg p-2 bg-white"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="verify-code" className="block text-sm font-medium text-gray-400">
                                Verification Code
                            </label>
                            <input
                                id="verify-code"
                                type="text"
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value.trim())}
                                className="mt-1 block w-full rounded-lg bg-[#0a0c0f] border border-white/[0.1] px-4 py-2.5 text-white text-sm
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                                placeholder="Enter code from your authenticator app"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={resetEnrollment}
                                disabled={actionInProgress}
                                className="px-4 py-2 text-sm font-medium text-gray-400 bg-white/5 border border-white/[0.1] rounded-lg hover:bg-white/10 hover:border-white/[0.15] transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyFactor}
                                disabled={actionInProgress || verifyCode.length === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                            >
                                {actionInProgress ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'list' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            {factors.length === 0
                                ? 'Protect your account with two-factor authentication. When enabled, you\'ll need to enter a code from your authenticator app in addition to your password when signing in.'
                                : 'You can add additional authentication methods or remove existing ones.'}
                        </p>
                        <button
                            onClick={() => setStep('name')}
                            disabled={actionInProgress}
                            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg 
                                       hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionInProgress ? 'Processing...' : 'Add New Authentication Method'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}