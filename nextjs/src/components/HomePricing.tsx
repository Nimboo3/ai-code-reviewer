"use client";

import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Staggered card animation wrapper
function PricingCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePricing() {
  const [isYearly, setIsYearly] = useState(false);

  const pricing = {
    free: {
      monthly: 0,
      yearly: 0,
    },
    pro: {
      monthly: 29,
      yearly: 24, // ~17% discount
    },
    enterprise: {
      monthly: 99,
      yearly: 79, // ~20% discount
    }
  };

  return (
    <div className="py-16 relative overflow-hidden">
      {/* Static gradient background matching beam hues */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_20%,rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_30%_80%,rgba(6,182,212,0.05),transparent_45%)]" />
      {/* Background Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-gray-400 mb-6">
            Start free, upgrade when you scale.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-white" : "text-gray-400")}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={cn("text-sm font-medium transition-colors flex items-center gap-2", isYearly ? "text-white" : "text-gray-400")}>
              Yearly
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Free Tier */}
          <PricingCard index={0}>
            <div className="flex flex-col relative rounded-lg bg-card border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300 group h-full">
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none rounded-xl"></div>
            <div className="flex-grow relative z-10">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-3 h-12">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-base text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-400">Perfect for individual developers.</p>
              </div>

              <div className="space-y-2.5 mb-6">
                {[
                    '10 reviews per day',
                    'Access to basic models',
                    '500KB file size limit',
                    'Basic analytics'
                ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                ))}
              </div>
            </div>

            <Link
                href="/auth/register"
                className="relative z-10 block w-full py-3 px-5 text-center text-sm font-semibold text-white border border-white/[0.12] rounded-md hover:bg-white/5 hover:border-white/20 transition-all duration-200"
            >
                Start Free
            </Link>
            </div>
          </PricingCard>

          {/* Pro Tier */}
          <PricingCard index={1}>
            <div className="flex flex-col relative rounded-lg bg-card border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300 group h-full">
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none rounded-xl"></div>
            <div className="flex-grow relative z-10">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-3 h-12 overflow-hidden">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">$</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={isYearly ? "yearly" : "monthly"}
                            initial={{ y: isYearly ? -20 : 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: isYearly ? 20 : -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-4xl font-bold text-white"
                        >
                            {isYearly ? pricing.pro.yearly : pricing.pro.monthly}
                        </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-base text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-400">For power users and teams.</p>
              </div>

              <div className="space-y-2.5 mb-6">
                {[
                    'Unlimited reviews',
                    'Access to GPT-4 & Claude 3.5',
                    '10MB file size limit',
                    'Priority processing',
                    'Advanced security checks'
                ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-white mt-0.5 shrink-0" />
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                ))}
              </div>
            </div>

            <a
                href="https://github.com/Nimboo3"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 block w-full py-3 px-5 text-center text-sm font-bold text-black bg-white rounded-md hover:bg-gray-100 transition-all duration-200"
            >
                Get Pro
            </a>
            </div>
          </PricingCard>

          {/* Enterprise Tier */}
          <PricingCard index={2}>
            <div className="flex flex-col relative rounded-lg bg-white/[0.03] border border-white/[0.1] p-6 hover:border-white/[0.18] transition-all duration-300 group shadow-2xl h-full">
            <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none rounded-xl"></div>
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="flex-grow relative z-10">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">Enterprise</h3>
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-white text-black uppercase tracking-wider">
                        Best Value
                    </span>
                </div>
                <div className="flex items-baseline gap-1 mb-3 h-12 overflow-hidden">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">$</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={isYearly ? "yearly" : "monthly"}
                            initial={{ y: isYearly ? -20 : 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: isYearly ? 20 : -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-4xl font-bold text-white"
                        >
                            {isYearly ? pricing.enterprise.yearly : pricing.enterprise.monthly}
                        </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-base text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-400">For large organizations.</p>
              </div>

              <div className="space-y-2.5 mb-6">
                {[
                    'Everything in Pro',
                    'SSO & SAML Integration',
                    'Custom AI Model Fine-tuning',
                    'Dedicated Success Manager',
                    'SLA & Priority Support',
                    'On-premise Deployment'
                ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-200">{feature}</span>
                    </div>
                ))}
              </div>
            </div>

            <a
                href="https://github.com/Nimboo3"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 block w-full py-3 px-5 text-center text-sm font-bold text-white bg-white/10 border border-white/[0.08] rounded-md hover:bg-white/15 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
                Contact Sales
            </a>
            </div>
          </PricingCard>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            All prices in USD. Free tier resets daily. No credit card required for free tier.
          </p>
        </div>
      </div>
    </div>
  );
}
