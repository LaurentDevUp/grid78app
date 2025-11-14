'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export function useTeamStats() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['team-stats'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd')
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

      // Total members
      const { count: totalMembers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Available today
      const { count: availableToday } = await supabase
        .from('availabilities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available')
        .lte('start_date', today)
        .gte('end_date', today)

      // Missions this month
      const { count: missionsThisMonth } = await supabase
        .from('missions')
        .select('*', { count: 'exact', head: true })
        .gte('mission_date', monthStart)
        .lte('mission_date', monthEnd)

      // Active missions
      const { count: activeMissions } = await supabase
        .from('missions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress')

      // Total flight hours this month
      const { data: flights } = await supabase
        .from('flights')
        .select('duration_minutes')
        .gte('flight_date', monthStart)
        .lte('flight_date', monthEnd)

      const totalMinutes = flights?.reduce(
        (sum, flight) => sum + (flight.duration_minutes || 0),
        0
      ) || 0
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10

      return {
        totalMembers: totalMembers || 0,
        availableToday: availableToday || 0,
        missionsThisMonth: missionsThisMonth || 0,
        activeMissions: activeMissions || 0,
        totalFlightHours: totalHours,
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })

  // Realtime subscription for missions
  useEffect(() => {
    const channel = supabase
      .channel('missions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'missions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['team-stats'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return {
    stats: data,
    isLoading,
    error,
  }
}
