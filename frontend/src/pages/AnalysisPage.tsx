/**
 * Analysis Page
 * Input form and result display
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisReport from '../components/AnalysisReport';
import type { ConsultingAnalysis } from '@core/types';

interface AnalysisResponse {
  analysisId: string;
  analysis: ConsultingAnalysis;
  generatedAt: string;
}

export default function AnalysisPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">New Consulting Analysis</h1>
            <p className="text-slate-400 mb-8">
              Describe your business challenge and receive an enterprise-grade consulting analysis
              in minutes.
            </p>
            <AnalysisForm onSubmit={handleAnalysisGenerated} />
          </motion.div>
        ) : analysisResponse ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="report"
          >
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Analysis Report</h1>
                <p className="text-slate-400">
                  Complete 9-section consulting analysis showing below
                </p>
              </div>
              <button
                onClick={handleStartNew}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
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
