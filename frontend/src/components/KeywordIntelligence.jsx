import React, { useState } from 'react';
import { Search, Download, Sparkles, Filter, TrendingUp, BarChart2 } from 'lucide-react';

export default function KeywordIntelligence({ keywordsData, onMineNewSeed }) {
  const [selectedIntent, setSelectedIntent] = useState('ALL');
  const [newSeed, setNewSeed] = useState('');

  if (!keywordsData) return null;

  const keywords = keywordsData.keywords || [];
  const seed = keywordsData.seed || 'platform';
  const intentBreakdown = keywordsData.intent_breakdown || {};

  const filtered = selectedIntent === 'ALL'
    ? keywords
    : keywords.filter(k => k.intent === selectedIntent);

  const getIntentBadge = (intent) => {
    switch (intent) {
      case 'Transactional':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">Transactional</span>;
      case 'Commercial':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200">Commercial</span>;
      case 'Navigational':
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200">Navigational</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">Informational</span>;
    }
  };

  const exportCSV = () => {
    const headers = ['Keyword', 'Search Intent', 'Difficulty (0-100)', 'Est. Monthly Volume', 'Est. CPC'];
    const rows = filtered.map(k => [
      `"${k.keyword}"`,
      k.intent,
      k.difficulty,
      k.est_volume,
      k.cpc_estimate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apexseo_keywords_${seed}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeedSubmit = (e) => {
    e.preventDefault();
    if (!newSeed.trim()) return;
    onMineNewSeed(newSeed.trim());
    setNewSeed('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-clay">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Alphabet-Soup Keyword Mining
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Seed: {seed}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Keyless Google Autocomplete discovery with automated intent classification.
          </p>
        </div>

        {/* Right Actions: Seed input & CSV download */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSeedSubmit} className="flex items-center">
            <input
              type="text"
              value={newSeed}
              onChange={(e) => setNewSeed(e.target.value)}
              placeholder="Mine new seed..."
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-l-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 w-36 sm:w-44 font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-r-xl border border-rose-600 transition"
            >
              Mine
            </button>
          </form>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Intent Breakdown Summary (Superlist Clay Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Informational', 'Commercial', 'Transactional', 'Navigational'].map((intent) => (
          <div 
            key={intent}
            onClick={() => setSelectedIntent(selectedIntent === intent ? 'ALL' : intent)}
            className={`p-4 rounded-2xl border cursor-pointer select-none transition-all shadow-clay shadow-clay-hover ${
              selectedIntent === intent 
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200/50' 
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              {intent}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {intentBreakdown[intent] || 0}
              </span>
              <span className="text-xs text-slate-400 font-medium">queries</span>
            </div>
          </div>
        ))}
      </div>

      {/* Keywords Data Table */}
      <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200/90 shadow-clay">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3.5 px-5">Discovered Keyword</th>
              <th className="py-3.5 px-5">Search Intent</th>
              <th className="py-3.5 px-5">Difficulty Index</th>
              <th className="py-3.5 px-5">Est. Monthly Searches</th>
              <th className="py-3.5 px-5">Est. CPC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((k) => (
              <tr key={k.id} className="hover:bg-rose-50/20 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                  {k.keyword}
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  {getIntentBadge(k.intent)}
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          k.difficulty > 70 ? 'bg-rose-600' : k.difficulty > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${k.difficulty}%` }}
                      />
                    </div>
                    <span className="font-mono text-slate-600 font-bold text-[11px]">{k.difficulty}/100</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 font-mono font-bold text-rose-600 whitespace-nowrap">
                  {k.est_volume.toLocaleString()} / mo
                </td>
                <td className="py-3.5 px-5 font-mono text-slate-700 whitespace-nowrap">
                  {k.cpc_estimate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
