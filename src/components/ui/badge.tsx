import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pilot' | 'chief' | 'success' | 'warning' | 'danger'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-grid-navy-100 text-grid-navy-700',
    pilot: 'bg-grid-cyan-100 text-grid-cyan-700',
    chief: 'bg-grid-orange-100 text-grid-orange-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-grid-red-100 text-grid-red-700',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
