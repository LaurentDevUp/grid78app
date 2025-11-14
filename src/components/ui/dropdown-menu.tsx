'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  align?: 'left' | 'right'
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
}

export function DropdownMenu({ 
  children, 
  trigger, 
  align = 'right',
  side = 'bottom',
  sideOffset = 8 
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const positionClasses = (() => {
    switch (side) {
      case 'top':
        return align === 'left'
          ? 'left-0 bottom-full mb-2 origin-bottom-left'
          : 'right-0 bottom-full mb-2 origin-bottom-right'
      case 'right':
        return align === 'left'
          ? 'top-0 left-full origin-top-left'
          : 'bottom-0 left-full origin-bottom-left'
      case 'left':
        return align === 'left'
          ? 'top-0 right-full origin-top-right'
          : 'bottom-0 right-full origin-bottom-right'
      case 'bottom':
      default:
        return align === 'left'
          ? 'left-0 top-full mt-2 origin-top-left'
          : 'right-0 top-full mt-2 origin-top-right'
    }
  })()

  const offsetStyles = (() => {
    const value = `${sideOffset}px`
    switch (side) {
      case 'top':
        return { marginBottom: value }
      case 'right':
        return { marginLeft: value }
      case 'left':
        return { marginRight: value }
      case 'bottom':
      default:
        return { marginTop: value }
    }
  })()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none w-full"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>

      {isOpen && (
        <div 
          className={cn(
            'absolute w-56 rounded-xl bg-white dark:bg-grid-navy-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-[100] border border-gray-200 dark:border-grid-navy-700',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            positionClasses
          )}
          style={offsetStyles}
        >
          <div className="py-2" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function DropdownMenuItem({
  children,
  className,
  asChild = false,
  ...props
}: DropdownMenuItemProps) {
  const Component = asChild ? 'div' : 'button'
  
  return (
    <Component
      className={cn(
        'flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-grid-cyan-50 dark:hover:bg-grid-navy-700 hover:text-grid-cyan-700 dark:hover:text-grid-cyan-400 transition-colors text-left rounded-lg mx-1',
        asChild ? '' : 'cursor-pointer',
        className
      )}
      role="menuitem"
      {...(asChild ? {} : props)}
    >
      {children}
    </Component>
  )
}

export function DropdownMenuSeparator() {
  return <div className="my-1 mx-2 h-px bg-gray-200 dark:bg-grid-navy-700" />
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {children}
    </div>
  )
}
