"use client";

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, FileText } from 'lucide-react';

interface LegalDocumentProps {
    filePath: string;
    title: string;
}

const LegalDocument: React.FC<LegalDocumentProps> = ({ filePath, title }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load document');
                }
                return response.text();
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading markdown:', error);
                setError('Failed to load document. Please try again later.');
                setLoading(false);
            });
    }, [filePath]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Dark Theme Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/20">
                    <FileText className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>
                <div className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
            </div>

            {/* Content Area - Dark Glass Card */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                        <p className="text-sm text-gray-400">Loading document...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <span className="text-red-400 text-2xl">⚠</span>
                        </div>
                        <p className="text-red-400 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-4 pb-3 border-b border-white/[0.08]">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl md:text-2xl font-semibold text-white mt-8 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg md:text-xl font-medium text-gray-200 mt-6 mb-2">{children}</h3>,
                                ul: ({ children }) => <ul className="space-y-2 my-4 pl-6">{children}</ul>,
                                li: ({ children }) => <li className="text-gray-300 leading-relaxed relative before:content-['•'] before:absolute before:-left-4 before:text-cyan-400 before:font-bold">{children}</li>,
                                p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4 text-[15px]">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                a: ({ children, href }) => <a href={href} className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-400 transition-colors">{children}</a>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
                <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
};

export default LegalDocument;