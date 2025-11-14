'use client'

import * as React from 'react'
import { z } from 'zod'
import { useToast } from '@/components/ui/toast'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { format } from 'date-fns'

const flightSchema = z.object({
  flight_date: z.string().min(1, 'La date est requise'),
  duration_minutes: z.number().min(1, 'La durée doit être supérieure à 0').max(600, 'Maximum 600 minutes'),
  drone_model: z.string().optional(),
  notes: z.string().optional(),
})

type FlightFormData = z.infer<typeof flightSchema>

interface FlightFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FlightFormData) => Promise<void>
  missionId: string
  pilotId: string
}

export function FlightForm({
  open,
  onOpenChange,
  onSubmit,
}: FlightFormProps) {
  const [formData, setFormData] = React.useState<FlightFormData>({
    flight_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration_minutes: 30,
    drone_model: '',
    notes: '',
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { addToast } = useToast()

  const handleChange = (
    field: keyof FlightFormData,
    value: string | number
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
    const result = flightSchema.safeParse(formData)
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
      addToast('success', 'Vol ajouté avec succès')
      handleClose()
    } catch (error) {
      console.error('Error creating flight:', error)
      addToast('error', 'Erreur lors de l\'ajout du vol')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Reset form
    setFormData({
      flight_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration_minutes: 30,
      drone_model: '',
      notes: '',
    })
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalHeader onClose={handleClose}>
        <ModalTitle>Ajouter un vol</ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Flight Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date et heure du vol <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.flight_date}
                onChange={(e) => handleChange('flight_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.flight_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-grid-cyan-500'
                }`}
              />
              {errors.flight_date && (
                <p className="mt-1 text-xs text-red-600">{errors.flight_date}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="600"
                value={formData.duration_minutes}
                onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.duration_minutes
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-grid-cyan-500'
                }`}
                placeholder="30"
              />
              {errors.duration_minutes && (
                <p className="mt-1 text-xs text-red-600">{errors.duration_minutes}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Durée du vol en minutes (max 600)
              </p>
            </div>

            {/* Drone Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modèle de drone
              </label>
              <input
                type="text"
                value={formData.drone_model}
                onChange={(e) => handleChange('drone_model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                placeholder="Ex: DJI Mavic 3"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                placeholder="Observations, conditions météo, incidents..."
              />
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
                Ajout en cours...
              </>
            ) : (
              'Ajouter le vol'
            )}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
