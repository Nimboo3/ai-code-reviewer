"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, ShieldAlert, RefreshCw, Hexagon } from 'lucide-react';

const legalDocuments = [
    {
        id: 'privacy',
        title: 'Privacy Policy',
        icon: ShieldAlert,
        description: 'How we handle and protect your data'
    },
    {
        id: 'terms',
        title: 'Terms of Service',
        icon: FileText,
        description: 'Rules and guidelines for using our service'
    },
    {
        id: 'refund',
        title: 'Refund Policy',
        icon: RefreshCw,
        description: 'Our policy on refunds and cancellations'
    }
];

export default function LegalLayout({ children } : { children: React.ReactNode }) {
    const router = useRouter();
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'CodeReview.ai';

    return (
        <div className="min-h-screen bg-[#0d1015] relative">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(6,182,212,0.10),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(59,130,246,0.08),transparent_60%)]" />
            <div className="absolute inset-0 bg-grid-pattern-small opacity-[0.02]" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="py-6 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                            <Hexagon className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold text-white">{productName}</span>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 pb-12">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06]">
                            <div className="p-4 border-b border-white/[0.06]">
                                <h2 className="text-lg font-semibold text-white">Legal Documents</h2>
                                <p className="text-sm text-gray-400 mt-1">Important information about our services</p>
                            </div>
                            <nav className="p-4 space-y-2">
                                {legalDocuments.map((doc) => (
                                    <Link
                                        key={doc.id}
                                        href={`/legal/${doc.id}`}
                                        className="block p-3 rounded-lg hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.06]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <doc.icon className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <div className="text-sm font-medium text-white">{doc.title}</div>
                                                <div className="text-xs text-gray-500">{doc.description}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}