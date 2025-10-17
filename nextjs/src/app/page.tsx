import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Shield, Users, Key, Database, Clock } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import HomePricing from "@/components/HomePricing";

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'CodeReviewAI';

  const features = [
    {
      icon: Shield,
      title: 'Robust Authentication',
      description: 'Secure login with email/password, Multi-Factor Authentication, and SSO providers',
      color: 'text-green-600'
    },
    {
      icon: Database,
      title: 'File Management',
      description: 'Built-in file storage with secure sharing, downloads, and granular permissions',
      color: 'text-orange-600'
    },
    {
      icon: Users,
      title: 'User Settings',
      description: 'Complete user management with password updates, MFA setup, and profile controls',
      color: 'text-red-600'
    },
    {
      icon: Clock,
      title: 'Task Management',
      description: 'Built-in todo system with real-time updates and priority management',
      color: 'text-teal-600'
    },
    {
      icon: Globe,
      title: 'Legal Documents',
      description: 'Pre-configured privacy policy, terms of service, and refund policy pages',
      color: 'text-purple-600'
    },
    {
      icon: Key,
      title: 'Cookie Consent',
      description: 'GDPR-compliant cookie consent system with customizable preferences',
      color: 'text-blue-600'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Organizations', value: '2K+' },
    { label: 'Countries', value: '50+' },
    { label: 'Uptime', value: '99.9%' }
  ];

  return (
      <div className="min-h-screen mesh-background">
        <nav className="fixed top-0 w-full glass z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
              <span className="text-2xl font-bold gradient-text animate-fade-in">
                {productName}
              </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Features
                </Link>

                <Link href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Pricing
                </Link>
                <Link
                    href="https://github.com/Nimboo3/ai-code-reviewer"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  Documentation
                </Link>

                <Link
                    href="https://github.com/Nimboo3/ai-code-reviewer"
                    className="gradient-bg-primary text-white px-4 py-2 rounded-lg hover-glow transition-all duration-200 shadow-md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  View source
                </Link>

                <AuthAwareButtons variant="nav" />
              </div>
            </div>
          </div>
        </nav>

        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block animate-slide-up">
                <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
                  ✨ Powered by Advanced AI
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up-delayed">
                AI-powered Code Reviews
                <span className="block gradient-text mt-2">Catch bugs faster, ship with confidence</span>
              </h1>
              <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed">
                {productName} helps teams automate code review with context-aware suggestions, security checks, and actionable feedback — seamlessly integrated into your workflow.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delayed">
                <AuthAwareButtons />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                  <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="text-4xl md:text-5xl font-bold gradient-text">{stat.value}</div>
                    <div className="mt-3 text-sm font-medium text-gray-600">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Everything You Need</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Built with modern technologies for reliability and speed
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className="glass p-8 rounded-2xl hover-lift group"
                  >
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <HomePricing />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg-primary opacity-95"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Idea into Reality?
            </h2>
                <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto">
              Join teams using {productName} to accelerate reviews and improve code quality
            </p>
            <Link
                href="/auth/register"
                className="mt-10 inline-flex items-center px-8 py-4 rounded-xl bg-white text-primary-600 font-semibold hover-lift hover-scale shadow-xl transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Resources</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="https://github.com/Nimboo3/ai-code-reviewer" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        Documentation
                      </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/legal/privacy" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600">
                © {new Date().getFullYear()} {productName}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}