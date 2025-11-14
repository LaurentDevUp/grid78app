'use client'

import * as React from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentAvatar?: string | null
  onUpload: (file: File) => Promise<string>
  userName?: string | null
}

export function AvatarUpload({ currentAvatar, onUpload, userName }: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5 MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      setIsUploading(true)
      setProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      await onUpload(file)

      clearInterval(progressInterval)
      setProgress(100)

      // Reset after success
      setTimeout(() => {
        setPreview(null)
        setProgress(0)
        setIsUploading(false)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
      setPreview(null)
      setProgress(0)
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleCancelPreview = () => {
    setPreview(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Avatar Display */}
      <div className="flex items-center gap-4">
        <Avatar
          src={preview || currentAvatar}
          alt={userName || 'User'}
          className="h-24 w-24"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Photo de profil</h3>
          <p className="text-sm text-gray-500">
            JPG, PNG ou WebP. Max 5 MB.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          isDragging
            ? 'border-grid-cyan-500 bg-grid-cyan-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 mx-auto text-grid-cyan-500 animate-spin" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-grid-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{progress}%</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-grid-cyan-600 hover:text-grid-cyan-700 font-medium"
              >
                Cliquez pour uploader
              </button>
              {' '}ou glissez-déposez
            </p>
            <p className="text-xs text-gray-500">
              Image jusqu&apos;à 5 MB
            </p>
          </>
        )}
      </div>

      {/* Preview with Cancel */}
      {preview && !isUploading && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <img
            src={preview}
            alt="Preview"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              Nouvelle photo prête
            </p>
            <p className="text-xs text-blue-700">
              Cliquez sur Enregistrer pour valider
            </p>
          </div>
          <button
            onClick={handleCancelPreview}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Annuler"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
