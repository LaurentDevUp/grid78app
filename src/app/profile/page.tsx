'use client'

import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useProfile } from '@/lib/hooks/useProfile'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { Separator } from '@/components/ui/separator'
import { User, Award, BookOpen } from 'lucide-react'

function ProfileContent() {
  const { user } = useAuth()
  const { profile, updateProfile, uploadAvatar, isUpdating, isLoading } = useProfile(user?.id)

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grid-cyan-500"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Impossible de charger le profil</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-grid-navy-600 mb-2">
            Mon Profil
          </h1>
          <p className="text-grid-navy-500">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-grid-cyan-600" />
            <h2 className="text-xl font-semibold text-gray-900">Photo de profil</h2>
          </div>
          <AvatarUpload
            currentAvatar={profile.avatar_url}
            onUpload={uploadAvatar}
            userName={profile.full_name}
          />
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ProfileForm
            profile={profile}
            onSave={async (data) => { await updateProfile(data) }}
            isUpdating={isUpdating}
          />
        </div>

        {/* Qualifications Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-grid-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Qualifications</h2>
          </div>
          <Separator className="mb-4" />
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Section à venir dans PROMPT 9</p>
            <p className="text-xs text-gray-400">
              Vos certifications et qualifications seront affichées ici
            </p>
          </div>
        </div>

        {/* Formations Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-grid-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Formations complétées
            </h2>
          </div>
          <Separator className="mb-4" />
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Section à venir dans PROMPT 9</p>
            <p className="text-xs text-gray-400">
              Vos formations complétées seront listées ici
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
