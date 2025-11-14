# 💡 Navigation - Exemples Pratiques

Collection d'exemples de code prêts à l'emploi pour la navigation GRID 78 v2.0.

---

## 🚀 Exemple 1 : Layout Standard

Le cas le plus courant - utilisation du MainLayout complet.

```tsx
// src/app/dashboard/page.tsx
import { MainLayout } from '@/components/layout/MainLayout'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-grid-navy-700">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Vos cartes ici */}
        </div>
      </div>
    </MainLayout>
  )
}
```

**Résultat :**
- ✅ Sidebar desktop automatique
- ✅ Bottom bar mobile automatique
- ✅ Header mobile avec burger
- ✅ Gestion du rôle utilisateur
- ✅ Dark mode supporté

---

## 📱 Exemple 2 : Bottom Bar Personnalisée

Utiliser uniquement la bottom bar mobile avec votre propre layout.

```tsx
// src/app/layout.tsx
'use client'

import { MobileNavigation } from '@/components/layout/Navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function RootLayout({ children }) {
  const { profile } = useAuth()

  return (
    <html lang="fr">
      <body>
        {/* Votre header personnalisé */}
        <header className="h-16 border-b">
          {/* ... */}
        </header>

        {/* Contenu avec padding pour la bottom bar */}
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>

        {/* Bottom bar mobile uniquement */}
        <MobileNavigation 
          userRole={profile?.role}
          variant="bottom"
        />
      </body>
    </html>
  )
}
```

---

## 🎯 Exemple 3 : Drawer Menu Custom

Créer un drawer menu avec la navigation sidebar.

```tsx
// src/components/MobileMenu.tsx
'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MobileNavigation } from '@/components/layout/Navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { profile } = useAuth()

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-grid-cyan-50 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-grid-navy-800 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-grid-cyan-50 dark:hover:bg-grid-navy-700"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="p-6 border-b dark:border-grid-navy-700">
              <h2 className="text-2xl font-bold text-grid-navy-700 dark:text-white">
                Menu
              </h2>
            </div>

            {/* Navigation */}
            <div className="p-4">
              <MobileNavigation
                userRole={profile?.role}
                onNavigate={() => setIsOpen(false)}
                variant="sidebar"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

---

## 🎨 Exemple 4 : Sidebar Collapsible

Sidebar desktop qui peut se rétracter.

```tsx
// src/components/CollapsibleSidebar.tsx
'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

export function CollapsibleSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { profile } = useAuth()

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 h-full bg-white dark:bg-grid-navy-800 border-r transition-all duration-300',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-grid-cyan-500 text-white hover:bg-grid-cyan-600 transition-colors flex items-center justify-center shadow-lg"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b">
        {collapsed ? (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">G78</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base">G78</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-grid-navy-600 dark:text-white">
                GRID 78
              </h1>
              <p className="text-xs text-grid-navy-400">🚁 Drone Team</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="py-6 overflow-y-auto">
        <Navigation userRole={profile?.role} />
      </div>

      {/* Note: Adapter Navigation.tsx pour supporter le mode collapsed */}
      {/* En mode collapsed, afficher uniquement les icônes */}
    </aside>
  )
}
```

---

## 🎭 Exemple 5 : Navigation avec Badge Dynamique

Mettre à jour les badges en temps réel (notifications).

```tsx
// src/components/DynamicNavigation.tsx
'use client'

import { useEffect, useState } from 'react'
import { Navigation, navigationItems } from '@/components/layout/Navigation'
import type { NavItem } from '@/components/layout/Navigation'

