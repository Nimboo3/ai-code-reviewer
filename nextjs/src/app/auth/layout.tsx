'use client';

import Link from 'next/link';
import { ArrowLeft, Hexagon } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'CodeReview.ai';
    const testimonials = [
        {
            quote: "CodeReview.ai surfaced critical issues and helped our team fix security and style regressions before they reached production.",
            author: "Anubhava Tripathi",
            role: "CTO, Kineton",
            avatar: "AT"
        },
        {
            quote: "The assistant integrates nicely into our workflow and produces reviews that are easy to action — a real time saver for architects and engineers.",
            author: "Kayapati Ganesh",
            role: "Associate System Architect, PegaSystems Worldwide",
            avatar: "KG"
        },
        {
            quote: "Heard about CodeReview.ai from a peer at Oracle and decided to give it a try. The quality of insights has exceeded my expectations — absolutely not disappointed!",
            author: "Karan Sharma",
            role: "Software Developer, Société Générale",
            avatar: "KS"
        }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#1e232b]">
            {/* Left side - Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-[#252a33]">
                {/* Subtle gradient glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(148,163,184,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-grid-pattern-small opacity-[0.03]" />
                
                <Link
                    href="/"
                    className="absolute left-6 top-6 flex items-center text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 group z-10"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Homepage
                </Link>

                <motion.div 
                    className="w-full sm:max-w-md relative z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                            <Hexagon className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-white">
                        {productName}
                    </h2>
                </motion.div>

                <motion.div 
                    className="mt-6 w-full sm:max-w-md relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {children}
                </motion.div>
            </div>

            {/* Right side - Testimonials */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Darker background for contrast */}
                <div className="absolute inset-0 bg-[#1a1f26]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_30%,rgba(100,116,139,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_70%_80%,rgba(71,85,105,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
                
                <div className="relative w-full flex items-center justify-center p-12">
                    <div className="space-y-6 max-w-lg">
                        <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-white text-2xl font-bold leading-tight">
                                Trusted by engineering leaders and developers
                            </h3>
                            <div className="h-px w-20 bg-gradient-to-r from-slate-400 to-slate-600"></div>
                        </motion.div>
                        
                        <div className="space-y-4">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                >
                                    <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {testimonial.avatar}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                                                    &quot;{testimonial.quote}&quot;
                                                </p>
                                                <div className="border-t border-white/[0.05] pt-3">
                                                    <p className="text-sm font-semibold text-white">
                                                        {testimonial.author}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div 
                            className="pt-6 border-t border-white/[0.05] text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <p className="text-gray-500 text-sm">
                                Trusted by teams using <span className="font-semibold text-slate-300">{productName}</span> to ship with confidence
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}