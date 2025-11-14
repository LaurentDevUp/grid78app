'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Flight = Database['public']['Tables']['flights']['Row']
type FlightInsert = Database['public']['Tables']['flights']['Insert']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface FlightWithPilot extends Flight {
  pilot?: Profile | null
}

export function useFlights(missionId?: string) {
  const queryClient = useQueryClient()

  // Fetch flights for a mission
  const { data: flights, isLoading, error } = useQuery({
    queryKey: ['flights', missionId],
    queryFn: async () => {
      if (!missionId) throw new Error('Mission ID required')

      const { data, error } = await supabase
        .from('flights')
        .select(`
          *,
          pilot:pilot_id (
            id,
            full_name,
            email,
            avatar_url,
            role
          )
        `)
        .eq('mission_id', missionId)
        .order('flight_date', { ascending: false })

      if (error) throw error
      return (data || []) as FlightWithPilot[]
    },
    enabled: !!missionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })

  // Realtime subscription for flights of this mission
  useEffect(() => {
    if (!missionId) return

    const channel = supabase
      .channel(`flights-mission-${missionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flights',
          filter: `mission_id=eq.${missionId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['flights', missionId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [missionId, queryClient])

  // Create flight mutation
  const createFlight = useMutation({
    mutationFn: async (data: FlightInsert) => {
      const { data: newFlight, error } = await supabase
        .from('flights')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return newFlight as Flight
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights', missionId] })
      queryClient.invalidateQueries({ queryKey: ['team-stats'] })
    },
  })

  // Update flight mutation
  const updateFlight = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Flight> & { id: string }) => {
      const { data: updatedFlight, error } = await supabase
        .from('flights')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedFlight as Flight
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights', missionId] })
      queryClient.invalidateQueries({ queryKey: ['team-stats'] })
    },
  })

  // Delete flight mutation
  const deleteFlight = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flights')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights', missionId] })
      queryClient.invalidateQueries({ queryKey: ['team-stats'] })
    },
  })

  return {
    flights: flights || [],
    isLoading,
    error,
    createFlight: createFlight.mutateAsync,
    updateFlight: updateFlight.mutateAsync,
    deleteFlight: deleteFlight.mutateAsync,
    isCreating: createFlight.isPending,
    isUpdating: updateFlight.isPending,
    isDeleting: deleteFlight.isPending,
  }
}
