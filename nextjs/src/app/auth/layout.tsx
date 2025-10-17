import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
        <div className="flex min-h-screen">
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative">
                <Link
                    href="/"
                    className="absolute left-8 top-8 flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-all duration-200 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Homepage
                </Link>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-4xl font-bold tracking-tight gradient-text">
                        {productName}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Modern gradient background with mesh effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700"></div>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_50%)]"></div>
                
                <div className="relative w-full flex items-center justify-center p-12">
                    <div className="space-y-8 max-w-lg animate-fade-in">
                        <div className="space-y-3">
                            <h3 className="text-white text-3xl font-bold leading-tight">
                                Trusted by engineering leaders and developers
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-5">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="relative group"
                                    style={{animationDelay: `${index * 0.15}s`}}
                                >
                                    {/* Enhanced card with better contrast */}
                                    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                    {testimonial.avatar}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base text-gray-700 mb-4 font-normal leading-relaxed italic">
                                                    &#34;{testimonial.quote}&#34;
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {testimonial.author}
                                                    </p>
                                                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-10 pt-8 border-t border-white/20 text-center">
                            <p className="text-white/90 text-sm font-medium leading-relaxed">
                                Trusted by teams using <span className="font-bold text-cyan-300">{productName}</span> to ship with confidence
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}