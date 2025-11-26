
'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export default function LegalPage() {
    return (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-8">
            <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Select a document</h2>
                <p className="text-gray-400">Choose a legal document from the sidebar to view its contents.</p>
            </div>
        </div>
    );
}