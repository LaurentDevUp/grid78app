export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'pilot' | 'chief'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'pilot' | 'chief'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'pilot' | 'chief'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      availabilities: {
        Row: {
          id: string
          user_id: string
          start_date: string
          end_date: string
          status: 'available' | 'unavailable' | 'tentative'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_date: string
          end_date: string
          status?: 'available' | 'unavailable' | 'tentative'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          status?: 'available' | 'unavailable' | 'tentative'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'availabilities_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      missions: {
        Row: {
          id: string
          title: string
          description: string | null
          mission_date: string
          location: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
          chief_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          mission_date: string
          location?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled'
          chief_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          mission_date?: string
          location?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled'
          chief_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'missions_chief_id_fkey'
            columns: ['chief_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      flights: {
        Row: {
          id: string
          mission_id: string
          pilot_id: string
          flight_date: string
          duration_minutes: number | null
          drone_model: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          pilot_id: string
          flight_date: string
          duration_minutes?: number | null
          drone_model?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          pilot_id?: string
          flight_date?: string
          duration_minutes?: number | null
          drone_model?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'flights_mission_id_fkey'
            columns: ['mission_id']
            referencedRelation: 'missions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'flights_pilot_id_fkey'
            columns: ['pilot_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      trainings: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_hours: number | null
          category: string | null
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration_hours?: number | null
          category?: string | null
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration_hours?: number | null
          category?: string | null
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_trainings: {
        Row: {
          id: string
          user_id: string
          training_id: string
          completed_at: string
          expires_at: string | null
          certificate_url: string | null
          validated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          training_id: string
          completed_at: string
          expires_at?: string | null
          certificate_url?: string | null
          validated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          training_id?: string
          completed_at?: string
          expires_at?: string | null
          certificate_url?: string | null
          validated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_trainings_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_trainings_training_id_fkey'
            columns: ['training_id']
            referencedRelation: 'trainings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_trainings_validated_by_fkey'
            columns: ['validated_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      safety_guidelines: {
        Row: {
          id: string
          title: string
          content: string
          category: string | null
          priority: 'low' | 'medium' | 'high' | 'critical'
          document_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string | null
          priority?: 'low' | 'medium' | 'high' | 'critical'
          document_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string | null
          priority?: 'low' | 'medium' | 'high' | 'critical'
          document_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'safety_guidelines_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
