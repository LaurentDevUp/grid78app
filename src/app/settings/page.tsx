'use client'

import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { Settings } from 'lucide-react'

function SettingsContent() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">
          Paramètres
        </h1>
        <p className="text-grid-navy-500 mb-8">
          Configurez l&apos;application (Réservé aux chefs)
        </p>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Settings className="h-16 w-16 text-grid-navy-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-grid-navy-700 mb-2">
            Page Paramètres
          </h2>
          <p className="text-gray-500">
            Cette page sera développée dans un prochain PROMPT
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute requiredRole="chief">
      <SettingsContent />
    </ProtectedRoute>
  )
}
