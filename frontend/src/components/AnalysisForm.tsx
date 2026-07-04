import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, FlaskConical, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';
import type { BusinessProblem } from '@core/types';

const STYLES = [
  { key: 'mckinsey',  label: 'McKinsey',  hint: 'Structured & hypothesis-driven' },
  { key: 'bcg',       label: 'BCG',       hint: 'Growth-oriented & bold' },
  { key: 'bain',      label: 'Bain',      hint: 'Execution-focused & ROI-clear' },
  { key: 'accenture', label: 'Accenture', hint: 'Tech-led transformation' },
];

const DEMO_PROBLEM = {
  description: `We're a B2B SaaS company selling project management software to mid-market teams (50–500 employees). We've grown to $3.2M ARR with strong retention (NRR 112%) but new logo acquisition has stalled — we closed only 8 new customers last quarter vs. 22 the quarter before.

Our ACV is $18k, sales cycle is 45–60 days, and we're selling to Engineering and Product teams. Our top competitors (Asana, Linear) have doubled down on PLG and we've been purely sales-led. We have a 12-person team: 4 in sales, 2 in CS, 3 in eng, 2 in product, 1 in marketing.

The CEO wants to hit $6M ARR in 12 months. We have 14 months of runway at current burn ($220k/month). What's the fastest path to growth without killing unit economics?`,
  firmStyle: 'mckinsey',
};

const EXAMPLES = [
  'We\'re a B2B SaaS at $3.2M ARR. New logo growth has stalled — 8 closes last quarter vs. 22 the prior quarter. How do we hit $6M ARR in 12 months?',
  'Our monthly churn spiked from 2% to 7% after raising prices. 200 customers, 18 months runway. What do we fix first?',
  'We\'re profitable in India ($2M revenue) and want to enter the US market. No US team yet. What\'s the GTM strategy?',
  'We need to cut burn by 30% without destroying growth. Series B SaaS, $8M ARR, $900k monthly burn.',
];

const LOADING_STEPS = [
  'Diagnosing the problem…',
  'Structuring the analysis…',
  'Running deep dive…',
  'Finding root causes…',
  'Building strategic options…',
  'Formulating recommendation…',
  'Writing execution plan…',
  'Designing KPI system…',
  'Assessing risks…',
];

interface AnalysisResponse {
  analysisId: string;
  analysis: any;
  generatedAt: string;
}

interface AnalysisFormProps {
  onSubmit?: (response: AnalysisResponse) => void;
  initialDescription?: string;
  compact?: boolean;
}

