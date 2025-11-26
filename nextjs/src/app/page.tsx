'use client';

import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Shield, Zap, GitPullRequest, LayoutDashboard, Bot, GitBranch, Hexagon } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import { FeatureCard, type FeatureType } from '@/components/ui/grid-feature-cards';
// Lazy load heavy components
const HomePricing = lazy(() => import('@/components/HomePricing'));
const SplineScene = lazy(() => import('@/components/ui/splite').then(mod => ({ default: mod.SplineScene })));
const DatabaseWithRestApi = lazy(() => import('@/components/ui/database-with-rest-api'));
const Testimonials = lazy(() => import('@/components/ui/testimonials').then(mod => ({ default: mod.Testimonials })));
const BeamsBackground = lazy(() => import('@/components/ui/beams-background').then(mod => ({ default: mod.BeamsBackground })));
const ContainerScroll = lazy(() => import('@/components/ui/container-scroll-animation').then(mod => ({ default: mod.ContainerScroll })));

// Optimized scroll reveal - uses CSS for better performance
function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Optimized animated container - removed blur filter for better performance
function AnimatedContainer({ className, delay = 0.1, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'CodeReview.ai';

  const features: FeatureType[] = [
    {
      icon: GitPullRequest,
      title: 'PR Reviews in Seconds',
      description: 'Automated pull request analysis with inline comments, risk scoring, and actionable suggestions.',
    },
    {
      icon: LayoutDashboard,
      title: 'Architecture Analysis',
      description: 'Visualize your codebase structure, detect architectural drift, and track architecture scores over time.',
    },
    {
      icon: Shield,
      title: 'Security Scanning',
      description: 'Detect vulnerabilities, secret leaks, and OWASP compliance issues before they reach production.',
    },
    {
      icon: GitBranch,
      title: 'Dependency Insights',
      description: 'Track dependencies, identify outdated packages, and get alerted to breaking changes.',
    },
    {
      icon: Zap,
      title: 'Tech Debt Tracking',
      description: 'Quantify and prioritize technical debt with effort estimates and automated refactor suggestions.',
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Deploy specialized agents for testing, documentation, migrations, and performance analysis.',
    }
  ];

  return (
      <div className="min-h-screen bg-background text-foreground selection:bg-white/20">
        {/* Navigation */}
        <nav className="fixed top-0 w-full glass-nav z-50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/#top" className="flex-shrink-0 flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <Hexagon className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  {productName}
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  How it works
                </Link>
                <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link
                    href="https://github.com/Nimboo3/ai-code-reviewer"
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  Docs
                </Link>
              </div>
              <div className="flex items-center gap-4">
                 <AuthAwareButtons variant="nav" />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div id="top">
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <BeamsBackground className="min-h-screen" intensity="subtle">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none"></div>
          
          <div className="min-h-screen flex items-center pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <motion.div 
                  className="text-left z-20 order-2 lg:order-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
                    AI-Powered<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Code Reviews.</span>
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-8">
                      <div className="h-px w-12 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                      <p className="text-sm font-mono text-cyan-400/90">AI-powered • &lt;30s per PR • Full codebase insights</p>
                  </div>

                  <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                    Stop waiting for reviewers. Get instant PR feedback with risk scores, architecture 
                    impact analysis, and AI-powered refactor suggestions—all in one platform.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <Link 
                        href="/auth/register"
                        className="px-8 py-4 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        Start reviewing PRs <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                        href="#demo"
                        className="px-8 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-white font-semibold rounded-md border border-white/[0.15] hover:border-cyan-500/30 hover:from-blue-500/15 hover:to-cyan-500/15 transition-all duration-300 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    >
                        See demo dashboard
                    </Link>
                  </div>
                </motion.div>

                {/* Right Content (Spline) */}
                <motion.div 
                  className="relative h-[400px] sm:h-[500px] lg:h-[600px] order-1 lg:order-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                   {/* Static Glow - no animation */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none"></div>
                   
                   <div className="relative w-full h-full z-10">
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><span className="loader"></span></div>}>
                        <SplineScene 
                          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                          className="w-full h-full"
                        />
                      </Suspense>
                   </div>
                </motion.div>
              </div>
            </div>
          </div>
        </BeamsBackground>
        </Suspense>
        </div>

        {/* Features Grid */}
        <section id="features" className="py-24 relative bg-[#12161c]">
            {/* Subtle blue/slate gradient from top */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_-10%,rgba(59,130,246,0.08),transparent_60%)]" />
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(148,163,184,0.04),transparent_50%)]" />
            {/* Subtle grid pattern for texture */}
            <div className="absolute inset-0 bg-grid-pattern-small opacity-[0.025]"></div>
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedContainer className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-white text-balance">
                        Built for modern engineering teams.
                    </h2>
                    <p className="text-muted-foreground mt-4 text-sm md:text-base tracking-wide text-balance">
                        Everything you need to review PRs, analyze architecture, and eliminate tech debt at scale.
                    </p>
                </AnimatedContainer>
                
                <AnimatedContainer 
                    delay={0.4}
                    className="grid grid-cols-1 divide-x divide-y divide-dashed divide-white/[0.08] border border-dashed border-white/[0.08] sm:grid-cols-2 md:grid-cols-3"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </AnimatedContainer>
            </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 border-t border-white/[0.06] relative overflow-hidden bg-[#10141a]">
            {/* Subtle cyan gradient center */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(34,211,238,0.05),transparent_60%)]" />
            {/* Subtle corner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_10%_90%,rgba(148,163,184,0.04),transparent_50%)]" />
            <div className="absolute inset-0 bg-grid-pattern-small opacity-[0.025]"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How it works</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Connect your repos, and let AI handle the rest. Every PR analyzed, every architecture change tracked.
                    </p>
                </ScrollReveal>
                
                <ScrollReveal delay={0.2} className="flex justify-center">
                    <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><span className="loader"></span></div>}>
                        <DatabaseWithRestApi 
                            badgeTexts={{
                                first: "PR Created",
                                second: "Analyze",
                                third: "Review",
                                fourth: "Merge"
                            }}
                            buttonTexts={{
                                first: "AI Engine",
                                second: "Your Repos"
                            }}
                            title="Intelligent PR analysis with architecture insights"
                            circleText="AI"
                            lightColor="#3B82F6"
                            className="max-w-[600px]"
                        />
                    </Suspense>
                </ScrollReveal>
            </div>
        </section>

        {/* Dashboard Preview Section with Scroll Animation */}
        <section id="demo" className="relative overflow-hidden bg-[#12161c]">
            {/* Subtle gradient from top */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_10%,rgba(59,130,246,0.06),transparent_50%)]" />
            {/* Ambient side glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_90%_50%,rgba(148,163,184,0.035),transparent_50%)]" />
            
            <Suspense fallback={<div className="h-[50rem] md:h-[60rem] flex items-center justify-center"><span className="loader"></span></div>}>
            <ContainerScroll
                titleComponent={
                    <>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Your complete PR command center
                        </h2>
                        {/* <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Track PRs, monitor architecture health, and manage tech debt—all from one beautiful dashboard.
                        </p> */}
                    </>
                }
            >
                {/* TODO: Replace with actual dashboard screenshot */}
                <Image
                    src="/dashboard-preview.webp"
                    alt="CodeReview.ai Dashboard"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>
            </Suspense>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 border-t border-white/[0.06] relative overflow-hidden bg-[#10141a]">
            {/* Subtle purple/blue gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_30%_50%,rgba(139,92,246,0.045),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(59,130,246,0.04),transparent_60%)]" />
            <div className="absolute inset-0 bg-grid-pattern-small opacity-[0.025]"></div>
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Suspense fallback={<div className="py-16 flex items-center justify-center"><span className="loader"></span></div>}>
                    <Testimonials 
                        testimonials={[
                            {
                                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                                name: 'Marcus Chen',
                                username: '@marcuschen',
                                text: 'The architecture analysis caught a circular dependency that would have caused major issues down the line. The risk scoring on PRs is incredibly accurate.',
                                social: 'https://twitter.com'
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                                name: 'Sarah Mitchell',
                                username: '@sarahdev',
                                text: 'Our PR review time dropped from 2 days to 30 minutes. The inline comments and refactor suggestions are game-changing.',
                                social: 'https://twitter.com'
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                                name: 'James Rodriguez',
                                username: '@jamesrodriguez',
                                text: 'The tech debt tracking alone paid for itself. We reduced our debt score by 40% and can now prioritize what actually matters.',
                                social: 'https://twitter.com'
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                                name: 'Emily Watson',
                                username: '@emilywatson',
                                text: 'The AI agents are brilliant. Test Generator wrote 80% of our missing tests automatically. Security Scout catches issues we never would have found.',
                                social: 'https://twitter.com'
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                                name: 'David Kim',
                                username: '@davidkim',
                                text: 'Finally a tool that understands architecture, not just syntax. The impact maps show exactly how each PR affects the codebase.',
                                social: 'https://twitter.com'
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                                name: 'Lisa Park',
                                username: '@lisapark',
                                text: 'The dashboard gives us complete visibility into every PR across all repos. As a team lead, I can finally see the big picture.',
                                social: 'https://twitter.com'
                            }
                        ]}
                        title="Trusted by developers worldwide"
                        description="See what engineering teams are saying about CodeReview.ai"
                        maxDisplayed={6}
                    />
                </Suspense>
            </div>
        </section>

        {/* Pricing Section Wrapper */}
        <div id="pricing" className="border-t border-white/[0.03]">
          <Suspense fallback={<div className="py-16 flex items-center justify-center"><span className="loader"></span></div>}>
            <HomePricing />
          </Suspense>
        </div>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden bg-[#12161c]">
            {/* Subtle cyan center glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(34,211,238,0.05),transparent_60%)]" />
            {/* Subtle ambient corners */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_20%,rgba(59,130,246,0.04),transparent_50%)]" />
            
            <ScrollReveal className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                    Ready to transform your PR workflow?
                </h2>
                <p className="text-xl text-gray-400 mb-12">
                    Join teams who use {productName} to review PRs faster, track architecture health, and ship with confidence.
                </p>
                <Link
                    href="/auth/register"
                    className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-all"
                >
                    Get Started for Free
                </Link>
            </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.05] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <Hexagon className="w-3 h-3 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold text-white">{productName}</span>
                </div>
                <p className="text-sm text-gray-500">
                    AI-powered PR reviews and architecture analysis for modern engineering teams.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="https://github.com/Nimboo3/ai-code-reviewer" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Changelog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Resources</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="https://github.com/Nimboo3/ai-code-reviewer" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Documentation</Link></li>
                  <li><Link href="https://tanmaypatel.dev" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Blog</Link></li>
                  <li><Link href="https://github.com/Nimboo3/ai-code-reviewer" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} {productName}. All rights reserved.
              </p>
              <div className="flex gap-6">
                {/* Social icons could go here */}
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}