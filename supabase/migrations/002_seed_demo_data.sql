-- Seed Demo Data for Khambi Funeral Management System
-- Created: December 12, 2025

-- Insert demo members
INSERT INTO members (member_number, first_name, last_name, id_number, phone, email, address, policy_type, cover_amount, status, joined_date) VALUES
('KFS-2024-001', 'Thabo', 'Mabaso', '8506125432089', '082 456 7890', 'thabo.mabaso@email.com', '123 Church St, Pretoria, Gauteng', 'gold', 25000.00, 'active', '2024-01-15'),
('KFS-2024-002', 'Nomsa', 'Dlamini', '7803214567098', '071 234 5678', 'nomsa.dlamini@email.com', '45 Main Rd, Johannesburg, Gauteng', 'silver', 20000.00, 'active', '2024-02-20'),
('KFS-2024-003', 'Sipho', 'Khumalo', '9201156789012', '083 987 6543', 'sipho.khumalo@email.com', '78 Nelson Mandela Dr, Centurion, Gauteng', 'bronze', 15000.00, 'active', '2024-03-10'),
('KFS-2024-004', 'Lerato', 'Mokoena', '8809234567890', '072 345 6789', 'lerato.mokoena@email.com', '12 Vilakazi St, Soweto, Gauteng', 'gold', 25000.00, 'active', '2024-04-05'),
('KFS-2024-005', 'Mandla', 'Ndlovu', '7512098765432', '084 567 8901', 'mandla.ndlovu@email.com', '56 Rivonia Rd, Sandton, Gauteng', 'silver', 20000.00, 'active', '2024-05-12');

-- Insert demo staff (first create users for staff)
INSERT INTO users (email, role, first_name, last_name, is_active) VALUES
('john.manager@khambifunerals.com', 'manager', 'John', 'Sithole', true),
('sarah.coord@khambifunerals.com', 'staff', 'Sarah', 'Nkosi', true),
('peter.driver@khambifunerals.com', 'staff', 'Peter', 'Mahlangu', true),
('grace.admin@khambifunerals.com', 'admin', 'Grace', 'Zulu', true),
('david.coord@khambifunerals.com', 'staff', 'David', 'Radebe', true);

-- Insert staff records linked to users
INSERT INTO staff (user_id, employee_number, role, status, phone, completion_rate)
SELECT u.id, 'EMP-001', 'Event Manager', 'on_assignment', '082 111 2222', 98.50
FROM users u WHERE u.email = 'john.manager@khambifunerals.com'
UNION ALL
SELECT u.id, 'EMP-002', 'Coordinator', 'available', '071 333 4444', 95.20
FROM users u WHERE u.email = 'sarah.coord@khambifunerals.com'
UNION ALL
SELECT u.id, 'EMP-003', 'Driver', 'on_assignment', '083 555 6666', 92.80
FROM users u WHERE u.email = 'peter.driver@khambifunerals.com'
UNION ALL
SELECT u.id, 'EMP-004', 'Administrator', 'available', '072 777 8888', 99.10
FROM users u WHERE u.email = 'grace.admin@khambifunerals.com'
UNION ALL
SELECT u.id, 'EMP-005', 'Coordinator', 'available', '084 999 0000', 94.60
FROM users u WHERE u.email = 'david.coord@khambifunerals.com';

-- Insert demo burial events
INSERT INTO burial_events (event_number, member_id, deceased_name, event_date, event_time, location, status, manager_id, progress, notes)
SELECT 
  'BE-2024-001',
  m.id,
  'Gogo Elsie Mabaso',
  '2024-12-20',
  '10:00:00',
  'Pretoria West Cemetery',
  'scheduled',
  s.id,
  75,
  'Family requested traditional ceremony'
FROM members m
CROSS JOIN staff s
WHERE m.member_number = 'KFS-2024-001' AND s.employee_number = 'EMP-001'
LIMIT 1;

INSERT INTO burial_events (event_number, member_id, deceased_name, event_date, event_time, location, status, manager_id, progress, notes)
SELECT 
  'BE-2024-002',
  m.id,
  'Ntate Joseph Dlamini',
  '2024-12-18',
  '09:00:00',
  'Johannesburg Memorial Park',
  'in_progress',
  s.id,
  45,
  'Church service at 8am'
FROM members m
CROSS JOIN staff s
WHERE m.member_number = 'KFS-2024-002' AND s.employee_number = 'EMP-001'
LIMIT 1;

-- Insert demo claims
INSERT INTO claims (claim_number, member_id, deceased_name, amount, status, submitted_date, notes)
SELECT 
  'CLM-2024-001',
  m.id,
  'Gogo Elsie Mabaso',
  25000.00,
  'processing',
  NOW() - INTERVAL '2 days',
  'All documents submitted'
FROM members m
WHERE m.member_number = 'KFS-2024-001'
LIMIT 1;

INSERT INTO claims (claim_number, member_id, deceased_name, amount, status, submitted_date, notes)
SELECT 
  'CLM-2024-002',
  m.id,
  'Ntate Joseph Dlamini',
  20000.00,
  'approved',
  NOW() - INTERVAL '5 days',
  'Approved and processed'
FROM members m
WHERE m.member_number = 'KFS-2024-002'
LIMIT 1;

-- Insert demo checklists for events
INSERT INTO checklists (event_id, phase, task_name, description, assigned_to, due_date, completed)
SELECT 
  be.id,
  'pre_event',
  'Confirm venue booking',
  'Contact cemetery and confirm burial slot',
  s.id,
  be.event_date - INTERVAL '2 days',
  true
