import React from 'react';
import { Activity, ShieldCheck, Zap, History, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';

export default function Navbar({ user, onOpenHistory, onOpenAutopilot, activeAudit }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tactile 3D Rose Icon */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30 transform group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900">Apex<span className="text-rose-600">SEO</span></span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 font-bold">
                Zero-Cost v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Superlist-Speed SEO & Autonomous Telemetry
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Active Audit Domain Pill */}
          {activeAudit && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-mono text-slate-700 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-900">{activeAudit.domain}</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-600 font-bold">{activeAudit.score}/100</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-rose-100/70 text-rose-800 font-bold">
                {activeAudit.grade}
              </span>
            </div>
          )}

          {/* Autopilot Trigger Button (Superlist Tactile Vibe) */}
          <button 
            onClick={onOpenAutopilot}
            className="btn-tactile flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 shadow-md transition-all select-none"
          >
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
            <span className="hidden sm:inline">Autopilot Mode</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 transition shadow-xs"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* User & Plan Pill (Attio Ergonomics) */}
          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-100 to-rose-50 border border-rose-100 flex items-center justify-center text-xs font-bold text-rose-700 shadow-2xs">
              AM
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span>Alex Mercer</span>
                <span className="px-1.5 py-0.2 text-[9px] rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {user?.plan || 'PRO'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{user?.audits_count || 14} / 500 audits</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
