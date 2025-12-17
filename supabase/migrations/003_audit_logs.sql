-- Create audit_logs table for tracking all changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'member', 'claim', 'event', 'staff', etc.
  entity_id UUID NOT NULL,
  old_values JSONB, -- Previous values before change
  new_values JSONB, -- New values after change
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Add RLS policies
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin and managers can view all audit logs
CREATE POLICY "Admin and managers can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Only system can insert audit logs (through service role)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- No one can update or delete audit logs (immutable)
CREATE POLICY "Audit logs are immutable"
  ON audit_logs FOR UPDATE
  USING (false);

CREATE POLICY "Audit logs cannot be deleted"
  ON audit_logs FOR DELETE
  USING (false);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail of all system changes';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (create, update, delete, approve, reject, etc.)';
COMMENT ON COLUMN audit_logs.entity_type IS 'Type of entity affected (member, claim, event, staff, etc.)';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN audit_logs.old_values IS 'JSON snapshot of values before change';
COMMENT ON COLUMN audit_logs.new_values IS 'JSON snapshot of values after change';
