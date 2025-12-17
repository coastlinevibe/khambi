import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { staffApi } from '@/lib/api';

interface StaffFormProps {
  staff?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StaffForm({ staff, onClose, onSuccess }: StaffFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    employee_number: staff?.employee_number || '',
    role: staff?.role || '',
    status: staff?.status || 'available',
    phone: staff?.phone || '',
    completion_rate: staff?.completion_rate || 0,
  });

  // Auto-generate employee number for new staff
  useEffect(() => {
    if (!staff && !formData.employee_number) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setFormData(prev => ({ ...prev, employee_number: `EMP-${year}-${random}` }));
    }
  }, [staff, formData.employee_number]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (staff) {
        // Update existing staff
        await staffApi.update(staff.id, {
          role: formData.role,
          status: formData.status,
          phone: formData.phone,
          completion_rate: formData.completion_rate,
        });
      } else {
        // Create new staff
        await staffApi.create({
          employee_number: formData.employee_number,
          role: formData.role,
          phone: formData.phone,
        } as any);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'completion_rate' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
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

          {/* Employee Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Number
            </label>
            <input
              type="text"
              name="employee_number"
              value={formData.employee_number}
              onChange={handleChange}
              required
              readOnly={!!staff}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-generated for new staff members
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
            >
              <option value="">Select a role</option>
              <option value="Event Manager">Event Manager</option>
              <option value="Event Coordinator">Event Coordinator</option>
              <option value="Driver">Driver</option>
              <option value="Catering Manager">Catering Manager</option>
              <option value="Funeral Director">Funeral Director</option>
              <option value="Administrative Assistant">Administrative Assistant</option>
              <option value="Mortician">Mortician</option>
              <option value="Groundskeeper">Groundskeeper</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 082 123 4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
            />
          </div>

          {/* Status (only for editing) */}
          {staff && (
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
                <option value="available">Available</option>
                <option value="on_assignment">On Assignment</option>
                <option value="off_duty">Off Duty</option>
              </select>
            </div>
          )}

          {/* Completion Rate (only for editing) */}
          {staff && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Rate (%)
              </label>
              <input
                type="number"
                name="completion_rate"
                value={formData.completion_rate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Task completion rate for performance tracking
              </p>
            </div>
          )}

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
              {loading ? 'Saving...' : staff ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
