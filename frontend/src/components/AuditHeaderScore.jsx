import React from 'react';
import { ExternalLink, Zap, Clock, HardDrive, CheckCircle, AlertTriangle, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

export default function AuditHeaderScore({ report, onOpenAutopilot }) {
  if (!report) return null;

  const score = report.score || 0;
  const grade = report.grade || 'C';
  const passed = report.passed_checks || 0;
  const total = report.total_checks || 22;
  const ttfb = report.crawl?.ttfb_ms || 0;
  const pageSize = report.crawl?.page_size_kb || 0;
  const failed = report.failed_checks || 0;

  // SVG Circle calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Grade badge style in light mode
  const getGradeStyle = (g) => {
    switch (g) {
      case 'A+':
      case 'A':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-100';
      case 'B':
        return 'bg-rose-50 text-rose-700 border-rose-300 ring-rose-100';
      case 'C':
        return 'bg-amber-50 text-amber-700 border-amber-300 ring-amber-100';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-400 ring-rose-200';
    }
  };

  const getStrokeColor = (s) => {
    if (s >= 85) return '#10B981'; // Emerald
    if (s >= 70) return '#E11D48'; // Electric Rose-Red
    if (s >= 55) return '#F59E0B'; // Amber
    return '#E11D48'; // Red
  };

  return (
    <div className="bg-white border-b border-slate-200/80 pt-8 pb-10 relative overflow-hidden">
      
      {/* Ambient background rose warmth */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-48 bg-rose-400/5 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                {report.domain}
              </h2>
              <a
                href={report.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-rose-600 transition"
                title="Open target URL in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Scanned: {new Date(report.created_at).toLocaleString()} • Latency: {report.execution_time_ms ? `${(report.execution_time_ms / 1000).toFixed(2)}s` : '1.8s'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAutopilot}
              className="btn-tactile flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-bold text-xs select-none"
            >
              <Zap className="w-4 h-4 text-white fill-white" />
              <span>Simulate Autopilot Fix</span>
              <span className="px-1.5 py-0.5 rounded-lg bg-white/20 text-[10px] font-mono">
                +{report.advisor?.projected_points_gain || 12} pts
              </span>
            </button>
          </div>
        </div>

        {/* Score & Key Metrics Row (Superlist 3D Clay Elevation) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Radial Score Meter Card (4 Cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-clay flex items-center gap-6 relative overflow-hidden group">
            
            {/* SVG Progress Ring */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#F1F5F9"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress Ring with Rose Glow */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={getStrokeColor(score)}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_8px_rgba(225,29,72,0.35)]"
                />
              </svg>
              
              {/* Inner Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tight text-slate-900 leading-none font-mono">
                  {Math.round(score)}
                </span>
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider mt-1">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono border ${getGradeStyle(grade)}`}>
                  GRADE {grade}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                {score >= 80 ? 'Optimal Architecture' : score >= 65 ? 'Moderate Technical Debt' : 'Critical Deficits Found'}
              </h4>
              <p className="text-xs text-slate-500 leading-normal">
                Weighted across 22 indexing, speed, and content signals.
              </p>
            </div>
          </div>

          {/* 4 Metric Cards (8 Cols - Superlist Style) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* TTFB */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-medium">TTFB Latency</span>
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {ttfb ? `${Math.round(ttfb)}ms` : '—'}
              </div>
              <span className={`inline-block mt-1 text-[11px] font-mono font-semibold ${ttfb < 600 ? 'text-emerald-600' : ttfb < 1200 ? 'text-amber-600' : 'text-rose-600'}`}>
                {ttfb < 600 ? '• Excellent' : ttfb < 1200 ? '• Fair Latency' : '• Slow Response'}
              </span>
            </div>

            {/* Document Size */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-medium">HTML Payload</span>
                <HardDrive className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {pageSize} KB
              </div>
              <span className={`inline-block mt-1 text-[11px] font-mono font-semibold ${pageSize < 150 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {pageSize < 150 ? '• Lightweight' : '• Heavy DOM'}
              </span>
            </div>

            {/* Passed Checks */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-medium">Passed Checks</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {passed} <span className="text-xs font-normal text-slate-400">/ {total}</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-emerald-600">
                • {Math.round((passed / total) * 100)}% Pass Rate
              </span>
            </div>

            {/* Action Items */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-medium">Issues Detected</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {failed}
              </div>
              <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-rose-600">
                • {report.advisor?.critical_count || 0} Critical
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
