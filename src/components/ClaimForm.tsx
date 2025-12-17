import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { claimsApi, membersApi } from '@/lib/api';

interface ClaimFormProps {
  claim?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClaimForm({ claim, onClose, onSuccess }: ClaimFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    member_id: claim?.member_id || '',
    attending_member_id: claim?.attending_member_id || null,
    deceased_name: claim?.deceased_name || '',
    amount: claim?.amount || 15000,
    status: claim?.status || 'new',
    submitted_date: claim?.submitted_date || new Date().toISOString().split('T')[0],
    processed_date: claim?.processed_date || null,
    processor_id: claim?.processor_id || null,
    notes: claim?.notes || '',
  });

  // Load members for dropdown
  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await membersApi.getAll({ status: 'active' });
        setMembers(data);
      } catch (err) {
        console.error('Failed to load members:', err);
      }
    }
    loadMembers();
  }, []);

  // Auto-fill amount based on selected member
  useEffect(() => {
    if (formData.member_id && members.length > 0) {
      const selectedMember = members.find(m => m.id === formData.member_id);
      if (selectedMember) {
        setFormData(prev => ({ ...prev, amount: selectedMember.cover_amount }));
      }
    }
  }, [formData.member_id, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (claim) {
        // Update existing claim - only send fields that can be updated
        await claimsApi.update(claim.id, {
          deceased_name: formData.deceased_name,
          amount: formData.amount,
          status: formData.status,
          notes: formData.notes,
        });
      } else {
        // Create new claim - only send required fields for creation
        await claimsApi.create({
          member_id: formData.member_id,
          deceased_name: formData.deceased_name,
          amount: formData.amount,
          submitted_date: formData.submitted_date,
          notes: formData.notes,
        } as any);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save claim');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {claim ? 'Edit Claim' : 'Submit New Claim'}
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

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member *
            </label>
            <select
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              required
              disabled={!!claim}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select a member</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.member_number} - {member.first_name} {member.last_name} ({member.policy_type.toUpperCase()})
                </option>
              ))}
            </select>
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

          {/* Claim Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Amount is auto-filled based on member's policy cover
            </p>
          </div>

          {/* Status (only for editing) */}
          {claim && (
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
                <option value="new">New</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
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
              placeholder="Additional information about the claim..."
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
              {loading ? 'Saving...' : claim ? 'Update Claim' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
