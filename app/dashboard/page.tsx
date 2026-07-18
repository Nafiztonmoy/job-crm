'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { 
  LayoutDashboard, Briefcase, Calendar, Award, LogOut, 
  Plus, Search, Building2, MapPin, DollarSign, Clock, 
  TrendingUp, Sparkles, ChevronRight, Filter, Settings, X, Trash2
} from 'lucide-react';

interface PipelineItem {
  id: string;
  company: string;
  role: string;
  stage: 'Applied' | 'Technical Round' | 'Interviewing' | 'Offer Received';
  salary: string;
  location: string;
  updated: string;
  color: string;
}

const STAGES: PipelineItem['stage'][] = ['Applied', 'Technical Round', 'Interviewing', 'Offer Received'];

const STAGE_STYLES = {
  'Applied': 'bg-slate-950 border-slate-900 text-slate-400',
  'Technical Round': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  'Interviewing': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  'Offer Received': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/5'
};

const COLOR_MAP = {
  'Applied': 'from-slate-600 to-slate-400',
  'Technical Round': 'from-purple-500 to-pink-500',
  'Interviewing': 'from-indigo-500 to-purple-500',
  'Offer Received': 'from-emerald-500 to-teal-500'
};

const DEFAULT_DATA: PipelineItem[] = [
  { id: '1', company: 'Stripe', role: 'Staff Frontend Engineer', stage: 'Interviewing', salary: '$190k', location: 'Remote', updated: 'Just now', color: 'from-indigo-500 to-purple-500' },
  { id: '2', company: 'Linear', role: 'Product Designer', stage: 'Technical Round', salary: '$165k', location: 'NYC / Hybrid', updated: '1d ago', color: 'from-purple-500 to-pink-500' }
];

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // Core Functional States
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  
  // Modal Drawer Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [stage, setStage] = useState<PipelineItem['stage']>('Applied');

  // Hydrate User-Scoped Database
  useEffect(() => {
    if (!isLoading && user) {
      const storageKey = `pipeline_data_${user.email}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        setPipeline(JSON.parse(savedData));
      } else {
        setPipeline(DEFAULT_DATA);
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_DATA));
      }
    }
  }, [user, isLoading]);

  // Route Guard Access Layer
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const updateStorage = (updatedList: PipelineItem[]) => {
    setPipeline(updatedList);
    localStorage.setItem(`pipeline_data_${user.email}`, JSON.stringify(updatedList));
  };

  // Add Application Action Handler
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) {
      addToast('Company and Role fields are mandatory.', 'error');
      return;
    }

    const newItem: PipelineItem = {
      id: Date.now().toString(),
      company,
      role,
      stage,
      salary: salary || 'Undisclosed',
      location: location || 'Remote',
      updated: 'Just now',
      color: COLOR_MAP[stage]
    };

    const updatedList = [newItem, ...pipeline];
    updateStorage(updatedList);
    addToast(`${company} tracking cluster initialized!`, 'success');
    
    // Clear Form & Close Panel
    setCompany('');
    setRole('');
    setSalary('');
    setLocation('');
    setStage('Applied');
    setIsModalOpen(false);
  };

  // Click Trigger to Cycle Application Stage
  const cycleStage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card selection click
    const updatedList = pipeline.map((item) => {
      if (item.id === id) {
        const currentIdx = STAGES.indexOf(item.stage);
        const nextStage = STAGES[(currentIdx + 1) % STAGES.length];
        return { 
          ...item, 
          stage: nextStage, 
          color: COLOR_MAP[nextStage],
          updated: 'Just now' 
        };
      }
      return item;
    });
    updateStorage(updatedList);
    addToast('Lifecycle node state updated successfully.', 'success');
  };

  // Remove tracking node completely
  const deleteApplication = (id: string, companyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = pipeline.filter(item => item.id !== id);
    updateStorage(updatedList);
    addToast(`${companyName} purge trace complete.`, 'info');
  };

  const handleLogout = () => {
    logout();
    addToast('Secure workspace session terminated.', 'info');
    router.push('/login');
  };

  const filteredPipeline = pipeline.filter(item => {
    const matchesSearch = item.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || item.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
      
      {/* SIDEBAR NAVIGATION CONTROL */}
      <aside className="w-64 hidden md:flex flex-col justify-between border-r border-slate-900 bg-slate-950/40 backdrop-blur-md p-6 relative z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-200">Pipeline Workspace</span>
          </div>

          <nav className="space-y-1.5">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              <LayoutDashboard className="w-4 h-4" />
              <span>Applications</span>
            </button>
            <button onClick={() => addToast('Schedule telemetry is read-only right now.', 'info')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 transition-all cursor-pointer">
              <Calendar className="w-4 h-4" />
              <span>Schedules</span>
            </button>
            <button onClick={() => addToast('Offer computation matrices require upgraded licensing.', 'info')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 transition-all cursor-pointer">
              <Award className="w-4 h-4" />
              <span>Offers</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-900 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-950 hover:bg-red-950/20 border border-slate-900 hover:border-red-900/30 text-slate-500 hover:text-red-400 text-xs font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT PANELS */}
      <main className="flex-1 relative overflow-y-auto p-6 md:p-10 z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono tracking-tight mb-2">
              <Sparkles className="w-3 h-3 text-indigo-400" /> INSTANCE ACTIVE
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-slate-100">{user.name}</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </header>

        {/* ANALYTICS HUD METRIC COMPASS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {[
            { label: 'ACTIVE PIPELINE', val: pipeline.length, trend: 'Dynamic Nodes' },
            { label: 'LIVE ROUNDS', val: pipeline.filter(i => i.stage === 'Interviewing' || i.stage === 'Technical Round').length, trend: 'Actionable Items' },
            { label: 'OFFERS DOCUMENTED', val: pipeline.filter(i => i.stage === 'Offer Received').length, trend: 'Target Milestones' },
            { label: 'PIPELINE CAPACITY', val: '94%', trend: 'Nominal Health Cluster' }
          ].map((card, i) => (
            <div key={i} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 backdrop-blur-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">{card.label}</span>
              <p className="text-2xl font-semibold text-slate-100 tracking-tight">{card.val}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">{card.trend}</p>
            </div>
          ))}
        </section>

        {/* MANAGEMENT & CONTROL BAR FILTER MATRICES */}
        <section className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between bg-slate-900/10 border border-slate-900 p-3 rounded-xl backdrop-blur-xl animate-fade-in-up">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query application ecosystem..."
              className="w-full bg-slate-950/60 border border-slate-900 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
            {['All', 'Applied', 'Technical Round', 'Interviewing', 'Offer Received'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStage(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedStage === tab 
                    ? 'bg-slate-900 border border-slate-800 text-indigo-300 shadow-inner' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* RENDER DYNAMIC CARD MATRIX MAPPINGS */}
        <section className="space-y-3 animate-fade-in-up">
          {filteredPipeline.length > 0 ? (
            filteredPipeline.map((item) => (
              <div 
                key={item.id}
                onClick={() => addToast(`Opening telemetry console log context for ${item.company}...`, 'info')}
                className="bg-slate-900/10 hover:bg-slate-900/30 border border-slate-900/60 hover:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 backdrop-blur-md relative group cursor-pointer"
              >
                <div className={`absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b ${item.color} rounded-r opacity-60 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start gap-4 pl-2">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-900/80 mt-0.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      {item.company}
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-slate-500 font-medium pl-2 sm:pl-0">
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-slate-600" />{item.salary}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-600" />{item.location}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600"><Clock className="w-3.5 h-3.5 text-slate-700" />{item.updated}</span>
                </div>

                {/* Interactive Dynamic Action Badges */}
                <div className="flex items-center justify-end gap-3 px-2 sm:px-0">
                  <button
                    type="button"
                    onClick={(e) => cycleStage(item.id, e)}
                    title="Click to cycle next stage"
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border cursor-pointer hover:scale-105 transition-transform active:scale-95 select-none ${STAGE_STYLES[item.stage]}`}
                  >
                    {item.stage}
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => deleteApplication(item.id, item.company, e)}
                    className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg hover:bg-red-500/5 border border-transparent hover:border-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Purge record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-slate-900 rounded-2xl py-12 px-4 text-center text-sm text-slate-600 backdrop-blur-xl bg-slate-900/5">
              <Filter className="w-5 h-5 mx-auto mb-3 text-slate-700" />
              No tracked nodes match the active filtering constraints.
            </div>
          )}
        </section>
      </main>

      {/* 3. PREMIUM SLIDE-OVER GLASS DISPATCHER MODAL DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          {/* Dismiss Back-Click Cover Trigger layer */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          <div className="w-full max-w-md h-full bg-slate-950/90 border-l border-slate-900 p-6 sm:p-8 relative z-10 flex flex-col justify-between shadow-2xl animate-fade-in-up">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-slate-100">Initialize App Node</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Input Form Module */}
              <form onSubmit={handleAddApplication} id="modal-app-form" className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company Name *</label>
                  <input 
                    type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                    placeholder="Stripe, Vercel, Linear..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role Title *</label>
                  <input 
                    type="text" required value={role} onChange={(e) => setRole(e.target.value)}
                    placeholder="Senior Frontend Engineer..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Comp / Salary</label>
                    <input 
                      type="text" value={salary} onChange={(e) => setSalary(e.target.value)}
                      placeholder="$160k - $180k..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location Layout</label>
                    <input 
                      type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                      placeholder="Remote / NYC..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lifecycle Tracking Target Stage</label>
                  <select 
                    value={stage} 
                    onChange={(e) => setStage(e.target.value as PipelineItem['stage'])}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {STAGES.map((s) => (<option key={s} value={s} className="bg-slate-950 text-slate-300">{s}</option>))}
                  </select>
                </div>
              </form>
            </div>

            <div className="border-t border-slate-900 pt-4 flex gap-3">
              <button 
                type="button" onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" form="modal-app-form"
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Deploy Cluster
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}