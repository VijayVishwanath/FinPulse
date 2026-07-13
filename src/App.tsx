import React, { useState, useEffect } from 'react';
import { mockProfiles } from './data/profiles';
import { calculateFinancialHealthScore } from './utils/calculator';
import ConsentManager from './components/ConsentManager';
import EnterpriseSelector from './components/EnterpriseSelector';
import ScoreGauge from './components/ScoreGauge';
import ReportCardView from './components/ReportCardView';
import AIOfficerChat from './components/AIOfficerChat';
import LoanRecommendation from './components/LoanRecommendation';
import { EnterpriseProfile, AIAnalysisResult } from './types';
import { ShieldCheck, Sparkles, Landmark, FileText, Bot, CheckSquare, HelpCircle } from 'lucide-react';

export default function App() {
  // Primary States
  const [selectedProfile, setSelectedProfile] = useState<EnterpriseProfile>(mockProfiles[0]);
  const [isConsented, setIsConsented] = useState(true); // default true for easy initial preview
  const [activeTab, setActiveTab] = useState<'card' | 'ai' | 'loan'>('card');
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Computed Score
  const calculatedScore = calculateFinancialHealthScore(selectedProfile);

  // Sync / Reset AI analysis when company shifts or alternate fields are updated
  useEffect(() => {
    setAnalysis(null);
    // If consented, we can auto-trigger the analysis or wait for user action
    if (isConsented) {
      triggerAiAnalysis();
    }
  }, [selectedProfile, isConsented]);

  const triggerAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: selectedProfile,
          calculatedScore
        })
      });
      const data = await response.json();
      if (response.ok) {
        setAnalysis(data.data);
      } else {
        console.error('Failed to parse AI insights:', data.error);
      }
    } catch (err) {
      console.error('Failed to execute credit assessment endpoint:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleProfileSelect = (p: EnterpriseProfile) => {
    setSelectedProfile(p);
  };

  const handleProfileUpdate = (updated: EnterpriseProfile) => {
    setSelectedProfile(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" id="msme-platform-root">
      {/* Premium Indian Bank Co-branded Navbar */}
      <nav className="bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-slate-800 to-emerald-500 p-0.5 shadow-sm shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
                  <Landmark className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block leading-none">Co-Branded Bank Sandbox</span>
                <span className="font-extrabold text-white tracking-tight text-md">MSME Credit Health Card Portal</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="hidden md:flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                <ShieldCheck className="w-4 h-4" />
                <span>RBI DEPA Compliant</span>
              </div>
              <span className="text-slate-400">Time: <strong className="text-slate-200 font-mono">13:53 UTC</strong></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome and Context Panel */}
        <div className="bg-slate-900/60 border border-slate-800/80 bento-glow-indigo p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Health Card Assessment</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Evaluating creditworthiness for New-to-Credit (NTC) MSMEs using GST registrations, UPI digital trails, Account Aggregators (AA), and EPFO contribution ledgers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <span>Active Enterprise:</span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-extrabold truncate max-w-44">
              {selectedProfile.name}
            </span>
          </div>
        </div>

        {/* Coordinated Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Enterprise selector, Consent Manager, and Score Gauge */}
          <div className="lg:col-span-4 space-y-8">
            <EnterpriseSelector 
              selectedProfile={selectedProfile}
              onProfileSelect={handleProfileSelect}
              onProfileUpdate={handleProfileUpdate}
            />

            <ConsentManager 
              enterpriseName={selectedProfile.name}
              isConsented={isConsented}
              onConsentGranted={setIsConsented}
            />

            {isConsented && (
              <ScoreGauge calculatedScore={calculatedScore} />
            )}
          </div>

          {/* RIGHT PANEL: Report Card, Gemini AI Desk, and Loan recommendation */}
          <div className="lg:col-span-8 space-y-8">
            {!isConsented ? (
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-12 text-center" id="consent-gate-blocker">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Access Restricted - Consent Required</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                  Authorize digital telemetry on the left panel to request alternate transactions from GSTN, UPI, and Account Aggregator pipelines.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Visual Tab Selection */}
                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 flex shadow-inner gap-1">
                  <button
                    onClick={() => setActiveTab('card')}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'card' 
                        ? 'bg-indigo-600 text-white border border-indigo-500/30 shadow-md bento-glow-indigo' 
                        : 'text-slate-400 hover:text-slate-250 hover:bg-slate-800/50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Financial Health Card
                  </button>

                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'ai' 
                        ? 'bg-indigo-600 text-white border border-indigo-500/30 shadow-md bento-glow-indigo' 
                        : 'text-slate-400 hover:text-slate-250 hover:bg-slate-800/50'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    Gemini Risk Advisory
                  </button>

                  <button
                    onClick={() => setActiveTab('loan')}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'loan' 
                        ? 'bg-indigo-600 text-white border border-indigo-500/30 shadow-md bento-glow-indigo' 
                        : 'text-slate-400 hover:text-slate-250 hover:bg-slate-800/50'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Loan Eligibility & Repayment
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="transition-all duration-300">
                  {activeTab === 'card' && (
                    <ReportCardView 
                      enterpriseName={selectedProfile.name}
                      calculatedScore={calculatedScore}
                      location={selectedProfile.location}
                      vintage={selectedProfile.vintageYears}
                    />
                  )}

                  {activeTab === 'ai' && (
                    <AIOfficerChat 
                      analysis={analysis}
                      isLoading={isAiLoading}
                      onAnalyze={triggerAiAnalysis}
                      profile={selectedProfile}
                      calculatedScore={calculatedScore}
                    />
                  )}

                  {activeTab === 'loan' && (
                    <LoanRecommendation 
                      analysis={analysis}
                      overallScore={calculatedScore.overallScore}
                    />
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer co-branded bank disclaimer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© 2026 Reserve Bank alternate credit sandbox. All pipeline executions are RBI DEPA v1.2 and DPDP-compliant.</p>
          <p className="font-mono text-[10px]">Portal build secure • v1.2.0-CBA-ULI • Port: 3000 Ingress</p>
        </div>
      </footer>
    </div>
  );
}
