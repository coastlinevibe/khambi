import { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { checklistsApi } from '@/lib/api';
import { useAuth } from '../contexts/AuthContext';

interface ChecklistModalProps {
  event: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChecklistModal({ event, onClose, onSuccess }: ChecklistModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checklists, setChecklists] = useState<any[]>([]);
  const [hasChecklist, setHasChecklist] = useState(false);

  // Load checklists for this event
  useEffect(() => {
    async function loadChecklists() {
      try {
        const data = await checklistsApi.getByEvent(event.id);
        setChecklists(data);
        setHasChecklist(data.length > 0);
      } catch (err) {
        console.error('Failed to load checklists:', err);
      }
    }
    loadChecklists();
  }, [event.id]);

  const handleGenerateChecklist = async () => {
    setLoading(true);
    setError('');
    
    try {
      await checklistsApi.generateDefaultChecklist(event.id, event.event_date);
      const data = await checklistsApi.getByEvent(event.id);
      setChecklists(data);
      setHasChecklist(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to generate checklist');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (checklistId: string, currentStatus: boolean) => {
    if (!user) return;
    
    try {
      if (!currentStatus) {
        await checklistsApi.complete(checklistId, user.id);
      } else {
        await checklistsApi.update(checklistId, { 
          completed: false, 
          completed_at: null,
          completed_by: null 
        });
      }
      
      const data = await checklistsApi.getByEvent(event.id);
      setChecklists(data);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  // Group checklists by phase
  const preEventTasks = checklists.filter(c => c.phase === 'pre_event');
  const duringEventTasks = checklists.filter(c => c.phase === 'during_event');
  const postEventTasks = checklists.filter(c => c.phase === 'post_event');

  // Calculate stats
  const totalTasks = checklists.length;
  const completedTasks = checklists.filter(c => c.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Check for overdue tasks
  const now = new Date();
  const overdueTasks = checklists.filter(c => 
    !c.completed && c.due_date && new Date(c.due_date) < now
  );

  const renderPhaseSection = (title: string, tasks: any[], color: string) => {
    if (tasks.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className={`text-lg font-semibold mb-3 ${color}`}>{title}</h4>
        <div className="space-y-2">
          {tasks.map((task) => {
            const isOverdue = !task.completed && task.due_date && new Date(task.due_date) < now;
            
            return (
              <div
                key={task.id}
                className={`p-4 border rounded-lg ${
                  task.completed ? 'bg-green-50 border-green-200' : 
                  isOverdue ? 'bg-red-50 border-red-200' : 
                  'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id, task.completed)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.task_name}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                      </div>
                      {isOverdue && (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {task.due_date && (
                        <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                      {task.completed && task.completed_at && (
                        <span className="text-green-600">
                          Completed: {new Date(task.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Event Checklist</h2>
            <p className="text-sm text-gray-600 mt-1">
              {event.event_number} - {event.deceased_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!hasChecklist ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No checklist has been generated for this event yet.</p>
              <button
                onClick={handleGenerateChecklist}
                disabled={loading}
                className="px-6 py-3 bg-khambi-accent text-black font-bold rounded-lg hover:bg-khambi-gold transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Default Checklist'}
              </button>
            </div>
          ) : (
            <>
              {/* Progress Stats */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{completedTasks} / {totalTasks} tasks</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-khambi-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {overdueTasks.length > 0 && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Checklist Sections */}
              {renderPhaseSection('Pre-Event Tasks', preEventTasks, 'text-yellow-700')}
              {renderPhaseSection('During Event Tasks', duringEventTasks, 'text-blue-700')}
              {renderPhaseSection('Post-Event Tasks', postEventTasks, 'text-green-700')}
            </>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 mt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
