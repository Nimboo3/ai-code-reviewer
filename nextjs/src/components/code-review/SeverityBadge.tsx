import type { IssueSeverity } from '@/lib/types'

interface SeverityBadgeProps {
  severity: IssueSeverity
  count?: number
}

interface SeverityConfig {
  bg: string
  text: string
  border: string
  icon: string
  label: string
}

export function SeverityBadge({ severity, count }: SeverityBadgeProps) {
  const config: Record<IssueSeverity, SeverityConfig> = {
    critical: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      icon: '🔴',
      label: 'Critical',
    },
    high: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      icon: '🟠',
      label: 'High',
    },
    medium: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      icon: '🟡',
      label: 'Medium',
    },
    low: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: '🔵',
      label: 'Low',
    },
    info: {
      bg: 'bg-white/[0.05]',
      text: 'text-gray-400',
      border: 'border-white/[0.1]',
      icon: 'ℹ️',
      label: 'Info',
    },
  }

  const { bg, text, border, icon, label } = config[severity]

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${bg} ${text} ${border} text-sm font-medium`}>
      <span>{icon}</span>
      <span>{label}</span>
      {typeof count === 'number' && <span className="ml-1 font-bold">({count})</span>}
    </span>
  )
}
