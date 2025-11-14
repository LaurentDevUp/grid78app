'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'
import type { Database } from '@/types/database.types'

type Availability = Database['public']['Tables']['availabilities']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface DayAvailability {
  date: string // YYYY-MM-DD
  availableCount: number
  totalCount: number
  percentage: number
  availableUsers: Array<{
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    role: string | null
  }>
}

export function calculateAvailabilityPercentage(
  available: number,
  total: number
): number {
  if (total === 0) return 0
  return Math.round((available / total) * 100)
}

export function useTeamAvailability(date: Date) {
  const queryClient = useQueryClient()
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  const { data, isLoading, error } = useQuery({
    queryKey: ['team-availability', format(monthStart, 'yyyy-MM')],
    queryFn: async () => {
      // Fetch all availabilities for the month
      const { data: availabilities, error: availError } = await supabase
        .from('availabilities')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url,
            role
          )
        `)
        .gte('start_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('end_date', format(monthEnd, 'yyyy-MM-dd'))
        .eq('status', 'available')

      if (availError) throw availError

      // Fetch total team count
      const { count: totalCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      // Generate all days in the month
      const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

      // Aggregate availability by day
      const availabilityByDay: Record<string, DayAvailability> = {}

      allDays.forEach((day) => {
        const dayStr = format(day, 'yyyy-MM-dd')
        const dayDate = day.toISOString().split('T')[0]

        // Find users available on this day
        const availableOnDay = (availabilities || []).filter((avail) => {
          const startDate = avail.start_date
          const endDate = avail.end_date
          return dayDate >= startDate && dayDate <= endDate
        })

        const uniqueUsers = Array.from(
          new Map(
            availableOnDay.map((avail) => [
              (avail.profiles as unknown as Profile).id,
              avail.profiles as unknown as Profile,
            ])
          ).values()
        )

        availabilityByDay[dayStr] = {
          date: dayStr,
          availableCount: uniqueUsers.length,
          totalCount: totalCount || 0,
          percentage: calculateAvailabilityPercentage(
            uniqueUsers.length,
            totalCount || 0
          ),
          availableUsers: uniqueUsers.map((profile) => ({
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
            role: profile.role,
          })),
        }
      })

      return {
        availabilityByDay,
        totalTeamCount: totalCount || 0,
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('availabilities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availabilities',
        },
        () => {
          // Invalidate query on any availability change
          queryClient.invalidateQueries({
            queryKey: ['team-availability', format(monthStart, 'yyyy-MM')],
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [monthStart, queryClient])

  return {
    availabilityByDay: data?.availabilityByDay || {},
    totalTeamCount: data?.totalTeamCount || 0,
    isLoading,
    error,
  }
}
