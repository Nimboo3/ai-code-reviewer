import type { ReviewMetrics } from '@/lib/types'

interface MetricsChartProps {
  metrics: ReviewMetrics
}

export function MetricsChart({ metrics }: MetricsChartProps) {
  const items = [
    { label: 'Complexity', value: metrics.complexity, max: 10, description: 'Lower is better', type: 'complexity' as const },
    { label: 'Maintainability', value: metrics.maintainability, max: 100, description: 'Ease of modification', type: 'normal' as const },
    { label: 'Readability', value: metrics.readability, max: 100, description: 'Code clarity', type: 'normal' as const },
    { label: 'Testability', value: metrics.testability, max: 100, description: 'Ease of testing', type: 'normal' as const },
    { label: 'Security', value: metrics.security, max: 100, description: 'Production readiness', type: 'normal' as const },
  ]

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percentage = (item.value / item.max) * 100
        const isComplexity = item.type === 'complexity'
        const displayValue = isComplexity ? `${item.value}/10` : `${item.value}%`
        
        // Get appropriate color based on score
        const getBarColor = () => {
          if (isComplexity) {
            // For complexity, lower is better
            if (item.value <= 3) return 'bg-emerald-500'
            if (item.value <= 6) return 'bg-yellow-500'
            return 'bg-red-500'
          }
          // For other metrics, higher is better
          if (percentage >= 80) return 'bg-emerald-500'
          if (percentage >= 60) return 'bg-blue-500'
          if (percentage >= 40) return 'bg-yellow-500'
          return 'bg-orange-500'
        }

        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-semibold text-slate-300">{item.label}</span>
                <span className="text-xs text-slate-500 ml-2">({item.description})</span>
              </div>
              <span className="text-sm font-bold text-slate-100">{displayValue}</span>
            </div>
            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/40">
              <div
                className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
