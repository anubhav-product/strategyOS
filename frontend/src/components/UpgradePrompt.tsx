import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const PRO_FEATURES = [
  'Unlimited analyses (free: 3/month)',
  'Team workspaces — share with colleagues',
  'Priority AI (faster responses)',
  'Advanced export (Word, Notion, Slides)',
  'Email delivery of reports',
  'White-label PDF branding',
];

interface UpgradePromptProps {
  trigger?: 'limit' | 'feature';
  onClose?: () => void;
}

export default function UpgradePrompt({ trigger = 'limit', onClose }: UpgradePromptProps) {
  const [open, setOpen] = useState(true);

  const handleUpgrade = () => {
    // Stripe integration scaffold — replace with real Stripe checkout session URL
    toast('Stripe checkout coming soon! Email hi@strategyos.ai to join the beta.', { icon: '🚀', duration: 5000 });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="relative rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 mb-6"
      >
        <button onClick={() => { setOpen(false); onClose?.(); }}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-white/10 transition-colors">
          <X size={16} className="text-slate-400" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              {trigger === 'limit' ? "You've reached the free tier limit" : 'Unlock Pro features'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {trigger === 'limit'
                ? 'Upgrade to Pro for unlimited analyses and team collaboration.'
                : 'Take your strategy work to the next level.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-5">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={13} className="text-purple-500 flex-shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleUpgrade}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                <Zap size={15} /> Upgrade to Pro — $29/mo
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">Cancel anytime</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
