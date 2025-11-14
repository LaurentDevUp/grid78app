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
    <nav className="space-y-1">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-grid-cyan-50',
              isActive
                ? 'bg-grid-cyan-100 text-grid-cyan-700 border-l-4 border-grid-cyan-500'
                : 'text-grid-navy-600 hover:text-grid-cyan-600'
            )}
          >
            <Icon className={cn('h-5 w-5', isActive && 'text-grid-cyan-600')} />
            <span>{item.title}</span>
            {item.badge && (
              <span className="ml-auto rounded-full bg-grid-orange-500 px-2 py-0.5 text-xs text-white">
                {item.badge}
              </span>
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
}

export function MobileNavigation({ userRole, onNavigate }: MobileNavigationProps) {
  return <Navigation userRole={userRole} onNavigate={onNavigate} />
}
