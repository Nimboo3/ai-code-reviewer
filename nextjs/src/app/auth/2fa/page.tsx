
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';
import { MFAVerification } from '@/components/MFAVerification';
import { Shield } from 'lucide-react';

export default function TwoFactorAuthPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkMFAStatus();
    }, []);

    const checkMFAStatus = async () => {
        try {
            const supabase = await createSPASassClient();
            const client = supabase.getSupabaseClient();

            const { data: { user }, error: sessionError } = await client.auth.getUser();
            if (sessionError || !user) {
                router.push('/auth/login');
                return;
            }

            const { data: aal, error: aalError } = await client.auth.mfa.getAuthenticatorAssuranceLevel();

            if (aalError) throw aalError;

            if (aal.currentLevel === 'aal2' || aal.nextLevel === 'aal1') {
                router.push('/app');
                return;
            }

            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    const handleVerified = () => {
        router.push('/app');
    };

    if (loading) {
        return (
            <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-8 rounded-xl">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
                    <p className="mt-4 text-sm text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-card/50 backdrop-blur-sm border border-white/[0.06] p-8 rounded-xl">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-red-400" />
                        </div>
                    </div>
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <MFAVerification onVerified={handleVerified} />
        </div>
    );
}