import { supabase } from '../supabase';

export const analyticsApi = {
  // Get dashboard overview statistics
  async getDashboardStats() {
    // Get all data in parallel
    const [
      { data: members },
      { data: events },
      { data: claims },
      { data: staff },
      { data: contacts },
      { data: checklists },
    ] = await Promise.all([
      supabase.from('members').select('policy_type, status, cover_amount'),
      supabase.from('burial_events').select('status, event_date, created_at'),
      supabase.from('claims').select('status, amount, submitted_date, processed_date'),
      supabase.from('staff').select('status, completion_rate'),
      supabase.from('contacts').select('type, events_count'),
      supabase.from('checklists').select('completed, due_date'),
    ]);

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Calculate member stats
    const totalMembers = members?.length || 0;
    const activeMembers = members?.filter((m) => m.status === 'active').length || 0;
    const bronzeMembers = members?.filter((m) => m.policy_type === 'bronze').length || 0;
    const silverMembers = members?.filter((m) => m.policy_type === 'silver').length || 0;
    const goldMembers = members?.filter((m) => m.policy_type === 'gold').length || 0;

    // Calculate event stats
    const totalEvents = events?.length || 0;
    const scheduledEvents = events?.filter((e) => e.status === 'scheduled').length || 0;
    const inProgressEvents = events?.filter((e) => e.status === 'in_progress').length || 0;
    const completedEvents = events?.filter((e) => e.status === 'completed').length || 0;
    const monthlyEvents = events?.filter((e) => {
      const date = new Date(e.event_date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length || 0;

    // Calculate claim stats
    const totalClaims = claims?.length || 0;
    const newClaims = claims?.filter((c) => c.status === 'new').length || 0;
    const processingClaims = claims?.filter((c) => c.status === 'processing').length || 0;
    const approvedClaims = claims?.filter((c) => c.status === 'approved').length || 0;
    
    // Calculate average processing time
    const processedClaims = claims?.filter((c) => c.processed_date && c.submitted_date) || [];
    const avgProcessingTime = processedClaims.length > 0
      ? processedClaims.reduce((sum, c) => {
          const submitted = new Date(c.submitted_date).getTime();
          const processed = new Date(c.processed_date!).getTime();
          return sum + (processed - submitted) / (1000 * 60 * 60 * 24);
        }, 0) / processedClaims.length
      : 0;

    // Calculate staff stats
    const totalStaff = staff?.length || 0;
    const availableStaff = staff?.filter((s) => s.status === 'available').length || 0;
    const onAssignmentStaff = staff?.filter((s) => s.status === 'on_assignment').length || 0;
    const avgCompletionRate = staff && staff.length > 0
      ? staff.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / staff.length
      : 0;

    // Calculate contact stats
    const totalContacts = contacts?.length || 0;
    const memberContacts = contacts?.filter((c) => c.type === 'member').length || 0;
    const attendingMembers = contacts?.filter((c) => c.type === 'attending_member').length || 0;
    const staffContacts = contacts?.filter((c) => c.type === 'staff').length || 0;

    // Calculate checklist stats
    const totalTasks = checklists?.length || 0;
    const completedTasks = checklists?.filter((c) => c.completed).length || 0;
    const overdueTasks = checklists?.filter((c) => {
      return !c.completed && c.due_date && new Date(c.due_date) < now;
    }).length || 0;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate revenue (from claims)
    const totalRevenue = claims?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0;

    return {
      members: {
        total: totalMembers,
        active: activeMembers,
        bronze: bronzeMembers,
        silver: silverMembers,
        gold: goldMembers,
      },
      events: {
        total: totalEvents,
        scheduled: scheduledEvents,
        inProgress: inProgressEvents,
        completed: completedEvents,
        thisMonth: monthlyEvents,
      },
      claims: {
        total: totalClaims,
        new: newClaims,
        processing: processingClaims,
        approved: approvedClaims,
        avgProcessingTime: avgProcessingTime.toFixed(1),
      },
      staff: {
        total: totalStaff,
        available: availableStaff,
        onAssignment: onAssignmentStaff,
        avgCompletionRate: avgCompletionRate.toFixed(1),
      },
      contacts: {
        total: totalContacts,
        members: memberContacts,
        attendingMembers,
        staff: staffContacts,
      },
      checklists: {
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate: completionRate.toFixed(0),
      },
      financial: {
        revenue: totalRevenue,
      },
    };
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10) {
    const { data: events, error } = await supabase
      .from('burial_events')
      .select('*, members(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return events;
  },

  // Get upcoming events
  async getUpcomingEvents(days: number = 7) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    const { data, error } = await supabase
      .from('burial_events')
      .select('*, members(*), staff!burial_events_manager_id_fkey(*)')
      .gte('event_date', now.toISOString().split('T')[0])
      .lte('event_date', future.toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },
};
