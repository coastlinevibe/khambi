import { supabase } from '../supabase';

export interface Document {
  id: string;
  entity_type: string;
  entity_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  storage_path: string;
  uploaded_by: string;
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  users?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const documentsApi = {
  // Upload a file
  async upload(
    file: File,
    entityType: string,
    entityId: string,
    category?: string,
    description?: string
  ): Promise<Document> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storagePath = `${entityType}/${entityId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: publicUrl,
          storage_path: storagePath,
          uploaded_by: user.id,
          category,
          description,
        })
        .select(`
          *,
          users:uploaded_by (
            first_name,
            last_name,
            email
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Get all documents for an entity
  async getByEntity(entityType: string, entityId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        users:uploaded_by (
          first_name,
          last_name,
          email
        )
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single document
  async getById(id: string): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        users:uploaded_by (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update document metadata
  async update(id: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        users:uploaded_by (
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a document
  async delete(id: string): Promise<void> {
    // Get document to find storage path
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([doc.storage_path]);

    if (storageError) console.error('Storage delete error:', storageError);

    // Delete from database
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Download a document
  async download(storagePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(storagePath);

    if (error) throw error;
    return data;
  },

  // Get all documents (with pagination)
  async getAll(page: number = 1, limit: number = 50): Promise<Document[]> {
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        users:uploaded_by (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // Get documents by category
  async getByCategory(category: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        users:uploaded_by (
          first_name,
          last_name,
          email
        )
      `)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Search documents
  async search(query: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        users:uploaded_by (
          first_name,
          last_name,
          email
        )
      `)
      .or(`file_name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },
};
