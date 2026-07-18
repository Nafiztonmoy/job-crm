'use client';

import { Job } from '../types/job';
import { Briefcase, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { useMemo } from 'react';

interface StatsBannerProps {
  jobs: Job[];
}

export function StatsBanner({ jobs }: StatsBannerProps) {
  const total = jobs.length;
  const interviewing = jobs.filter((j) => j.status === 'Interviewing').length;
  const rejected = jobs.filter((j) => j.status === 'Rejected').length;
  const offers = jobs.filter((j) => j.status === 'Offer').length;

  const ratio = useMemo(() => {
    if (rejected > 0) return (offers / rejected).toFixed(2);
    return offers > 0 ? '∞' : '0.00';
  }, [rejected, offers]);

  const activeRate = total > 0 ? Math.round(((interviewing + offers) / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Applications',
      value: total,
      icon: Briefcase,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      label: 'Active Interviews',
      value: interviewing,
      icon: MessageSquare,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: 'Offer / Rejection Ratio',
      value: ratio,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Active Pipeline Rate',
      value: `${activeRate}%`,
      icon: Target,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} border rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className={`p-2.5 rounded-lg bg-slate-950/30`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100 tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Dual-export fallback to satisfy any trailing module maps
export default StatsBanner;