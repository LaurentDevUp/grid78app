'use client'

import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { ShieldAlert } from 'lucide-react'

function SafetyContent() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">
          Consignes de Sécurité
        </h1>
        <p className="text-grid-navy-500 mb-8">
          Consultez les consignes et procédures de sécurité
        </p>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ShieldAlert className="h-16 w-16 text-grid-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-grid-navy-700 mb-2">
            Page Sécurité
          </h2>
          <p className="text-gray-500">
            Cette page sera développée dans un prochain PROMPT
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default function SafetyPage() {
  return (
    <ProtectedRoute>
      <SafetyContent />
    </ProtectedRoute>
  )
}
