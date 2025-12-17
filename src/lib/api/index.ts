// Central API exports
export { membersApi } from './members';
export { claimsApi } from './claims';
export { eventsApi } from './events';
export { staffApi } from './staff';
export { contactsApi } from './contacts';
export { checklistsApi } from './checklists';
export { analyticsApi } from './analytics';
export { auditApi } from './audit';
export { documentsApi } from './documents';
export { obituariesApi } from './obituaries';

// Re-export supabase client for direct access if needed
export { supabase } from '../supabase';
