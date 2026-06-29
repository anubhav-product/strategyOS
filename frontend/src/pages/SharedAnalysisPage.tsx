import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Share2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { ConsultingAnalysis } from '@core/types';

interface SharedData {
  analysisId: string;
  analysis: ConsultingAnalysis;
  problem: { title: string; industry: string; firmStyle: string; companySize: string };
  generatedAt: string;
}

export default function SharedAnalysisPage() {
  const { token } = useParams();
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios.get(`/api/s/${token}`)
      .then(res => { if (res.data.success) setData(res.data); })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, [token]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-slate-500">Loading analysis...</div>
  );
  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-slate-500">This shared analysis doesn't exist or has been removed.</p>
      <Link to="/" className="text-blue-600 dark:text-cyan-400 hover:underline">← Go to StrategyOS</Link>
    </div>
  );

  const { analysis, problem, generatedAt } = data;
  const firmLabel: Record<string, string> = { mckinsey: 'McKinsey', bcg: 'BCG', bain: 'Bain', accenture: 'Accenture' };

  const phaseData = [
    { label: 'Phase 1', value: analysis.executionPlan.phase1.milestones.length, fill: '#38bdf8' },
    { label: 'Phase 2', value: analysis.executionPlan.phase2.milestones.length, fill: '#60a5fa' },
    { label: 'Phase 3', value: analysis.executionPlan.phase3.milestones.length, fill: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen py-12 px-6 bg-slate-50 dark:bg-slate-950">
      {/* Shared banner */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between rounded-2xl border border-blue-200 dark:border-cyan-500/20 bg-blue-50 dark:bg-cyan-500/8 px-5 py-3">
          <div className="flex items-center gap-3">
            <Share2 size={16} className="text-blue-600 dark:text-cyan-400" />
            <span className="text-sm text-blue-700 dark:text-cyan-300 font-medium">Shared via StrategyOS</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyLink}
              className="text-sm text-blue-600 dark:text-cyan-400 hover:underline">Copy link</button>
            <Link to="/analysis"
              className="inline-flex items-center gap-1.5 text-sm bg-blue-600 dark:bg-cyan-500 text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
              <ExternalLink size={13} /> Try StrategyOS
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-cyan-400 mb-2">
            {firmLabel[problem.firmStyle] || problem.firmStyle} Analysis
          </p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">{problem.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {problem.industry} · {problem.companySize} · Generated {new Date(generatedAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Core recommendation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-2">Final Recommendation</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mb-3">{analysis.finalRecommendation.clearDecision}</p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{analysis.finalRecommendation.partnerLevelInsight}</p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Revenue impact',   val: analysis.finalRecommendation.expectedImpact.revenueIncrease },
              { label: 'Retention lift',   val: analysis.finalRecommendation.expectedImpact.retentionLift },
              { label: 'Cost reduction',   val: analysis.finalRecommendation.expectedImpact.costReduction },
              { label: 'Market position',  val: analysis.finalRecommendation.expectedImpact.marketPosition },
            ].map((m, i) => m.val && (
              <div key={i} className="rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{m.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Root cause + charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="glass-card p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3">Core Issue</p>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{analysis.rootCauseAnalysis.coreIssue}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-4">Execution Milestones</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseData} margin={{ left: -20 }}>
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', background: '#1e293b', color: '#fff' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {phaseData.map(e => <Cell key={e.label} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Execution phases */}
        <div className="grid gap-4 lg:grid-cols-3 mb-8">
          {[analysis.executionPlan.phase1, analysis.executionPlan.phase2, analysis.executionPlan.phase3].map((phase, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="glass-sm p-5">
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em] mb-1">{phase.duration}</p>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-3 text-sm">{phase.name}</h3>
              <div className="space-y-2">
                {phase.milestones.map((m, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{m}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Generate your own AI-powered consulting analysis</p>
          <Link to="/analysis"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
            Start a free analysis <ExternalLink size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
