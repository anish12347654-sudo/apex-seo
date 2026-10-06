import React from 'react';
import { Gauge, Zap, CheckCircle2, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';

export default function SpeedVitalsCard({ speedData }) {
  if (!speedData) return null;

  const perfScore = speedData.performance_score || 80;
  const lcp = speedData.lcp_sec || 2.1;
  const fcp = speedData.fcp_sec || 1.2;
  const cls = speedData.cls || 0.04;
  const tbt = speedData.tbt_ms || 120;
  const speedIndex = speedData.speed_index_sec || 1.8;
  const source = speedData.source || 'Synthetic Lab Benchmark';

  const getMetricStatus = (metric, val) => {
    switch (metric) {
      case 'lcp':
        return val <= 2.5 ? { label: 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' } : val <= 4.0 ? { label: 'Needs Work', color: 'text-amber-700 bg-amber-50 border-amber-200' } : { label: 'Poor', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'cls':
        return val <= 0.1 ? { label: 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' } : val <= 0.25 ? { label: 'Needs Work', color: 'text-amber-700 bg-amber-50 border-amber-200' } : { label: 'Poor', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'fcp':
        return val <= 1.8 ? { label: 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' } : val <= 3.0 ? { label: 'Needs Work', color: 'text-amber-700 bg-amber-50 border-amber-200' } : { label: 'Poor', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'tbt':
        return val <= 200 ? { label: 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' } : val <= 600 ? { label: 'Needs Work', color: 'text-amber-700 bg-amber-50 border-amber-200' } : { label: 'Poor', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      default:
        return { label: 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-clay flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-rose-500/25 font-mono">
            {perfScore}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Lighthouse Performance Index
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mobile audit benchmarks using Chrome DevTools Protocol & Web Vitals telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs">
            {source}
          </span>
        </div>
      </div>

      {/* Core Web Vitals Grid (Superlist Clay Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* LCP */}
        {(() => {
          const st = getMetricStatus('lcp', lcp);
          return (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Largest Contentful Paint</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {lcp}s
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Target: &lt; 2.5s for optimal search ranking.</p>
            </div>
          );
        })()}

        {/* FCP */}
        {(() => {
          const st = getMetricStatus('fcp', fcp);
          return (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">First Contentful Paint</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {fcp}s
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Target: &lt; 1.8s when initial DOM renders.</p>
            </div>
          );
        })()}

        {/* CLS */}
        {(() => {
          const st = getMetricStatus('cls', cls);
          return (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Cumulative Layout Shift</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {cls}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Target: &lt; 0.1 visual stability score.</p>
            </div>
          );
        })()}

        {/* TBT */}
        {(() => {
          const st = getMetricStatus('tbt', tbt);
          return (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-clay shadow-clay-hover space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Blocking Time</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {tbt}ms
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Target: &lt; 200ms CPU main thread block.</p>
            </div>
          );
        })()}

      </div>

    </div>
  );
}
