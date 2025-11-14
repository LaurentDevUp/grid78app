'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Training = Database['public']['Tables']['trainings']['Row']
type TrainingInsert = Database['public']['Tables']['trainings']['Insert']
type UserTraining = Database['public']['Tables']['user_trainings']['Row']
type UserTrainingInsert = Database['public']['Tables']['user_trainings']['Insert']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface TrainingWithStatus extends Training {
  user_training?: UserTraining | null
  isCompleted?: boolean
}

export interface UserTrainingWithDetails extends UserTraining {
  training?: Training | null
  user?: Profile | null
}

export function useTrainings() {
  const queryClient = useQueryClient()

  // Fetch all trainings catalogue
  const { data: trainings, isLoading, error } = useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .order('title', { ascending: true })

      if (error) throw error
      return (data || []) as Training[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create training mutation (chiefs only)
  const createTraining = useMutation({
    mutationFn: async (data: TrainingInsert) => {
      const { data: newTraining, error } = await supabase
        .from('trainings')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return newTraining as Training
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
  })

  // Update training mutation (chiefs only)
  const updateTraining = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Training> & { id: string }) => {
      const { data: updatedTraining, error } = await supabase
        .from('trainings')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedTraining as Training
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
  })

  // Delete training mutation (chiefs only)
  const deleteTraining = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] })
    },
  })

  return {
    trainings: trainings || [],
    isLoading,
    error,
    createTraining: createTraining.mutateAsync,
    updateTraining: updateTraining.mutateAsync,
    deleteTraining: deleteTraining.mutateAsync,
    isCreating: createTraining.isPending,
    isUpdating: updateTraining.isPending,
    isDeleting: deleteTraining.isPending,
  }
}

export function useUserTrainings(userId?: string) {
  const queryClient = useQueryClient()

  // Fetch user certifications
  const { data: certifications, isLoading, error } = useQuery({
    queryKey: ['user-trainings', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')

      const { data, error } = await supabase
        .from('user_trainings')
        .select(`
          *,
          training:training_id (
            id,
            title,
            description,
            duration_hours,
            is_required
          )
        `)
        .eq('user_id', userId)
        .order('completion_date', { ascending: false })

      if (error) throw error
      return (data || []) as UserTrainingWithDetails[]
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Add certification mutation
  const addCertification = useMutation({
    mutationFn: async (data: UserTrainingInsert) => {
      const { data: newCertification, error } = await supabase
        .from('user_trainings')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return newCertification as UserTraining
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-trainings', variables.user_id] })
      queryClient.invalidateQueries({ queryKey: ['trainings-with-status'] })
    },
  })

  // Remove certification mutation
  const removeCertification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_trainings')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-trainings', userId] })
      queryClient.invalidateQueries({ queryKey: ['trainings-with-status'] })
    },
  })

  // Upload certificate document
  const uploadCertificate = async (file: File, userId: string, trainingId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${trainingId}-${Date.now()}.${fileExt}`
    const filePath = `certificates/${fileName}`

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  // Realtime subscription
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`user-trainings-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_trainings',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user-trainings', userId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient])

  return {
    certifications: certifications || [],
    isLoading,
    error,
    addCertification: addCertification.mutateAsync,
    removeCertification: removeCertification.mutateAsync,
    uploadCertificate,
    isAdding: addCertification.isPending,
    isRemoving: removeCertification.isPending,
  }
}

// Hook to get trainings with user completion status
export function useTrainingsWithStatus(userId?: string) {
  const { trainings, isLoading: trainingsLoading } = useTrainings()
  const { certifications, isLoading: certsLoading } = useUserTrainings(userId)

  const trainingsWithStatus: TrainingWithStatus[] = trainings.map((training) => {
    const userTraining = certifications.find((cert) => cert.training_id === training.id)
    return {
      ...training,
      user_training: userTraining,
      isCompleted: !!userTraining,
    }
  })

  return {
    trainingsWithStatus,
    isLoading: trainingsLoading || certsLoading,
  }
}
