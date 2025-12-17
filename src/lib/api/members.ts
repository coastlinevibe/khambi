import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Member = Database['public']['Tables']['members']['Row'];
type MemberInsert = Database['public']['Tables']['members']['Insert'];
type MemberUpdate = Database['public']['Tables']['members']['Update'];

export const membersApi = {
  // Get all members with optional filtering
  async getAll(filters?: {
    policy_type?: 'bronze' | 'silver' | 'gold';
    status?: 'active' | 'suspended' | 'cancelled';
    search?: string;
  }) {
    let query = supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.policy_type) {
      query = query.eq('policy_type', filters.policy_type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,member_number.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Member[];
  },

  // Get single member by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Member;
  },

  // Get member by member number
  async getByMemberNumber(memberNumber: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('member_number', memberNumber)
      .single();

    if (error) throw error;
    return data as Member;
  },

  // Create new member
  async create(member: MemberInsert) {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data as Member;
  },

  // Update member
  async update(id: string, updates: MemberUpdate) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Member;
  },

  // Delete member
  async delete(id: string) {
    const { error } = await supabase.from('members').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get member statistics
  async getStats() {
    const { data: members, error } = await supabase
      .from('members')
      .select('policy_type, status');

    if (error) throw error;

    const stats = {
      total: members.length,
      active: members.filter((m) => m.status === 'active').length,
      bronze: members.filter((m) => m.policy_type === 'bronze').length,
      silver: members.filter((m) => m.policy_type === 'silver').length,
      gold: members.filter((m) => m.policy_type === 'gold').length,
    };

    return stats;
  },
};
