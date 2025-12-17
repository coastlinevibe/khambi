import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'manager' | 'staff';
          first_name: string | null;
          last_name: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      members: {
        Row: {
          id: string;
          member_number: string;
          first_name: string;
          last_name: string;
          id_number: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          policy_type: 'bronze' | 'silver' | 'gold';
          cover_amount: number;
          status: 'active' | 'suspended' | 'cancelled';
          joined_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['members']['Insert']>;
      };
      attending_members: {
        Row: {
          id: string;
          member_id: string | null;
          first_name: string;
          last_name: string;
          relationship: string | null;
          phone: string;
          email: string | null;
          reference_number: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['attending_members']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['attending_members']['Insert']>;
      };
      staff: {
        Row: {
          id: string;
          user_id: string | null;
          employee_number: string;
          role: string;
          status: 'available' | 'on_assignment' | 'off_duty';
          phone: string | null;
          completion_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['staff']['Insert']>;
      };
      burial_events: {
        Row: {
          id: string;
          event_number: string;
          member_id: string | null;
          deceased_name: string;
          event_date: string;
          event_time: string;
          location: string;
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          manager_id: string | null;
          progress: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['burial_events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['burial_events']['Insert']>;
      };
      claims: {
        Row: {
          id: string;
          claim_number: string;
          member_id: string | null;
          attending_member_id: string | null;
          deceased_name: string;
          amount: number;
          status: 'new' | 'processing' | 'approved' | 'rejected';
          submitted_date: string;
          processed_date: string | null;
          processor_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['claims']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['claims']['Insert']>;
      };
      checklists: {
        Row: {
          id: string;
          event_id: string;
          phase: 'pre_event' | 'during_event' | 'post_event';
          task_name: string;
          description: string | null;
          assigned_to: string | null;
          due_date: string | null;
          completed: boolean;
          completed_at: string | null;
          completed_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['checklists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['checklists']['Insert']>;
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          type: 'member' | 'attending_member' | 'staff' | 'supplier';
          relationship: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          events_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
      };
    };
  };
}
