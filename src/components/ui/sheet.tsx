'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-white shadow-lg">
        {children}
      </div>
    </>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
}

export function SheetContent({ children, className }: SheetContentProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      {children}
    </div>
  )
}

interface SheetHeaderProps {
  children: React.ReactNode
  onClose?: () => void
}

export function SheetHeader({ children, onClose }: SheetHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4">
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  )
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

export function SheetTitle({ children, className }: SheetTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h2>
  )
}

interface SheetBodyProps {
  children: React.ReactNode
  className?: string
}

export function SheetBody({ children, className }: SheetBodyProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto p-4', className)}>
      {children}
    </div>
  )
}