export function DynamicNavigation({ userRole }) {
  const [items, setItems] = useState<NavItem[]>(navigationItems)

  // Simuler des notifications en temps réel
  useEffect(() => {
    // WebSocket ou polling
    const interval = setInterval(() => {
      // Exemple: mettre à jour le badge des missions
      setItems(prev => 
        prev.map(item => 
          item.href === '/missions'
            ? { ...item, badge: String(Math.floor(Math.random() * 10)) }
            : item
        )
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return <Navigation userRole={userRole} />
}

// Usage
<DynamicNavigation userRole={profile?.role} />
```

---

## 🔒 Exemple 6 : Navigation avec Restrictions

Afficher des items différents selon les permissions.

```tsx
// src/components/layout/RestrictedNavigation.tsx
'use client'

import { Navigation } from '@/components/layout/Navigation'
import type { NavItem } from '@/components/layout/Navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export function RestrictedNavigation() {
  const { profile, permissions } = useAuth()

  // Filtrer les items selon les permissions
  const filteredItems = navigationItems.filter(item => {
    // Items publics (pas de restriction)
    if (!item.requiredRole && !item.requiredPermission) {
      return true
    }

    // Vérifier le rôle
    if (item.requiredRole && profile?.role !== item.requiredRole) {
      return false
    }

    // Vérifier les permissions
    if (item.requiredPermission && !permissions?.includes(item.requiredPermission)) {
      return false
    }

    return true
  })

  return (
    <nav className="space-y-1.5 px-2 md:px-3">
      {/* Rendu custom avec filteredItems */}
    </nav>
  )
}
```

---

## 🎨 Exemple 7 : Thème Personnalisé

Modifier les couleurs de la navigation.

```tsx
// src/components/ThemedNavigation.tsx
import { Navigation } from '@/components/layout/Navigation'

export function ThemedNavigation({ userRole, theme = 'cyan' }) {
  // Mapping de thèmes
  const themes = {
    cyan: {
      active: 'from-grid-cyan-500 to-grid-cyan-600',
      hover: 'hover:bg-grid-cyan-50',
      text: 'text-grid-cyan-600',
    },
    orange: {
      active: 'from-grid-orange-500 to-grid-orange-600',
      hover: 'hover:bg-grid-orange-50',
      text: 'text-grid-orange-600',
    },
    purple: {
      active: 'from-grid-purple-500 to-grid-purple-600',
      hover: 'hover:bg-grid-purple-50',
      text: 'text-grid-purple-600',
    },
  }

  const currentTheme = themes[theme]

  // Injecter le thème via CSS variables ou classes Tailwind
  return (
    <div data-nav-theme={theme}>
      <Navigation userRole={userRole} />
    </div>
  )
}
```

---

## 📊 Exemple 8 : Navigation avec Analytics

Tracker les clics sur les items de navigation.

```tsx
// src/components/AnalyticsNavigation.tsx
'use client'

import { Navigation } from '@/components/layout/Navigation'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AnalyticsNavigation({ userRole }) {
  const pathname = usePathname()

  useEffect(() => {
    // Tracker la navigation
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_title: document.title,
      })
    }

    // Ou votre solution analytics
    console.log('Navigation to:', pathname)
  }, [pathname])

  const handleNavigate = () => {
    // Event custom
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'navigation_click', {
        from: pathname,
      })
    }
  }

  return <Navigation userRole={userRole} onNavigate={handleNavigate} />
}
```

---

## 🔄 Exemple 9 : Navigation avec Loading States

Afficher un état de chargement pendant la navigation.

```tsx
// src/components/LoadingNavigation.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Navigation, navigationItems } from '@/components/layout/Navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function LoadingNavigation({ userRole }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [loadingHref, setLoadingHref] = useState<string | null>(null)

  const handleClick = (href: string) => {
    setLoadingHref(href)
    startTransition(() => {
      router.push(href)
    })
  }

  const filteredItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return userRole === item.requiredRole
  })

  return (
    <nav className="space-y-1.5 px-2 md:px-3">
      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        const isLoading = loadingHref === item.href && isPending

        return (
          <button
            key={item.href}
            onClick={() => handleClick(item.href)}
            disabled={isLoading}
            className={cn(
              'w-full group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-grid-cyan-500 to-grid-cyan-600 text-white'
                : 'text-grid-navy-600 hover:bg-grid-cyan-50',
              isLoading && 'opacity-50 cursor-wait'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
            <span>{item.title}</span>
          </button>
        )
      })}
    </nav>
  )
}
```

---

## 🎯 Exemple 10 : Navigation avec Groupes

Organiser les items par catégories.

```tsx
// src/components/GroupedNavigation.tsx
'use client'

