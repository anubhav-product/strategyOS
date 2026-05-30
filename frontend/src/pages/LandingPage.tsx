/**
 * Landing Page
 * Premium homepage with animated features, visual strategy sections, and executive positioning
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Brain,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ClipboardCheck,
  Layers,
  Rocket,
  Users,
  Mic,
} from 'lucide-react';

const featureTiles = [
  {
    icon: <Zap size={28} className="text-cyan-400" />,
    title: 'Insight to Action',
    description: 'Transform strategic diagnosis into a premium execution playbook with clarity and confidence.',
  },
  {
    icon: <Brain size={28} className="text-sky-400" />,
    title: 'C-Suite Ready',
    description: 'Boardroom-grade recommendations with messaging designed for leadership decisions.',
  },
  {
    icon: <Target size={28} className="text-violet-400" />,
    title: 'Growth Focused',
    description: 'Designed to drive trial conversion, revenue expansion, and sustainable operating rhythm.',
  },
  {
    icon: <Layers size={28} className="text-teal-400" />,
    title: 'Visual Strategy',
    description: 'Premium visuals, bold narrative, and structural clarity across every section.',
  },
  {
    icon: <ShieldCheck size={28} className="text-emerald-400" />,
    title: 'Risk-Aware',
    description: 'Explicit risk mitigation and contingency plans keep strategy grounded and executable.',
  },
  {
    icon: <BookOpen size={28} className="text-fuchsia-400" />,
    title: 'Consulting Heritage',
    description: 'Inspired by McKinsey, BCG, Bain, and Accenture to feel both modern and authoritative.',
  },
  {
    icon: <Mic size={28} className="text-cyan-300" />,
    title: 'Voice Prompt',
    description: 'Speak your challenge and launch analysis faster with a voice-driven strategy input.',
  },
];

const workflowSteps = [
  {
    title: '1. Capture the Problem',
    description: 'Share your business challenge, context, and growth ambition.',
    icon: <ClipboardCheck size={32} className="text-cyan-400" />,
  },
  {
    title: '2. Generate a Premium Analysis',
    description: 'Receive a full strategic report with recommendations, KPIs, and execution plan.',
    icon: <BarChart3 size={32} className="text-blue-400" />,
  },
  {
    title: '3. Align Leadership Fast',
    description: 'Use board-ready outputs to move from insight to decision confidently.',
    icon: <Users size={32} className="text-sky-400" />,
  },
];

interface LandingPageProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function LandingPage({ theme, toggleTheme }: LandingPageProps) {
  const navigate = useNavigate();
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'finished' | 'unsupported'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [speechRecognitionClass, setSpeechRecognitionClass] = useState<any>(null);

  useEffect(() => {
    const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (recognition) {
      setSpeechRecognitionClass(() => recognition);
    } else {
      setVoiceStatus('unsupported');
    }
  }, []);

  const startVoiceCapture = () => {
    if (!speechRecognitionClass) {
      setVoiceStatus('unsupported');
      return;
    }

    const recognition = new speechRecognitionClass();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setVoiceStatus('listening');
    recognition.onerror = () => setVoiceStatus('idle');
    recognition.onend = () => {
      if (voiceTranscript) {
        setVoiceStatus('finished');
      } else {
        setVoiceStatus('idle');
      }
    };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      setVoiceTranscript(transcript);
    };
    recognition.start();
  };

  const clearVoicePrompt = () => {
    setVoiceTranscript('');
    setVoiceStatus('idle');
  };

  const submitVoicePrompt = () => {
    if (!voiceTranscript.trim()) return;
    navigate('/analysis', { state: { initialDescription: voiceTranscript.trim() } });
  };

  return (
    <div className="min-h-[calc(100vh-73px)] overflow-hidden">
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_35%)]" />
        <div className="absolute right-[-120px] top-20 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500/10 to-slate-900/0 blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.5fr_1fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-slate-900/70 px-4 py-2 text-sm text-cyan-300 shadow-lg shadow-cyan-500/10">
              <Sparkles size={18} />
              Trusted by growth teams and strategy leaders.
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              The most premium consulting website for modern strategy teams.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
              StrategyOS blends AI-driven analysis with executive-grade storytelling, beautifully visualized outputs, and an actionable growth playbook for leadership.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/analysis"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-cyan-500/20 hover:scale-[1.01] transition-transform duration-300"
              >
                Start a strategic analysis
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-100 hover:bg-slate-800 transition-colors duration-300"
              >
                Explore the dashboard
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/90 px-6 py-4 text-base font-semibold text-slate-950 hover:bg-slate-100 transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>
            <div className="mt-4 rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="mb-3 text-slate-400">Preview links</p>
              <div className="space-y-2">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-[0.35em]">Public demo</p>
                  <a
                    href="https://two-insects-talk.loca.lt"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cyan-300 hover:text-white underline"
                  >
                    https://two-insects-talk.loca.lt
                  </a>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-[0.35em]">Local preview</p>
                  <span className="text-slate-200">http://localhost:3000</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] items-start">
              <button
                type="button"
                onClick={startVoiceCapture}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900/90 px-6 py-4 text-base font-semibold text-white border border-cyan-500/20 hover:bg-slate-800 transition-colors duration-300"
              >
                <Mic size={18} className="text-cyan-400" />
                {voiceStatus === 'listening' ? 'Listening...' : 'Describe your problem by voice'}
              </button>
              <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 text-left">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Voice input</p>
                <p className="text-sm text-slate-300 mb-3">
                  {voiceTranscript
                    ? voiceTranscript
                    : voiceStatus === 'unsupported'
                    ? 'Voice capture is not supported in your browser.'
                    : 'Speak a brief description of your challenge and use it to open the analysis form.'}
                </p>
                {voiceStatus === 'finished' && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={submitVoicePrompt}
                      className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
                    >
                      Use this prompt
                    </button>
                    <button
                      type="button"
                      onClick={clearVoicePrompt}
                      className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Board-ready reports', value: 'Yes' },
                { label: 'Average report time', value: '15 min' },
                { label: 'Executive resonance', value: 'Premium' },
              ].map((stat, index) => (
                <div key={index} className="rounded-3xl bg-slate-950/75 border border-slate-700/70 px-5 py-4 shadow-lg shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
              <div className="absolute right-6 top-6 h-14 w-14 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="mb-6 rounded-3xl bg-slate-900/80 p-6 border border-slate-700/60">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">StrategyOS Preview</p>
                <p className="mt-4 text-2xl font-semibold text-white">Executive Growth Snapshot</p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-900/80 p-5 border border-slate-700/60">
                  <p className="text-slate-400 text-sm uppercase tracking-[0.18em]">Core recommendation</p>
                  <p className="mt-3 text-white font-semibold">Accelerate trial-to-paid conversion with a high-value onboarding experience.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-5 border border-slate-700/60">
                    <p className="text-slate-400 text-sm">Expected growth</p>
                    <p className="mt-3 text-white font-semibold">+15–20% conversion</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5 border border-slate-700/60">
                    <p className="text-slate-400 text-sm">Time to impact</p>
                    <p className="mt-3 text-white font-semibold">90 days</p>
                  </div>
                </div>
                <div className="h-1 rounded-full bg-slate-800">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4 border border-slate-700/60">
                    <p className="text-slate-400 text-xs uppercase tracking-[0.3em]">Market signal</p>
                    <p className="mt-2 text-white text-sm">Clear demand for outcome-first trials.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4 border border-slate-700/60">
                    <p className="text-slate-400 text-xs uppercase tracking-[0.3em]">Leadership lens</p>
                    <p className="mt-2 text-white text-sm">Premium insights for executive alignment.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-950/90">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-4">Premium features</p>
            <h2 className="text-4xl font-bold text-white">The best consulting website experience</h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              From vivid narrative to bold execution frameworks, every section is crafted to feel elevated, intuitive, and uniquely strategic.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureTiles.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[2rem] border border-slate-700/70 bg-slate-900/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.3)] hover:-translate-y-1 hover:border-cyan-400/40 transition-all"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/80 border border-slate-700/70">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">How it works</p>
            <h2 className="text-4xl font-bold text-white">Move from brief to board-ready strategy in three steps</h2>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              The homepage guides visitors through the value proposition clearly, with animated sections, premium visuals, and powerful consulting features.
            </p>

            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-slate-900/80 p-4 text-cyan-400">{step.icon}</div>
                    <div>
                      <p className="text-lg font-semibold text-white">{step.title}</p>
                      <p className="text-slate-400 mt-2">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="relative rounded-[2rem] border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.4)]">
            <div className="absolute inset-x-10 top-10 h-2 rounded-full bg-gradient-to-r from-cyan-400/60 to-blue-500/20 blur-2xl" />
            <div className="relative space-y-6">
              <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-900/80 p-6">
                <div className="flex items-center gap-4">
                  <Rocket size={28} className="text-cyan-400" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Launch fast</p>
                    <p className="text-white font-semibold mt-2">Premium onboarding experiences</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-400">Use AI pattern recognition to create a compelling trial-to-paid journey with a strong first-win narrative.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-900/80 p-6">
                <div className="flex items-center gap-4">
                  <Users size={28} className="text-blue-400" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Align teams</p>
                    <p className="text-white font-semibold mt-2">Executive-ready decision support</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-400">Share recommendations that connect strategy, execution, and finance for immediate buy-in.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-900/80 p-6">
                <div className="flex items-center gap-4">
                  <Sparkles size={28} className="text-violet-400" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Own the outcome</p>
                    <p className="text-white font-semibold mt-2">A complete growth playbook</p>
                  </div>
                </div>
                <p className="mt-4 text-slate-400">Move beyond insights with a live execution plan, KPI system, and risk register built for growth.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-slate-950/90 to-slate-900/95">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-sm uppercase tracking-[0.35em] text-cyan-300 mb-4">
            Ready to lead with confidence
          </motion.p>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-4xl font-bold text-white mb-6">
            The consulting website that feels as premium as the insights it delivers.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            StrategyOS makes navigation simple, the main page compelling, and the full experience unmistakably high-end for executive audiences.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex gap-4 flex-wrap justify-center">
            <Link
              to="/analysis"
              className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-white font-semibold shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] transition-transform"
            >
              Launch a report
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-slate-700/80 bg-slate-900/80 px-8 py-4 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              View the dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
