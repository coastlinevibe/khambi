# Supabase Setup Guide

## Database Setup Complete ✅

The database schema and demo data have been successfully created in Supabase.

### What's Been Created

#### Tables (15 total):
1. **users** - Admin/staff authentication
2. **members** - Policy holders
3. **attending_members** - Family representatives
4. **staff** - Employee records
5. **burial_events** - Funeral events
6. **event_staff_assignments** - Staff-to-event assignments
7. **checklists** - Event task lists
8. **claims** - Fast claim processing
9. **contacts** - Unified contact database
10. **coffins** - Coffin catalogue
11. **tombstones** - Tombstone catalogue
12. **extras** - Burial extras catalogue
13. **cms_pages** - Website content management
14. **audit_logs** - System audit trail
15. **notifications** - User notifications

#### Demo Data Seeded:
- 5 demo members (Bronze, Silver, Gold plans)
- 5 staff members with user accounts
- 2 burial events (scheduled, in progress)
- 2 claims (processing, approved)
- Checklist items for events
- 5 contacts
- 6 coffins with real images
- 6 tombstones with real images
- 18 extras across 6 categories

### Next Steps - Create Admin User

Go to your Supabase project: https://supabase.com/dashboard/project/tfcnxmebuypzgkektdve

**Enable Email Authentication:**
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Disable email confirmation for development (optional)

**Create Admin User:**
1. Go to Authentication → Users
2. Click "Add User"
3. Create user with:
   - Email: `grace.admin@khambifunerals.com`
   - Password: (choose a secure password)
   - User Metadata (click "Add metadata"):
     ```json
     {
       "role": "admin",
       "first_name": "Grace",
       "last_name": "Zulu"
     }
     ```

### Testing the Setup

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test login:**
   - Navigate to `/login`
   - Use the admin credentials you created
   - Should redirect to `/admin/dashboard`

### API Service Layer

Located in `src/lib/api/`:
- `members.ts` - Member management
- `claims.ts` - Claims processing
- `events.ts` - Burial events

### Authentication

- **Context:** `src/contexts/AuthContext.tsx`
- **Protected Routes:** `src/components/ProtectedRoute.tsx`
- **Login Page:** `src/components/LoginPage.tsx`
