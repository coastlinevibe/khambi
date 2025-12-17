import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { eventsApi, membersApi, staffApi } from '@/lib/api';

interface EventFormProps {
  event?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EventForm({ event, onClose, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    member_id: event?.member_id || '',
    deceased_name: event?.deceased_name || '',
    event_date: event?.event_date || new Date().toISOString().split('T')[0],
    event_time: event?.event_time || '10:00',
    location: event?.location || '',
    status: event?.status || 'scheduled',
    manager_id: event?.manager_id || '',
    progress: event?.progress || 0,
    notes: event?.notes || '',
  });

  // Load members and staff for dropdowns
  useEffect(() => {
    async function loadData() {
      try {
        const [membersData, staffData] = await Promise.all([
          membersApi.getAll({ status: 'active' }),
          staffApi.getAll({ status: 'available' })
        ]);
        setMembers(membersData);
        setStaff(staffData);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (event) {
        // Update existing event
        await eventsApi.update(event.id, {
          deceased_name: formData.deceased_name,
          event_date: formData.event_date,
          event_time: formData.event_time,
          location: formData.location,
          status: formData.status,
          manager_id: formData.manager_id || null,
          progress: formData.progress,
          notes: formData.notes,
        });
      } else {
        // Create new event
        await eventsApi.create({
          member_id: formData.member_id || null,
          deceased_name: formData.deceased_name,
          event_date: formData.event_date,
          event_time: formData.event_time,
          location: formData.location,
          manager_id: formData.manager_id || null,
          notes: formData.notes,
        } as any);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Edit Burial Event' : 'Schedule New Burial Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Member Selection (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member (Optional)
            </label>
            <select
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              disabled={!!event}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">No member associated</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.member_number} - {member.first_name} {member.last_name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Link this event to a member's policy (optional)
            </p>
          </div>

          {/* Deceased Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deceased Name *
            </label>
            <input
              type="text"
              name="deceased_name"
              value={formData.deceased_name}
              onChange={handleChange}
              required
              placeholder="Full name of deceased"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                name="event_time"
                value={formData.event_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Pretoria, Johannesburg, Centurion"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
            />
          </div>

          {/* Manager Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Manager
            </label>
            <select
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
            >
              <option value="">Unassigned</option>
              {staff.map(staffMember => (
                <option key={staffMember.id} value={staffMember.id}>
                  {staffMember.employee_number} - {staffMember.users?.first_name} {staffMember.users?.last_name} ({staffMember.role})
                </option>
              ))}
            </select>
          </div>

          {/* Status and Progress (only for editing) */}
          {event && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress (%)
                </label>
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional information about the event..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-khambi-accent text-black font-bold rounded-lg hover:bg-khambi-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : event ? 'Update Event' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
