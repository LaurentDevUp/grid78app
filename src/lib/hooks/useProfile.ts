'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import imageCompression from 'browser-image-compression'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export function useProfile(userId?: string) {
  const queryClient = useQueryClient()

  // Fetch profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!userId) throw new Error('User ID required')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as Profile
    },
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile', userId] })

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<Profile>(['profile', userId])

      // Optimistically update
      if (previousProfile) {
        queryClient.setQueryData<Profile>(['profile', userId], {
          ...previousProfile,
          ...updates,
        })
      }

      return { previousProfile }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', userId], context.previousProfile)
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  // Upload avatar function
  const uploadAvatar = async (file: File): Promise<string> => {
    if (!userId) throw new Error('User ID required')

    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: 'image/jpeg',
      }

      const compressedFile = await imageCompression(file, options)

      // Create filename
      const fileExt = 'jpg'
      const fileName = `avatar.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Delete old avatar if exists
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(userId)

      if (existingFiles && existingFiles.length > 0) {
        await supabase.storage
          .from('avatars')
          .remove([`${userId}/${existingFiles[0].name}`])
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, {
          upsert: true,
          contentType: 'image/jpeg',
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const avatarUrl = urlData.publicUrl

      // Update profile with new avatar URL
      await updateProfile.mutateAsync({ avatar_url: avatarUrl })

      return avatarUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutateAsync,
    uploadAvatar,
    isUpdating: updateProfile.isPending,
  }
}
