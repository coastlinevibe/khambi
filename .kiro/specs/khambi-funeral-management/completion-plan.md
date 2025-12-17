# Khambi Funeral Management System - Project Completion Plan

**Created:** December 7, 2025  
**Status:** Frontend Complete - Backend Implementation Required

---

## 📊 Project Analysis Summary

### What We Have (Frontend - 100% Complete)
✅ **Public Website** - Fully functional with plans, coffins, extras, chatbot  
✅ **Fast Claim Process** - Visual selection with real images and pricing  
✅ **Admin Dashboard UI** - Comprehensive demo of all 12 requirements  
✅ **Professional Design** - Gold/black branding, dark mode, responsive  
✅ **Demo Data** - Realistic South African context (Rands, Gauteng, SA names)

### What We Need (Backend - 0% Complete)
⏳ **Database** - Schema design and setup  
⏳ **API Layer** - RESTful endpoints for all operations  
⏳ **Authentication** - Admin/staff login system  
⏳ **Business Logic** - CRUD operations, validations, workflows  
⏳ **Integrations** - SMS/Email notifications, AI document scanning  
⏳ **Data Migration** - Convert demo data to real database records

---

## 🎯 Completion Strategy

### Approach: Incremental Backend Implementation
We'll build the backend in phases, connecting one feature at a time to the existing frontend. This allows:
- Testing each feature independently
- Demonstrating progress to client incrementally
- Maintaining working demo while building production system
- Reducing risk of breaking existing functionality

---

## 📋 Phase 1: Foundation & Core Infrastructure (Week 1-2)

### 1.1 Technology Stack Decision
**Required Decisions:**
- [ ] Backend framework (Node.js/Express, Python/Django, .NET Core)
- [ ] Database (PostgreSQL, MySQL, MongoDB)
- [ ] Authentication method (JWT, OAuth2, session-based)
- [ ] Hosting provider (AWS, Azure, local server)
- [ ] SMS/Email service (Twilio, SendGrid, local SMTP)

**Recommended Stack:**
```yaml
Backend: Node.js + Express.js
  - Reason: Matches React frontend, JavaScript throughout
  - Fast development, large ecosystem
  
Database: PostgreSQL
  - Reason: Relational data, ACID compliance, mature
  - Excellent for audit trails and complex queries
  
ORM: Prisma
  - Reason: Type-safe, auto-migrations, great DX
  - Works perfectly with TypeScript
  
Auth: JWT + bcrypt
  - Reason: Stateless, scalable, industry standard
  - Easy to implement role-based access
  
Hosting: AWS or Azure (South African region)
  - Reason: Enterprise-grade, local data centers
  - Compliance with POPIA (SA data protection)
  
Notifications: Twilio (SMS) + SendGrid (Email)
  - Reason: Reliable, scalable, good SA coverage
```

### 1.2 Database Schema Design

