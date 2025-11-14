'use client'

import * as React from 'react'
import { z } from 'zod'
import { useToast } from '@/components/ui/toast'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { format } from 'date-fns'
import type { Database } from '@/types/database.types'
import type { MissionStatus } from '@/lib/hooks/useMissions'

type Mission = Database['public']['Tables']['missions']['Row']

const missionSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  mission_date: z.string().min(1, 'La date est requise'),
  location: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
})

type MissionFormData = z.infer<typeof missionSchema>

interface MissionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: MissionFormData) => Promise<void>
  mission?: Mission | null
  chiefId?: string  // Optional, not directly used in form
}

export function MissionForm({
  open,
  onOpenChange,
  onSubmit,
  mission,
  chiefId,
}: MissionFormProps) {
  const [formData, setFormData] = React.useState<MissionFormData>({
    title: mission?.title || '',
    description: mission?.description || '',
    mission_date: mission?.mission_date || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    location: mission?.location || '',
    status: (mission?.status as MissionStatus) || 'planned',
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { addToast } = useToast()

  // Reset form when mission changes
  React.useEffect(() => {
    if (mission) {
      setFormData({
        title: mission.title,
        description: mission.description || '',
        mission_date: mission.mission_date,
        location: mission.location || '',
        status: mission.status as MissionStatus,
      })
    }
  }, [mission])

  const handleChange = (
    field: keyof MissionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate
    const result = missionSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(newErrors)
      return
    }

    // Submit
    try {
      setIsSubmitting(true)
      await onSubmit(formData)
      addToast('success', mission ? 'Mission mise à jour' : 'Mission créée avec succès')
      handleClose()
    } catch (error) {
      console.error('Error submitting mission:', error)
      addToast('error', 'Erreur lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!mission) {
      // Reset form only for creation
      setFormData({
        title: '',
        description: '',
        mission_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        location: '',
        status: 'planned',
      })
    }
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalHeader onClose={handleClose}>
        <ModalTitle>
          {mission ? 'Modifier la mission' : 'Nouvelle mission'}
        </ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-grid-cyan-500'
                }`}
                placeholder="Ex: Surveillance forêt"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                placeholder="Détails de la mission..."
              />
            </div>

            {/* Mission Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date et heure <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.mission_date}
                onChange={(e) => handleChange('mission_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.mission_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-grid-cyan-500'
                }`}
              />
              {errors.mission_date && (
                <p className="mt-1 text-xs text-red-600">{errors.mission_date}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                placeholder="Ex: Forêt de Rambouillet"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
              >
                <option value="planned">Planifiée</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              mission ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
