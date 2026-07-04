import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, BarChart3, MessageSquare, Download, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  {
    icon: <Zap size={28} className="text-yellow-400" />,
    title: 'AI-Powered Consulting in Minutes',
    body: 'Describe any business challenge and StrategyOS generates a complete McKinsey-grade analysis — problem diagnosis, strategic options, execution plan, KPIs, and risk management.',
    tip: 'Use the templates to get started fast',
  },
  {
    icon: <BarChart3 size={28} className="text-blue-400" />,
    title: 'Pick Your Consulting Style',
    body: 'Choose from McKinsey (structured MECE), BCG (growth-oriented), Bain (execution-biased), or Accenture (tech-led transformation). Each produces a distinctly different frame.',
    tip: 'McKinsey works best for most strategy problems',
  },
  {
    icon: <MessageSquare size={28} className="text-cyan-400" />,
    title: 'Chat with Your Analysis',
    body: 'After generating, use "Ask AI" to dig deeper — challenge assumptions, explore alternatives, stress-test the recommendation, or ask "what if we cut the budget in half?"',
    tip: 'The AI has full context on your analysis',
  },
  {
    icon: <Download size={28} className="text-purple-400" />,
    title: 'Export for Stakeholders',
    body: 'Download a polished PDF (10+ pages, dark theme) or a PowerPoint deck ready for boardroom presentation. Share via link for async review.',
    tip: 'PPTX export is under "Export PPTX" in the engagement view',
  },
];

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleClose = () => {
    localStorage.setItem('strategyos_onboarded', '1');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          {/* Header bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500">
            <motion.div
              className="h-full bg-white/30"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {current.icon}
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{current.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{current.body}</p>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
                  <Check size={14} className="text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-cyan-700 dark:text-cyan-300">{current.tip}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              {/* Dots */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <button key={i} onClick={() => setStep(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                    }`} />
                ))}
              </div>

              <div className="flex gap-2">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Back
                  </button>
                )}
                <button
                  onClick={isLast ? handleClose : () => setStep(s => s + 1)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                  {isLast ? 'Get started' : 'Next'}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
