'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from '@/components/ui/toast'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache strategy
            staleTime: 2 * 60 * 1000, // 2 minutes - data considered fresh
            gcTime: 5 * 60 * 1000, // 5 minutes - cache garbage collection
            
            // Refetch strategy
            refetchOnWindowFocus: false, // Disable auto refetch on focus
            refetchOnMount: true, // Refetch on component mount if stale
            refetchOnReconnect: true, // Refetch on network reconnect
            
            // Retry strategy
            retry: 1, // Only retry once on failure
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Optimistic updates enabled by default
            retry: false, // Don't retry mutations
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  )
}
