import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Claim = Database['public']['Tables']['claims']['Row'];
type ClaimInsert = Database['public']['Tables']['claims']['Insert'];
type ClaimUpdate = Database['public']['Tables']['claims']['Update'];

export const claimsApi = {
  // Get all claims with optional filtering
  async getAll(filters?: {
    status?: 'new' | 'processing' | 'approved' | 'rejected';
    member_id?: string;
  }) {
    let query = supabase
      .from('claims')
      .select('*, members(*), attending_members(*)')
      .order('submitted_date', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.member_id) {
      query = query.eq('member_id', filters.member_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get single claim by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('claims')
      .select('*, members(*), attending_members(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new claim
  async create(claim: ClaimInsert) {
    // Generate claim number
    const claimNumber = `CLM-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 10000)
    ).padStart(4, '0')}`;

    const { data, error } = await supabase
      .from('claims')
      .insert({ ...claim, claim_number: claimNumber })
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Update claim
  async update(id: string, updates: ClaimUpdate) {
    const { data, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Approve claim
  async approve(id: string, processorId: string) {
    const { data, error } = await supabase
      .from('claims')
      .update({
        status: 'approved',
        processed_date: new Date().toISOString(),
        processor_id: processorId,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Reject claim
  async reject(id: string, processorId: string, notes: string) {
    const { data, error } = await supabase
      .from('claims')
      .update({
        status: 'rejected',
        processed_date: new Date().toISOString(),
        processor_id: processorId,
        notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Claim;
  },

  // Delete claim
  async delete(id: string) {
    const { error } = await supabase
      .from('claims')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get claim statistics
  async getStats() {
    const { data: claims, error } = await supabase
      .from('claims')
      .select('status, amount, submitted_date, processed_date');

    if (error) throw error;

    const newClaims = claims.filter((c) => c.status === 'new');
    const processingClaims = claims.filter((c) => c.status === 'processing');
    const approvedClaims = claims.filter((c) => c.status === 'approved');

    // Calculate average processing time
    const processedClaims = claims.filter(
      (c) => c.processed_date && c.submitted_date
    );
    const avgProcessingTime =
      processedClaims.length > 0
        ? processedClaims.reduce((sum, c) => {
            const submitted = new Date(c.submitted_date).getTime();
            const processed = new Date(c.processed_date!).getTime();
            return sum + (processed - submitted) / (1000 * 60 * 60 * 24); // days
          }, 0) / processedClaims.length
        : 0;

    return {
      total: claims.length,
      new: newClaims.length,
      processing: processingClaims.length,
      approved: approvedClaims.length,
      avgProcessingTime: avgProcessingTime.toFixed(1),
    };
  },
};
