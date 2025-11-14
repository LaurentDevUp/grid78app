'use client'

import * as React from 'react'
import { z } from 'zod'
import { useToast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

const profileSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: Profile
  onSave: (data: Partial<Profile>) => Promise<void>
  isUpdating?: boolean
}

export function ProfileForm({ profile, onSave, isUpdating }: ProfileFormProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<ProfileFormData>({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const { addToast } = useToast()

  const handleChange = (field: keyof ProfileFormData, value: string) => {
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
    const result = profileSchema.safeParse(formData)
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

    // Save
    try {
      await onSave(formData)
      setIsEditing(false)
      addToast('success', 'Profil mis à jour avec succès')
    } catch (error) {
      addToast('error', 'Erreur lors de la mise à jour du profil')
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      phone: profile.phone || '',
    })
    setErrors({})
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nom complet</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.full_name || 'Non renseigné'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.phone || 'Non renseigné'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rôle</label>
              <div className="mt-1">
                <Badge variant={profile.role === 'chief' ? 'chief' : 'pilot'}>
                  {profile.role === 'chief' ? 'Chef d\'unité' : 'Télépilote'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date de création
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Dernière mise à jour
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(profile.updated_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors"
          >
            Modifier le profil
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Modifier les informations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.full_name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-grid-cyan-500'
              }`}
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>
            )}
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">L&apos;email ne peut pas être modifié</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-cyan-500"
            />
          </div>

          {/* Role (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <div className="mt-2">
              <Badge variant={profile.role === 'chief' ? 'chief' : 'pilot'}>
                {profile.role === 'chief' ? 'Chef d\'unité' : 'Télépilote'}
              </Badge>
              <p className="mt-1 text-xs text-gray-500">
                Le rôle ne peut pas être modifié
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isUpdating}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="px-4 py-2 bg-grid-cyan-500 text-white rounded-md hover:bg-grid-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUpdating ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  )
}
