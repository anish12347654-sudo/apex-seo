import React, { useEffect, useState } from 'react';
import { X, History, ArrowRight, ExternalLink, Calendar, Gauge } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, domain, onSelectAudit, onReRunAudit }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, domain]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const endpoint = domain 
        ? `http://127.0.0.1:8000/api/reports/history?domain=${encodeURIComponent(domain)}`
        : 'http://127.0.0.1:8000/api/reports/recent';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data.history || data.recent || []);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200/90 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Audit History & Trends
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {domain ? `Domain: ${domain}` : 'Recent System Audits'}
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

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                Loading historical checkpoints...
              </div>
            ) : historyList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No past audit history recorded yet for this domain.
              </div>
            ) : (
              historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectAudit(item.id)}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-300 shadow-clay shadow-clay-hover transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-900 truncate max-w-[180px]">
                      {item.domain || domain}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {Math.round(item.score)}/100
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-rose-50 text-rose-700 border border-rose-200">
                        {item.grade}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-rose-600 font-bold group-hover:underline flex items-center gap-0.5">
                      View Report <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-500">Historical Report Store</span>
            <button
              onClick={() => onReRunAudit(domain)}
              className="btn-tactile px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white"
            >
              Re-Audit Domain
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
