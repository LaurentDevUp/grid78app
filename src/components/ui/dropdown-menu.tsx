'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
}

export function DropdownMenu({ children, trigger }: DropdownMenuProps) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
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
        'flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left',
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
  return <div className="my-1 h-px bg-gray-200" />
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </div>
  )
}
