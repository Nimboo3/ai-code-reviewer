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
        <div className="w-full max-w-4xl mx-auto px-6 py-12">
            {/* Minimal Header */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
                <div className="mt-4 h-1 w-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>

            {/* Content Area - Minimal White Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <p className="text-sm text-gray-500">Loading document...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                            <span className="text-red-600 text-2xl">⚠</span>
                        </div>
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="prose prose-gray max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-10 mb-4 pb-3 border-b border-gray-200">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">{children}</h3>,
                                ul: ({ children }) => <ul className="space-y-2 my-4 pl-6">{children}</ul>,
                                li: ({ children }) => <li className="text-gray-700 leading-relaxed relative before:content-['•'] before:absolute before:-left-4 before:text-blue-500 before:font-bold">{children}</li>,
                                p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4 text-[15px]">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                a: ({ children, href }) => <a href={href} className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-600 transition-colors">{children}</a>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
};

export default LegalDocument;