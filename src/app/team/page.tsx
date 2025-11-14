'use client'

import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { Users } from 'lucide-react'

function TeamContent() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">
          Gestion de l&apos;Équipe
        </h1>
        <p className="text-grid-navy-500 mb-8">
          Gérez les membres de l&apos;équipe drone (Réservé aux chefs)
        </p>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="h-16 w-16 text-grid-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-grid-navy-700 mb-2">
            Page Équipe
          </h2>
          <p className="text-gray-500">
            Cette page sera développée dans un prochain PROMPT
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default function TeamPage() {
  return (
    <ProtectedRoute requiredRole="chief">
      <TeamContent />
    </ProtectedRoute>
  )
}
