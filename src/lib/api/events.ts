import { supabase } from '../supabase';
import type { Database } from '../supabase';

type BurialEvent = Database['public']['Tables']['burial_events']['Row'];
type BurialEventInsert = Database['public']['Tables']['burial_events']['Insert'];
type BurialEventUpdate = Database['public']['Tables']['burial_events']['Update'];

export const eventsApi = {
  // Get all events with optional filtering
  async getAll(filters?: {
    status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    date_from?: string;
    date_to?: string;
  }) {
    let query = supabase
      .from('burial_events')
      .select('*, members(*), staff!burial_events_manager_id_fkey(*)')
      .order('event_date', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.date_from) {
      query = query.gte('event_date', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('event_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get single event by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('burial_events')
      .select('*, members(*), staff!burial_events_manager_id_fkey(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new event
  async create(event: BurialEventInsert) {
    // Generate event number
    const eventNumber = `BE-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 10000)
    ).padStart(4, '0')}`;

    const { data, error } = await supabase
      .from('burial_events')
      .insert({ ...event, event_number: eventNumber })
      .select()
      .single();

    if (error) throw error;
    return data as BurialEvent;
  },

  // Update event
  async update(id: string, updates: BurialEventUpdate) {
    const { data, error } = await supabase
      .from('burial_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BurialEvent;
  },

  // Delete/Cancel event
  async cancel(id: string) {
    const { data, error } = await supabase
      .from('burial_events')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BurialEvent;
  },

  // Delete event permanently
  async delete(id: string) {
    const { error } = await supabase
      .from('burial_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Assign staff to event
  async assignStaff(eventId: string, staffId: string) {
    const { data, error } = await supabase
      .from('event_staff_assignments')
      .insert({ event_id: eventId, staff_id: staffId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get assigned staff for event
  async getAssignedStaff(eventId: string) {
    const { data, error } = await supabase
      .from('event_staff_assignments')
      .select('*, staff(*, users(*))')
      .eq('event_id', eventId);

    if (error) throw error;
    return data;
  },

  // Remove staff assignment from event
  async removeStaffAssignment(eventId: string, staffId: string) {
    const { error } = await supabase
      .from('event_staff_assignments')
      .delete()
      .eq('event_id', eventId)
      .eq('staff_id', staffId);

    if (error) throw error;
  },

  // Get event statistics
  async getStats() {
    const { data: events, error } = await supabase
      .from('burial_events')
      .select('status, event_date');

    if (error) throw error;

    const now = new Date();
    const thisMonth = events.filter((e) => {
      const eventDate = new Date(e.event_date);
      return (
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      );
    });

    return {
      total: events.length,
      scheduled: events.filter((e) => e.status === 'scheduled').length,
      inProgress: events.filter((e) => e.status === 'in_progress').length,
      completed: events.filter((e) => e.status === 'completed').length,
      thisMonth: thisMonth.length,
    };
  },
};
