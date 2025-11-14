'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import type { Database } from '@/types/database.types'

type Mission = Database['public']['Tables']['missions']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface MissionWithChief extends Mission {
  chief?: Profile | null
}

export function useUpcomingMissions(limit: number = 3) {
  const queryClient = useQueryClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const { data, isLoading, error } = useQuery({
    queryKey: ['upcoming-missions', limit],
    queryFn: async () => {
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select(`
          *,
          chief:chief_id (
            id,
            full_name,
            email,
            avatar_url,
            role
          )
        `)
        .gte('mission_date', today)
        .in('status', ['planned', 'in_progress'])
        .order('mission_date', { ascending: true })
        .limit(limit)

      if (missionsError) throw missionsError

      return (missions || []) as MissionWithChief[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('upcoming-missions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'missions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['upcoming-missions'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return {
    missions: data || [],
    isLoading,
    error,
  }
}
