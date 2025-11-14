'use client'

import * as React from 'react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAvailabilities } from '@/lib/hooks/useAvailabilities'
import { AvailabilityModal } from '@/components/planning/AvailabilityModal'
import { useToast } from '@/components/ui/toast'
import { Calendar, Plus, Trash2, Info, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

function PlanningContent() {
  const { user } = useAuth()
  const {
    availabilities,
    isLoading,
    hasOverlap,
    createAvailability,
    deleteAvailability,
  } = useAvailabilities(user?.id)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const { addToast } = useToast()

  const handleAddAvailability = async (startDate: Date, endDate: Date, notes?: string) => {
    await createAvailability({
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      status: 'available',
      notes: notes || null,
    })
  }

  const handleDeleteAvailability = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) {
      return
    }

    try {
      setDeletingId(id)
      await deleteAvailability(id)
      addToast('success', 'Disponibilité supprimée')
    } catch (error) {
      console.error('Error deleting availability:', error)
      addToast('error', 'Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  // Get all selected dates for calendar
  const selectedDates = React.useMemo(() => {
    const dates: Date[] = []
    availabilities.forEach((avail) => {
      const start = parseISO(avail.start_date)
      const end = parseISO(avail.end_date)
      const current = new Date(start)
      while (current <= end) {
        dates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
    })
    return dates
  }, [availabilities])

  if (isLoading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">Mon Planning</h1>
          <p className="text-grid-navy-500">
            Gérez vos disponibilités pour les missions
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900">
              <strong>Comment ça marche ?</strong>
              <br />
              Indiquez vos disponibilités ici. Ces dates alimentent automatiquement le
              calendrier d&apos;équipe visible par tous les membres.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Add Button */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-grid-cyan-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-grid-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-grid-navy-700">
                    {availabilities.length}
                  </p>
                  <p className="text-sm text-gray-600">Disponibilités</p>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-grid-cyan-500 text-white rounded-lg hover:bg-grid-cyan-600 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              Ajouter une disponibilité
            </button>
          </div>

          {/* Right Column - Availabilities List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Mes disponibilités
                </h2>
              </div>

              <div className="p-6">
                {availabilities.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune disponibilité
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Commencez par ajouter vos premières disponibilités
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une disponibilité
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availabilities.map((availability) => (
                      <div
                        key={availability.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-grid-cyan-500 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-grid-cyan-600" />
                            <p className="font-semibold text-gray-900">
                              {format(parseISO(availability.start_date), 'd MMM yyyy', { locale: fr })}
                              {' → '}
                              {format(parseISO(availability.end_date), 'd MMM yyyy', { locale: fr })}
                            </p>
                          </div>
                          {availability.notes && (
                            <p className="text-sm text-gray-600 ml-6">
                              {availability.notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 ml-6 mt-1">
                            Créé le{' '}
                            {format(parseISO(availability.created_at), 'd MMM yyyy à HH:mm', {
                              locale: fr,
                            })}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteAvailability(availability.id)}
                          disabled={deletingId === availability.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Supprimer"
                        >
                          {deletingId === availability.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Availability Modal */}
      <AvailabilityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddAvailability}
        existingDates={selectedDates}
        checkOverlap={hasOverlap}
      />
    </MainLayout>
  )
}

export default function PlanningPage() {
  return (
    <ProtectedRoute>
      <PlanningContent />
    </ProtectedRoute>
  )
}
