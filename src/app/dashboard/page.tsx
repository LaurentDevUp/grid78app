'use client'

import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTeamStats } from '@/lib/hooks/useTeamStats'
import { useUpcomingMissions } from '@/lib/hooks/useUpcomingMissions'
import { TeamCalendar } from '@/components/shared/TeamCalendar'
import { Users, TrendingUp, Plane, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

function DashboardContent() {
  const { profile } = useAuth()
  const { stats, isLoading: statsLoading } = useTeamStats()
  const { missions, isLoading: missionsLoading } = useUpcomingMissions(3)

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">
            Tableau de bord
          </h1>
          <p className="text-grid-navy-500">
            Bienvenue, {profile?.full_name || 'Utilisateur'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Members */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total membres</p>
                <p className="text-3xl font-bold text-grid-navy-700">
                  {statsLoading ? '...' : stats?.totalMembers || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-grid-cyan-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-grid-cyan-600" />
              </div>
            </div>
          </div>

          {/* Available Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Disponibles aujourd&apos;hui</p>
                <p className="text-3xl font-bold text-green-600">
                  {statsLoading ? '...' : stats?.availableToday || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Missions This Month */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Missions ce mois</p>
                <p className="text-3xl font-bold text-grid-orange-600">
                  {statsLoading ? '...' : stats?.missionsThisMonth || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-grid-orange-100 flex items-center justify-center">
                <Plane className="h-6 w-6 text-grid-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Flight Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Heures de vol</p>
                <p className="text-3xl font-bold text-grid-purple-600">
                  {statsLoading ? '...' : `${stats?.totalFlightHours || 0}h`}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-grid-purple-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-grid-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <TeamCalendar />
          </div>

          {/* Sidebar - Upcoming Missions */}
          <div className="space-y-6">
            {/* Upcoming Missions Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-grid-navy-700">
                  Prochaines missions
                </h2>
              </div>
              <div className="p-4">
                {missionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-grid-cyan-500"></div>
                  </div>
                ) : missions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Plane className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Aucune mission prévue</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {missions.map((mission) => (
                      <div
                        key={mission.id}
                        className="p-4 rounded-lg border-2 border-gray-200 hover:border-grid-cyan-500 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-grid-navy-700">
                            {mission.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              mission.status === 'in_progress'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {mission.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {mission.description || 'Pas de description'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {format(
                            new Date(mission.mission_date),
                            "d MMM yyyy 'à' HH:mm",
                            { locale: fr }
                          )}
                        </div>
                        {mission.location && (
                          <p className="text-xs text-gray-500 mt-1">📍 {mission.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-grid-cyan-500 to-grid-orange-500 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Résumé rapide</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Missions actives</span>
                  <span className="text-2xl font-bold">
                    {statsLoading ? '...' : stats?.activeMissions || 0}
                  </span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs opacity-75">
                    {stats?.availableToday || 0} membre(s) disponible(s) sur{' '}
                    {stats?.totalMembers || 0} aujourd&apos;hui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
