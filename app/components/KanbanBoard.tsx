'use client';

import { Job, ApplicationStatus, STATUS_COLUMNS, STATUS_COLORS } from '../types/job';
import JobCard from './JobCard';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newStatus: ApplicationStatus) => void;
  onAdd: (status: ApplicationStatus) => void;
  onDrop: (jobId: string, newStatus: ApplicationStatus) => void;
}

// 1. Converted to a named export function
export function KanbanBoard({
  jobs,
  onEdit,
  onDelete,
  onMove,
  onAdd,
  onDrop,
}: KanbanBoardProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId) onDrop(jobId, status);
  };

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
      {STATUS_COLUMNS.map((status, colIndex) => {
        const columnJobs = jobs.filter((j) => j.status === status);
        return (
          <div
            key={status}
            className="flex flex-col bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: `${colIndex * 100}ms` }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div
              className={`flex items-center justify-between px-4 py-3.5 border-b border-slate-800/60 ${STATUS_COLORS[status]}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full bg-current`} />
                <h2 className="font-semibold text-sm tracking-wide">{status}</h2>
                <span className="bg-slate-800 text-slate-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  {columnJobs.length}
                </span>
              </div>
              <button
                onClick={() => onAdd(status)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={`Add to ${status}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[300px] max-h-[calc(100vh-320px)]">
              {columnJobs.map((job, jobIndex) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onMove={onMove}
                  onDragStart={handleDragStart}
                  index={jobIndex}
                />
              ))}
              {columnJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-600 text-xs border-2 border-dashed border-slate-800/60 rounded-xl">
                  <p>Drop jobs here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 2. Added default export fallback below for maximum runtime compatibility
export default KanbanBoard;