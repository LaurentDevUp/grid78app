'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { Navigation } from './Navigation'
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

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G78</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-grid-navy-600">GRID 78</h1>
                <p className="text-xs text-grid-navy-400">Drone Team</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="px-3">
              <Navigation userRole={profile?.role} />
            </div>
          </div>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.full_name || user?.email || ''}
                    className="h-9 w-9"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
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
                className="text-grid-red-600 hover:text-grid-red-700 hover:bg-grid-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenu>

            <div className="mt-3 flex items-center justify-between px-3">
              <Badge variant={profile?.role === 'chief' ? 'chief' : 'pilot'}>
                {profile?.role === 'chief' ? 'Chef d\'unité' : 'Télépilote'}
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G78</span>
            </div>
            <h1 className="text-lg font-bold text-grid-navy-600">GRID 78</h1>
          </Link>

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
                className="text-grid-red-600 hover:text-grid-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent>
          <SheetHeader onClose={() => setMobileMenuOpen(false)}>
            <SheetTitle>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G78</span>
                </div>
                <div>
                  <div className="text-base font-bold text-grid-navy-600">GRID 78</div>
                  <div className="text-xs text-grid-navy-400 font-normal">Drone Team</div>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <SheetBody>
            {/* User Info */}
            <div className="mb-6 rounded-lg bg-grid-cyan-50 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={profile?.avatar_url}
                  alt={profile?.full_name || user?.email || ''}
                  className="h-12 w-12"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  <Badge
                    variant={profile?.role === 'chief' ? 'chief' : 'pilot'}
                    className="mt-1"
                  >
                    {profile?.role === 'chief' ? 'Chef d\'unité' : 'Télépilote'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Navigation */}
            <Navigation
              userRole={profile?.role}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </SheetBody>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="lg:pl-64 border-t border-gray-200 bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>© 2025 GRID 78 - Sapeurs-Pompiers des Yvelines</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-grid-cyan-600 transition-colors">
                Aide
              </a>
              <a href="#" className="hover:text-grid-cyan-600 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-grid-cyan-600 transition-colors">
                Version 1.0.0
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
