/**
 * types/database.ts
 * Updated for @supabase/supabase-js v2.45+
 * which requires CompositeTypes in every schema definition.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      learners: {
        Row: {
          learner_id: string
          name: string
          email: string
          avatar_url: string | null
          bio: string | null
          profession: string | null
          linkedin_url: string | null
          status: 'active' | 'suspended' | 'pending_verification'
          created_at: string
          updated_at: string
        }
        Insert: {
          learner_id: string
          name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          profession?: string | null
          linkedin_url?: string | null
          status?: 'active' | 'suspended' | 'pending_verification'
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          avatar_url?: string | null
          bio?: string | null
          profession?: string | null
          linkedin_url?: string | null
          status?: 'active' | 'suspended' | 'pending_verification'
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          enrollment_id: string
          learner_id: string
          course_slug: string
          status: 'active' | 'completed' | 'paused'
          completion_percentage: number
          enrolled_at: string
          last_accessed_at: string | null
          completed_at: string | null
        }
        Insert: {
          enrollment_id?: string
          learner_id: string
          course_slug: string
          status?: 'active' | 'completed' | 'paused'
          completion_percentage?: number
          enrolled_at?: string
          last_accessed_at?: string | null
          completed_at?: string | null
        }
        Update: {
          status?: 'active' | 'completed' | 'paused'
          completion_percentage?: number
          last_accessed_at?: string | null
          completed_at?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          progress_id: string
          learner_id: string
          course_slug: string
          module_number: number
          lesson_number: number
          is_completed: boolean
          completed_at: string | null
          watched_seconds: number
          last_watched_at: string | null
        }
        Insert: {
          progress_id?: string
          learner_id: string
          course_slug: string
          module_number: number
          lesson_number: number
          is_completed?: boolean
          completed_at?: string | null
          watched_seconds?: number
          last_watched_at?: string | null
        }
        Update: {
          is_completed?: boolean
          completed_at?: string | null
          watched_seconds?: number
          last_watched_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          attempt_id: string
          learner_id: string
          course_slug: string
          answers: number[]
          score: number
          passed: boolean
          attempted_at: string
          attempt_number: number
        }
        Insert: {
          attempt_id?: string
          learner_id: string
          course_slug: string
          answers: number[]
          score: number
          passed: boolean
          attempted_at?: string
          attempt_number?: number
        }
        Update: never
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_id: string
          learner_id: string
          course_slug: string
          learner_name: string
          course_title: string
          issued_at: string
          status: 'pending_payment' | 'issued' | 'revoked'
          verification_url: string
          payment_id: string | null
        }
        Insert: {
          certificate_id: string
          learner_id: string
          course_slug: string
          learner_name: string
          course_title: string
          issued_at?: string
          status?: 'pending_payment' | 'issued' | 'revoked'
          verification_url: string
          payment_id?: string | null
        }
        Update: {
          status?: 'pending_payment' | 'issued' | 'revoked'
          payment_id?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          admin_id: string
          learner_id: string
          role: 'super_admin' | 'content_admin' | 'support'
          created_at: string
        }
        Insert: {
          admin_id?: string
          learner_id: string
          role: 'super_admin' | 'content_admin' | 'support'
        }
        Update: {
          role?: 'super_admin' | 'content_admin' | 'support'
        }
        Relationships: []
      }
      config_settings: {
        Row: {
          key: string
          value: string
          description: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          description?: string
          updated_at?: string
        }
        Update: {
          value?: string
          description?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          log_id: string
          actor_id: string | null
          actor_type: 'admin' | 'learner' | 'system'
          action: string
          target_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          log_id?: string
          actor_id?: string | null
          actor_type: 'admin' | 'learner' | 'system'
          action: string
          target_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: never
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_learner_stats: {
        Args: { p_learner_id: string }
        Returns: Array<{
          enrolled_count: number
          completed_count: number
          certificate_count: number
          total_watch_seconds: number
        }>
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_certificate: {
        Args: { p_certificate_id: string }
        Returns: Array<{
          certificate_id: string
          learner_name: string
          course_title: string
          issued_at: string
          status: string
        }>
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
