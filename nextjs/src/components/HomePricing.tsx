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
          {/* Free Tier - Minimal Clean Design */}
          <div className="flex flex-col relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 shadow-lg p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex-grow">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Free</h3>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-6xl font-extrabold text-gray-900">$0</span>
                  <span className="ml-2 text-gray-500 text-lg">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:bg-gray-200 transition-colors">
                    <Check className="h-3 w-3 text-gray-700" />
                  </div>
                  <span className="text-gray-700 font-medium">7 code reviews per day</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:bg-gray-200 transition-colors">
                    <Check className="h-3 w-3 text-gray-700" />
                  </div>
                  <span className="text-gray-700 font-medium">Up to 500KB file size</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:bg-gray-200 transition-colors">
                    <Check className="h-3 w-3 text-gray-700" />
                  </div>
                  <span className="text-gray-700 font-medium">All AI models available</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:bg-gray-200 transition-colors">
                    <Check className="h-3 w-3 text-gray-700" />
                  </div>
                  <span className="text-gray-700 font-medium">Review history & analytics</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <div className="h-5 mb-1">&nbsp;</div>
              <div className="h-6 mb-4">&nbsp;</div>
              <Link
                href="/auth/register"
                className="block w-full py-4 px-6 text-center font-bold text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Premium Tier - Sleek Dark Theme */}
          <div className="flex flex-col relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-700 shadow-2xl p-8 text-white hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
            
            {/* MVP Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                MVP Demo
              </div>
            </div>

            <div className="flex-grow relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Premium</h3>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">$29</span>
                  <span className="ml-2 text-gray-400 text-lg">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Unlimited code reviews</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Up to 10MB file size</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Priority AI processing</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Advanced analytics</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 relative z-10">
              <div className="h-5 text-center text-sm text-gray-400 mb-1">
                Payment integration coming soon
              </div>
              <div className="h-6 text-center text-xs text-gray-500 mb-4">
                Currently in MVP demo mode
              </div>
              <button
                disabled
                className="block w-full py-4 px-6 text-center font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl cursor-not-allowed opacity-50"
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
