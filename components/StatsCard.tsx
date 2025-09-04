import React, { memo } from 'react'
// import { LucideIcon } from 'lucide-react'

type LucideIcon = React.ComponentType<{ className?: string }>

interface StatsCardProps {
  title: string
  value: string | number
  total?: string | number
  percentage?: number
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  color: 'blue' | 'purple' | 'yellow' | 'green' | 'indigo' | 'pink'
}

interface ColorClasses {
  bg: string
  shadow: string
  progress: string
}

const StatsCard = ({ title, value, total, percentage, icon: Icon, color }: StatsCardProps): React.ReactElement => {
  const colorClasses: Record<string, ColorClasses> = {
    blue: {
      bg: 'bg-blue-500',
      shadow: 'shadow-blue-500/10',
      progress: 'bg-blue-500',
    },
    purple: {
      bg: 'bg-purple-500',
      shadow: 'shadow-purple-500/10',
      progress: 'bg-purple-500',
    },
    yellow: {
      bg: 'bg-yellow-500',
      shadow: 'shadow-yellow-500/10',
      progress: 'bg-yellow-500',
    },
    green: {
      bg: 'bg-green-500',
      shadow: 'shadow-green-500/10',
      progress: 'bg-green-500',
    },
    indigo: {
      bg: 'bg-indigo-500',
      shadow: 'shadow-indigo-500/10',
      progress: 'bg-indigo-500',
    },
    pink: {
      bg: 'bg-pink-500',
      shadow: 'shadow-pink-500/10',
      progress: 'bg-pink-500',
    },
  }

  const colors = colorClasses[color] || colorClasses.blue

  const getPercentageColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-900/30 text-green-300'
    if (percentage >= 50) return 'bg-blue-900/30 text-blue-300'
    if (percentage >= 20) return 'bg-yellow-900/30 text-yellow-300'
    return 'bg-red-900/30 text-red-300'
  }

  return (
    <div className="stats-card">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${colors.bg} rounded-xl p-3 shadow-sm`}>
              {Icon && React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: "h-6 w-6 text-white" })}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">{title}</p>
            </div>
          </div>
          {percentage !== undefined && (
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium ${getPercentageColor(
                percentage
              )}`}
            >
              {percentage}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-white">
            {value}
            {total && (
              <span className="text-sm text-gray-400 ml-2 font-normal">
                of {total}
              </span>
            )}
          </div>
          {percentage !== undefined && (
            <div className="mt-1 flex items-center gap-2">
              <div className="w-full rounded-full h-1.5 bg-gray-700">
                <div
                  className={`${colors.progress} h-1.5 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(StatsCard)