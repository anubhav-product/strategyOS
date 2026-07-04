import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisReport from '../components/AnalysisReport';
import OnboardingModal from '../components/OnboardingModal';
import type { ConsultingAnalysis } from '@core/types';

interface AnalysisResponse {
  analysisId: string;
  analysis: ConsultingAnalysis;
  generatedAt: string;
}

export default function AnalysisPage() {
  const location = useLocation();
  const initialDescription = (location.state as { initialDescription?: string } | null)?.initialDescription ?? '';
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('strategyos_token');
    const onboarded = localStorage.getItem('strategyos_onboarded');
    if (token && !onboarded) setShowOnboarding(true);
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] py-12 px-6">
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      <div className="max-w-6xl mx-auto">
        {result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Ready</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Full 9-section consulting report below</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  ← New analysis
                </button>
                <Link to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Dashboard →
                </Link>
              </div>
            </div>
            <AnalysisReport
              analysis={result.analysis}
              analysisId={result.analysisId}
              generatedAt={result.generatedAt}
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">New Analysis</h1>
              <p className="text-slate-500 dark:text-slate-400">Describe your business problem and get a complete consulting report.</p>
            </div>
            <AnalysisForm onSubmit={setResult} initialDescription={initialDescription} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
