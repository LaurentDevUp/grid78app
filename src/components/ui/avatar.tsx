import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
}

export function Avatar({ src, alt, fallback, className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const initials = React.useMemo(() => {
    if (fallback) return fallback
    if (alt) {
      return alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return '?'
  }, [alt, fallback])

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-grid-cyan-500 text-white font-semibold text-sm">
          {initials}
        </div>
      )}
    </div>
  )
}
