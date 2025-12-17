-- Create obituaries table
CREATE TABLE IF NOT EXISTS obituaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE NOT NULL,
  biography TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT false
);

-- Create obituary messages/condolences table
CREATE TABLE IF NOT EXISTS obituary_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obituary_id UUID REFERENCES obituaries(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create indexes
CREATE INDEX idx_obituaries_status ON obituaries(status);
CREATE INDEX idx_obituaries_created_at ON obituaries(created_at DESC);
CREATE INDEX idx_obituary_messages_obituary_id ON obituary_messages(obituary_id);
CREATE INDEX idx_obituary_messages_status ON obituary_messages(status);

-- Enable RLS
ALTER TABLE obituaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE obituary_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for obituaries
CREATE POLICY "Anyone can view approved obituaries"
  ON obituaries FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Authenticated users can create obituaries"
  ON obituaries FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own obituaries"
  ON obituaries FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all obituaries"
  ON obituaries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.user_id = auth.uid()
      AND staff.role IN ('admin', 'manager')
      AND staff.status = 'active'
    )
  );

-- RLS Policies for obituary messages
CREATE POLICY "Anyone can view approved messages"
  ON obituary_messages FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Anyone can create messages"
  ON obituary_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all messages"
  ON obituary_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.user_id = auth.uid()
      AND staff.role IN ('admin', 'manager')
      AND staff.status = 'active'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_obituaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER obituaries_updated_at
  BEFORE UPDATE ON obituaries
  FOR EACH ROW
  EXECUTE FUNCTION update_obituaries_updated_at();
