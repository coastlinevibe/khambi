import { supabase } from '../supabase';

export interface Obituary {
  id: string;
  name: string;
  birth_date: string;
  death_date: string;
  biography?: string;
  image_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
}

export interface ObituaryMessage {
  id: string;
  obituary_id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CreateObituaryData {
  name: string;
  birth_date: string;
  death_date: string;
  biography?: string;
  image_url?: string;
}

export interface CreateMessageData {
  obituary_id: string;
  name: string;
  email: string;
  message: string;
}

export const obituariesApi = {
  // Get all approved obituaries
  async getAll(): Promise<Obituary[]> {
    const { data, error } = await supabase
      .from('obituaries')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get featured obituaries
  async getFeatured(): Promise<Obituary[]> {
    const { data, error } = await supabase
      .from('obituaries')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single obituary by ID
  async getById(id: string): Promise<Obituary | null> {
    const { data, error } = await supabase
      .from('obituaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new obituary
  async create(obituaryData: CreateObituaryData): Promise<Obituary> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('obituaries')
      .insert([{
        ...obituaryData,
        created_by: user?.id,
        status: 'pending' // Requires admin approval
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update obituary
  async update(id: string, updates: Partial<CreateObituaryData>): Promise<Obituary> {
    const { data, error } = await supabase
      .from('obituaries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update obituary status (admin only)
  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Obituary> {
    const { data, error } = await supabase
      .from('obituaries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Toggle featured status (admin only)
  async toggleFeatured(id: string, is_featured: boolean): Promise<Obituary> {
    const { data, error } = await supabase
      .from('obituaries')
      .update({ is_featured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete obituary
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('obituaries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Upload obituary image
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `obituaries/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Messages API
  messages: {
    // Get all approved messages for an obituary
    async getByObituaryId(obituaryId: string): Promise<ObituaryMessage[]> {
      const { data, error } = await supabase
        .from('obituary_messages')
        .select('*')
        .eq('obituary_id', obituaryId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Create new message
    async create(messageData: CreateMessageData): Promise<ObituaryMessage> {
      const { data, error } = await supabase
        .from('obituary_messages')
        .insert([{
          ...messageData,
          status: 'pending' // Requires admin approval
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Update message status (admin only)
    async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ObituaryMessage> {
      const { data, error } = await supabase
        .from('obituary_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Delete message
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('obituary_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Get all pending messages (admin only)
    async getPending(): Promise<ObituaryMessage[]> {
      const { data, error } = await supabase
        .from('obituary_messages')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  }
};
