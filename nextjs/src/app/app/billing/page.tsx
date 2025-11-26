'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';

// Mock billing data
const mockBillingData = {
  currentPlan: 'Pro',
  billingCycle: 'monthly',
  nextBillingDate: 'January 15, 2025',
  monthlySpend: 29,
  tokenUsage: {
    used: 847500,
    limit: 1000000,
    percentage: 84.75,
  },
  prReviews: {
    used: 156,
    limit: 500,
    percentage: 31.2,
  },
  projects: {
    used: 5,
    limit: 10,
    percentage: 50,
  },
  agents: {
    used: 3,
    limit: 5,
    percentage: 60,
  },
};

// Mock invoice history
const mockInvoices = [
  { id: 'INV-2024-012', date: 'Dec 15, 2024', amount: 29.00, status: 'paid', plan: 'Pro' },
  { id: 'INV-2024-011', date: 'Nov 15, 2024', amount: 29.00, status: 'paid', plan: 'Pro' },
  { id: 'INV-2024-010', date: 'Oct 15, 2024', amount: 29.00, status: 'paid', plan: 'Pro' },
  { id: 'INV-2024-009', date: 'Sep 15, 2024', amount: 0.00, status: 'paid', plan: 'Free Trial' },
];

// Mock plans
const plans = [
  {
    name: 'Free',
    price: 0,
    priceYearly: 0,
    features: [
      '3 Projects',
      '50 PR reviews/month',
      '100K tokens/month',
      'Basic code review',
      'Community support',
    ],
    current: false,
  },
  {
    name: 'Pro',
    price: 29,
    priceYearly: 290,
    features: [
      '10 Projects',
      '500 PR reviews/month',
      '1M tokens/month',
      'Advanced AI review',
      'Architecture analysis',
      '5 Agents',
      'Priority support',
      'API access',
    ],
    current: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    priceYearly: 990,
    features: [
      'Unlimited projects',
      'Unlimited PR reviews',
      '10M tokens/month',
      'Custom agents',
      'SSO/SAML',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
    ],
    current: false,
  },
];

export default function BillingPage() {
  const { showComingSoon } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Billing & Usage</h1>
        <p className="text-slate-400">Manage your subscription and monitor usage</p>
      </div>

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#151922] rounded-xl p-5 border border-cyan-500/30">
          <div className="text-sm text-slate-400 mb-1">Current Plan</div>
          <div className="text-2xl font-bold text-cyan-400">{mockBillingData.currentPlan}</div>
          <div className="text-xs text-slate-500 mt-1">Next billing: {mockBillingData.nextBillingDate}</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Monthly Spend</div>
          <div className="text-2xl font-bold text-white">${mockBillingData.monthlySpend}</div>
          <div className="text-xs text-slate-500 mt-1">Billed monthly</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">Token Usage</div>
          <div className="text-2xl font-bold text-white">{mockBillingData.tokenUsage.percentage.toFixed(1)}%</div>
          <div className="text-xs text-slate-500 mt-1">{(mockBillingData.tokenUsage.used / 1000).toFixed(0)}K / {(mockBillingData.tokenUsage.limit / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-[#151922] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-sm text-slate-400 mb-1">PR Reviews</div>
          <div className="text-2xl font-bold text-white">{mockBillingData.prReviews.used}</div>
          <div className="text-xs text-slate-500 mt-1">of {mockBillingData.prReviews.limit} this month</div>
        </div>
      </div>

      {/* Usage Details */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06] mb-6">
        <h3 className="text-white font-medium text-lg mb-4">Usage This Month</h3>
        <div className="space-y-4">
          {/* Token Usage */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">AI Tokens</span>
              <span className="text-slate-200">
                {(mockBillingData.tokenUsage.used / 1000).toFixed(0)}K / {(mockBillingData.tokenUsage.limit / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="h-3 bg-[#101318] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getUsageColor(mockBillingData.tokenUsage.percentage)}`}
                style={{ width: `${mockBillingData.tokenUsage.percentage}%` }}
              />
            </div>
            {mockBillingData.tokenUsage.percentage >= 80 && (
              <p className="text-xs text-yellow-400 mt-1">⚠️ Approaching limit - consider upgrading</p>
            )}
          </div>

          {/* PR Reviews */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">PR Reviews</span>
              <span className="text-slate-200">
                {mockBillingData.prReviews.used} / {mockBillingData.prReviews.limit}
              </span>
            </div>
            <div className="h-3 bg-[#101318] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getUsageColor(mockBillingData.prReviews.percentage)}`}
                style={{ width: `${mockBillingData.prReviews.percentage}%` }}
              />
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Projects</span>
              <span className="text-slate-200">
                {mockBillingData.projects.used} / {mockBillingData.projects.limit}
              </span>
            </div>
            <div className="h-3 bg-[#101318] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getUsageColor(mockBillingData.projects.percentage)}`}
                style={{ width: `${mockBillingData.projects.percentage}%` }}
              />
            </div>
          </div>

          {/* Agents */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Active Agents</span>
              <span className="text-slate-200">
                {mockBillingData.agents.used} / {mockBillingData.agents.limit}
              </span>
            </div>
            <div className="h-3 bg-[#101318] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getUsageColor(mockBillingData.agents.percentage)}`}
                style={{ width: `${mockBillingData.agents.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Plans</h3>
          <div className="flex items-center gap-2 bg-[#151922] rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                billingCycle === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                billingCycle === 'yearly' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly <span className="text-green-400 text-xs">-17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#151922] rounded-xl p-5 border relative ${
                plan.current ? 'border-cyan-500/50' : 'border-white/[0.06]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-600 rounded-full text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-green-600 rounded-full text-xs font-medium text-white">
                  Current
                </div>
              )}
              <h4 className="text-white font-medium text-lg mb-2">{plan.name}</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">
                  ${billingCycle === 'monthly' ? plan.price : plan.priceYearly}
                </span>
                <span className="text-slate-400 text-sm">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <button
                  onClick={() => showComingSoon()}
                  className="w-full py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium cursor-default"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => showComingSoon()}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {plan.price > (plans.find(p => p.current)?.price || 0) ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06] mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Invoice History</h3>
          <button
            onClick={() => showComingSoon()}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Download All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Invoice</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-white/[0.04]">
                  <td className="py-3 px-4 text-sm text-slate-200 font-mono">{invoice.id}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">{invoice.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">{invoice.plan}</td>
                  <td className="py-3 px-4 text-sm text-slate-200">${invoice.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => showComingSoon()}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-[#151922] rounded-xl p-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Payment Method</h3>
          <button
            onClick={() => showComingSoon()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Update
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-[#101318] border border-white/[0.04]">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div>
            <div className="text-slate-200 text-sm">•••• •••• •••• 4242</div>
            <div className="text-slate-500 text-xs">Expires 12/26</div>
          </div>
          <span className="ml-auto px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
            Default
          </span>
        </div>
      </div>
    </div>
  );
}
