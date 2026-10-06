import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UrlInputHero from './components/UrlInputHero';
import PipelineProgressModal from './components/PipelineProgressModal';
import AuditHeaderScore from './components/AuditHeaderScore';
import AdvisorBoard from './components/AdvisorBoard';
import AuditChecksTable from './components/AuditChecksTable';
import KeywordIntelligence from './components/KeywordIntelligence';
import SerpCompetitorPeek from './components/SerpCompetitorPeek';
import SpeedVitalsCard from './components/SpeedVitalsCard';
import AutopilotModal from './components/AutopilotModal';
import HistoryDrawer from './components/HistoryDrawer';

import { ShieldCheck, Cpu, Database, Activity, Sparkles, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState({ plan: 'PRO', audits_count: 14, audits_limit: 500 });
  const [activeAudit, setActiveAudit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('advisor');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutopilotOpen, setIsAutopilotOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load user details and initial audit on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => {});

    // Run initial benchmark audit on stripe.com so user immediately sees rich data
    handleStartAudit('https://stripe.com', true);
  }, []);

  const handleStartAudit = (url, isInitial = false) => {
    setTargetUrl(url);
    setIsLoading(true);
    setCurrentStep(1);
    setPipelineLogs([`Target URL initialized: ${url}`]);
    const startTime = Date.now();
    setElapsedTime(0);

    if (!isInitial) {
      setIsModalOpen(true);
    }

    // Timer interval
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    // Use Server-Sent Events (SSE) for real-time 10-step execution streaming
    const eventSource = new EventSource(`http://127.0.0.1:8000/api/audit/stream?url=${encodeURIComponent(url)}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.step) {
          setCurrentStep(data.step);
        }
        if (data.log) {
          setPipelineLogs(prev => [...prev, data.log]);
        }
        if (data.step === 10 && data.report) {
          setActiveAudit(data.report);
          eventSource.close();
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
            setIsModalOpen(false);
          }, 600);
        }
      } catch (e) {
        console.error("SSE parse error:", e);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Fallback to synchronous POST if SSE fails
      fetch('http://127.0.0.1:8000/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
        .then(res => res.json())
        .then(report => {
          setActiveAudit(report);
          clearInterval(timer);
          setIsLoading(false);
          setIsModalOpen(false);
        })
        .catch(err => {
          console.error("Audit request failed:", err);
          clearInterval(timer);
          setIsLoading(false);
          setIsModalOpen(false);
        });
    };
  };

  const handleMineNewSeed = async (seed) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/keywords/mine?seed=${encodeURIComponent(seed)}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAudit(prev => ({
          ...prev,
          keywords: data
        }));
      }
    } catch (e) {
      console.error("Keyword mining failed:", e);
    }
  };

  const handleSelectAudit = async (auditId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/audit/${auditId}`);
      if (res.ok) {
        const report = await res.json();
        setActiveAudit(report);
        setIsHistoryOpen(false);
      }
    } catch (e) {
      console.error("Failed to load audit:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900 bg-light-ambient-grid selection:bg-rose-500 selection:text-white">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        user={user}
        activeAudit={activeAudit}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAutopilot={() => setIsAutopilotOpen(true)}
      />

      {/* 2. Superlist + Dub.co + Magic UI Light 3D Hero Section */}
      <UrlInputHero
        onStartAudit={(url) => handleStartAudit(url, false)}
        isLoading={isLoading}
      />

      {/* 3. Main Dashboard Workspace */}
      {activeAudit && (
        <main className="flex-1">
          
          {/* Audit Score & KPI Overview Header */}
          <AuditHeaderScore
            report={activeAudit}
            onOpenAutopilot={() => setIsAutopilotOpen(true)}
          />

          {/* Tabbed Navigation Hub */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            
            {/* Tab Selector (Attio Crisp Style) */}
            <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-px">
              {[
                { id: 'advisor', label: 'Advisor & Remediation', count: activeAudit.advisor?.total_issues, badgeColor: 'bg-rose-100 text-rose-800' },
                { id: 'checks', label: '22-Check Audit Table', count: activeAudit.total_checks, badgeColor: 'bg-slate-100 text-slate-800' },
                { id: 'keywords', label: 'Keyword Intelligence', count: activeAudit.keywords?.total_keywords, badgeColor: 'bg-purple-100 text-purple-800' },
                { id: 'serp', label: 'SERP Competitors', count: activeAudit.serp?.total_results, badgeColor: 'bg-emerald-100 text-emerald-800' },
                { id: 'speed', label: 'Core Web Vitals & Speed', badgeColor: 'bg-amber-100 text-amber-800' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all font-mono ${
                    activeTab === tab.id
                      ? 'border-rose-600 text-rose-600 bg-white rounded-t-2xl shadow-xs'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${tab.badgeColor}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panes */}
            <div>
              {activeTab === 'advisor' && (
                <AdvisorBoard
                  advisor={activeAudit.advisor}
                  onOpenAutopilot={() => setIsAutopilotOpen(true)}
                />
              )}

              {activeTab === 'checks' && (
                <AuditChecksTable
                  checks={activeAudit.checks}
                />
              )}

              {activeTab === 'keywords' && (
                <KeywordIntelligence
                  keywordsData={activeAudit.keywords}
                  onMineNewSeed={handleMineNewSeed}
                />
              )}

              {activeTab === 'serp' && (
                <SerpCompetitorPeek
                  serpData={activeAudit.serp}
                />
              )}

              {activeTab === 'speed' && (
                <SpeedVitalsCard
                  speedData={activeAudit.speed}
                />
              )}
            </div>

          </div>

        </main>
      )}

      {/* 4. Modals & Overlays */}
      <PipelineProgressModal
        isOpen={isModalOpen}
        currentStep={currentStep}
        logs={pipelineLogs}
        targetUrl={targetUrl}
        elapsedTime={elapsedTime}
      />

      <AutopilotModal
        isOpen={isAutopilotOpen}
        onClose={() => setIsAutopilotOpen(false)}
        report={activeAudit}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        domain={activeAudit?.domain}
        onSelectAudit={handleSelectAudit}
        onReRunAudit={(dom) => handleStartAudit(`https://${dom}`)}
      />

      {/* 5. Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ApexSEO</span>
            <span>•</span>
            <span>Zero-Cost Semrush Architecture</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">Autonomous Telemetry Active</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI Backend (Port 8000)</span>
            <span>•</span>
            <span>SQLite Report Store</span>
            <span>•</span>
            <span>Vite React Frontend</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
