import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Brain, Zap, Target, TrendingUp,
  Sparkles, ShieldCheck, BookOpen, ClipboardCheck,
  Layers, Rocket, Users, Mic, ArrowRight, CheckCircle,
} from 'lucide-react';

const FEATURES = [
  { icon: Zap,        color: 'text-cyan-500',    bg: 'bg-cyan-500/10',    title: 'Insight to Action',    desc: 'Transform strategic diagnosis into an execution playbook with clarity.' },
  { icon: Brain,      color: 'text-blue-500',    bg: 'bg-blue-500/10',    title: 'C-Suite Ready',        desc: 'Boardroom-grade recommendations designed for leadership decisions.' },
  { icon: Target,     color: 'text-violet-500',  bg: 'bg-violet-500/10',  title: 'Growth Focused',       desc: 'Drive trial conversion, revenue expansion, and operating rhythm.' },
  { icon: Layers,     color: 'text-teal-500',    bg: 'bg-teal-500/10',    title: 'Visual Strategy',      desc: 'Premium visuals, bold narrative, and structural clarity.' },
  { icon: ShieldCheck,color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Risk-Aware',           desc: 'Explicit mitigation and contingency plans keep strategy grounded.' },
  { icon: BookOpen,   color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', title: 'Consulting Heritage',  desc: 'Inspired by McKinsey, BCG, Bain, and Accenture.' },
];

const STEPS = [
  { icon: ClipboardCheck, title: '1. Capture the Problem',         desc: 'Share your business challenge, context, and growth ambition.',                       color: 'text-cyan-500' },
  { icon: BarChart3,      title: '2. Generate a Premium Analysis', desc: 'Receive a full strategic report with recommendations, KPIs, and execution plan.',   color: 'text-blue-500' },
  { icon: Users,          title: '3. Align Leadership Fast',       desc: 'Use board-ready outputs to move from insight to decision confidently.',              color: 'text-violet-500' },
];

interface LandingPageProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function LandingPage({ theme, toggleTheme }: LandingPageProps) {
  const navigate = useNavigate();
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'finished' | 'unsupported'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [SpeechClass, setSpeechClass] = useState<any>(null);

  useEffect(() => {
    const R = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    R ? setSpeechClass(() => R) : setVoiceStatus('unsupported');
  }, []);

  const startVoice = () => {
    if (!SpeechClass) return;
    const r = new SpeechClass();
    r.lang = 'en-US'; r.interimResults = true; r.maxAlternatives = 1;
    r.onstart  = () => setVoiceStatus('listening');
    r.onerror  = () => setVoiceStatus('idle');
    r.onend    = () => setVoiceStatus(voiceTranscript ? 'finished' : 'idle');
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((x: any) => x[0].transcript).join(' ');
      setVoiceTranscript(t);
    };
    r.start();
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-[calc(100vh-73px)] overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Background blobs — subtle in light, vivid in dark */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full opacity-20 dark:opacity-15"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }} />
          <div className="absolute top-10 right-[-100px] w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 65%)' }} />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full opacity-10 dark:opacity-8"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 65%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto grid gap-14 lg:grid-cols-[1.4fr_1fr] items-center">

          {/* Left — copy */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="space-y-8">

            <div className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium
              border-blue-200 bg-blue-50 text-blue-700
              dark:border-cyan-400/20 dark:bg-slate-900/70 dark:text-cyan-300">
              <Sparkles size={15} />
              Trusted by growth teams and strategy leaders
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]
              text-slate-900 dark:text-white">
              The most premium<br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                consulting AI
              </span>
              <br />for modern teams.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              StrategyOS blends AI-driven analysis with executive-grade storytelling,
              beautifully visualized outputs, and an actionable growth playbook.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/analysis"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200">
                Start a strategic analysis <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-base font-semibold transition-all duration-200
                  border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400
                  dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800">
                Explore the dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Board-ready reports', value: '✓ Yes' },
                { label: 'Avg. report time',    value: '< 2 min' },
                { label: 'Executive quality',   value: 'Premium' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border px-4 py-3
                  bg-white border-slate-200 shadow-sm
                  dark:bg-slate-900/70 dark:border-slate-700/60">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Voice input */}
            <div className="rounded-2xl border p-4 space-y-3
              bg-white/80 border-slate-200 backdrop-blur-sm
              dark:bg-slate-900/70 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Voice input</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Speak your challenge to open the analysis form</p>
                </div>
                <button onClick={startVoice} type="button"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    voiceStatus === 'listening'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700'
                  }`}>
                  <Mic size={14} />
                  {voiceStatus === 'listening' ? 'Listening…' : 'Speak'}
                </button>
              </div>
              {voiceTranscript && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{voiceTranscript}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => navigate('/analysis', { state: { initialDescription: voiceTranscript } })}
                      className="rounded-full bg-blue-600 dark:bg-cyan-500 text-white px-3 py-1 text-xs font-semibold hover:opacity-90 transition-opacity">
                      Use this prompt
                    </button>
                    <button onClick={() => { setVoiceTranscript(''); setVoiceStatus('idle'); }}
                      className="rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 px-3 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — preview card */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-300/40 dark:shadow-slate-950/60
              bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/8 backdrop-blur-xl">
              {/* Decorative top glow */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent" />

              <div className="p-6 space-y-4">
                <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-600 dark:text-cyan-300 mb-3">StrategyOS Preview</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">Executive Growth Snapshot</p>
                </div>

                <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800/60 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Core recommendation</p>
                  <p className="font-semibold text-slate-900 dark:text-white">Accelerate trial-to-paid conversion with a high-value onboarding experience.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Expected growth', value: '+15–20%' },
                    { label: 'Time to impact', value: '90 days' },
                  ].map((m, i) => (
                    <div key={i} className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{m.label}</p>
                      <p className="font-bold text-slate-900 dark:text-white">{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Market signal',   value: 'Clear demand for outcome-first trials.' },
                    { label: 'Leadership lens', value: 'Premium insights for executive alignment.' },
                  ].map((m, i) => (
                    <div key={i} className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950/90">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-cyan-400 mb-3">Premium features</p>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to lead with clarity</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              From vivid narrative to bold execution frameworks, every section is crafted to feel elevated, intuitive, and uniquely strategic.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="group rounded-2xl border p-6 transition-all duration-300 cursor-default
                  bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/8 hover:-translate-y-0.5
                  dark:bg-slate-900/70 dark:border-slate-700/60 dark:hover:border-cyan-500/40 dark:hover:shadow-cyan-500/5">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid gap-14 lg:grid-cols-[1fr_1fr] items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-cyan-400 mb-3">How it works</p>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Brief to board-ready strategy in three steps
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Guided workflow takes you from raw problem to a complete executive strategy document in minutes.
              </p>
            </div>

            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border p-5 transition-all
                    bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm
                    dark:bg-slate-900/60 dark:border-slate-700/60 dark:hover:border-slate-600">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${step.color}`}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">{step.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl border overflow-hidden
              bg-white border-slate-200 shadow-xl shadow-slate-200/60
              dark:bg-slate-900/70 dark:border-slate-700/60 dark:shadow-slate-950/50">
            <div className="p-6 space-y-4">
              {[
                { icon: Rocket,   label: 'Launch fast',       title: 'Premium onboarding experiences',      desc: 'Create a compelling trial-to-paid journey with a strong first-win narrative.', color: 'text-cyan-500' },
                { icon: Users,    label: 'Align teams',       title: 'Executive-ready decision support',    desc: 'Share recommendations that connect strategy, execution, and finance.', color: 'text-blue-500' },
                { icon: Sparkles, label: 'Own the outcome',   title: 'A complete growth playbook',          desc: 'Live execution plan, KPI system, and risk register built for growth.', color: 'text-violet-500' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border p-5
                  bg-slate-50 border-slate-200
                  dark:bg-slate-800/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <item.icon size={18} className={item.color} />
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950/90">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-cyan-400">Ready to lead with confidence</p>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              The consulting tool that feels as premium as the insights it delivers.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              StrategyOS makes every analysis unmistakably high-end for executive audiences.
            </p>
            <div className="flex gap-4 flex-wrap justify-center pt-2">
              <Link to="/analysis"
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 inline-flex items-center gap-2">
                Launch a report <ArrowRight size={16} />
              </Link>
              <Link to="/login"
                className="rounded-full border px-8 py-4 font-semibold transition-all duration-200 inline-flex items-center gap-2
                  border-slate-300 bg-white text-slate-800 hover:bg-slate-50
                  dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800">
                Sign up free
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 pt-4">
              {['McKinsey style', 'BCG style', 'Bain style', 'Accenture style'].map(label => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <CheckCircle size={14} className="text-green-500" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
