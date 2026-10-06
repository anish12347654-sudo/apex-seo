import React, { useState } from 'react';
import { Search, Globe, ArrowRight, Sparkles, CheckCircle2, Shield, Gauge, Cpu, Zap, Activity, Radio, Terminal } from 'lucide-react';

export default function UrlInputHero({ onStartAudit, isLoading }) {
  const [protocol, setProtocol] = useState('https://');
  const [domainInput, setDomainInput] = useState('');

  const sampleTargets = [
    { name: 'stripe.com', label: 'Stripe' },
    { name: 'linear.app', label: 'Linear' },
    { name: 'github.com', label: 'GitHub' },
    { name: 'vercel.com', label: 'Vercel' },
    { name: 'superlist.com', label: 'Superlist' },
    { name: 'dub.co', label: 'Dub.co' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    const cleanUrl = domainInput.trim().replace(/^https?:\/\//i, '');
    onStartAudit(`${protocol}${cleanUrl}`);
  };

  const handleQuickLaunch = (target) => {
    setDomainInput(target);
    onStartAudit(`https://${target}`);
  };

  return (
    <div className="relative pt-12 pb-20 sm:pt-18 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-rose-50/20 to-slate-50 border-b border-slate-200/80">
      
      {/* 1. Ambient Warm Rose & Coral Glow Radiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-rose-400/10 via-pink-400/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-24 left-1/4 w-[380px] h-[380px] bg-rose-300/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-red-400/8 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill (Magic UI Shiny Badge) */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200/80 text-xs font-semibold mb-6 shadow-sm shadow-rose-500/5 backdrop-blur-md relative overflow-hidden group select-none">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-slate-700 font-bold">ApexSEO 2.0</span>
            <span className="w-1 h-1 rounded-full bg-rose-300"></span>
            <span className="animate-shiny-text font-bold">Autonomous Technical SEO & Keyword Telemetry</span>
            <ArrowRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition" />
          </div>

          {/* Master Headline (Superlist + Attio Bold Clean Style) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08] max-w-4xl mx-auto">
            High-Velocity SEO &{' '}
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Autonomous Intelligence
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Zero-cost Semrush alternative. Deep-crawl DOM signals in milliseconds, mine live Google 
            alphabet-soup queries, and simulate 1-click code remediation.
          </p>

          {/* Command Search Cockpit (Dub.co Style Elevated Dock) */}
          <form onSubmit={handleSubmit} className="mt-9 max-w-2xl mx-auto">
            <div className="relative p-2.5 rounded-3xl bg-white border border-slate-200/90 shadow-clay focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all">
              <div className="flex items-center gap-2">
                
                {/* Protocol Pill */}
                <div className="flex items-center pl-3 pr-2 text-xs font-mono font-bold text-rose-600 border-r border-slate-200 select-none">
                  <Globe className="w-4 h-4 mr-1.5 text-rose-500" />
                  <span>{protocol}</span>
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter target domain (e.g. stripe.com or linear.app)..."
                  disabled={isLoading}
                  className="w-full px-2 py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none bg-transparent"
                />

                {/* Submit Button (Superlist Tactile Button) */}
                <button
                  type="submit"
                  disabled={isLoading || !domainInput.trim()}
                  className="btn-tactile flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 disabled:opacity-50 text-white font-bold text-sm select-none"
                >
                  <Zap className="w-4 h-4 text-white fill-white" />
                  <span>{isLoading ? 'Crawling...' : 'Run Audit'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </form>

          {/* Fast Benchmark Chips with Colorful Live Status Dots */}
          <div className="mt-5 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-mono text-slate-400 mr-1">Benchmarks:</span>
            {sampleTargets.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleQuickLaunch(item.name)}
                disabled={isLoading}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/40 text-slate-700 hover:text-rose-700 transition font-mono text-xs shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* 2. Superlist 3D Tactile Bento Dashboard Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto relative perspective-1000">
          
          {/* Orbiting Satellite Badges (Superlist Floating Widgets with Real Clay Shadows) */}
          {/* Satellite 1: Top-Left (TTFB) */}
          <div className="hidden lg:flex absolute -top-5 -left-10 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-clay animate-float-1 select-none">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 block leading-tight">EDGE SPEED</span>
              <span className="text-xs font-black text-slate-800 font-mono">TTFB 142ms • Blazing Fast</span>
            </div>
          </div>

          {/* Satellite 2: Top-Right (Grade) */}
          <div className="hidden lg:flex absolute -top-5 -right-10 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-clay animate-float-2 select-none">
            <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 block leading-tight">HEALTH GRADE</span>
              <span className="text-xs font-black text-rose-600 font-mono">Grade A+ • 98/100</span>
            </div>
          </div>

          {/* Satellite 3: Bottom-Left (22 Signals) */}
          <div className="hidden lg:flex absolute -bottom-5 -left-8 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-clay animate-float-2 select-none">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 block leading-tight">ALGORITHMIC AUDIT</span>
              <span className="text-xs font-black text-slate-800 font-mono">22 Weighted Signals</span>
            </div>
          </div>

          {/* Satellite 4: Bottom-Right (Autopilot) */}
          <div className="hidden lg:flex absolute -bottom-5 -right-8 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-clay animate-float-1 select-none">
            <div className="w-7 h-7 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 block leading-tight">LOOP ENGINE</span>
              <span className="text-xs font-black text-pink-700 font-mono">Autopilot 1-Click Fix</span>
            </div>
          </div>

          {/* 3D Tilted Porcelain White Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-clay rotate-x-8 hover:rotate-0 transition-transform duration-500 relative overflow-hidden group select-none">
            
            {/* Subtle Top Rose Glow Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600" />

            {/* Card Content: Telemetry HUD Preview */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Radial Dial & Score (Superlist Rose Signature) */}
              <div className="flex items-center gap-5">
                <div className="relative w-26 h-26 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#E11D48"
                      strokeWidth="8"
                      strokeDasharray="263.89"
                      strokeDashoffset="26.38"
                      strokeLinecap="round"
                      fill="transparent"
                      className="filter drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900 font-mono leading-none">94</span>
                    <span className="text-[9px] font-black text-rose-600 uppercase mt-0.5">HEALTH</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-black font-mono bg-rose-50 text-rose-700 border border-rose-200">
                      GRADE A+
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">Live Crawl Verified</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-1">Autonomous Telemetry Hub</h4>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Zero-cost crawler analyzing headers, redirects, Core Web Vitals, & Google Autocomplete.
                  </p>
                </div>
              </div>

              {/* Live Metric HUD Pills */}
              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">HTML Payload</span>
                  <span className="text-base font-black text-slate-900 font-mono">48.2 KB</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center shadow-2xs">
                  <span className="text-[10px] font-mono font-bold text-rose-500 uppercase block">Keywords Mined</span>
                  <span className="text-base font-black text-rose-600 font-mono">40+ Queries</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
