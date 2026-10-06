import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Copy, Check, ChevronRight, Zap, Code } from 'lucide-react';

export default function AdvisorBoard({ advisor, onOpenAutopilot }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  if (!advisor || !advisor.tickets) return null;

  const tickets = advisor.tickets;
  const filteredTickets = filterSeverity === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.severity === filterSeverity);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-rose-50 text-rose-700 border border-rose-200">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-orange-50 text-orange-700 border border-orange-200">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-amber-50 text-amber-700 border border-amber-200">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-blue-50 text-blue-700 border border-blue-200">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Advisor Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-clay">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Linear-Style Issue Triage
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {tickets.length} issues
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based expert advisor prioritizes highest-impact ranking blockers first.
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-medium">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => {
            const count = sev === 'ALL' ? tickets.length : tickets.filter(t => t.severity === sev).length;
            if (count === 0 && sev !== 'ALL') return null;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-xl transition font-mono ${
                  filterSeverity === sev
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/20'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {sev} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((t) => {
          const isExpanded = expandedTicketId === t.id;

          return (
            <div
              key={t.id}
              className="rounded-2xl bg-white border border-slate-200/90 hover:border-rose-300 shadow-clay shadow-clay-hover transition-all overflow-hidden"
            >
              {/* Ticket Summary Row */}
              <div 
                onClick={() => setExpandedTicketId(isExpanded ? null : t.id)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {t.id}
                  </span>
                  {getSeverityBadge(t.severity)}
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {t.title}
                  </span>
                  <span className="hidden md:inline-block text-xs text-slate-400 font-mono">
                    • {t.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.potential_gain}
                  </span>
                  <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
                    ~{t.effort}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded Remediation Drawer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-3">
                  <div>
                    <h5 className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1 font-mono">
                      Remediation Instruction:
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {t.instruction}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-mono text-slate-500">
                      Current Value: <code className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-800 font-mono">{t.current_status || 'Empty'}</code>
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAutopilot();
                      }}
                      className="btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Autopilot 1-Click Fix</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 text-slate-500 shadow-clay">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900">No issues found in this severity filter!</p>
            <p className="text-xs text-slate-400 mt-1">Your technical parameters meet industry compliance standards.</p>
          </div>
        )}
      </div>

    </div>
  );
}
