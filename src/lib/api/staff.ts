import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Staff = Database['public']['Tables']['staff']['Row'];
type StaffInsert = Database['public']['Tables']['staff']['Insert'];
type StaffUpdate = Database['public']['Tables']['staff']['Update'];

export const staffApi = {
  // Get all staff with optional filtering
  async getAll(filters?: {
    status?: 'available' | 'on_assignment' | 'off_duty';
    role?: string;
  }) {
    let query = supabase
      .from('staff')
      .select('*, users(*)')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get single staff by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('staff')
      .select('*, users(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new staff
  async create(staff: StaffInsert) {
    const { data, error } = await supabase
      .from('staff')
      .insert(staff)
      .select()
      .single();

    if (error) throw error;
    return data as Staff;
  },

  // Update staff
  async update(id: string, updates: StaffUpdate) {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Staff;
  },

  // Delete staff
  async delete(id: string) {
    const { error } = await supabase.from('staff').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get staff statistics
  async getStats() {
    const { data: staff, error } = await supabase
      .from('staff')
      .select('status, completion_rate');

    if (error) throw error;

    const stats = {
      total: staff.length,
      available: staff.filter((s) => s.status === 'available').length,
      onAssignment: staff.filter((s) => s.status === 'on_assignment').length,
      offDuty: staff.filter((s) => s.status === 'off_duty').length,
      avgCompletionRate:
        staff.length > 0
          ? (
              staff.reduce((sum, s) => sum + (s.completion_rate || 0), 0) /
              staff.length
            ).toFixed(1)
          : '0.0',
    };

    return stats;
  },

  // Get staff availability
  async getAvailable() {
    const { data, error } = await supabase
      .from('staff')
      .select('*, users(*)')
      .eq('status', 'available')
      .order('completion_rate', { ascending: false });

    if (error) throw error;
    return data;
  },
};
