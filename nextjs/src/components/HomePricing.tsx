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
          <div className="flex flex-col bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-shadow">
            <div className="flex-grow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900"></span>
                  <span className="ml-2 text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">7 code reviews per day</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 500KB file size</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All AI models available</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Review history & analytics</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <div className="h-5">&nbsp;</div>
              <div className="h-6">&nbsp;</div>
              <Link
                href="/auth/register"
                className="block w-full py-3 px-6 text-center font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white hover:shadow-2xl transition-shadow relative">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              MVP Demo
            </div>

            <div className="flex-grow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold"></span>
                  <span className="ml-2 opacity-90">/month</span>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Unlimited code reviews</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Up to 10MB file size</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Priority AI processing</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Advanced analytics</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <div className="h-5 text-center text-sm opacity-90">
                Payment integration coming soon
              </div>
              <div className="h-6 text-center text-xs opacity-75">
                Currently in MVP demo mode
              </div>
              <button
                disabled
                className="block w-full py-3 px-6 text-center font-semibold bg-white/20 rounded-lg cursor-not-allowed opacity-75"
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
