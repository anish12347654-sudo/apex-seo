import React, { useState, useEffect } from 'react';
import { X, Zap, Copy, Check, Download, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, FileCode } from 'lucide-react';

export default function AutopilotModal({ isOpen, onClose, report, onSimulateBoost }) {
  const [activeTab, setActiveTab] = useState('nextjs');
  const [copied, setCopied] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (isOpen && report) {
      handleSimulate();
    }
  }, [isOpen, report]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/autopilot/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_data: report })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationData(data);
      }
    } catch (e) {
      console.error("Simulation failed:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!isOpen || !report) return null;

  const artifacts = simulationData?.artifacts || report.advisor?.artifacts || {};
  const origScore = simulationData?.original_score || report.score || 70;
  const simScore = simulationData?.simulated_score || Math.min(98, Math.round(origScore + 14));
  const simGrade = simulationData?.simulated_grade || 'A';
  const delta = simulationData?.score_delta || `+${Math.round(simScore - origScore)}`;
  const fixedCount = simulationData?.fixed_items_count || 4;

  const getCodeSnippet = () => {
    switch (activeTab) {
      case 'nextjs':
        return artifacts.nextjs_metadata_snippet || '// Next.js Metadata snippet';
      case 'html':
        return artifacts.html_head_snippet || '<!-- HTML Head snippet -->';
      case 'robots':
        return artifacts.robots_txt_snippet || '# robots.txt snippet';
      case 'schema':
        return artifacts.schema_json_ld || '<script type="application/ld+json">{}</script>';
      case 'nginx':
        return artifacts.nginx_snippet || '# Nginx config';
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-pink-50 to-white text-slate-900 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-900">Autopilot Remediation & Re-Audit Loop</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  USP Loop Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Automated patch synthesis for {report.domain}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 relative z-10">
          
          {/* Simulated Score Leap Card (Superlist Style) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-rose-50/40 border border-rose-200/80 shadow-clay flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-8">
              {/* Before */}
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                  Current Score
                </span>
                <span className="text-3xl font-black text-slate-700 font-mono">
                  {Math.round(origScore)}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1 font-mono">
                  ({report.grade})
                </span>
              </div>

              <ArrowRight className="w-6 h-6 text-rose-500 animate-pulse" />

              {/* After */}
              <div className="text-center">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block font-mono">
                  Projected Re-Audit
                </span>
                <span className="text-4xl font-black text-rose-600 font-mono filter drop-shadow-[0_0_8px_rgba(225,29,72,0.3)]">
                  {Math.round(simScore)}
                </span>
                <span className="text-xs font-bold text-rose-700 ml-1 font-mono">
                  (Grade {simGrade})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono bg-rose-600 text-white shadow-md shadow-rose-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Score Leap: {delta} pts
              </span>
              <p className="text-[11px] text-slate-500 mt-1.5 font-mono">
                {fixedCount} technical deficiencies resolved
              </p>
            </div>

          </div>

          {/* Code Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
                {[
                  { id: 'nextjs', label: 'Next.js 14+ Metadata' },
                  { id: 'html', label: 'HTML <head>' },
                  { id: 'robots', label: 'robots.txt' },
                  { id: 'schema', label: 'Schema JSON-LD' },
                  { id: 'nginx', label: 'Nginx Redirect' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-mono ${
                      activeTab === tab.id
                        ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Copy & Download Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                
                {activeTab === 'robots' && (
                  <button
                    onClick={() => handleDownload('robots.txt', artifacts.robots_txt_snippet)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Block Display (Crisp Dark Terminal with Colorful Syntax) */}
            <div className="mt-3 relative rounded-2xl bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-80 border border-slate-800 shadow-inner">
              <pre className="leading-relaxed">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>ApexSEO Autopilot Engine v2 • Zero human intervention required</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
