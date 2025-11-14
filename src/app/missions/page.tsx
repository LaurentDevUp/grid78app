'use client'

import * as React from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useMissions, useMission } from '@/lib/hooks/useMissions'
import { MissionForm } from '@/components/missions/MissionForm'
import { Badge } from '@/components/ui/badge'
import { Plus, Plane, Calendar, MapPin, Filter } from 'lucide-react'
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

function MissionsContent() {
  const { user, profile } = useAuth()
  const [statusFilter, setStatusFilter] = React.useState<MissionStatus | 'all'>('all')
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  
  const filters = statusFilter === 'all' ? undefined : { status: statusFilter }
  const { missions, isLoading } = useMissions(filters)
  const { createMission } = useMission()

  const isChief = profile?.role === 'chief'

  const handleCreateMission = async (data: MissionFormData) => {
    if (!user?.id) return
    await createMission({
      ...data,
      chief_id: user.id,
    })
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">Missions</h1>
            <p className="text-grid-navy-500">
              Consultez et gérez les missions drone
            </p>
          </div>
          {isChief && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-grid-orange-500 text-white rounded-lg hover:bg-grid-orange-600 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              Nouvelle Mission
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-grid-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setStatusFilter('planned')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === 'planned'
                    ? 'bg-grid-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Planifiées
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === 'in_progress'
                    ? 'bg-grid-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En cours
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-grid-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Terminées
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  statusFilter === 'cancelled'
                    ? 'bg-grid-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Annulées
              </button>
            </div>
          </div>
        </div>

        {/* Missions Grid */}
        {missions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune mission
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'all'
                ? 'Aucune mission pour le moment'
                : 'Aucune mission avec ce filtre'}
            </p>
            {isChief && statusFilter === 'all' && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-grid-orange-500 text-white rounded-md hover:bg-grid-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Créer une mission
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-transparent hover:border-grid-cyan-500"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {mission.title}
                    </h3>
                    {getStatusBadge(mission.status)}
                  </div>

                  {mission.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {mission.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-grid-cyan-600" />
                      {format(parseISO(mission.mission_date), "d MMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </div>

                    {mission.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-grid-orange-600" />
                        {mission.location}
                      </div>
                    )}

                    {mission.chief && (
                      <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                        Chef : {mission.chief.full_name || mission.chief.email}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mission Form Modal */}
      {isChief && user && (
        <MissionForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleCreateMission}
          chiefId={user.id}
        />
      )}
    </MainLayout>
  )
}

export default function MissionsPage() {
  return (
    <ProtectedRoute>
      <MissionsContent />
    </ProtectedRoute>
  )
}
