"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [isYearly, setIsYearly] = useState(false);

  const pricing = {
    free: {
      monthly: 0,
      yearly: 0,
    },
    pro: {
      monthly: 29,
      yearly: 24,
    },
    enterprise: {
      monthly: 99,
      yearly: 79,
    }
  };

  const githubProfile = "https://github.com/Nimboo3";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-10 lg:inset-16 z-50 overflow-auto"
          >
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="relative w-full max-w-5xl bg-[#12141a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Upgrade Your Plan
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Choose the plan that fits your needs
                    </p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4">
                      <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-white" : "text-gray-500")}>
                        Monthly
                      </span>
                      <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative w-12 h-6 rounded-full bg-white/10 border border-white/10 transition-colors hover:bg-white/15"
                      >
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                          animate={{ x: isYearly ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                      <span className={cn("text-sm font-medium transition-colors flex items-center gap-2", isYearly ? "text-white" : "text-gray-500")}>
                        Yearly
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Save 20%
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Free Tier */}
                    <div className="flex flex-col rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all">
                      <div className="flex-grow">
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-white mb-1">Free</h3>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-3xl font-bold text-white">$0</span>
                            <span className="text-sm text-gray-500">/month</span>
                          </div>
                          <p className="text-xs text-gray-500">For individual developers</p>
                        </div>

                        <div className="space-y-2 mb-5">
                          {['10 reviews per day', 'Basic models', '500KB file limit', 'Basic analytics'].map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                              <span className="text-sm text-gray-400">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="py-2.5 px-4 text-center text-sm font-medium text-gray-400 border border-white/[0.06] rounded-lg bg-white/[0.02]">
                        Current Plan
                      </div>
                    </div>

                    {/* Pro Tier */}
                    <div className="flex flex-col rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/[0.15] transition-all">
                      <div className="flex-grow">
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-3xl font-bold text-white">
                              ${isYearly ? pricing.pro.yearly : pricing.pro.monthly}
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                          </div>
                          <p className="text-xs text-gray-500">For power users and teams</p>
                        </div>

                        <div className="space-y-2 mb-5">
                          {['Unlimited reviews', 'GPT-4 & Claude 3.5', '10MB file limit', 'Priority processing', 'Advanced security'].map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-white mt-0.5 shrink-0" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a
                        href={githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 px-4 text-center text-sm font-bold text-black bg-white rounded-lg hover:bg-gray-100 transition-all"
                      >
                        Get Pro
                      </a>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="flex flex-col relative rounded-xl bg-white/[0.04] border border-white/[0.12] p-5 hover:border-white/[0.2] transition-all shadow-lg">
                      <span className="absolute -top-2 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black uppercase tracking-wider">
                        Best Value
                      </span>
                      
                      <div className="flex-grow">
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-white mb-1">Enterprise</h3>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-3xl font-bold text-white">
                              ${isYearly ? pricing.enterprise.yearly : pricing.enterprise.monthly}
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                          </div>
                          <p className="text-xs text-gray-500">For large organizations</p>
                        </div>

                        <div className="space-y-2 mb-5">
                          {['Everything in Pro', 'SSO & SAML', 'Custom AI fine-tuning', 'Dedicated support', 'On-premise option'].map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                              <span className="text-sm text-gray-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a
                        href={githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-white/10 border border-white/[0.08] rounded-lg hover:bg-white/15 transition-all"
                      >
                        Contact Sales
                      </a>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-xs text-gray-600">
                    All prices in USD. Free tier resets daily. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
