import type { IssueSeverity } from '@/lib/types'

interface SeverityBadgeProps {
  severity: IssueSeverity
  count?: number
}

export function SeverityBadge({ severity, count }: SeverityBadgeProps) {
  const config = {
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '🔴',
      label: 'Critical',
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: '🟠',
      label: 'High',
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: '🟡',
      label: 'Medium',
    },
    low: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: '🔵',
      label: 'Low',
    },
    info: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
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
