'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Briefcase, Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1994&auto=format&fit=crop'
];

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  
  const { login, register, guestLogin } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // Background Slider Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !name) {
      addToast('Please enter your name', 'error');
      return;
    }
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const success = await register(name, email, password);
        if (success) {
          addToast('Account initialized successfully!', 'success');
          router.push('/dashboard');
        } else {
          addToast('Registration rejected. This email might already exist.', 'error');
          setLoading(false);
        }
      } else {
        const success = await login(email, password);
        if (success) {
          addToast('Pipeline workspace unlocked.', 'success');
          router.push('/dashboard');
        } else {
          addToast('Authentication failed. Check details or use Demo access.', 'error');
          setLoading(false);
        }
      }
    } catch (err) {
      addToast('A secure connection exception occurred.', 'error');
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    guestLogin();
    addToast('Logged in under anonymous session sandbox.', 'info');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* LEFT VIEWPORT: Cinematic Image Slider with Ken Burns Movement */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden border-r border-slate-900/60">
        {BACKGROUND_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === bgIndex ? 'opacity-35 scale-100 animate-ken-burns' : 'opacity-0 scale-95'
            }`}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        {/* Multilayer Matte Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950" />

        {/* Floating Interactive Badge Array */}
        <div className="relative z-10 p-16 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-indigo-300 text-xs font-medium backdrop-blur-md shadow-inner animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Next-Gen Pipeline Ecosystem
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-100 leading-[1.15] animate-fade-in-up">
            Architect your enterprise application workflows <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">fluidly.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed font-normal animate-fade-in-up max-w-md">
            Consolidate tracking paradigms, analyze velocity performance, and control data pipelines via unified, beautiful views.
          </p>
        </div>
      </div>

      {/* RIGHT VIEWPORT: Minimalist Premium Form Shell */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Dynamic Backglow Orbs */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-4000" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-6000" />

        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
          
          {/* Brand Header Identity */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="p-3.5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-800 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
                {isSignUp ? 'Create your platform account' : 'Access your pipeline'}
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                {isSignUp ? 'Deploy your persistent analytic workspace instantly' : 'Sign in to resume infrastructure monitoring'}
              </p>
            </div>
          </div>

          {/* Core Login/Registration Floating Card */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative group hover:border-slate-800/80 transition-all duration-500">
            
            {/* Top Border Glow Ambient Strip */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Floating Input Component: Full Name */}
              {isSignUp && (
                <div className="relative border border-slate-800/80 bg-slate-950/40 rounded-xl px-3.5 pt-4 pb-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-300 animate-fade-in">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                  <input
                    type="text"
                    id="name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    className="block w-full bg-transparent p-0 text-sm text-slate-100 placeholder-transparent focus:outline-none focus:ring-0 peer"
                  />
                  <label 
                    htmlFor="name-input"
                    className="absolute left-3.5 top-3.5 text-xs font-medium text-slate-500 pointer-events-none origin-[0_0] transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-indigo-400 !peer-not-placeholder-shown:text-xs !peer-not-placeholder-shown:top-1.5"
                    style={{ top: name ? '6px' : '', fontSize: name ? '11px' : '' }}
                  >
                    Full Name
                  </label>
                </div>
              )}

              {/* Floating Input Component: Email Address */}
              <div className="relative border border-slate-800/80 bg-slate-950/40 rounded-xl px-3.5 pt-4 pb-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-300">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  type="email"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="block w-full bg-transparent p-0 text-sm text-slate-100 placeholder-transparent focus:outline-none focus:ring-0 peer"
                />
                <label 
                  htmlFor="email-input"
                  className="absolute left-3.5 top-3.5 text-xs font-medium text-slate-500 pointer-events-none origin-[0_0] transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-indigo-400"
                  style={{ top: email ? '6px' : '', fontSize: email ? '11px' : '' }}
                >
                  Email Address
                </label>
              </div>

              {/* Floating Input Component: Password */}
              <div className="relative border border-slate-800/80 bg-slate-950/40 rounded-xl px-3.5 pt-4 pb-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-300">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  type="password"
                  id="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="block w-full bg-transparent p-0 text-sm text-slate-100 placeholder-transparent focus:outline-none focus:ring-0 peer"
                />
                <label 
                  htmlFor="password-input"
                  className="absolute left-3.5 top-3.5 text-xs font-medium text-slate-500 pointer-events-none origin-[0_0] transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:text-xs peer-focus:top-1.5 peer-focus:text-indigo-400"
                  style={{ top: password ? '6px' : '', fontSize: password ? '11px' : '' }}
                >
                  Password
                </label>
              </div>

              {/* Forgot Account Recovery Trigger */}
              {!isSignUp && (
                <div className="flex justify-end animate-fade-in">
                  <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-400 transition-colors">
                    Forgot account recovery?
                  </a>
                </div>
              )}

              {/* Primary Action Dispatcher */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-xl shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{isSignUp ? (loading ? 'Configuring Node...' : 'Sign Up') : (loading ? 'Verifying...' : 'Sign In')}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Secondary Identity Verification Split */}
              {!isSignUp && (
                <div className="relative flex py-1 items-center animate-fade-in">
                  <div className="flex-grow border-t border-slate-900" />
                  <span className="flex-shrink mx-4 text-[10px] uppercase font-semibold tracking-wider text-slate-600">Alternative Credentials</span>
                  <div className="flex-grow border-t border-slate-900" />
                </div>
              )}

              {/* Direct Demo Sandbox Trigger Bypass */}
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleGuestAccess}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-300 font-medium text-sm active:scale-[0.98] transition-all duration-150 cursor-pointer animate-fade-in"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                  Launch Guest Sandbox
                </button>
              )}
            </form>

            {/* Quick-hint credential footer contextual layer */}
            {!isSignUp && (
              <div className="mt-5 pt-4 flex items-center justify-center gap-2 border-t border-slate-950/60 text-[11px] text-slate-600 animate-fade-in">
                <span>Demo Workspace:</span>
                <code className="bg-slate-950 px-2 py-0.5 rounded border border-slate-900 text-indigo-400 font-mono">demo@example.com</code>
              </div>
            )}
          </div>

          {/* Form State Navigation Toggle Tunnels */}
          <p className="text-center text-sm text-slate-500">
            {isSignUp ? 'Already have an initialized node? ' : "New to the tracking framework? "}
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setName('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer focus:outline-none underline decoration-indigo-500/20 underline-offset-4"
            >
              {isSignUp ? 'Sign In' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}