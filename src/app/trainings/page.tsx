'use client'

import * as React from 'react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTrainings, useUserTrainings, useTrainingsWithStatus } from '@/lib/hooks/useTrainings'
import { TrainingCard } from '@/components/trainings/TrainingCard'
import { TrainingList } from '@/components/trainings/TrainingList'
import { CertificationModal } from '@/components/trainings/CertificationModal'
import { Plus, Award, BookOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

function TrainingsContent() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = React.useState<'catalogue' | 'certifications'>('catalogue')
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const { trainingsWithStatus, isLoading: trainingsLoading } = useTrainingsWithStatus(user?.id)
  const { certifications, isLoading: certsLoading, addCertification, removeCertification, uploadCertificate } = useUserTrainings(user?.id)

  const isChief = profile?.role === 'chief'

  // Fetch all users for certification modal
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true })
      return data || []
    },
    enabled: isChief,
  })

  const { trainings } = useTrainings()

  const handleAddCertification = async (data: any) => {
    await addCertification({
      user_id: data.user_id,
      training_id: data.training_id,
      completed_at: data.completion_date,
      expires_at: data.expiration_date || null,
      certificate_url: data.certificate_url || null,
      validated_by: user?.id || null,
    })
  }

  if (trainingsLoading || certsLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grid-cyan-500"></div>
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
            <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">Formations</h1>
            <p className="text-grid-navy-500">
              Suivez vos certifications et formations
            </p>
          </div>
          {isChief && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-grid-purple-500 text-white rounded-lg hover:bg-grid-purple-600 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              Valider certification
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('catalogue')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'catalogue'
                    ? 'border-grid-purple-500 text-grid-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                Catalogue
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'certifications'
                    ? 'border-grid-purple-500 text-grid-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Award className="h-5 w-5" />
                Mes Certifications ({certifications.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Catalogue Tab */}
            {activeTab === 'catalogue' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Formations disponibles
                </h2>
                {trainingsWithStatus.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune formation
                    </h3>
                    <p className="text-gray-500">
                      Le catalogue de formations est vide pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainingsWithStatus.map((training) => (
                      <TrainingCard
                        key={training.id}
                        training={training}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Mes certifications
                </h2>
                <TrainingList
                  certifications={certifications}
                  onDelete={isChief ? removeCertification : undefined}
                  showActions={isChief}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certification Modal */}
      {isChief && (
        <CertificationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleAddCertification}
          uploadCertificate={uploadCertificate}
          trainings={trainings}
          users={users || []}
        />
      )}
    </MainLayout>
  )
}

export default function TrainingsPage() {
  return (
    <ProtectedRoute>
      <TrainingsContent />
    </ProtectedRoute>
  )
}
