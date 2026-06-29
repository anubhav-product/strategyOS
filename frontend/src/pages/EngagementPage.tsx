import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Share2, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { ConsultingAnalysis } from '@core/types';

interface EngagementData {
  analysisId: string;
  analysis: ConsultingAnalysis;
  problem: { title: string; industry: string; firmStyle: string; companySize: string };
  generatedAt: string;
}

export default function EngagementPage() {
  const { id } = useParams();
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const token = localStorage.getItem('strategyos_token');

  useEffect(() => {
    if (!id || !token) { setLoading(false); return; }
    axios.get(`/api/analyses/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (res.data.success) setData(res.data); })
      .catch(() => setError('Analysis not found'))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center text-slate-500 dark:text-slate-400">
      Loading analysis...
    </div>
  );
  if (error || !data) return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400">
      <p>{error || 'Sign in to view saved analyses'}</p>
      <Link to="/dashboard" className="text-blue-600 dark:text-cyan-400 hover:underline">← Back to dashboard</Link>
    </div>
  );

  const { analysis, problem, generatedAt } = data;

  const phaseData = [
    { label: 'Phase 1', value: analysis.executionPlan.phase1.milestones.length, fill: '#38bdf8' },
    { label: 'Phase 2', value: analysis.executionPlan.phase2.milestones.length, fill: '#60a5fa' },
    { label: 'Phase 3', value: analysis.executionPlan.phase3.milestones.length, fill: '#8b5cf6' },
  ];

  const kpiData = [
    ...analysis.kpiTrackingSystem.leadingIndicators.slice(0, 2),
    ...analysis.kpiTrackingSystem.laggingIndicators.slice(0, 2),
  ].map((k, i) => ({
    metric: k.name.length > 20 ? k.name.slice(0, 18) + '…' : k.name,
    target: k.target,
    fill: ['#38bdf8', '#60a5fa', '#8b5cf6', '#22c55e'][i % 4],
  }));

  const firmLabel: Record<string, string> = { mckinsey: 'McKinsey', bcg: 'BCG', bain: 'Bain', accenture: 'Accenture' };

  const shareAnalysis = async () => {
    if (!id || !token) return;
    setSharing(true);
    try {
      const res = await axios.post(`/api/analyses/${id}/share`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        const url = `${window.location.origin}/s/${res.data.shareToken}`;
        await navigator.clipboard.writeText(url);
        setShared(true);
        toast.success('Share link copied to clipboard!');
        setTimeout(() => setShared(false), 3000);
      }
    } catch { toast.error('Could not create share link'); }
    finally { setSharing(false); }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 text-sm mb-4 inline-block transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{problem.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {problem.industry} · {problem.companySize} · {firmLabel[problem.firmStyle] || problem.firmStyle} approach
            · Generated {new Date(generatedAt).toLocaleDateString()}
          </p>
          <div className="flex gap-3 flex-wrap items-center">
            <span className="px-4 py-2 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 rounded-lg text-sm font-semibold">
              {firmLabel[problem.firmStyle] || problem.firmStyle} Style
            </span>
            <span className="px-4 py-2 bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg text-sm font-semibold">
              AI-Generated
            </span>
            <button onClick={shareAnalysis} disabled={sharing}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                shared
                  ? 'bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-cyan-500'
              }`}>
              {shared ? <><Check size={15} /> Link copied!</> : <><Share2 size={15} /> {sharing ? 'Generating…' : 'Share'}</>}
            </button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card p-6">
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.3em] mb-4">Execution Milestones by Phase</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseData} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--tooltip-bg, #f8fafc)', borderRadius: 12, border: '1px solid #e2e8f0', color: '#0f172a' }}
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {phaseData.map(entry => <Cell key={entry.label} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card p-6">
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.3em] mb-4">KPI Targets</p>
            <div className="space-y-4">
              {kpiData.map((k, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{k.metric}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{k.target}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: k.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 mb-8">
          {[analysis.executionPlan.phase1, analysis.executionPlan.phase2, analysis.executionPlan.phase3].map((phase, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-sm p-5">
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em] mb-2">{phase.duration}</p>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{phase.name}</h3>
              <div className="space-y-2">
                {phase.milestones.map((m, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0" />
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{m}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.3em] mb-3">Final Recommendation</p>
          <p className="text-slate-900 dark:text-white font-semibold text-lg mb-2">{analysis.finalRecommendation.clearDecision}</p>
          <p className="text-slate-700 dark:text-slate-300">{analysis.finalRecommendation.partnerLevelInsight}</p>
        </motion.div>
      </div>
    </div>
  );
}
