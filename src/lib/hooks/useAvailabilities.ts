'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import type { Database } from '@/types/database.types'

type Availability = Database['public']['Tables']['availabilities']['Row']
type AvailabilityInsert = Database['public']['Tables']['availabilities']['Insert']

export function useAvailabilities(userId?: string) {
  const queryClient = useQueryClient()

  // Fetch user availabilities
  const { data: availabilities, isLoading, error } = useQuery({
    queryKey: ['availabilities', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')

      const { data, error } = await supabase
        .from('availabilities')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: true })

      if (error) throw error
      return data as Availability[]
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Check if date range overlaps with existing availabilities
  const hasOverlap = (startDate: Date, endDate: Date, excludeId?: string): boolean => {
    if (!availabilities) return false

    const start = format(startDate, 'yyyy-MM-dd')
    const end = format(endDate, 'yyyy-MM-dd')

    return availabilities.some((avail) => {
      // Skip the availability being edited
      if (excludeId && avail.id === excludeId) return false

      const availStart = avail.start_date
      const availEnd = avail.end_date

      // Check if ranges overlap
      // Range 1: [start, end]
      // Range 2: [availStart, availEnd]
      // Overlap if: start <= availEnd AND end >= availStart
      return start <= availEnd && end >= availStart
    })
  }

  // Create availability mutation
  const createAvailability = useMutation({
    mutationFn: async (data: Omit<AvailabilityInsert, 'user_id'>) => {
      if (!userId) throw new Error('User ID required')

      const { data: newAvailability, error } = await supabase
        .from('availabilities')
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return newAvailability as Availability
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilities', userId] })
      // Also invalidate team availability for dashboard
      queryClient.invalidateQueries({ queryKey: ['team-availability'] })
    },
  })

  // Update availability mutation
  const updateAvailability = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Availability> & { id: string }) => {
      const { data: updatedAvailability, error } = await supabase
        .from('availabilities')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedAvailability as Availability
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilities', userId] })
      queryClient.invalidateQueries({ queryKey: ['team-availability'] })
    },
  })

  // Delete availability mutation
  const deleteAvailability = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('availabilities')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilities', userId] })
      queryClient.invalidateQueries({ queryKey: ['team-availability'] })
    },
  })

  // Realtime subscription
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`availabilities-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availabilities',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['availabilities', userId] })
          queryClient.invalidateQueries({ queryKey: ['team-availability'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient])

  return {
    availabilities: availabilities || [],
    isLoading,
    error,
    hasOverlap,
    createAvailability: createAvailability.mutateAsync,
    updateAvailability: updateAvailability.mutateAsync,
    deleteAvailability: deleteAvailability.mutateAsync,
    isCreating: createAvailability.isPending,
    isUpdating: updateAvailability.isPending,
    isDeleting: deleteAvailability.isPending,
  }
}
