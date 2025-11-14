'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type SafetyGuideline = Database['public']['Tables']['safety_guidelines']['Row']
type SafetyGuidelineInsert = Database['public']['Tables']['safety_guidelines']['Insert']

export type GuidelinePriority = 'high' | 'medium' | 'low'
export type GuidelineCategory = 'pre_flight' | 'flight' | 'emergency' | 'maintenance' | 'general'

export interface GuidelinesFilters {
  category?: GuidelineCategory
  priority?: GuidelinePriority
  search?: string
}

export function useSafetyGuidelines(filters?: GuidelinesFilters) {
  const queryClient = useQueryClient()

  // Fetch guidelines with filters
  const { data: guidelines, isLoading, error } = useQuery({
    queryKey: ['safety-guidelines', filters],
    queryFn: async () => {
      let query = supabase
        .from('safety_guidelines')
        .select('*')
        .order('priority', { ascending: false })
        .order('title', { ascending: true })

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority)
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as SafetyGuideline[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create guideline mutation (chiefs only)
  const createGuideline = useMutation({
    mutationFn: async (data: SafetyGuidelineInsert) => {
      const { data: newGuideline, error } = await supabase
        .from('safety_guidelines')
        .insert(data)
        .select()
        .single()

      if (error) throw error
      return newGuideline as SafetyGuideline
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-guidelines'] })
    },
  })

  // Update guideline mutation (chiefs only)
  const updateGuideline = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SafetyGuideline> & { id: string }) => {
      const { data: updatedGuideline, error } = await supabase
        .from('safety_guidelines')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedGuideline as SafetyGuideline
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-guidelines'] })
    },
  })

  // Delete guideline mutation (chiefs only)
  const deleteGuideline = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('safety_guidelines')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-guidelines'] })
    },
  })

  // Upload document
  const uploadDocument = async (file: File, guidelineId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${guidelineId}-${Date.now()}.${fileExt}`
    const filePath = `safety/${fileName}`

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
    const channel = supabase
      .channel('safety-guidelines-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safety_guidelines',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['safety-guidelines'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return {
    guidelines: guidelines || [],
    isLoading,
    error,
    createGuideline: createGuideline.mutateAsync,
    updateGuideline: updateGuideline.mutateAsync,
    deleteGuideline: deleteGuideline.mutateAsync,
    uploadDocument,
    isCreating: createGuideline.isPending,
    isUpdating: updateGuideline.isPending,
    isDeleting: deleteGuideline.isPending,
  }
}

// Helper to group guidelines by category
export function groupByCategory(guidelines: SafetyGuideline[]) {
  const grouped: Record<GuidelineCategory, SafetyGuideline[]> = {
    pre_flight: [],
    flight: [],
    emergency: [],
    maintenance: [],
    general: [],
  }

  guidelines.forEach((guideline) => {
    const category = (guideline.category as GuidelineCategory) || 'general'
    grouped[category].push(guideline)
  })

  return grouped
}
