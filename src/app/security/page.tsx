'use client'

import * as React from 'react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSafetyGuidelines, groupByCategory, type GuidelineCategory } from '@/lib/hooks/useSafety'
import { GuidelineCard } from '@/components/security/GuidelineCard'
import { GuidelineEditor, type GuidelineFormData } from '@/components/security/GuidelineEditor'
import { Plus, Search, Shield, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORY_LABELS: Record<GuidelineCategory, string> = {
  pre_flight: 'Pré-vol',
  flight: 'En vol',
  emergency: 'Urgence',
  maintenance: 'Maintenance',
  general: 'Général',
}

const CATEGORY_ICONS: Record<GuidelineCategory, string> = {
  pre_flight: '✈️',
  flight: '🛫',
  emergency: '🚨',
  maintenance: '🔧',
  general: '📋',
}

function SecurityContent() {
  const { user, profile } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)
  const [editingGuideline, setEditingGuideline] = React.useState<any>(null)
  const [expandedCategories, setExpandedCategories] = React.useState<Set<GuidelineCategory>>(
    new Set(['pre_flight', 'flight', 'emergency', 'maintenance', 'general'])
  )

  const { guidelines, isLoading, createGuideline, updateGuideline, uploadDocument } = useSafetyGuidelines({
    search: searchQuery || undefined,
  })

  const isChief = profile?.role === 'chief'
  const groupedGuidelines = groupByCategory(guidelines)

  const toggleCategory = (category: GuidelineCategory) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCreateGuideline = () => {
    setEditingGuideline(null)
    setIsEditorOpen(true)
  }

  const handleEditGuideline = (guideline: any) => {
    setEditingGuideline(guideline)
    setIsEditorOpen(true)
  }

  const handleSubmitGuideline = async (data: GuidelineFormData) => {
    if (editingGuideline) {
      await updateGuideline({
        id: editingGuideline.id,
        ...data,
      })
    } else {
      await createGuideline(data)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grid-orange-500"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-grid-orange-600" />
              <h1 className="text-3xl font-bold text-grid-navy-600">Consignes de Sécurité</h1>
            </div>
            <p className="text-grid-navy-500">
              Procédures et directives pour assurer la sécurité des opérations
            </p>
          </div>
          {isChief && (
            <button
              onClick={handleCreateGuideline}
              className="flex items-center gap-2 px-4 py-2 bg-grid-orange-500 text-white rounded-lg hover:bg-grid-orange-600 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              Nouvelle consigne
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les consignes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-orange-500"
            />
          </div>
        </div>

        {/* Guidelines by Category */}
        {guidelines.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'Aucun résultat' : 'Aucune consigne'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'Essayez une autre recherche'
                : 'Commencez par ajouter des consignes de sécurité'}
            </p>
            {isChief && !searchQuery && (
              <button
                onClick={handleCreateGuideline}
                className="inline-flex items-center gap-2 px-4 py-2 bg-grid-orange-500 text-white rounded-md hover:bg-grid-orange-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Créer la première consigne
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {(Object.keys(CATEGORY_LABELS) as GuidelineCategory[]).map((category) => {
              const categoryGuidelines = groupedGuidelines[category]
              if (categoryGuidelines.length === 0) return null

              const isExpanded = expandedCategories.has(category)

              return (
                <div key={category} className="bg-white rounded-lg shadow">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {CATEGORY_LABELS[category]}
                      </h2>
                      <span className="text-sm text-gray-500">
                        ({categoryGuidelines.length})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {/* Category Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4">
                      {categoryGuidelines.map((guideline) => (
                        <GuidelineCard
                          key={guideline.id}
                          guideline={guideline}
                          onEdit={() => handleEditGuideline(guideline)}
                          showActions={isChief}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isChief && (
        <GuidelineEditor
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          onSubmit={handleSubmitGuideline}
          uploadDocument={uploadDocument}
          guideline={editingGuideline}
        />
      )}
    </MainLayout>
  )
}

export default function SecurityPage() {
  return (
    <ProtectedRoute>
      <SecurityContent />
    </ProtectedRoute>
  )
}
