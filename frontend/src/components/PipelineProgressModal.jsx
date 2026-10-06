import React from 'react';
import { Loader2, CheckCircle, Terminal, Clock, ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react';

const PIPELINE_STEPS = [
  { step: 1, key: 'VALIDATE', title: 'Validate Target & Plan Limits', desc: 'Protocol fix & quota enforcement' },
  { step: 2, key: 'FETCH', title: 'Network Fetch & TTFB', desc: 'Crawler GET & latency capture' },
  { step: 3, key: 'PARSE', title: 'DOM Tree Extraction', desc: 'Headings, tags & schema parser' },
  { step: 4, key: 'SITE_LEVEL', title: 'Site-Level Discovery', desc: 'Robots.txt & XML sitemap probe' },
  { step: 5, key: 'SPEED', title: 'Speed Engine & Vitals', desc: 'PageSpeed Insights v5 / lab benchmark' },
  { step: 6, key: 'SCORE', title: '22-Check Weighted Engine', desc: 'Letter grade A+..D computation' },
  { step: 7, key: 'ENRICH', title: 'Keyword & SERP Intelligence', desc: 'Alphabet-soup mining & DDG rankings' },
  { step: 8, key: 'ADVISE', title: 'Advisor Rule Matrix', desc: 'Severity triage & code generation' },
  { step: 9, key: 'STORE', title: 'Persistence & Trend Delta', desc: 'SQLite snapshot serialization' },
  { step: 10, key: 'RENDER', title: 'Report Rendering Engine', desc: 'Client payload compilation' },
];

export default function PipelineProgressModal({ isOpen, currentStep, logs, targetUrl, elapsedTime }) {
  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((currentStep / 10) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Autonomous 10-Step Pipeline</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                  Step {currentStep} of 10
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono truncate max-w-sm sm:max-w-md mt-0.5">
                Target: {targetUrl}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>{(elapsedTime / 1000).toFixed(1)}s</span>
          </div>
        </div>

        {/* Rose Laser Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 h-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 relative z-10">
          
          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PIPELINE_STEPS.map((s) => {
              const isCompleted = s.step < currentStep;
              const isRunning = s.step === currentStep;

              return (
                <div
                  key={s.key}
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                    isRunning 
                      ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-2 ring-rose-200/50' 
                      : isCompleted
                      ? 'bg-slate-50/80 border-slate-200/80'
                      : 'bg-white border-slate-100 opacity-40'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : isRunning ? (
                      <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-mono text-slate-400">
                        {s.step}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-tight ${isRunning ? 'text-rose-950 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {s.step}. {s.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix Terminal Console Output (Clean Dark/Light high contrast) */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Live Crawler Console</span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                SOCKET ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto text-[11px] leading-relaxed">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-rose-400 select-none font-bold">&gt;</span>
                  <span className={index === logs.length - 1 ? 'text-white font-medium' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-500 italic">Initializing sockets and allocating crawl worker...</div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-mono">
          ApexSEO Zero-Cost Telemetry • Non-blocking asynchronous task pipeline
        </div>

      </div>
    </div>
  );
}
