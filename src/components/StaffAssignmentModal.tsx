import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { eventsApi, staffApi } from '@/lib/api';

interface StaffAssignmentModalProps {
  event: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StaffAssignmentModal({ event, onClose, onSuccess }: StaffAssignmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Load available staff and assigned staff
  useEffect(() => {
    async function loadData() {
      try {
        const [allStaff, assigned] = await Promise.all([
          staffApi.getAll(),
          eventsApi.getAssignedStaff(event.id)
        ]);
        setAvailableStaff(allStaff);
        setAssignedStaff(assigned);
      } catch (err) {
        console.error('Failed to load staff:', err);
        setError('Failed to load staff data');
      }
    }
    loadData();
  }, [event.id]);

  const handleAssignStaff = async () => {
    if (!selectedStaffId) return;
    
    setLoading(true);
    setError('');
    
    try {
      await eventsApi.assignStaff(event.id, selectedStaffId);
      
      // Reload assigned staff
      const assigned = await eventsApi.getAssignedStaff(event.id);
      setAssignedStaff(assigned);
      setSelectedStaffId('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to assign staff');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    setLoading(true);
    setError('');
    
    try {
      await eventsApi.removeStaffAssignment(event.id, staffId);
      
      // Reload assigned staff
      const assigned = await eventsApi.getAssignedStaff(event.id);
      setAssignedStaff(assigned);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to remove staff');
    } finally {
      setLoading(false);
    }
  };

  // Filter out already assigned staff
  const unassignedStaff = availableStaff.filter(
    staff => !assignedStaff.some(assigned => assigned.staff_id === staff.id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Manage Staff Assignment
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Event: {event.event_number} - {event.deceased_name}
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
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Assign New Staff */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Staff Member
            </label>
            <div className="flex gap-2">
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
              >
                <option value="">Select staff member...</option>
                {unassignedStaff.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.employee_number} - {staff.users?.first_name} {staff.users?.last_name} ({staff.role})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignStaff}
                disabled={!selectedStaffId || loading}
                className="px-4 py-2 bg-khambi-accent text-black font-semibold rounded-lg hover:bg-khambi-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Assign
              </button>
            </div>
          </div>

          {/* Assigned Staff List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Assigned Staff ({assignedStaff.length})
            </h3>
            
            {assignedStaff.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                No staff assigned to this event yet
              </div>
            ) : (
              <div className="space-y-2">
                {assignedStaff.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {assignment.staff?.users?.first_name} {assignment.staff?.users?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {assignment.staff?.employee_number} - {assignment.staff?.role}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Assigned: {new Date(assignment.assigned_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveStaff(assignment.staff_id)}
                      disabled={loading}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove assignment"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
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
