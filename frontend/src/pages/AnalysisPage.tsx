/**
 * Analysis Page
 * Input form and result display
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisReport from '../components/AnalysisReport';
import type { ConsultingAnalysis } from '@core/types';

interface AnalysisResponse {
  analysisId: string;
  analysis: ConsultingAnalysis;
  generatedAt: string;
}

export default function AnalysisPage() {
  const location = useLocation();
  const initialDescription = (location.state as { initialDescription?: string } | null)?.initialDescription ?? '';
  const [analysisResponse, setAnalysisResponse] = useState<AnalysisResponse | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleAnalysisGenerated = (response: AnalysisResponse) => {
    setAnalysisResponse(response);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNew = () => {
    setAnalysisResponse(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {showForm && !analysisResponse ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-950 dark:text-white mb-4">New Consulting Analysis</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Describe your business challenge and receive an enterprise-grade consulting analysis
              in minutes.
            </p>
            <AnalysisForm onSubmit={handleAnalysisGenerated} initialDescription={initialDescription} />
          </motion.div>
        ) : analysisResponse ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="report"
          >
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Analysis Report</h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Complete 9-section consulting analysis showing below
                </p>
              </div>
              <button
                onClick={handleStartNew}
                className="px-6 py-3 bg-slate-100 text-slate-950 rounded-lg border border-slate-300 hover:bg-slate-200 transition-all dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600"
              >
                New Analysis
              </button>
            </div>

            <AnalysisReport
              analysis={analysisResponse.analysis}
              analysisId={analysisResponse.analysisId}
              generatedAt={analysisResponse.generatedAt}
            />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
