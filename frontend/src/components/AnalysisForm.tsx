/**
 * Analysis Input Form Component
 * Structured business problem capture
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { BusinessProblem } from '@core/types';

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
    
    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').trim();
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/analysis/generate` : '/api/analysis/generate';
      const response = await axios.post(endpoint, formData, {
        timeout: 30000,
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
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white/90 dark:bg-slate-800/50 backdrop-blur border border-slate-200/70 dark:border-slate-700/50 rounded-2xl p-8 space-y-6 text-slate-950 dark:text-white"
    >
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
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
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
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <Mic size={16} className="text-cyan-400" />
          Detailed Problem Description *
        </label>
        <p className="text-xs text-slate-500 mb-3">Type your challenge or use voice input below — both work together.</p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the business challenge, current situation, and what you want to achieve..."
          rows={5}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
        <div className="mt-4 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Voice input</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Optional: speak your problem instead of typing. The transcript can be applied to the description field.</p>
            </div>
            <button
              type="button"
              onClick={startVoiceCapture}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-950 dark:text-white border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors"
            >
              {voiceStatus === 'listening' ? 'Stop voice input' : 'Start voice input'}
            </button>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400 mb-3">Voice transcript preview</p>
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
                  className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  Use transcript
                </button>
                <button
                  type="button"
                  onClick={clearVoiceTranscript}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 transition-colors"
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
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
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
            Generating Analysis...
          </span>
        ) : (
          'Generate Consulting Analysis'
        )}
      </motion.button>
    </motion.form>
  );
}