export default function AnalysisForm({ onSubmit, initialDescription, compact }: AnalysisFormProps) {
  const [description, setDescription] = useState(initialDescription || '');
  const [firmStyle, setFirmStyle] = useState('mckinsey');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('mid-market');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [streamPreview, setStreamPreview] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialDescription) setDescription(initialDescription);
  }, [initialDescription]);

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported in this browser'); return; }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const r = new SR();
    r.lang = 'en-US';
    r.continuous = true;
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .slice(e.resultIndex)
        .map((res: any) => res[0].transcript)
        .join(' ');
      setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    r.start();
    recognitionRef.current = r;
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { toast.error('Describe your business problem first'); return; }

    // Auto-generate title from first sentence
    const title = description.split(/[.!?\n]/)[0].slice(0, 100) || 'Business Strategy Analysis';

    const problem: BusinessProblem = {
      title,
      description,
      context: '',
      industry: industry || 'General',
      companySize: companySize as any,
      firmStyle: firmStyle as any,
      reportTemplate: 'conversion-led',
      timeframe: '12 months',
    };

    setLoading(true);
    setLoadingStep(0);
    setStreamPreview('');

    const stepTimer = setInterval(() => {
      setLoadingStep(p => (p + 1) % LOADING_STEPS.length);
    }, 7000);

    try {
      const token = localStorage.getItem('strategyos_token');
      const apiBase = (import.meta.env.VITE_API_URL || '').trim();
      const endpoint = `${apiBase}/api/analysis/stream`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(problem),
      });

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) setStreamPreview(p => p + data.text);
            if (data.analysis) {
              clearInterval(stepTimer);
              setLoading(false);
              setStreamPreview('');
              toast.success('Analysis ready!');
              onSubmit?.({ analysisId: data.analysisId, analysis: data.analysis, generatedAt: data.generatedAt });
              return;
            }
            if (data.message && !data.text) throw new Error(data.message);
          } catch (err: any) {
            if (err.message?.includes('Failed') || err.message?.includes('Could not')) throw err;
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong — try again');
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
      setStreamPreview('');
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4">

      {/* Demo shortcut */}
      {!description && !loading && (
        <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setDescription(DEMO_PROBLEM.description); setFirmStyle(DEMO_PROBLEM.firmStyle); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 dark:border-cyan-500/40 bg-blue-50/50 dark:bg-cyan-500/5 text-left hover:border-blue-400 dark:hover:border-cyan-500/70 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-all group">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-cyan-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-cyan-500/25 transition-colors">
            <FlaskConical size={15} className="text-blue-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-cyan-300">Try a demo problem</p>
            <p className="text-xs text-blue-500/70 dark:text-cyan-500/60 mt-0.5">SaaS growth stall — $3.2M ARR, 8 new logos last quarter vs. 22 the prior. McKinsey analysis.</p>
          </div>
          <span className="ml-auto text-xs text-blue-400 dark:text-cyan-500/60 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors flex-shrink-0">Fill form →</span>
        </motion.button>
      )}

      {/* Main textarea */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 focus-within:border-blue-400 dark:focus-within:border-cyan-500 transition-colors">
        <textarea
          ref={textareaRef}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your business problem… e.g. 'We're a SaaS company with 8% monthly churn. We raised $5M and need to fix retention before Series B.'"
          rows={compact ? 4 : 5}
          className="w-full bg-transparent px-5 pt-5 pb-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base leading-relaxed resize-none focus:outline-none"
        />

        {/* Mic button */}
        <button type="button" onClick={toggleVoice}
          title={listening ? 'Stop recording' : 'Speak your problem'}
          className={`absolute right-4 top-4 p-2 rounded-xl transition-all ${
            listening
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
          }`}>
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        {/* Quick example chips */}
        {!description && !loading && (
          <div className="px-5 pb-4 flex flex-wrap gap-2">
            <p className="w-full text-xs text-slate-400 dark:text-slate-500 mb-0.5">Or try one of these:</p>
            {EXAMPLES.slice(0, 3).map((ex, i) => (
              <button key={i} type="button" onClick={() => setDescription(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 transition-colors text-left">
                {ex.slice(0, 60)}…
              </button>
            ))}
          </div>
        )}

        {/* Live stream preview inside the card */}
        <AnimatePresence>
          {loading && streamPreview && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mx-4 mb-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">AI generating…</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono leading-relaxed line-clamp-3">
                {streamPreview.slice(-400)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Style selector */}
      <div className="flex gap-2 flex-wrap">
        {STYLES.map(s => (
          <button key={s.key} type="button" onClick={() => setFirmStyle(s.key)}
            title={s.hint}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              firmStyle === s.key
                ? 'border-blue-400 bg-blue-50 text-blue-700 dark:border-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900/50'
            }`}>
            {s.label}
          </button>
        ))}
        <button type="button" onClick={() => setShowAdvanced(v => !v)}
          className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          More options
          <ChevronDown size={13} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced options (collapsed by default) */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="flex gap-3 pt-1">
              <input value={industry} onChange={e => setIndustry(e.target.value)}
                placeholder="Industry (e.g. SaaS, FinTech)"
                className="field flex-1 text-sm py-2.5" />
              <select value={companySize} onChange={e => setCompanySize(e.target.value)} className="field text-sm py-2.5">
                <option value="startup">Startup</option>
                <option value="scale-up">Scale-up</option>
                <option value="mid-market">Mid-market</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button type="submit" disabled={loading || !description.trim()}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {LOADING_STEPS[loadingStep]}
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate Analysis
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
