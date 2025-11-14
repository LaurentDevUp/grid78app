'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { Edit, Download, FileText, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import type { Database } from '@/types/database.types'

type SafetyGuideline = Database['public']['Tables']['safety_guidelines']['Row']

interface GuidelineCardProps {
  guideline: SafetyGuideline
  onEdit?: () => void
  showActions?: boolean
}

export function GuidelineCard({ guideline, onEdit, showActions = false }: GuidelineCardProps) {
  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: {
        variant: 'danger' as const,
        label: 'Priorité Haute',
        icon: AlertTriangle,
        color: 'text-red-600',
      },
      medium: {
        variant: 'warning' as const,
        label: 'Priorité Moyenne',
        icon: AlertCircle,
        color: 'text-orange-600',
      },
      low: {
        variant: 'default' as const,
        label: 'Priorité Basse',
        icon: Info,
        color: 'text-blue-600',
      },
    }
    return configs[priority as keyof typeof configs] || configs.low
  }

  const priorityConfig = getPriorityConfig(guideline.priority || 'low')
  const PriorityIcon = priorityConfig.icon

  const handleDownload = () => {
    if (!guideline.document_url) return
    
    const link = document.createElement('a')
    link.href = guideline.document_url
    link.download = `${guideline.title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow border-l-4 border-l-transparent hover:border-l-grid-orange-500 transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <PriorityIcon className={`h-5 w-5 ${priorityConfig.color}`} />
              <h3 className="text-lg font-semibold text-gray-900">
                {guideline.title}
              </h3>
            </div>
            <Badge variant={priorityConfig.variant}>
              {priorityConfig.label}
            </Badge>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2 ml-4">
              {guideline.document_url && (
                <button
                  onClick={handleDownload}
                  className="p-2 text-grid-cyan-600 hover:bg-grid-cyan-50 rounded-md transition-colors"
                  title="Télécharger le document"
                >
                  <Download className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content (Markdown) */}
        <div className="prose prose-sm max-w-none text-gray-700 mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {guideline.content || ''}
          </ReactMarkdown>
        </div>

        {/* Document Link */}
        {guideline.document_url && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-grid-cyan-600 hover:text-grid-cyan-800 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Document joint disponible
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
