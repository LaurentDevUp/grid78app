'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'pilot' | 'chief'
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        const currentPath = window.location.pathname
        const redirectUrl = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`
        router.push(redirectUrl)
        return
      }

      // Check role requirement
      if (requiredRole && profile?.role !== requiredRole) {
        router.push('/dashboard') // Redirect to dashboard if wrong role
      }
    }
  }, [user, profile, loading, requiredRole, redirectTo, router])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-grid-cyan-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-grid-cyan-500"></div>
          <p className="mt-4 text-grid-navy-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null
  }

  // Wrong role
  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-grid-cyan-50 to-white px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-grid-navy-600 mb-2">
            Accès refusé
          </h2>
          <p className="text-grid-navy-500 mb-6">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-grid-cyan-500 hover:bg-grid-cyan-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    )
  }

  // Authenticated and authorized
  return <>{children}</>
}

// HOC helper
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
