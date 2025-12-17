import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Contact = Database['public']['Tables']['contacts']['Row'];
type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export const contactsApi = {
  // Get all contacts with optional filtering
  async getAll(filters?: {
    type?: 'member' | 'attending_member' | 'staff' | 'supplier';
    search?: string;
  }) {
    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Contact[];
  },

  // Get single contact by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Contact;
  },

  // Create new contact
  async create(contact: ContactInsert) {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single();

    if (error) throw error;
    return data as Contact;
  },

  // Update contact
  async update(id: string, updates: ContactUpdate) {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Contact;
  },

  // Delete contact
  async delete(id: string) {
    const { error } = await supabase.from('contacts').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get contact statistics
  async getStats() {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('type, events_count');

    if (error) throw error;

    const stats = {
      total: contacts.length,
      members: contacts.filter((c) => c.type === 'member').length,
      attendingMembers: contacts.filter((c) => c.type === 'attending_member')
        .length,
      staff: contacts.filter((c) => c.type === 'staff').length,
      suppliers: contacts.filter((c) => c.type === 'supplier').length,
    };

    return stats;
  },

  // Export contacts (returns data for CSV/Excel)
  async export(filters?: {
    type?: 'member' | 'attending_member' | 'staff' | 'supplier';
  }) {
    const contacts = await this.getAll(filters);
    return contacts;
  },
};
