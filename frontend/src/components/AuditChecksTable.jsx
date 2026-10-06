import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Search, Filter } from 'lucide-react';

export default function AuditChecksTable({ checks = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Checks', count: checks.length },
    { id: 'Indexing & Crawlability', label: 'Indexing', count: checks.filter(c => c.category === 'Indexing & Crawlability').length },
    { id: 'Content & On-Page Meta', label: 'Content & Meta', count: checks.filter(c => c.category === 'Content & On-Page Meta').length },
    { id: 'Performance & Vitals', label: 'Performance', count: checks.filter(c => c.category === 'Performance & Vitals').length },
    { id: 'Security & Modern Standards', label: 'Security', count: checks.filter(c => c.category === 'Security & Modern Standards').length },
  ];

  const filteredChecks = checks.filter((c) => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.recommendation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-clay">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-mono ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-shrink-0 w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search checks..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition font-mono"
          />
        </div>

      </div>

      {/* 22 Checks Table (Attio High-Density Clean Style) */}
      <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200/90 shadow-clay">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Audit Factor</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Weight</th>
              <th className="py-3.5 px-5">Detected Value</th>
              <th className="py-3.5 px-5">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChecks.map((c) => (
              <tr key={c.id} className="hover:bg-rose-50/20 transition-colors">
                
                {/* Status Column */}
                <td className="py-3.5 px-5 whitespace-nowrap">
                  {c.passed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                      <XCircle className="w-3.5 h-3.5" />
                      Failed
                    </span>
                  )}
                </td>

                {/* Factor Name */}
                <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                  {c.title}
                </td>

                {/* Category */}
                <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  {c.category}
                </td>

                {/* Weight */}
                <td className="py-3.5 px-5 font-mono font-bold text-rose-600 whitespace-nowrap">
                  {c.score_contribution}/{c.weight} pts
                </td>

                {/* Detected Value */}
                <td className="py-3.5 px-5 font-mono text-slate-700 max-w-xs truncate" title={c.value}>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                    {c.value || 'None'}
                  </span>
                </td>

                {/* Recommendation */}
                <td className="py-3.5 px-5 text-slate-600 leading-normal max-w-md">
                  {c.recommendation}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredChecks.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No audit checks match your search query.
          </div>
        )}
      </div>

    </div>
  );
}
