'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/useAuth'
import { Navigation, MobileNavigation } from './Navigation'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
} from '@/components/ui/sheet'
import { Menu, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { branding } from '@/lib/config/branding'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { logo, alt, showLogo } = branding

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-grid-cyan-50/20 dark:from-grid-navy-900 dark:via-grid-navy-800 dark:to-grid-navy-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-40">
        <div className="flex min-h-0 flex-1 flex-col bg-white/95 dark:bg-grid-navy-800/95 backdrop-blur-lg border-r border-gray-200 dark:border-grid-navy-700 shadow-xl">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center px-6 border-b border-gray-200 dark:border-grid-navy-700 bg-gradient-to-r from-grid-cyan-500/5 to-grid-orange-500/5">
            <Link href="/dashboard" className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200">
              <div className="relative">
                {showLogo ? (
                  <div className="h-11 w-11 rounded-xl bg-white shadow-lg ring-1 ring-grid-cyan-100 flex items-center justify-center overflow-hidden">
                    <Image src={logo} alt={alt} width={48} height={48} className="max-h-10 max-w-10 object-contain" priority />
                  </div>
                ) : (
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-grid-cyan-500 via-grid-cyan-600 to-grid-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-base">G78</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-grid-navy-800 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-black text-grid-navy-600 dark:text-white group-hover:text-grid-cyan-600 dark:group-hover:text-grid-cyan-400 transition-colors">GRID 78</h1>
                <p className="text-xs text-grid-navy-400 dark:text-gray-400 font-medium">🚁 Drone Team</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-grid-cyan-500/20 scrollbar-track-transparent">
            <Navigation userRole={profile?.role} />
          </div>

          {/* User Section */}
          <div className="border-t border-gray-200 dark:border-grid-navy-700 p-4 bg-gradient-to-r from-grid-cyan-500/5 to-transparent">
            <DropdownMenu
              align="left"
              side="right"
              sideOffset={12}
              trigger={
                <div className="group flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gradient-to-r hover:from-grid-cyan-50 hover:to-grid-cyan-50/50 dark:hover:from-grid-navy-700 dark:hover:to-grid-navy-700/50 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-grid-cyan-200 dark:hover:border-grid-cyan-800">
                  <div className="relative">
                    <Avatar
                      src={profile?.avatar_url}
                      alt={profile?.full_name || user?.email || ''}
                      className="h-10 w-10 ring-2 ring-grid-cyan-500/20 group-hover:ring-grid-cyan-500 transition-all"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-grid-navy-800"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-grid-cyan-600 dark:group-hover:text-grid-cyan-400 transition-colors">
                      {profile?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-grid-cyan-600 dark:group-hover:text-grid-cyan-400 transition-colors" />
                </div>
              }
            >
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-grid-red-600 dark:text-grid-red-500 hover:text-grid-red-700 dark:hover:text-grid-red-400 hover:bg-grid-red-50 dark:hover:bg-grid-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenu>

            <div className="mt-3 flex items-center justify-center px-3">
              <Badge 
                variant={profile?.role === 'chief' ? 'chief' : 'pilot'}
                className="w-full justify-center py-1.5 font-semibold shadow-sm"
              >
                {profile?.role === 'chief' ? '👨‍✈️ Chef d\'unité' : '🎮 Télépilote'}
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-grid-navy-700 bg-white/95 dark:bg-grid-navy-800/95 backdrop-blur-lg px-4 shadow-lg">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden hover:bg-grid-cyan-50 dark:hover:bg-grid-navy-700 rounded-lg transition-colors active:scale-95"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            {showLogo ? (
              <div className="h-9 w-9 rounded-xl bg-white shadow-md ring-1 ring-grid-cyan-100 flex items-center justify-center overflow-hidden">
                <Image src={logo} alt={alt} width={36} height={36} className="max-h-8 max-w-8 object-contain" />
              </div>
            ) : (
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">G78</span>
              </div>
            )}
            <h1 className="text-lg font-bold text-grid-navy-600 dark:text-white group-hover:text-grid-cyan-600 dark:group-hover:text-grid-cyan-400 transition-colors">GRID 78</h1>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant={profile?.role === 'chief' ? 'chief' : 'pilot'} className="hidden sm:inline-flex">
            {profile?.role === 'chief' ? 'Chef' : 'Pilot'}
          </Badge>
          <DropdownMenu
            trigger={
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.full_name || user?.email || ''}
                className="h-8 w-8 cursor-pointer"
              />
            }
          >
            <DropdownMenuLabel>
              {profile?.full_name || 'Utilisateur'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-grid-red-600 dark:text-grid-red-500 hover:text-grid-red-700 dark:hover:text-grid-red-400 hover:bg-grid-red-50 dark:hover:bg-grid-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent className="w-[85vw] max-w-sm">
          <SheetHeader onClose={() => setMobileMenuOpen(false)}>
            <SheetTitle>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-grid-cyan-500 via-grid-cyan-600 to-grid-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-sm">G78</span>
                </div>
                <div>
                  <div className="text-lg font-black text-grid-navy-600 dark:text-white">GRID 78</div>
                  <div className="text-xs text-grid-navy-400 dark:text-gray-400 font-medium">🚁 Drone Team</div>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <SheetBody>
            {/* User Info */}
            <div className="mb-6 rounded-xl bg-gradient-to-br from-grid-cyan-50 to-grid-cyan-100/50 dark:from-grid-navy-700 dark:to-grid-navy-700/50 p-4 border-2 border-grid-cyan-200 dark:border-grid-cyan-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.full_name || user?.email || ''}
                    className="h-14 w-14 ring-4 ring-white dark:ring-grid-navy-800 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-grid-navy-700"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {profile?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">{user?.email}</p>
                  <Badge
                    variant={profile?.role === 'chief' ? 'chief' : 'pilot'}
                    className="mt-1"
                  >
                    {profile?.role === 'chief' ? 'Chef d\'unité' : 'Télépilote'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Navigation */}
            <div className="space-y-1">
              <MobileNavigation
                userRole={profile?.role}
                onNavigate={() => setMobileMenuOpen(false)}
                variant="sidebar"
              />
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="lg:pl-72 pb-20 lg:pb-0">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation 
        userRole={profile?.role}
        variant="bottom"
      />

      {/* Footer */}
      <footer className="lg:pl-72 border-t border-gray-200 dark:border-grid-navy-700 bg-white/80 dark:bg-grid-navy-800/80 backdrop-blur-sm mb-16 lg:mb-0">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium">© 2025 GRID 78 - Sapeurs-Pompiers des Yvelines</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-grid-cyan-600 dark:hover:text-grid-cyan-400 transition-colors font-medium">
                📖 Aide
              </a>
              <a href="#" className="hover:text-grid-cyan-600 dark:hover:text-grid-cyan-400 transition-colors font-medium">
                💬 Contact
              </a>
              <a href="#" className="hover:text-grid-cyan-600 dark:hover:text-grid-cyan-400 transition-colors font-medium">
                🚀 v2.0.0
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
