'use client'

import * as React from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTeamAvailability } from '@/lib/hooks/useTeamAvailability'
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function TeamCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)

  const { availabilityByDay, totalTeamCount, isLoading } = useTeamAvailability(currentMonth)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Lundi
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const getColorClass = (percentage: number) => {
    if (percentage >= 50) return 'bg-green-100 border-green-500 text-green-700'
    if (percentage >= 25) return 'bg-orange-100 border-orange-500 text-orange-700'
    return 'bg-red-100 border-red-500 text-red-700'
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDayClick = (dayStr: string) => {
    setSelectedDate(dayStr)
  }

  const selectedDayData = selectedDate ? availabilityByDay[selectedDate] : null

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grid-cyan-500"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-grid-navy-700">
            Disponibilités de l&apos;équipe
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const dayData = availabilityByDay[dayStr]
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isTodayDate = isToday(day)

              return (
                <button
                  key={dayStr}
                  onClick={() => handleDayClick(dayStr)}
                  disabled={!isCurrentMonth}
                  className={cn(
                    'aspect-square p-2 rounded-lg border-2 transition-all',
                    isCurrentMonth
                      ? 'hover:shadow-md cursor-pointer'
                      : 'opacity-30 cursor-not-allowed border-transparent',
                    isTodayDate && 'ring-2 ring-grid-cyan-500 ring-offset-2',
                    dayData && isCurrentMonth
                      ? getColorClass(dayData.percentage)
                      : 'border-gray-200 bg-white'
                  )}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={cn(
                        'text-sm font-medium mb-1',
                        !isCurrentMonth && 'text-gray-400'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayData && isCurrentMonth && (
                      <span className="text-xs font-semibold">
                        {dayData.availableCount}/{totalTeamCount}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 bg-green-100 border-green-500"></div>
              <span className="text-gray-600">≥50% disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 bg-orange-100 border-orange-500"></div>
              <span className="text-gray-600">25-49% disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 bg-red-100 border-red-500"></div>
              <span className="text-gray-600">&lt;25% disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Available users */}
      <Modal open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <ModalHeader onClose={() => setSelectedDate(null)}>
          <ModalTitle>
            Pilotes disponibles le{' '}
            {selectedDate && format(new Date(selectedDate), 'dd MMMM yyyy', { locale: fr })}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedDayData && selectedDayData.availableUsers.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {selectedDayData.availableCount} pilote(s) disponible(s) sur{' '}
                  {totalTeamCount}
                </p>
                <Badge
                  variant={
                    selectedDayData.percentage >= 50
                      ? 'success'
                      : selectedDayData.percentage >= 25
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {selectedDayData.percentage}%
                </Badge>
              </div>
              <div className="space-y-2">
                {selectedDayData.availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar
                      src={user.avatar_url}
                      alt={user.full_name || user.email}
                      className="h-10 w-10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'chief' ? 'chief' : 'pilot'}>
                      {user.role === 'chief' ? 'Chef' : 'Pilot'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun pilote disponible ce jour</p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}
