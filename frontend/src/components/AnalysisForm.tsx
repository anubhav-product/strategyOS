/**
 * Analysis Input Form Component
 * Structured business problem capture
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Zap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { BusinessProblem } from '@core/types';

const TEMPLATES: Array<{ label: string; emoji: string; data: Partial<BusinessProblem> }> = [
  {
    label: 'SaaS Growth',
    emoji: '🚀',
    data: {
      title: 'Scale ARR from $XM to $YM in 12 months',
      description: 'We are a B2B SaaS company with strong retention (NRR 110%+) but slow new logo acquisition. We need to identify the fastest path to doubling ARR.',
      context: 'Series A funded, 15-person team. Selling to mid-market. ACV $30-50k. Sales cycle 30-60 days.',
      industry: 'B2B SaaS',
      companySize: 'scale-up',
      firmStyle: 'mckinsey',
      timeframe: '12 months',
    },
  },
  {
    label: 'Market Entry',
    emoji: '🌍',
    data: {
      title: 'Enter the [Country/Region] market',
      description: 'We want to expand our product into a new geographic market. We need to assess market size, competitive dynamics, go-to-market strategy, and required investment.',
      context: 'Profitable in home market. Product-market fit proven. Considering geographic expansion.',
      industry: 'Technology',
      companySize: 'mid-market',
      firmStyle: 'bcg',
      timeframe: '18 months',
    },
  },
  {
    label: 'Cost Reduction',
    emoji: '✂️',
    data: {
      title: 'Reduce operating costs by 20% without impacting growth',
      description: 'Rising burn rate is threatening our runway. We need to identify cost reduction opportunities across the business while protecting growth investments.',
      context: 'Series B startup, 18 months runway. $5M ARR, $800k monthly burn. Team of 40.',
      industry: 'Technology',
      companySize: 'startup',
      firmStyle: 'bain',
      timeframe: '6 months',
    },
  },
  {
    label: 'Product Launch',
    emoji: '🎯',
    data: {
      title: 'Launch new product line to enterprise segment',
      description: 'We have built a new product targeted at enterprise customers. We need a go-to-market strategy covering positioning, pricing, sales motion, and success metrics.',
      context: 'Currently serve SMB. New product ready for beta. No enterprise sales experience.',
      industry: 'SaaS',
      companySize: 'mid-market',
      firmStyle: 'accenture',
      timeframe: '9 months',
    },
  },
  {
    label: 'M&A Due Diligence',
    emoji: '🤝',
    data: {
      title: 'Evaluate acquisition of [Target Company]',
      description: 'We are considering acquiring a competitor. Need strategic rationale, synergy analysis, integration plan, and risk assessment.',
      context: 'Acquirer is profitable with strong balance sheet. Target has complementary product and customer base.',
      industry: 'Technology',
      companySize: 'enterprise',
      firmStyle: 'mckinsey',
      timeframe: '3 months',
    },
  },
  {
    label: 'Churn Reduction',
    emoji: '🔒',
    data: {
      title: 'Reduce monthly churn from X% to Y%',
      description: 'Customer churn is eroding growth. We need to diagnose root causes across product, onboarding, support, and pricing — then build a systematic retention program.',
      context: 'SaaS product, monthly contracts, 200 customers. Churn spiked after recent price increase.',
      industry: 'B2B SaaS',
      companySize: 'startup',
      firmStyle: 'bain',
      timeframe: '6 months',
    },
  },
];

interface AnalysisResponse {
  analysisId: string;
  analysis: any;
  generatedAt: string;
}

interface AnalysisFormProps {
  onSubmit?: (response: AnalysisResponse) => void;
  initialDescription?: string;
}

export default function AnalysisForm({ onSubmit, initialDescription }: AnalysisFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const LOADING_STEPS = [
    'Diagnosing problem...',
    'Structuring analysis...',
    'Running deep dive...',
    'Identifying root causes...',
    'Generating strategic options...',
    'Formulating recommendation...',
    'Building execution plan...',
    'Designing KPI system...',
    'Assessing risks...',
  ];
  const [formData, setFormData] = useState<BusinessProblem>({
    title: '',
    description: '',
    context: '',
    industry: '',
    companySize: 'mid-market',
    firmStyle: 'mckinsey',
    reportTemplate: 'conversion-led',
    timeframe: '12 months',
  });
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'finished' | 'unsupported'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const voiceTranscriptRef = React.useRef('');

  useEffect(() => {
    const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (recognition) {
      setSpeechRecognition(() => recognition);
    } else {
      setVoiceStatus('unsupported');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionInstance && recognitionInstance.stop) {
        recognitionInstance.stop();
      }
    };
  }, [recognitionInstance]);

  useEffect(() => {
    if (initialDescription && !formData.description) {
      setFormData(prev => ({ ...prev, description: initialDescription }));
    }
  }, [initialDescription, formData.description]);

  const startVoiceCapture = () => {
    if (!speechRecognition) {
      setVoiceStatus('unsupported');
      return;
    }

    if (voiceStatus === 'listening' && recognitionInstance) {
      recognitionInstance.stop();
      return;
    }

    const recognition = new speechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceStatus('listening');
      setRecognitionInstance(recognition);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      setVoiceStatus('idle');
      setRecognitionInstance(null);
    };

    recognition.onend = () => {
      setRecognitionInstance(null);
      setVoiceStatus(voiceTranscriptRef.current.trim() ? 'finished' : 'idle');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      voiceTranscriptRef.current = transcript;
      setVoiceTranscript(transcript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.start();
  };

  const useVoiceTranscript = () => {
    if (!voiceTranscript.trim()) return;
    setFormData(prev => ({ ...prev, description: voiceTranscript.trim() }));
    setVoiceStatus('idle');
    toast.success('Voice transcript saved to problem description.');
  };

  const clearVoiceTranscript = () => {
    voiceTranscriptRef.current = '';
    setVoiceTranscript('');
    setVoiceStatus('idle');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 7000);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').trim();
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/analysis/generate` : '/api/analysis/generate';
      const token = localStorage.getItem('strategyos_token');
      const response = await axios.post(endpoint, formData, {
        timeout: 120000,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        toast.success('Analysis generated successfully!');
        onSubmit?.({
          analysisId: response.data.analysisId,
          analysis: response.data.analysis,
          generatedAt: response.data.generatedAt,
        });
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate analysis');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-card p-8 space-y-6"
    >
      {/* Template picker */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} className="text-blue-500 dark:text-cyan-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start from a template</span>
          <span className="text-xs text-slate-400 ml-1">— or fill in your own below</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <button key={t.label} type="button"
              onClick={() => setFormData(prev => ({ ...prev, ...t.data }))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50
                dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:text-cyan-400 dark:hover:bg-cyan-500/8">
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Problem Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Accelerating Revenue Growth in Enterprise Segment"
            className="field"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g., SaaS, FinTech, Healthcare"
            className="field"
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Company Size
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            className="field"
          >
            <option value="startup">Startup</option>
            <option value="scale-up">Scale-up</option>
            <option value="mid-market">Mid-market</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        {/* Consulting Firm Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Consulting Approach
          </label>
          <select
            name="firmStyle"
            value={formData.firmStyle}
            onChange={handleChange}
            className="field"
          >
            <option value="mckinsey">McKinsey — structured problem-solving and MECE clarity</option>
            <option value="bcg">BCG — growth-oriented options and opportunity mapping</option>
            <option value="bain">Bain — execution bias with real-world implementation focus</option>
            <option value="accenture">Accenture — tech-enabled transformation and scaling</option>
          </select>
          <p className="mt-3 text-sm text-slate-400">
            Choose the style that matches your preference. Every approach works for any problem; this simply adjusts how the report frames the recommendation.
          </p>
        </div>

        {/* Report Template */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Report Template
          </label>
          <select
            name="reportTemplate"
            value={formData.reportTemplate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="conversion-led">Conversion-Led Executive Brief</option>
            <option value="growth-strategy">Growth Strategy Blueprint</option>
            <option value="execution-excellence">Execution Excellence Playbook</option>
            <option value="tech-enabled">Tech-Enabled Transformation Plan</option>
          </select>
        </div>
      </div>

      {/* Problem Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
          <Mic size={16} className="text-cyan-500 dark:text-cyan-400" />
          Detailed Problem Description *
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">Type your challenge or use voice input below — both work together.</p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the business challenge, current situation, and what you want to achieve..."
          rows={5}
          className="field resize-none"
        />
        <div className="mt-4 rounded-3xl glass-sm p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Voice input</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Optional: speak your problem instead of typing.</p>
            </div>
            <button
              type="button"
              onClick={startVoiceCapture}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors"
            >
              {voiceStatus === 'listening' ? 'Stop voice input' : 'Start voice input'}
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Voice transcript preview</p>
            <p className="min-h-[3rem] text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {voiceStatus === 'unsupported'
                ? 'Voice input is not supported in this browser.'
                : voiceStatus === 'listening'
                ? voiceTranscript || 'Listening... speak now and the text will appear live.'
                : voiceTranscript
                ? voiceTranscript
                : 'No voice input captured yet. Click the button to begin speaking.'}
            </p>
            {voiceTranscript && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={useVoiceTranscript}
                  className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition-colors"
                >
                  Use transcript
                </button>
                <button
                  type="button"
                  onClick={clearVoiceTranscript}
                  className="rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-colors"
                >
                  Clear transcript
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Context */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Business Context & Background
        </label>
        <textarea
          name="context"
          value={formData.context}
          onChange={handleChange}
          placeholder="Company background, market position, recent changes, constraints..."
          rows={4}
          className="field resize-none"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {LOADING_STEPS[loadingStep]}
          </span>
        ) : (
          'Generate Consulting Analysis'
        )}
      </motion.button>
    </motion.form>
  );
}
