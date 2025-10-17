"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export default function HomePricing() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier - Modern Light Design */}
          <div className="flex flex-col relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-xl p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex-grow relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Free</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-extrabold text-gray-900">$0</span>
                  <span className="text-xl text-gray-500 font-medium">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Perfect to get started</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">7 reviews per day</p>
                    <p className="text-sm text-gray-600">Daily limit resets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Limited AI models</p>
                    <p className="text-sm text-gray-600">Access to basic models</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">500KB file size</p>
                    <p className="text-sm text-gray-600">Small to medium files</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Basic analytics</p>
                    <p className="text-sm text-gray-600">Review history tracking</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                href="/auth/register"
                className="block w-full py-4 px-6 text-center font-bold text-blue-600 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Premium Tier - Premium Light Design */}
          <div className="flex flex-col relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 border-2 border-purple-300 shadow-2xl p-8 hover:shadow-purple-300/50 hover:scale-[1.02] transition-all duration-300 group">
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* MVP Badge */}
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xl">
                MVP Demo
              </div>
            </div>

            <div className="flex-grow relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Premium</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$2</span>
                  <span className="text-xl text-gray-700 font-medium">/month</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Best value for developers</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Unlimited reviews</p>
                    <p className="text-sm text-gray-700">No daily limits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">All AI models</p>
                    <p className="text-sm text-gray-700">Including latest models</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">10MB file size</p>
                    <p className="text-sm text-gray-700">Large project support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Priority processing</p>
                    <p className="text-sm text-gray-700">Faster review times</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3">
              <p className="text-center text-sm text-gray-600">
                Payment integration coming soon
              </p>
              <button
                disabled
                className="block w-full py-4 px-6 text-center font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl cursor-not-allowed opacity-75 hover:opacity-90 transition-opacity shadow-lg"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            All prices in USD. Free tier resets daily. No credit card required for free tier.
          </p>
        </div>
      </div>
    </div>
  );
}
