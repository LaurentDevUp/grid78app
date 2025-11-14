'use client'

import * as React from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { Upload, FileText, Eye } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { GuidelinePriority, GuidelineCategory } from '@/lib/hooks/useSafety'
import type { Database } from '@/types/database.types'

type SafetyGuideline = Database['public']['Tables']['safety_guidelines']['Row']

interface GuidelineEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: GuidelineFormData) => Promise<void>
  uploadDocument: (file: File, guidelineId: string) => Promise<string>
  guideline?: SafetyGuideline | null
}

export interface GuidelineFormData {
  title: string
  content: string
  category: GuidelineCategory
  priority: GuidelinePriority
  document_url?: string
}

export function GuidelineEditor({
  open,
  onOpenChange,
  onSubmit,
  uploadDocument,
  guideline,
}: GuidelineEditorProps) {
  const [formData, setFormData] = React.useState<GuidelineFormData>({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
  })
  const [documentFile, setDocumentFile] = React.useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { addToast } = useToast()

  // Initialize form with guideline data if editing
  React.useEffect(() => {
    if (guideline && open) {
      setFormData({
        title: guideline.title,
        content: guideline.content || '',
        category: (guideline.category as GuidelineCategory) || 'general',
        priority: (guideline.priority as GuidelinePriority) || 'medium',
        document_url: guideline.document_url || undefined,
      })
    } else if (!open) {
      // Reset on close
      setFormData({
        title: '',
        content: '',
        category: 'general',
        priority: 'medium',
      })
      setDocumentFile(null)
      setShowPreview(false)
      setError(null)
    }
  }, [guideline, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 10 MB')
      return
    }

    setDocumentFile(file)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Le titre est requis')
      return
    }

    if (!formData.content.trim()) {
      setError('Le contenu est requis')
      return
    }

    try {
      setIsSubmitting(true)

      let documentUrl = formData.document_url

      // Upload document if new file provided
      if (documentFile && guideline) {
        documentUrl = await uploadDocument(documentFile, guideline.id)
      }

      // Submit form
      await onSubmit({
        ...formData,
        document_url: documentUrl,
      })

      addToast('success', guideline ? 'Consigne mise à jour' : 'Consigne créée')
      handleClose()
    } catch (err) {
      console.error('Error saving guideline:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement')
      addToast('error', 'Erreur lors de l\'enregistrement')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={handleClose} size="large">
      <ModalHeader onClose={handleClose}>
        <ModalTitle>
          {guideline ? 'Modifier la consigne' : 'Nouvelle consigne de sécurité'}
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-orange-500"
                placeholder="Ex: Vérifications pré-vol"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GuidelineCategory })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-orange-500"
                required
              >
                <option value="pre_flight">Pré-vol</option>
                <option value="flight">En vol</option>
                <option value="emergency">Urgence</option>
                <option value="maintenance">Maintenance</option>
                <option value="general">Général</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorité <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as GuidelinePriority })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-orange-500"
                required
              >
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>

            {/* Content (Markdown) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Contenu (Markdown) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-sm text-grid-orange-600 hover:text-grid-orange-800"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'Éditer' : 'Prévisualiser'}
                </button>
              </div>

              {showPreview ? (
                <div className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content || '*Aucun contenu*'}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grid-orange-500 font-mono text-sm"
                  placeholder="Utilisez Markdown pour formater le texte...&#10;&#10;**Gras**, *Italique*, [Lien](url)&#10;- Liste&#10;1. Numérotée"
                  required
                />
              )}
              <p className="mt-1 text-xs text-gray-500">
                Utilisez Markdown pour formater le texte (gras, listes, liens, etc.)
              </p>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document associé (optionnel)
              </label>
              <div className="mt-1 flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {documentFile ? documentFile.name : formData.document_url ? 'Remplacer le document' : 'Choisir un fichier'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {(documentFile || formData.document_url) && (
                  <FileText className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PDF, Word ou image, max 10 MB
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
            className="px-4 py-2 bg-grid-orange-500 text-white rounded-md hover:bg-grid-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              guideline ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
