'use client'

import * as React from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { format } from 'date-fns'
import { Upload, FileText } from 'lucide-react'
import type { Training } from '@/lib/hooks/useTrainings'

interface CertificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    user_id: string
    training_id: string
    completion_date: string
    expiration_date?: string
    certificate_url?: string
  }) => Promise<void>
  uploadCertificate: (file: File, userId: string, trainingId: string) => Promise<string>
  trainings: Training[]
  users: Array<{ id: string; full_name: string | null; email: string }>
}

export function CertificationModal({
  open,
  onOpenChange,
  onSubmit,
  uploadCertificate,
  trainings,
  users,
}: CertificationModalProps) {
  const [selectedUser, setSelectedUser] = React.useState('')
  const [selectedTraining, setSelectedTraining] = React.useState('')
  const [completionDate, setCompletionDate] = React.useState(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [expirationDate, setExpirationDate] = React.useState('')
  const [certificateFile, setCertificateFile] = React.useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { addToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      setError('Le fichier doit être un PDF ou une image')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5 MB')
      return
    }

    setCertificateFile(file)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedUser || !selectedTraining) {
      setError('Veuillez sélectionner un utilisateur et une formation')
      return
    }

    try {
      setIsSubmitting(true)

      let certificateUrl: string | undefined

      // Upload certificate if provided
      if (certificateFile) {
        certificateUrl = await uploadCertificate(
          certificateFile,
          selectedUser,
          selectedTraining
        )
      }

      // Submit certification
      await onSubmit({
        user_id: selectedUser,
        training_id: selectedTraining,
        completion_date: completionDate,
        expiration_date: expirationDate || undefined,
        certificate_url: certificateUrl,
      })

      addToast('success', 'Certification ajoutée avec succès')
      handleClose()
    } catch (err) {
      console.error('Error adding certification:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout')
      addToast('error', 'Erreur lors de l\'ajout de la certification')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedUser('')
    setSelectedTraining('')
    setCompletionDate(format(new Date(), 'yyyy-MM-dd'))
    setExpirationDate('')
    setCertificateFile(null)
    setError(null)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalHeader onClose={handleClose}>
        <ModalTitle>Valider une certification</ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membre d'équipe <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                required
              >
                <option value="">Sélectionner un membre</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Training Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formation <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTraining}
                onChange={(e) => setSelectedTraining(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                required
              >
                <option value="">Sélectionner une formation</option>
                {trainings.map((training) => (
                  <option key={training.id} value={training.id}>
                    {training.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de complétion <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
                required
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'expiration (optionnel)
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
              />
            </div>

            {/* Certificate Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificat (optionnel)
              </label>
              <div className="mt-1 flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {certificateFile ? certificateFile.name : 'Choisir un fichier'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {certificateFile && (
                  <FileText className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PDF ou image, max 5 MB
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
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
              'Valider la certification'
            )}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
