'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Mission = Database['public']['Tables']['missions']['Row']
type MissionInsert = Database['public']['Tables']['missions']['Insert']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface MissionWithChief extends Mission {
  chief?: Profile | null
}

export type MissionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'

export interface MissionsFilters {
  status?: MissionStatus
  startDate?: string
  endDate?: string
}

export function useMissions(filters?: MissionsFilters) {
  const queryClient = useQueryClient()

  // Fetch missions with filters
  const { data: missions, isLoading, error } = useQuery({
    queryKey: ['missions', filters],
    queryFn: async () => {
      let query = supabase
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
        .order('mission_date', { ascending: false })

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.startDate) {
        query = query.gte('mission_date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('mission_date', filters.endDate)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as MissionWithChief[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Realtime subscription
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
          queryClient.invalidateQueries({ queryKey: ['missions'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return {
    missions: missions || [],
    isLoading,
    error,
  }
}

export function useMission(missionId?: string) {
  const queryClient = useQueryClient()

  const { data: mission, isLoading, error } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: async () => {
      if (!missionId) throw new Error('Mission ID required')

      const { data, error } = await supabase
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
        .eq('id', missionId)
        .single()

      if (error) throw error
      return data as MissionWithChief
    },
    enabled: !!missionId,
    staleTime: 2 * 60 * 1000,
  })

  // Create mission mutation
  const createMission = useMutation({
    mutationFn: async (data: MissionInsert) => {
      const { data: newMission, error } = await supabase
        .from('missions')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return newMission as Mission
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-missions'] })
      queryClient.invalidateQueries({ queryKey: ['team-stats'] })
    },
  })

  // Update mission mutation
  const updateMission = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Mission> & { id: string }) => {
      const { data: updatedMission, error } = await supabase
        .from('missions')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedMission as Mission
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['mission', missionId] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-missions'] })
      queryClient.invalidateQueries({ queryKey: ['team-stats'] })
    },
  })

  // Delete mission mutation
  const deleteMission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-missions'] })
      queryClient.invalidateQueries({ queryKey: ['team-stats'] })
    },
  })

  return {
    mission,
    isLoading,
    error,
    createMission: createMission.mutateAsync,
    updateMission: updateMission.mutateAsync,
    deleteMission: deleteMission.mutateAsync,
    isCreating: createMission.isPending,
    isUpdating: updateMission.isPending,
    isDeleting: deleteMission.isPending,
  }
}