**Core Tables:**
```sql
-- Authentication & Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'manager', 'staff'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Members (Policy Holders)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  id_number VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  policy_type VARCHAR(20) NOT NULL, -- 'bronze', 'silver', 'gold'
  cover_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
  joined_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Attending Members (Family Representatives)
CREATE TABLE attending_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(50), -- 'spouse', 'child', 'sibling', etc.
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  reference_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Staff
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  employee_number VARCHAR(50) UNIQUE,
  role VARCHAR(50) NOT NULL, -- 'event_manager', 'coordinator', 'driver', etc.
  status VARCHAR(20) DEFAULT 'available', -- 'available', 'on_assignment', 'off_duty'
  phone VARCHAR(20),
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Burial Events
CREATE TABLE burial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_number VARCHAR(50) UNIQUE NOT NULL,
  member_id UUID REFERENCES members(id),
  deceased_name VARCHAR(200) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  manager_id UUID REFERENCES staff(id),
  progress INTEGER DEFAULT 0, -- 0-100
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event Staff Assignments
CREATE TABLE event_staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES burial_events(id),
  staff_id UUID REFERENCES staff(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, staff_id)
);

-- Checklists
CREATE TABLE checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES burial_events(id),
  phase VARCHAR(20) NOT NULL, -- 'pre_event', 'during_event', 'post_event'
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES staff(id),
  due_date TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  completed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fast Claims
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  member_id UUID REFERENCES members(id),
  attending_member_id UUID REFERENCES attending_members(id),
  deceased_name VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'processing', 'approved', 'rejected'
  submitted_date TIMESTAMP DEFAULT NOW(),
  processed_date TIMESTAMP,
  processor_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts (Unified Database)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'member', 'attending_member', 'staff', 'supplier'
  relationship VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  events_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Coffins Catalogue
CREATE TABLE coffins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50), -- 'traditional', 'modern', 'premium', 'budget_friendly'
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tombstones Catalogue
CREATE TABLE tombstones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50), -- 'granite', 'marble', 'bronze', 'custom'
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Burial Extras
CREATE TABLE extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- 'venue', 'flowers', 'music', 'streaming', 'catering', 'transport'
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CMS Pages
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
  page_views INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  editor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'view'
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'sms', 'email', 'system'
  message TEXT NOT NULL,
  sent_at TIMESTAMP,
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 API Endpoints Architecture

**Base URL:** `/api/v1`

**Authentication Endpoints:**
```
POST   /auth/login          - Admin/staff login
POST   /auth/logout         - Logout
POST   /auth/refresh        - Refresh JWT token
GET    /auth/me             - Get current user info
```

**Member Management:**
```
GET    /members             - List all members (paginated, filterable)
GET    /members/:id         - Get member details
POST   /members             - Create new member
PUT    /members/:id         - Update member
DELETE /members/:id         - Delete member
GET    /members/search      - Search members by name/policy/contact
```

**Burial Events:**
```
GET    /events              - List all events
GET    /events/:id          - Get event details
POST   /events              - Create new event
PUT    /events/:id          - Update event
DELETE /events/:id          - Cancel event
GET    /events/:id/staff    - Get assigned staff
POST   /events/:id/staff    - Assign staff to event
GET    /events/:id/checklist - Get event checklist
PUT    /events/:id/checklist/:taskId - Update checklist task
```

**Staff Management:**
```
GET    /staff               - List all staff
GET    /staff/:id           - Get staff details
POST   /staff               - Create staff record
PUT    /staff/:id           - Update staff
DELETE /staff/:id           - Remove staff
GET    /staff/availability  - Check staff availability
```

**Fast Claims:**
```
GET    /claims              - List all claims
GET    /claims/:id          - Get claim details
POST   /claims              - Submit new claim
PUT    /claims/:id          - Update claim status
POST   /claims/:id/approve  - Approve claim
POST   /claims/:id/reject   - Reject claim
```

**Contacts:**
```
GET    /contacts            - List all contacts
GET    /contacts/:id        - Get contact details
POST   /contacts            - Create contact
PUT    /contacts/:id        - Update contact
DELETE /contacts/:id        - Delete contact
GET    /contacts/export     - Export contacts (CSV/Excel)
```

**Catalogue (Coffins, Tombstones, Extras):**
```
GET    /catalogue/coffins   - List coffins
GET    /catalogue/tombstones - List tombstones
GET    /catalogue/extras    - List extras
POST   /catalogue/coffins   - Add coffin (admin)
PUT    /catalogue/coffins/:id - Update coffin
```

**CMS:**
```
GET    /cms/pages           - List all pages
GET    /cms/pages/:slug     - Get page by slug
POST   /cms/pages           - Create page
PUT    /cms/pages/:id       - Update page
DELETE /cms/pages/:id       - Delete page
```

**Analytics:**
```
GET    /analytics/dashboard - Get dashboard metrics
GET    /analytics/events    - Get event statistics
GET    /analytics/staff     - Get staff performance
GET    /analytics/financial - Get financial data
POST   /analytics/export    - Export report
```

### 1.4 Development Environment Setup

**Tasks:**
- [x] Initialize Node.js project with TypeScript
- [x] Set up Supabase database (PostgreSQL)
- [x] Configure Supabase client with TypeScript types
- [x] Configure environment variables (.env)
- [x] Set up JWT authentication with Supabase Auth
- [x] Create database migrations (15 tables)
- [x] Seed database with demo data
- [x] Create API service layer (members, claims, events)
- [x] Configure authentication context and protected routes
- [x] Update .gitignore for security

**Status:** ✅ COMPLETE - December 12, 2025

---

## 📋 Phase 2: Core Features Implementation (Week 3-5)

### 2.1 Authentication System
**Priority: CRITICAL**

**Tasks:**
- [ ] Implement user registration (admin only)
- [ ] Implement login with JWT
- [ ] Create role-based middleware (admin, manager, staff)
- [ ] Implement password hashing with bcrypt
- [ ] Add password reset functionality
- [ ] Create protected route middleware
- [ ] Test authentication flow

**Frontend Integration:**
- [ ] Update AdminDashboard to use real login
- [ ] Store JWT in localStorage/cookies
- [ ] Add auth context to React app
- [ ] Implement logout functionality
- [ ] Add token refresh logic

### 2.2 Member Management
**Priority: HIGH**

**Tasks:**
- [ ] Implement CRUD operations for members
- [ ] Add search functionality (name, policy, contact)
- [ ] Implement filtering by plan type
- [ ] Add pagination for member list
- [ ] Create audit trail for member changes
- [ ] Implement policy status updates
- [ ] Add member profile view with history

**Frontend Integration:**
- [ ] Connect Member Management table to API
- [ ] Implement real search functionality
- [ ] Add create/edit member forms
- [ ] Show real member data instead of demo
- [ ] Add loading states and error handling

### 2.3 Fast Claims Processing
**Priority: HIGH**

**Tasks:**
- [ ] Implement claim submission API
- [ ] Add claim validation logic
- [ ] Create claim status workflow
- [ ] Implement claim approval/rejection
- [ ] Add SMS/Email notifications for claims
- [ ] Generate claim reference numbers
- [ ] Create claim history tracking

**Frontend Integration:**
- [ ] Connect FastClaim component to API
- [ ] Implement real-time claim submission
- [ ] Add claim status tracking
- [ ] Show confirmation with reference number
- [ ] Send SMS/Email confirmations

---

## 📋 Phase 3: Event & Staff Management (Week 6-8)

### 3.1 Burial Event Management
**Priority: HIGH**

**Tasks:**
- [ ] Implement event CRUD operations
- [ ] Add event scheduling with conflict detection
- [ ] Create staff assignment logic
- [ ] Implement event timeline tracking
- [ ] Add event cancellation workflow
- [ ] Create event notifications
- [ ] Implement progress tracking (0-100%)

**Frontend Integration:**
- [ ] Connect Burial Events table to API
- [ ] Implement event creation form
- [ ] Add staff assignment interface
- [ ] Show real-time progress updates
- [ ] Add event calendar view

### 3.2 Staff Management
**Priority: MEDIUM**

**Tasks:**
- [ ] Implement staff CRUD operations
- [ ] Add role and permission management
- [ ] Create availability tracking
- [ ] Implement staff assignment logic
- [ ] Add completion rate calculation
- [ ] Create staff performance metrics
- [ ] Implement staff notifications

**Frontend Integration:**
- [ ] Connect Staff Management table to API
- [ ] Implement staff creation/editing
- [ ] Add availability calendar
- [ ] Show real-time assignments
- [ ] Display performance metrics

### 3.3 Event Checklist System
**Priority: MEDIUM**

**Tasks:**
- [ ] Implement checklist generation on event creation
- [ ] Add task completion tracking
- [ ] Create phase management (pre/during/post)
- [ ] Implement overdue task alerts
- [ ] Add task assignment to staff
- [ ] Create checklist templates
- [ ] Implement completion timestamps

**Frontend Integration:**
- [ ] Connect Event Checklists table to API
- [ ] Implement task completion UI
- [ ] Add phase indicators
- [ ] Show overdue alerts
- [ ] Display completion progress

---

## 📋 Phase 4: Advanced Features (Week 9-11)

### 4.1 Contact Database
**Priority: MEDIUM**

**Tasks:**
- [ ] Implement unified contact search
- [ ] Add contact filtering by type
- [ ] Create relationship tracking
- [ ] Implement communication history
- [ ] Add contact export (CSV/Excel)
- [ ] Create contact merge functionality
- [ ] Implement contact deduplication

**Frontend Integration:**
- [ ] Connect Contact Database to API
- [ ] Implement advanced search
- [ ] Add export functionality
- [ ] Show communication history
- [ ] Display relationship graphs

### 4.2 Analytics & Reporting
**Priority: MEDIUM**

**Tasks:**
- [ ] Implement dashboard metrics calculation
- [ ] Add event statistics aggregation
- [ ] Create staff performance reports
- [ ] Implement financial data tracking
- [ ] Add report export (PDF/Excel)
- [ ] Create trend analysis
- [ ] Implement real-time chart data

**Frontend Integration:**
- [ ] Connect Analytics dashboard to API
- [ ] Implement real-time chart updates
- [ ] Add report export buttons
- [ ] Show live metrics
- [ ] Display trend indicators

### 4.3 CMS & Website Management
**Priority: LOW**

**Tasks:**
- [ ] Implement page CRUD operations
- [ ] Add content versioning
- [ ] Create page preview functionality
- [ ] Implement page analytics tracking
- [ ] Add image upload for CMS
- [ ] Create page templates
- [ ] Implement publish/draft workflow

**Frontend Integration:**
- [ ] Connect CMS section to API
- [ ] Implement rich text editor
- [ ] Add image upload UI
- [ ] Show page analytics
- [ ] Display version history

---

## 📋 Phase 5: Integrations & Notifications (Week 12-13)

### 5.1 SMS/Email Notifications
**Priority: HIGH**

**Tasks:**
- [ ] Set up Twilio for SMS
- [ ] Set up SendGrid for Email
- [ ] Create notification templates
- [ ] Implement claim confirmation notifications
- [ ] Add event reminder notifications
- [ ] Create staff assignment notifications
- [ ] Implement overdue task alerts
- [ ] Add notification preferences

### 5.2 AI Document Scanning (Optional)
**Priority: LOW**

**Tasks:**
- [ ] Research OCR solutions (Google Vision, AWS Textract)
- [ ] Implement ID document scanning
- [ ] Add death certificate validation
- [ ] Create data extraction logic
- [ ] Implement validation rules
- [ ] Add manual verification workflow
- [ ] Create error flagging system

---

## 📋 Phase 6: Testing & Deployment (Week 14-15)

### 6.1 Testing
**Tasks:**
- [ ] Write unit tests for API endpoints
- [ ] Create integration tests
- [ ] Perform end-to-end testing
- [ ] Test authentication flows
- [ ] Validate data integrity
- [ ] Test notification delivery
- [ ] Perform load testing
- [ ] Security audit

### 6.2 Deployment
**Tasks:**
- [ ] Set up production database
- [ ] Configure production environment
- [ ] Set up CI/CD pipeline
- [ ] Deploy backend to hosting
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging
- [ ] Create backup strategy
- [ ] Document deployment process

### 6.3 Data Migration
**Tasks:**
- [ ] Export demo data from frontend
- [ ] Create migration scripts
- [ ] Import data to production database
- [ ] Validate migrated data
- [ ] Test with real data
- [ ] Create data backup

---

## 🎯 Success Criteria

### Technical Requirements
- [ ] All 12 requirements fully functional with backend
- [ ] Authentication working with role-based access
- [ ] All CRUD operations tested and working
- [ ] SMS/Email notifications delivering successfully
- [ ] Database properly indexed and optimized
- [ ] API response times < 500ms
- [ ] 99.9% uptime SLA
- [ ] POPIA compliance for data protection

### Business Requirements
- [ ] Client can manage members and policies
- [ ] Staff can process claims in < 2 days
- [ ] Events can be scheduled without conflicts
- [ ] Checklists ensure no tasks are missed
- [ ] Analytics provide actionable insights
- [ ] System scales to 10,000+ members
- [ ] Mobile-responsive for field staff

---

## 📊 Timeline Summary

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| Phase 1 | Week 1-2 | Foundation & Infrastructure | ✅ COMPLETE |
| Phase 2 | Week 3-5 | Core Features (Auth, Members, Claims) | 🔄 Ready to Start |
| Phase 3 | Week 6-8 | Events & Staff Management | ⏳ Not Started |
| Phase 4 | Week 9-11 | Advanced Features (Contacts, Analytics, CMS) | ⏳ Not Started |
| Phase 5 | Week 12-13 | Integrations & Notifications | ⏳ Not Started |
| Phase 6 | Week 14-15 | Testing & Deployment | ⏳ Not Started |

**Total Estimated Time:** 15 weeks (3.5 months)

---

## 💰 Resource Requirements

### Development Team
- **1 Backend Developer** (Full-time, 15 weeks)
- **1 Frontend Developer** (Part-time, integration work)
- **1 DevOps Engineer** (Part-time, deployment)
- **1 QA Tester** (Part-time, final 3 weeks)

### Infrastructure Costs (Monthly)
- **Hosting**: R2,000 - R5,000 (AWS/Azure)
- **Database**: R1,000 - R3,000 (PostgreSQL managed)
- **SMS**: R0.50 per SMS (Twilio)
- **Email**: R500 - R1,500 (SendGrid)
- **Domain & SSL**: R500
- **Monitoring**: R500 (optional)

**Total Monthly**: ~R4,500 - R10,500

---

## 🚀 Next Steps

### Immediate Actions Required:
1. **Review & Approve Plan** - Client/stakeholder sign-off
2. **Technology Stack Decision** - Choose backend framework
3. **Resource Allocation** - Assign development team
4. **Environment Setup** - Provision servers and databases
5. **Kickoff Meeting** - Align team on timeline and deliverables

### Questions to Answer:
- [ ] What is the target launch date?
- [ ] What is the budget for development and infrastructure?
- [ ] Who will be the backend developer(s)?
- [ ] Do we need AI document scanning in MVP?
- [ ] What are the priority features for Phase 1 launch?
- [ ] Are there any compliance requirements (POPIA, etc.)?

---

## 📝 Notes

- Frontend is **100% complete** and client-ready for demos
- Backend can be built incrementally without breaking frontend
- Demo data provides perfect test cases for backend development
- South African context is already embedded throughout
- System is designed for scalability from day one
