'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from './client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'
export type RealtimeTable = 
  | 'profiles'
  | 'availabilities'
  | 'missions'
  | 'flights'
  | 'trainings'
  | 'user_trainings'
  | 'safety_guidelines'

interface RealtimeSubscriptionConfig {
  table: RealtimeTable
  event?: RealtimeEvent
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  invalidateQueries?: string[][]
}

/**
 * Hook générique pour subscriptions Realtime Supabase
 * Gère automatiquement cleanup et reconnexion
 */
export function useRealtimeSubscription(config: RealtimeSubscriptionConfig) {
  const queryClient = useQueryClient()
  const { table, event = '*', filter, onInsert, onUpdate, onDelete, invalidateQueries } = config

  useEffect(() => {
    const channelName = filter 
      ? `${table}-${filter.replace(/[^a-zA-Z0-9]/g, '-')}`
      : `${table}-changes`

    let channel: RealtimeChannel

    try {
      channel = supabase.channel(channelName)

      // Setup postgres changes listener
      const changeConfig: any = {
        event,
        schema: 'public',
        table,
      }

      if (filter) {
        changeConfig.filter = filter
      }

      channel.on(
        'postgres_changes',
        changeConfig,
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log(`[Realtime] ${table}:`, payload.eventType, payload)

          // Call specific handlers
          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload.new)
          }
          if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload.new)
          }
          if (payload.eventType === 'DELETE' && onDelete) {
            onDelete(payload.old)
          }

          // Invalidate queries
          if (invalidateQueries) {
            invalidateQueries.forEach((queryKey) => {
              queryClient.invalidateQueries({ queryKey })
            })
          }
        }
      )

      // Subscribe to channel
      channel.subscribe((status) => {
        console.log(`[Realtime] Channel ${channelName}:`, status)
      })
    } catch (error) {
      console.error('[Realtime] Subscription error:', error)
    }

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        console.log(`[Realtime] Unsubscribed from ${channelName}`)
      }
    }
  }, [table, event, filter, queryClient])
}

/**
 * Hook pour subscription availabilities
 * Invalide dashboard calendar et team availability
 */
export function useAvailabilitiesRealtimeSync(userId?: string) {
  useRealtimeSubscription({
    table: 'availabilities',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    invalidateQueries: [
      ['availabilities', userId],
      ['team-availability'],
      ['team-stats'],
    ],
  })
}

/**
 * Hook pour subscription missions
 * Invalide liste missions et stats
 */
export function useMissionsRealtimeSync() {
  useRealtimeSubscription({
    table: 'missions',
    invalidateQueries: [
      ['missions'],
      ['upcoming-missions'],
      ['team-stats'],
    ],
  })
}

/**
 * Hook pour subscription flights d'une mission
 * Invalide flights de cette mission et stats
 */
export function useFlightsRealtimeSync(missionId?: string) {
  useRealtimeSubscription({
    table: 'flights',
    filter: missionId ? `mission_id=eq.${missionId}` : undefined,
    invalidateQueries: [
      ['flights', missionId],
      ['team-stats'],
    ],
  })
}

/**
 * Hook pour subscription trainings
 * Invalide catalogue et certifications
 */
export function useTrainingsRealtimeSync(userId?: string) {
  useRealtimeSubscription({
    table: 'user_trainings',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    invalidateQueries: [
      ['user-trainings', userId],
      ['trainings-with-status'],
    ],
  })
}

/**
 * Hook pour subscription safety guidelines
 * Invalide liste consignes
 */
export function useSafetyGuidelinesRealtimeSync() {
  useRealtimeSubscription({
    table: 'safety_guidelines',
    invalidateQueries: [
      ['safety-guidelines'],
    ],
  })
}

/**
 * Setup global realtime subscriptions
 * À appeler dans layout ou provider
 */
export function setupGlobalRealtimeSubscriptions(userId?: string) {
  if (!userId) return

  // Subscribe to user-specific changes
  const userChannel = supabase
    .channel(`user-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      () => {
        console.log('[Realtime] Profile updated')
        // Trigger profile refetch via event
        window.dispatchEvent(new CustomEvent('profile-updated'))
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(userChannel)
  }
}
