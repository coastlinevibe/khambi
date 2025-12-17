import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Checklist = Database['public']['Tables']['checklists']['Row'];
type ChecklistInsert = Database['public']['Tables']['checklists']['Insert'];
type ChecklistUpdate = Database['public']['Tables']['checklists']['Update'];

export const checklistsApi = {
  // Get all checklists with optional filtering
  async getAll(filters?: {
    event_id?: string;
    phase?: 'pre_event' | 'during_event' | 'post_event';
    completed?: boolean;
  }) {
    let query = supabase
      .from('checklists')
      .select('*, burial_events(*), staff(*)')
      .order('created_at', { ascending: true });

    if (filters?.event_id) {
      query = query.eq('event_id', filters.event_id);
    }

    if (filters?.phase) {
      query = query.eq('phase', filters.phase);
    }

    if (filters?.completed !== undefined) {
      query = query.eq('completed', filters.completed);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get checklists by event
  async getByEvent(eventId: string) {
    const { data, error } = await supabase
      .from('checklists')
      .select('*, staff(*)')
      .eq('event_id', eventId)
      .order('phase', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create new checklist item
  async create(checklist: ChecklistInsert) {
    const { data, error } = await supabase
      .from('checklists')
      .insert(checklist)
      .select()
      .single();

    if (error) throw error;
    return data as Checklist;
  },

  // Update checklist item
  async update(id: string, updates: ChecklistUpdate) {
    const { data, error } = await supabase
      .from('checklists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Checklist;
  },

  // Mark task as complete
  async complete(id: string, completedBy: string) {
    const { data, error } = await supabase
      .from('checklists')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        completed_by: completedBy,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Checklist;
  },

  // Delete checklist item
  async delete(id: string) {
    const { error } = await supabase.from('checklists').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get checklist statistics
  async getStats() {
    const { data: checklists, error } = await supabase
      .from('checklists')
      .select('completed, due_date');

    if (error) throw error;

    const now = new Date();
    const overdue = checklists.filter(
      (c) => !c.completed && c.due_date && new Date(c.due_date) < now
    );

    const completed = checklists.filter((c) => c.completed);
    const total = checklists.length;
    const completionRate = total > 0 ? (completed.length / total) * 100 : 0;

    return {
      total,
      completed: completed.length,
      pending: total - completed.length,
      overdue: overdue.length,
      completionRate: completionRate.toFixed(0),
    };
  },

  // Get overdue tasks
  async getOverdue() {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('checklists')
      .select('*, burial_events(*), staff(*)')
      .eq('completed', false)
      .lt('due_date', now)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Generate default checklist for an event
  async generateDefaultChecklist(eventId: string, eventDate: string) {
    const eventDateTime = new Date(eventDate);
    
    // Default checklist templates
    const defaultTasks = [
      // Pre-Event Tasks
      { phase: 'pre_event', task_name: 'Confirm venue booking', description: 'Verify venue is booked and ready', daysBeforeEvent: 7 },
      { phase: 'pre_event', task_name: 'Order coffin', description: 'Select and order appropriate coffin', daysBeforeEvent: 5 },
      { phase: 'pre_event', task_name: 'Arrange catering', description: 'Confirm catering arrangements and menu', daysBeforeEvent: 5 },
      { phase: 'pre_event', task_name: 'Prepare funeral programs', description: 'Design and print funeral programs', daysBeforeEvent: 3 },
      { phase: 'pre_event', task_name: 'Confirm transportation', description: 'Verify hearse and family cars are arranged', daysBeforeEvent: 3 },
      { phase: 'pre_event', task_name: 'Set up chairs and tent', description: 'Arrange seating and tent at venue', daysBeforeEvent: 2 },
      { phase: 'pre_event', task_name: 'Prepare graveside decor', description: 'Arrange flowers and decorations', daysBeforeEvent: 1 },
      { phase: 'pre_event', task_name: 'Final venue inspection', description: 'Check all arrangements are in place', daysBeforeEvent: 1 },
      
      // During Event Tasks
      { phase: 'during_event', task_name: 'Coordinate arrival of family', description: 'Ensure family arrives and is seated', daysBeforeEvent: 0 },
      { phase: 'during_event', task_name: 'Manage ceremony proceedings', description: 'Oversee the funeral ceremony', daysBeforeEvent: 0 },
      { phase: 'during_event', task_name: 'Coordinate burial process', description: 'Manage the burial at graveside', daysBeforeEvent: 0 },
      { phase: 'during_event', task_name: 'Serve refreshments', description: 'Ensure catering is served properly', daysBeforeEvent: 0 },
      { phase: 'during_event', task_name: 'Manage guest book', description: 'Ensure guests sign condolence book', daysBeforeEvent: 0 },
      
      // Post-Event Tasks
      { phase: 'post_event', task_name: 'Clean up venue', description: 'Remove all equipment and decorations', daysBeforeEvent: 0 },
      { phase: 'post_event', task_name: 'Return rental items', description: 'Return chairs, tent, and other rentals', daysBeforeEvent: 1 },
      { phase: 'post_event', task_name: 'Follow up with family', description: 'Check on family and offer support', daysBeforeEvent: 3 },
      { phase: 'post_event', task_name: 'Complete documentation', description: 'Finalize all paperwork and records', daysBeforeEvent: 5 },
      { phase: 'post_event', task_name: 'Process feedback', description: 'Collect and review family feedback', daysBeforeEvent: 7 },
    ];

    // Create checklist items with calculated due dates
    const checklistItems = defaultTasks.map(task => {
      const dueDate = new Date(eventDateTime);
      
      if (task.phase === 'pre_event') {
        // Tasks before the event
        dueDate.setDate(dueDate.getDate() - task.daysBeforeEvent);
      } else if (task.phase === 'post_event') {
        // Tasks after the event
        dueDate.setDate(dueDate.getDate() + task.daysBeforeEvent);
      }
      // during_event tasks use the event date itself

      return {
        event_id: eventId,
        phase: task.phase as 'pre_event' | 'during_event' | 'post_event',
        task_name: task.task_name,
        description: task.description,
        due_date: dueDate.toISOString(),
        completed: false,
      };
    });

    // Insert all checklist items
    const { data, error } = await supabase
      .from('checklists')
      .insert(checklistItems)
      .select();

    if (error) throw error;
    return data;
  },
};
