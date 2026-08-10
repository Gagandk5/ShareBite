import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface ReportModalProps {
  donationId?: string;
  reportedUserId?: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ donationId, reportedUserId, onClose }) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState('Unsafe Food');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide details about the issue.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify({
          donationId,
          reportedUserId,
          reason,
          description
        })
      });
      showToast('Report filed successfully. Our team will review this issue.', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-2 bg-rose-50 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Report Listing or User</h3>
            <p className="text-xs text-slate-500">Help maintain ShareBite safety & transparency</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Unsafe Food">Unsafe Food / Expired</option>
              <option value="Fake Donation">Fake Donation / Scam</option>
              <option value="Spam">Spam or Misleading Info</option>
              <option value="Harassment">Harassment or Unprofessional Behavior</option>
              <option value="Incorrect Information">Incorrect Location or Time</option>
              <option value="Other Issue">Other Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue clearly..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
