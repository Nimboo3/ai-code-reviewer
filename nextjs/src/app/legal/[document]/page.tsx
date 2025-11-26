'use client';

import React from 'react';
import LegalDocument from '@/components/LegalDocument';
import { notFound } from 'next/navigation';

const legalDocuments = {
    'privacy': {
        title: 'Privacy Notice',
        path: '/terms/privacy-notice.md'
    },
    'terms': {
        title: 'Terms of Service',
        path: '/terms/terms-of-service.md'
    },
    'refund': {
        title: 'Refund Policy',
        path: '/terms/refund-policy.md'
    }
} as const;

type LegalDocument = keyof typeof legalDocuments;

interface LegalPageProps {
    document: LegalDocument;
    lng: string;
}

interface LegalPageParams {
    params: Promise<LegalPageProps>
}

export default function LegalPage({ params }: LegalPageParams) {
    const {document} = React.use<LegalPageProps>(params);

    if (!legalDocuments[document]) {
        notFound();
    }

    const { title, path } = legalDocuments[document];

    return (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-6 md:p-8">
            <LegalDocument
                title={title}
                filePath={path}
            />
        </div>
    );
}