'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, Circle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { TrainingWithStatus } from '@/lib/hooks/useTrainings'

interface TrainingCardProps {
  training: TrainingWithStatus
  onClick?: () => void
}

export function TrainingCard({ training, onClick }: TrainingCardProps) {
  const isCompleted = training.isCompleted
  const completionDate = training.user_training?.completed_at

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-6 transition-all cursor-pointer border-2 ${
        isCompleted
          ? 'border-green-200 hover:border-green-400'
          : 'border-gray-200 hover:border-grid-cyan-500'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {training.title}
        </h3>
        {isCompleted ? (
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 ml-2" />
        ) : (
          <Circle className="h-6 w-6 text-gray-400 flex-shrink-0 ml-2" />
        )}
      </div>

      {training.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {training.description}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        {training.duration_hours && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {training.duration_hours}h
          </div>
        )}

        {training.is_required && (
          <Badge variant="warning">Obligatoire</Badge>
        )}

        {isCompleted && completionDate && (
          <Badge variant="success">
            Complété le {format(parseISO(completionDate), 'd MMM yyyy', { locale: fr })}
          </Badge>
        )}

        {!isCompleted && (
          <Badge variant="default">À faire</Badge>
        )}
      </div>

      {training.user_training?.expires_at && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Expire le{' '}
            {format(parseISO(training.user_training.expires_at), 'd MMM yyyy', {
              locale: fr,
            })}
          </p>
        </div>
      )}
    </div>
  )
}
