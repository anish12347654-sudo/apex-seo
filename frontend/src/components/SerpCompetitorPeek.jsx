import React from 'react';
import { Trophy, ExternalLink, Globe, BarChart3, HelpCircle } from 'lucide-react';

export default function SerpCompetitorPeek({ serpData }) {
  if (!serpData || !serpData.rankings) return null;

  const rankings = serpData.rankings;
  const avgTitleLen = serpData.avg_title_length || 55;
  const avgSnippetLen = serpData.avg_snippet_length || 145;

  return (
    <div className="space-y-6">
      
      {/* Benchmark Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-clay">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Target Query
          </span>
          <p className="text-sm font-black text-slate-900 mt-1 truncate font-mono">
            "{serpData.query}"
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-clay">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Avg Competitor Title Length
          </span>
          <div className="flex items-baseline gap-1.5 mt-1 font-mono">
            <span className="text-2xl font-black text-slate-900">{avgTitleLen}</span>
            <span className="text-xs text-slate-500">chars (Google ideal: 50-60)</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-clay">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Avg Snippet Length
          </span>
          <div className="flex items-baseline gap-1.5 mt-1 font-mono">
            <span className="text-2xl font-black text-slate-900">{avgSnippetLen}</span>
            <span className="text-xs text-slate-500">chars (Google ideal: 140-160)</span>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {rankings.map((r) => (
          <div
            key={r.position}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-rose-300 shadow-clay shadow-clay-hover transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                
                {/* Position Badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                  r.position === 1 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : r.position <= 3
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  #{r.position}
                </div>

                <div>
                  {/* Domain & URL */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Globe className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-bold text-slate-900">{r.domain}</span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Visit URL"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-rose-600 hover:underline transition mt-1 cursor-pointer">
                    {r.title}
                  </h4>

                  {/* Snippet */}
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {r.snippet}
                  </p>
                </div>

              </div>

              {/* Meta Stats */}
              <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  {r.title_length} char title
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  {r.snippet_length} char desc
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
