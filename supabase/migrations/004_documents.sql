-- Create documents table for file attachments
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL, -- 'claim', 'event', 'member', 'staff'
  entity_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL, -- MIME type
  file_size BIGINT NOT NULL, -- Size in bytes
  file_url TEXT NOT NULL, -- Supabase storage URL
  storage_path TEXT NOT NULL, -- Path in storage bucket
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  category VARCHAR(50), -- 'id_document', 'death_certificate', 'invoice', 'photo', 'other'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Admin and managers can view all documents
CREATE POLICY "Admin and managers can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Admin and managers can insert documents
CREATE POLICY "Admin and managers can insert documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Admin and managers can update documents
CREATE POLICY "Admin and managers can update documents"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Admin and managers can delete documents
CREATE POLICY "Admin and managers can delete documents"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Create storage bucket for documents (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies (to be created in Supabase dashboard)
-- Allow authenticated users to upload
-- Allow authenticated users to download their own files

COMMENT ON TABLE documents IS 'File attachments for claims, events, members, and staff';
COMMENT ON COLUMN documents.entity_type IS 'Type of entity the document is attached to';
COMMENT ON COLUMN documents.entity_id IS 'ID of the entity the document is attached to';
COMMENT ON COLUMN documents.category IS 'Document category for organization';
COMMENT ON COLUMN documents.storage_path IS 'Path in Supabase storage bucket';