import { Navigation } from '@/components/layout/Navigation'
import type { NavItem } from '@/components/layout/Navigation'
import { navigationItems } from '@/components/layout/Navigation'

interface NavGroup {
  title: string
  items: NavItem[]
}

export function GroupedNavigation({ userRole }) {
  const groups: NavGroup[] = [
    {
      title: 'Principal',
      items: navigationItems.filter(item => 
        ['/', '/dashboard', '/profile'].includes(item.href)
      ),
    },
    {
      title: 'Opérations',
      items: navigationItems.filter(item => 
        ['/missions', '/planning', '/trainings'].includes(item.href)
      ),
    },
    {
      title: 'Administration',
      items: navigationItems.filter(item => 
        ['/team', '/settings', '/safety'].includes(item.href)
      ),
    },
  ]

  return (
    <nav className="space-y-6 px-2 md:px-3">
      {groups.map(group => (
        <div key={group.title}>
          {/* Group title */}
          <h3 className="px-3 mb-2 text-xs font-semibold text-grid-navy-400 uppercase tracking-wider">
            {group.title}
          </h3>
          
          {/* Group items */}
          <div className="space-y-1">
            {/* Render items here */}
          </div>
        </div>
      ))}
    </nav>
  )
}
```

---

## 🔔 Exemple 11 : Bottom Bar avec Plus Menu

Gérer plus de 5 items sur mobile avec un menu "Plus".

```tsx
// src/components/ExtendedBottomBar.tsx
'use client'

