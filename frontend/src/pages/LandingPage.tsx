import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisReport from '../components/AnalysisReport';
import type { ConsultingAnalysis } from '@core/types';

interface LandingPageProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

interface AnalysisResponse {
  analysisId: string;
  analysis: ConsultingAnalysis;
  generatedAt: string;
}

const PROOF = [
  { icon: Zap,        label: 'Under 2 min',  desc: 'Full analysis' },
  { icon: BarChart3,  label: '9 sections',   desc: 'Consulting depth' },
  { icon: ShieldCheck,label: 'Board-ready',  desc: 'PDF & PPTX export' },
];

export default function LandingPage({ theme }: LandingPageProps) {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  if (result) {
    return (
      <div className="min-h-[calc(100vh-73px)] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Ready</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Scroll down to explore your full consulting report</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] overflow-hidden">

      {/* ── Hero with embedded form ─────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-10"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }} />
          <div className="absolute top-0 right-[-80px] w-[360px] h-[360px] rounded-full opacity-15 dark:opacity-8"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 65%)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-5 mb-10">

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium
                border-blue-200 bg-blue-50/80 text-blue-700
                dark:border-cyan-400/20 dark:bg-cyan-500/5 dark:text-cyan-300 backdrop-blur-sm">
              <Sparkles size={13} />
              McKinsey · BCG · Bain · Accenture — in under 2 minutes
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
              Strategy at the<br />
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  speed of AI.
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Describe any business problem. Get a complete 9-section consulting analysis —
              diagnosis, root causes, strategic options, execution plan, KPIs, and risk management.
            </p>
          </motion.div>

          {/* The form IS the hero */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <AnalysisForm onSubmit={setResult} />
          </motion.div>

          {/* Proof points */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-8 flex-wrap">
            {PROOF.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <p.icon size={15} className="text-blue-500 dark:text-cyan-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{p.label}</span>
                <span className="text-slate-400 dark:text-slate-500">· {p.desc}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-cyan-400 mb-3">How it works</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Three steps. Full strategy.</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Describe the problem',      desc: "One paragraph. What's happening, what you've tried, what success looks like." },
              { n: '02', title: 'Pick a consulting style',   desc: 'McKinsey for structure, BCG for growth, Bain for execution, Accenture for tech.' },
              { n: '03', title: 'Get your full report',      desc: '9-section analysis: diagnosis, root cause, options, recommendation, execution plan, KPIs, risks.' },
            ].map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border p-6 bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-700/60">
                <p className="text-3xl font-bold text-slate-200 dark:text-slate-700 mb-4">{step.n}</p>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 text-center">
            <Link to="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Sign in to save your analyses and access history <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