FROM burial_events be
CROSS JOIN staff s
WHERE be.event_number = 'BE-2024-001' AND s.employee_number = 'EMP-002'
LIMIT 1;

INSERT INTO checklists (event_id, phase, task_name, description, assigned_to, due_date, completed)
SELECT 
  be.id,
  'pre_event',
  'Prepare coffin and flowers',
  'Ensure coffin is ready and flowers arranged',
  s.id,
  be.event_date - INTERVAL '1 day',
  false
FROM burial_events be
CROSS JOIN staff s
WHERE be.event_number = 'BE-2024-001' AND s.employee_number = 'EMP-002'
LIMIT 1;

-- Insert demo contacts
INSERT INTO contacts (name, type, relationship, phone, email, events_count) VALUES
('Thabo Mabaso', 'member', 'Policy Holder', '082 456 7890', 'thabo.mabaso@email.com', 1),
('Nomsa Dlamini', 'member', 'Policy Holder', '071 234 5678', 'nomsa.dlamini@email.com', 1),
('John Sithole', 'staff', 'Event Manager', '082 111 2222', 'john.manager@khambifunerals.com', 5),
('Sarah Nkosi', 'staff', 'Coordinator', '071 333 4444', 'sarah.coord@khambifunerals.com', 3),
('Funeral Flowers SA', 'supplier', 'Supplier', '011 234 5678', 'orders@funeralflowers.co.za', 12);

-- Insert coffins catalogue
INSERT INTO coffins (name, category, price, description, image_url, in_stock) VALUES
('Cherry Elegance', 'traditional', 12500.00, 'Classic cherry wood coffin with brass handles', '/images/cas1.jpg', true),
('Pecan Heritage', 'traditional', 15800.00, 'Premium pecan wood with velvet interior', '/images/cas2.jpg', true),
('Mahogany Prestige', 'premium', 18900.00, 'Luxury mahogany with gold accents', '/images/cas3.jpg', true),
('Charcoal Dignity', 'modern', 14200.00, 'Contemporary charcoal finish', '/images/cas4.jpg', true),
('Navy Serenity', 'modern', 16500.00, 'Modern navy blue with silver trim', '/images/cas5.jpg', true),
('Pecan Comfort', 'budget_friendly', 13800.00, 'Affordable pecan option', '/images/cas6.jpg', true);

-- Insert tombstones catalogue
INSERT INTO tombstones (name, category, price, description, image_url, in_stock) VALUES
('Royal Monument', 'granite', 28500.00, 'Premium black granite monument', '/images/tomb1.jpeg', true),
('Classic Upright', 'granite', 12000.00, 'Traditional upright granite headstone', '/images/tomb2.jpeg', true),
('Heritage Stone', 'marble', 18500.00, 'White marble with engraving', '/images/tomb3.jpeg', true),
('Azure Memorial', 'granite', 15800.00, 'Blue-grey granite memorial', '/images/tomb4.jpeg', true),
('Eternal Rest', 'bronze', 22000.00, 'Bronze plaque on granite base', '/images/tomb5.jpeg', true),
('Ocean Tribute', 'marble', 16500.00, 'Ocean blue marble tribute', '/images/tomb6.jpeg', true);

-- Insert extras catalogue
INSERT INTO extras (category, name, price, description, image_url, available) VALUES
('venue', 'Community Hall', 2500.00, 'Spacious hall for 100+ guests', '/images/venue1.jpg', true),
('venue', 'Church Venue', 3500.00, 'Traditional church setting', '/images/venue2.jpg', true),
('venue', 'Garden Venue', 5000.00, 'Beautiful outdoor garden space', '/images/venue3.jpg', true),
('flowers', 'Coffin Spray', 800.00, 'Elegant floral arrangement for coffin', '/images/flowers1.jpg', true),
('flowers', 'Standing Wreaths', 1200.00, 'Large standing floral wreaths', '/images/flowers2.jpg', true),
('flowers', 'Premium Bouquets', 2500.00, 'Luxury mixed flower arrangements', '/images/flowers3.jpg', true),
('music', 'Solo Musician', 500.00, 'Professional solo performer', '/images/music1.jpg', true),
('music', 'Gospel Choir', 1500.00, '10-person gospel choir', '/images/music2.jpg', true),
('music', 'Full Band', 3000.00, 'Complete musical ensemble', '/images/music3.jpg', true),
('streaming', 'Basic Streaming', 1000.00, 'Single camera live stream', '/images/stream1.jpg', true),
('streaming', 'Premium Streaming', 2000.00, 'Multi-camera professional stream', '/images/stream2.jpg', true),
('catering', 'Light Refreshments', 3000.00, 'Tea, coffee, and snacks for 50', '/images/catering1.jpg', true),
('catering', 'Full Meal Service', 5500.00, 'Complete meal for 50 guests', '/images/catering2.jpg', true),
('catering', 'Premium Catering', 8000.00, 'Gourmet catering for 100 guests', '/images/catering3.jpg', true),
('transport', 'Additional Family Car', 1500.00, 'Extra luxury vehicle', '/images/transport1.jpg', true),
('transport', 'Bus Service', 2500.00, '50-seater bus for guests', '/images/transport2.jpg', true),
('transport', 'VIP Transport Package', 4000.00, 'Multiple luxury vehicles', '/images/transport3.jpg', true);
