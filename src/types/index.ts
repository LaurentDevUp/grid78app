export type UserRole = 'pilot' | 'chief'

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Availability {
  id: string
  user_id: string
  start_date: string
  end_date: string
  status: 'available' | 'unavailable' | 'tentative'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Mission {
  id: string
  title: string
  description?: string
  mission_date: string
  location?: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  chief_id?: string
  created_at: string
  updated_at: string
}

export interface Flight {
  id: string
  mission_id: string
  pilot_id: string
  flight_date: string
  duration_minutes?: number
  drone_model?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Training {
  id: string
  name: string
  description?: string
  duration_hours?: number
  category?: string
  document_url?: string
  created_at: string
  updated_at: string
}

export interface UserTraining {
  id: string
  user_id: string
  training_id: string
  completed_at: string
  expires_at?: string
  certificate_url?: string
  validated_by?: string
  created_at: string
  updated_at: string
}

export interface SafetyGuideline {
  id: string
  title: string
  content: string
  category?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  document_url?: string
  created_by?: string
  created_at: string
  updated_at: string
}
