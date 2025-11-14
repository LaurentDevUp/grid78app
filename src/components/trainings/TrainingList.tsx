'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { format, parseISO, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Download, Trash2, Loader2, Award } from 'lucide-react'
import type { UserTrainingWithDetails } from '@/lib/hooks/useTrainings'

interface TrainingListProps {
  certifications: UserTrainingWithDetails[]
  onDelete?: (id: string) => Promise<void>
  showActions?: boolean
}

export function TrainingList({
  certifications,
  onDelete,
  showActions = false,
}: TrainingListProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState<'all' | 'active' | 'expired'>('all')

  const filteredCertifications = certifications.filter((cert) => {
    if (filter === 'all') return true
    if (filter === 'active') {
      return !cert.expires_at || !isPast(parseISO(cert.expires_at))
    }
    if (filter === 'expired') {
      return cert.expires_at && isPast(parseISO(cert.expires_at))
    }
    return true
  })

  const handleDelete = async (id: string) => {
    if (!onDelete) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) {
      return
    }

    try {
      setDeletingId(id)
      await onDelete(id)
    } catch (error) {
      console.error('Error deleting certification:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `${title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (certifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune certification
        </h3>
        <p className="text-gray-500">
          Vous n&apos;avez pas encore de certifications enregistrées
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            filter === 'all'
              ? 'bg-grid-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            filter === 'active'
              ? 'bg-grid-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Actives
        </button>
        <button
          onClick={() => setFilter('expired')}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            filter === 'expired'
              ? 'bg-grid-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Expirées
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de complétion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificat
              </th>
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCertifications.map((cert) => {
              const isExpired = cert.expires_at && isPast(parseISO(cert.expires_at))

              return (
                <tr key={cert.id} className={isExpired ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cert.training?.title || 'Formation inconnue'}
                      </div>
                      {cert.training?.description && (
                        <div className="text-sm text-gray-500 max-w-md truncate">
                          {cert.training.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(parseISO(cert.completed_at), 'd MMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cert.expires_at ? (
                      <Badge variant={isExpired ? 'danger' : 'success'}>
                        {format(parseISO(cert.expires_at), 'd MMM yyyy', { locale: fr })}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cert.certificate_url ? (
                      <button
                        onClick={() =>
                          handleDownload(
                            cert.certificate_url!,
                            cert.training?.title || 'certificate'
                          )
                        }
                        className="flex items-center gap-1 text-grid-cyan-600 hover:text-grid-cyan-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Télécharger</span>
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Aucun</span>
                    )}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(cert.id)}
                        disabled={deletingId === cert.id}
                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                      >
                        {deletingId === cert.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredCertifications.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune certification avec ce filtre</p>
        </div>
      )}
    </div>
  )
}