import { useState } from 'react'
import { MobileNavigation, navigationItems } from '@/components/layout/Navigation'
import { MoreHorizontal, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ExtendedBottomBar({ userRole }) {
  const [showMore, setShowMore] = useState(false)
  const pathname = usePathname()

  // Filtrer les items
  const filteredItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return userRole === item.requiredRole
  })

  // 4 items principaux + bouton "Plus"
  const mainItems = filteredItems.slice(0, 4)
  const moreItems = filteredItems.slice(4)

  return (
    <>
      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-grid-navy-800 border-t-2 border-grid-cyan-500/20 shadow-2xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Main items */}
          {mainItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all',
                  isActive ? 'text-grid-cyan-600' : 'text-grid-navy-400'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-11 h-11 rounded-xl',
                  isActive && 'bg-gradient-to-br from-grid-cyan-500 to-grid-cyan-600 shadow-lg'
                )}>
                  <Icon className={cn('h-5 w-5', isActive && 'text-white')} />
                </div>
              </Link>
            )
          })}

          {/* Plus button */}
          <button
            onClick={() => setShowMore(true)}
            className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-grid-navy-400"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-grid-cyan-50">
              <MoreHorizontal className="h-5 w-5" />
            </div>
          </button>
        </div>
      </nav>

      {/* More Menu Modal */}
      {showMore && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMore(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-grid-navy-800 rounded-t-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-grid-navy-700 dark:text-white">
                Plus d'options
              </h3>
              <button onClick={() => setShowMore(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              {moreItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive 
                        ? 'bg-gradient-to-r from-grid-cyan-500 to-grid-cyan-600 text-white'
                        : 'hover:bg-grid-cyan-50 dark:hover:bg-grid-navy-700'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

---

## 🎨 Exemple 12 : Custom Item Renderer

Personnaliser complètement le rendu des items.

```tsx
// src/components/CustomNavigation.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { navigationItems } from '@/components/layout/Navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function CustomNavigation({ userRole }) {
  const pathname = usePathname()

  const filteredItems = navigationItems.filter((item) => {
    if (!item.requiredRole) return true
    return userRole === item.requiredRole
  })

  return (
    <nav className="space-y-2 px-3">
      {filteredItems.map((item, index) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300',
              isActive 
                ? 'bg-gradient-to-r from-grid-cyan-500 via-grid-cyan-600 to-grid-cyan-700 text-white shadow-2xl scale-105'
                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-grid-navy-700 dark:hover:to-grid-navy-600'
            )}
            style={{
              // Animation delay progressive
              transitionDelay: `${index * 50}ms`,
            }}
          >
            {/* Numéro d'ordre */}
            <div className={cn(
              'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
              isActive 
                ? 'bg-white/20 text-white'
                : 'bg-grid-cyan-100 text-grid-cyan-600'
            )}>
              {index + 1}
            </div>

            {/* Icône avec container */}
            <div className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl transition-transform group-hover:scale-110',
              isActive 
                ? 'bg-white/20 shadow-lg'
                : 'bg-gradient-to-br from-grid-cyan-50 to-grid-cyan-100'
            )}>
              <Icon className={cn(
                'h-6 w-6',
                isActive ? 'text-white' : 'text-grid-cyan-600'
              )} />
            </div>

            {/* Texte et description */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                'font-bold text-sm',
                isActive ? 'text-white' : 'text-grid-navy-700 dark:text-white'
              )}>
                {item.title}
              </div>
              <div className={cn(
                'text-xs',
                isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
              )}>
                {/* Description optionnelle */}
                Accéder à {item.title.toLowerCase()}
              </div>
            </div>

            {/* Badge et flèche */}
            <div className="flex items-center gap-2">
              {item.badge && (
                <Badge className={cn(
                  isActive 
                    ? 'bg-white text-grid-cyan-600'
                    : 'bg-grid-orange-500 text-white'
                )}>
                  {item.badge}
                </Badge>
              )}
              <div className={cn(
                'w-2 h-2 rounded-full transition-all',
                isActive 
                  ? 'bg-white scale-150'
                  : 'bg-grid-cyan-500 opacity-0 group-hover:opacity-100'
              )} />
            </div>

            {/* Effet de gradient animé au hover */}
            {!isActive && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-grid-cyan-500/0 via-grid-cyan-500/10 to-grid-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
```

---

## 📝 Notes d'Utilisation

### Bonnes Pratiques

✅ **À faire :**
- Toujours fermer le drawer après navigation
- Utiliser `onNavigate` pour les callbacks
- Tester sur différentes tailles d'écran
- Limiter à 5 items sur la bottom bar
- Ajouter un padding-bottom pour la bottom bar

❌ **À éviter :**
- Ne pas mixer bottom bar et sidebar sur mobile
- Ne pas oublier le dark mode
- Ne pas surcharger d'animations
- Ne pas ignorer l'accessibilité

---

## 🚀 Tips Performance

1. **Memoization**
```tsx
const filteredItems = useMemo(() => 
  navigationItems.filter(item => /* ... */),
  [userRole]
)
```

2. **Lazy Loading**
```tsx
const MobileNavigation = lazy(() => 
  import('./Navigation').then(m => ({ default: m.MobileNavigation }))
)
```

3. **Code Splitting**
```tsx
// Charger uniquement sur mobile
{isMobile && <MobileNavigation />}
```

---

## 📚 Ressources

- 📖 **Guide complet** : `NAVIGATION_GUIDE.md`
- 🎨 **Guide visuel** : `NAVIGATION_VISUAL_GUIDE.md`
- 📋 **Résumé v2.0** : `NAVIGATION_V2_COMPLETE.md`
- 🎨 **Couleurs** : `COLORS_GRID78.md`

---

**Version :** 2.0.0  
**Dernière mise à jour :** 14 janvier 2025
