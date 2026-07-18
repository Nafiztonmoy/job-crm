'use client';

import { useState, useEffect } from 'react';
import { Job, ApplicationStatus, STATUS_COLUMNS } from '../types/job';
import { X, Save, Briefcase, Building2, FileText, Calendar, AlignLeft, Tag, StickyNote } from 'lucide-react';

// Bypasses strict DOM target checks and safely falls back if not in a secure context
const generateSafeId = (): string => {
  if (
    typeof window !== 'undefined' &&
    window.crypto &&
    typeof (window.crypto as any).randomUUID === 'function'
  ) {
    return (window.crypto as any).randomUUID();
  }
  // Robust fallback id generation string
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  initialJob?: Job | null;
  defaultStatus?: ApplicationStatus;
}

const emptyJob: Omit<Job, 'id' | 'createdAt'> = {
  companyName: '',
  jobTitle: '',
  status: 'Applied',
  resumeVersionUsed: '',
  jobDescriptionText: '',
  followUpDate: '',
  notes: '',
};

export default function JobModal({
  isOpen,
  onClose,
  onSave,
  initialJob,
  defaultStatus = 'Applied',
}: JobModalProps) {
  const [form, setForm] = useState<Omit<Job, 'id' | 'createdAt'>>({
    ...emptyJob,
    status: defaultStatus,
  });
  const isEditing = !!initialJob;

  useEffect(() => {
    if (initialJob) {
      setForm({
        companyName: initialJob.companyName,
        jobTitle: initialJob.jobTitle,
        status: initialJob.status,
        resumeVersionUsed: initialJob.resumeVersionUsed,
        jobDescriptionText: initialJob.jobDescriptionText,
        followUpDate: initialJob.followUpDate ? initialJob.followUpDate.split('T')[0] : '',
        notes: initialJob.notes,
      });
    } else {
      setForm({ ...emptyJob, status: defaultStatus });
    }
  }, [initialJob, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const job: Job = {
      ...form,
      id: initialJob?.id || generateSafeId(),
      createdAt: initialJob?.createdAt || new Date().toISOString(),
      followUpDate: form.followUpDate ? new Date(form.followUpDate).toISOString() : '',
    };
    
    onSave(job);
    onClose();
  };

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-white/5 animate-fade-in-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-100">
            {isEditing ? 'Edit Application' : 'Log New Application'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Company
              </label>
              <input
                required
                type="text"
                value={form.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                placeholder="e.g. Vercel"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" /> Job Title
              </label>
              <input
                required
                type="text"
                value={form.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" /> Pipeline Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as ApplicationStatus)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all appearance-none"
              >
                {STATUS_COLUMNS.map((s) => (
                  <option key={s} value={s} className="bg-slate-800">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> Resume Version
              </label>
              <input
                type="text"
                value={form.resumeVersionUsed}
                onChange={(e) => updateField('resumeVersionUsed', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                placeholder="e.g. v2.1-Frontend"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlignLeft className="w-3.5 h-3.5" /> Job Description
            </label>
            <textarea
              rows={5}
              value={form.jobDescriptionText}
              onChange={(e) => updateField('jobDescriptionText', e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none"
              placeholder="Paste the full job description here for reference..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Follow-up Date
              </label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => updateField('followUpDate', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <StickyNote className="w-3.5 h-3.5" /> Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none"
              placeholder="Add key items, interview context, or custom reminders..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Track Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}