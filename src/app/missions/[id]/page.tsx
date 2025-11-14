'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useMission } from '@/lib/hooks/useMissions'
import { useFlights } from '@/lib/hooks/useFlights'
import { MissionForm } from '@/components/missions/MissionForm'
import { FlightForm } from '@/components/missions/FlightForm'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Edit,
  Plus,
  Plane,
  Clock,
  Trash2,
  Loader2,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { MissionStatus } from '@/lib/hooks/useMissions'

type MissionFormData = {
  title: string
  description?: string
  mission_date: string
  location?: string
  status: MissionStatus
}

type FlightFormData = {
  flight_date: string
  duration_minutes: number
  drone_model?: string
  notes?: string
}

function MissionDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const missionId = params.id as string

  const { mission, isLoading: missionLoading, updateMission } = useMission(missionId)
  const { flights, isLoading: flightsLoading, createFlight, deleteFlight } = useFlights(missionId)

  const [isEditFormOpen, setIsEditFormOpen] = React.useState(false)
  const [isFlightFormOpen, setIsFlightFormOpen] = React.useState(false)
  const [deletingFlightId, setDeletingFlightId] = React.useState<string | null>(null)
  const { addToast } = useToast()

  const isChief = profile?.role === 'chief'

  const handleUpdateMission = async (data: MissionFormData) => {
    await updateMission({
      id: missionId,
      ...data,
    })
  }

  const handleCreateFlight = async (data: FlightFormData) => {
    if (!user?.id) return
    await createFlight({
      ...data,
      mission_id: missionId,
      pilot_id: user.id,
    })
  }

  const handleDeleteFlight = async (flightId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce vol ?')) {
      return
    }

    try {
      setDeletingFlightId(flightId)
      await deleteFlight(flightId)
      addToast('success', 'Vol supprimé')
    } catch (error) {
      console.error('Error deleting flight:', error)
      addToast('error', 'Erreur lors de la suppression')
    } finally {
      setDeletingFlightId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
      planned: 'default',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'danger',
    }
    const labels: Record<string, string> = {
      planned: 'Planifiée',
      in_progress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée',
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (missionLoading) {
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

  if (!mission) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Mission introuvable</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour aux missions
        </button>

        {/* Mission Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-grid-navy-600">
                  {mission.title}
                </h1>
                {getStatusBadge(mission.status)}
              </div>
              {mission.description && (
                <p className="text-gray-600">{mission.description}</p>
              )}
            </div>
            {isChief && (
              <button
                onClick={() => setIsEditFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-grid-cyan-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-grid-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(mission.mission_date), "d MMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            </div>

            {mission.location && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-grid-orange-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-grid-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium text-gray-900">{mission.location}</p>
                </div>
              </div>
            )}

            {mission.chief && (
              <div className="flex items-center gap-3">
                <Avatar
                  src={mission.chief.avatar_url}
                  alt={mission.chief.full_name || mission.chief.email}
                  className="h-10 w-10"
                />
                <div>
                  <p className="text-sm text-gray-500">Chef de mission</p>
                  <p className="font-medium text-gray-900">
                    {mission.chief.full_name || mission.chief.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flights Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Vols associés ({flights.length})
            </h2>
            <button
              onClick={() => setIsFlightFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter un vol
            </button>
          </div>

          <div className="p-6">
            {flightsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-grid-cyan-500"></div>
              </div>
            ) : flights.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun vol enregistré
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez par ajouter votre premier vol pour cette mission
                </p>
                <button
                  onClick={() => setIsFlightFormOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un vol
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pilote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durée
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Drone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {flights.map((flight) => (
                      <tr key={flight.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(parseISO(flight.flight_date), 'd MMM yyyy HH:mm', {
                            locale: fr,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={flight.pilot?.avatar_url}
                              alt={flight.pilot?.full_name || flight.pilot?.email || 'Pilot'}
                              className="h-8 w-8"
                            />
                            <span className="text-sm text-gray-900">
                              {flight.pilot?.full_name || flight.pilot?.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {flight.duration_minutes} min
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.drone_model || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {flight.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {(isChief || flight.pilot_id === user?.id) && (
                            <button
                              onClick={() => handleDeleteFlight(flight.id)}
                              disabled={deletingFlightId === flight.id}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                            >
                              {deletingFlightId === flight.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Mission Form */}
      {isChief && user && (
        <MissionForm
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSubmit={handleUpdateMission}
          mission={mission}
          chiefId={user.id}
        />
      )}

      {/* Add Flight Form */}
      {user && (
        <FlightForm
          open={isFlightFormOpen}
          onOpenChange={setIsFlightFormOpen}
          onSubmit={handleCreateFlight}
          missionId={missionId}
          pilotId={user.id}
        />
      )}
    </MainLayout>
  )
}

export default function MissionDetailPage() {
  return (
    <ProtectedRoute>
      <MissionDetailContent />
    </ProtectedRoute>
  )
}
