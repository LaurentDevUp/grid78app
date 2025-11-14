'use client'

import * as React from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { CalendarSelector } from './CalendarSelector'
import { useToast } from '@/components/ui/toast'
import { format, isBefore, startOfToday } from 'date-fns'
import { AlertCircle } from 'lucide-react'

interface AvailabilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (startDate: Date, endDate: Date, notes?: string) => Promise<void>
  existingDates?: Date[]
  checkOverlap?: (start: Date, end: Date) => boolean
}

export function AvailabilityModal({
  open,
  onOpenChange,
  onSubmit,
  existingDates = [],
  checkOverlap,
}: AvailabilityModalProps) {
  const [selectedStart, setSelectedStart] = React.useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = React.useState<Date | null>(null)
  const [notes, setNotes] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { addToast } = useToast()

  const handleRangeSelect = (start: Date, end: Date) => {
    setError(null)

    // Validate dates
    const today = startOfToday()
    if (isBefore(start, today)) {
      setError('La date de début ne peut pas être dans le passé')
      return
    }

    if (isBefore(end, start)) {
      setError('La date de fin doit être après la date de début')
      return
    }

    // Check overlap
    if (checkOverlap && checkOverlap(start, end)) {
      setError('Cette période chevauche une disponibilité existante')
      return
    }

    setSelectedStart(start)
    setSelectedEnd(end)
  }

  const handleSubmit = async () => {
    if (!selectedStart || !selectedEnd) {
      setError('Veuillez sélectionner une période')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await onSubmit(selectedStart, selectedEnd, notes || undefined)

      addToast('success', 'Disponibilité ajoutée avec succès')
      handleClose()
    } catch (err) {
      console.error('Error creating availability:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      addToast('error', 'Erreur lors de l\'ajout de la disponibilité')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedStart(null)
    setSelectedEnd(null)
    setNotes('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalHeader onClose={handleClose}>
        <ModalTitle>Ajouter une disponibilité</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* Calendar Selector */}
          <CalendarSelector
            selectedDates={existingDates}
            onRangeSelect={handleRangeSelect}
          />

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Disponible pour missions longue distance"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
            />
          </div>

          {/* Selected Period Display */}
          {selectedStart && selectedEnd && !error && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>✅ Période sélectionnée :</strong>
                <br />
                Du <strong>{format(selectedStart, 'dd/MM/yyyy')}</strong>
                {' '}au <strong>{format(selectedEnd, 'dd/MM/yyyy')}</strong>
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedStart || !selectedEnd}
          className="px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Ajout en cours...
            </>
          ) : (
            'Ajouter'
          )}
        </button>
      </ModalFooter>
    </Modal>
  )
}
