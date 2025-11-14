'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  User,
  Calendar,
  Plane,
  GraduationCap,
  ShieldAlert,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react'
import type { Database } from '@/types/database.types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredRole?: UserRole
  badge?: string
}

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Mon Profil',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Planning',
    href: '/planning',
    icon: Calendar,
  },
  {
    title: 'Missions',
    href: '/missions',
    icon: Plane,
  },
  {
    title: 'Formations',
    href: '/trainings',
    icon: GraduationCap,
  },
  {
    title: 'Sécurité',
    href: '/safety',
    icon: ShieldAlert,
  },
  {
    title: 'Équipe',
    href: '/team',
    icon: Users,
    requiredRole: 'chief',
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
    requiredRole: 'chief',
  },
]

interface NavigationProps {
  userRole?: UserRole | null
  onNavigate?: () => void
}

export function Navigation({ userRole, onNavigate }: NavigationProps) {
  const pathname = usePathname()

  const filteredItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return userRole === item.requiredRole
  })

  return (
    <nav className="space-y-1.5 px-2 md:px-3">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
              'hover:scale-[1.02] active:scale-[0.98]',
              'md:px-4 md:py-2.5',
              isActive
                ? 'bg-gradient-to-r from-grid-cyan-500 to-grid-cyan-600 text-white shadow-lg shadow-grid-cyan-500/30'
                : 'text-grid-navy-600 hover:bg-grid-cyan-50 hover:text-grid-cyan-700 dark:text-gray-300 dark:hover:bg-grid-navy-700/50'
            )}
          >
            {/* Indicateur actif */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-r-full shadow-md" />
            )}
            
            {/* Icône avec animation */}
            <div className={cn(
              'flex items-center justify-center rounded-lg p-1.5 transition-all',
              isActive 
                ? 'bg-white/20' 
                : 'group-hover:bg-grid-cyan-100 dark:group-hover:bg-grid-navy-600'
            )}>
              <Icon className={cn(
                'h-5 w-5 transition-all duration-200',
                isActive 
                  ? 'text-white scale-110' 
                  : 'text-grid-navy-500 group-hover:text-grid-cyan-600 group-hover:scale-110 dark:text-gray-400'
              )} />
            </div>

            {/* Titre */}
            <span className={cn(
              'flex-1 font-semibold transition-all',
              isActive ? 'text-white' : 'group-hover:translate-x-0.5'
            )}>
              {item.title}
            </span>

            {/* Badge */}
            {item.badge && (
              <span className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm transition-all',
                isActive
                  ? 'bg-white text-grid-cyan-600'
                  : 'bg-grid-orange-500 text-white group-hover:scale-110'
              )}>
                {item.badge}
              </span>
            )}

            {/* Chevron pour indicateur visuel */}
            <ChevronRight className={cn(
              'h-4 w-4 transition-all duration-200',
              isActive 
                ? 'text-white opacity-100 translate-x-0' 
                : 'text-grid-cyan-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
            )} />

            {/* Effet de brillance au hover */}
            {!isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-grid-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

interface MobileNavigationProps {
  userRole?: UserRole | null
  onNavigate?: () => void
  variant?: 'sidebar' | 'bottom'
}

export function MobileNavigation({ 
  userRole, 
  onNavigate,
  variant = 'sidebar'
}: MobileNavigationProps) {
  const pathname = usePathname()

  const filteredItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return userRole === item.requiredRole
  })

  // Version bottom bar pour mobile
  if (variant === 'bottom') {
    // Limiter à 5 items principaux pour la bottom bar
    const mainItems = filteredItems.slice(0, 5)
    
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-grid-navy-800 border-t-2 border-grid-cyan-500/20 shadow-2xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-bottom">
          {mainItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 flex-1 max-w-[80px]',
                  'active:scale-95',
                  isActive
                    ? 'text-grid-cyan-600 dark:text-grid-cyan-400'
                    : 'text-grid-navy-400 dark:text-gray-500'
                )}
              >
                {/* Indicateur actif en haut */}
                {isActive && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-grid-cyan-500 to-grid-cyan-600 rounded-full shadow-lg shadow-grid-cyan-500/50" />
                )}

                {/* Conteneur icône avec effet */}
                <div className={cn(
                  'relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-br from-grid-cyan-500 to-grid-cyan-600 shadow-lg shadow-grid-cyan-500/30 scale-110'
                    : 'hover:bg-grid-cyan-50 dark:hover:bg-grid-navy-700'
                )}>
                  <Icon className={cn(
                    'h-5 w-5 transition-all',
                    isActive ? 'text-white' : 'text-current'
                  )} />
                  
                  {/* Badge pour la bottom bar */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-grid-orange-500 text-[10px] font-bold text-white shadow-md">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label (caché sur très petits écrans) */}
                <span className={cn(
                  'text-[10px] font-semibold transition-all text-center leading-tight hidden xs:block',
                  isActive ? 'text-grid-cyan-600 dark:text-grid-cyan-400' : ''
                )}>
                  {item.title}
                </span>

                {/* Effet de pulse pour l'item actif */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-grid-cyan-500/10 animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  // Version sidebar pour mobile (dans le drawer/menu)
  return <Navigation userRole={userRole} onNavigate={onNavigate} />
}
