export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  resumeVersionUsed: string;
  jobDescriptionText: string;
  followUpDate: string;
  notes: string;
  createdAt: string;
}

export const STATUS_COLUMNS: ApplicationStatus[] = ['Applied', 'Interviewing', 'Rejected', 'Offer'];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Interviewing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  Offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export const STATUS_ACCENT: Record<ApplicationStatus, string> = {
  Applied: 'border-blue-500/30 hover:border-blue-500/50',
  Interviewing: 'border-amber-500/30 hover:border-amber-500/50',
  Rejected: 'border-red-500/30 hover:border-red-500/50',
  Offer: 'border-emerald-500/30 hover:border-emerald-500/50',
};