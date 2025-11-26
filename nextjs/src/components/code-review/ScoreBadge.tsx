import type { ReviewGrade } from '@/lib/types'

interface ScoreBadgeProps {
  grade: ReviewGrade
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBadge({ grade, score, size = 'md' }: ScoreBadgeProps) {
  const colors: Record<ReviewGrade, string> = {
    'A+': 'from-emerald-500 to-green-600',
    'A': 'from-green-500 to-emerald-600',
    'B': 'from-blue-500 to-cyan-600',
    'C': 'from-yellow-500 to-orange-500',
    'D': 'from-orange-500 to-red-500',
    'F': 'from-red-600 to-rose-700',
  }

  const sizes = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
  }

  return (
    <div className={`relative ${sizes[size]} flex items-center justify-center`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[grade]} rounded-full opacity-20 blur-xl`}></div>
      <div className={`relative ${sizes[size]} bg-gradient-to-br ${colors[grade]} rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl border-4 border-slate-800/40`}>
        <div className="leading-none">{grade}</div>
        <div className="text-xs font-normal opacity-90">{score}/100</div>
      </div>
    </div>
  )
}
