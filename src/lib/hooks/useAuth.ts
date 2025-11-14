'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Get user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Invalidate profile query on auth change
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  // Fetch profile with React Query
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  }

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name: string; role: 'pilot' | 'chief' }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    
    if (error) throw error
    return data
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    queryClient.clear()
    router.push('/auth/login')
    router.refresh()
  }

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    
    // Update cache
    queryClient.setQueryData(['profile', user.id], data)
    
    return data
  }

  return {
    user,
    profile,
    loading: loading || profileLoading,
    profileError,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
