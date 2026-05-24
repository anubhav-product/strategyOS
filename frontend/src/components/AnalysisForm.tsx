/**
 * Analysis Input Form Component
 * Structured business problem capture
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
}

export default function AnalysisForm({ onSubmit }: AnalysisFormProps) {
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
      className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Problem Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Accelerating Revenue Growth in Enterprise Segment"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g., SaaS, FinTech, Healthcare"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Company Size
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="startup">Startup</option>
            <option value="scale-up">Scale-up</option>
            <option value="mid-market">Mid-market</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        {/* Consulting Firm Style */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Consulting Approach
          </label>
          <select
            name="firmStyle"
            value={formData.firmStyle}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="mckinsey">McKinsey (Structured Analysis)</option>
            <option value="bcg">BCG (Growth-Focused)</option>
            <option value="bain">Bain (Execution-Focused)</option>
            <option value="accenture">Accenture (Tech-Enabled)</option>
          </select>
        </div>

        {/* Report Template */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Report Template
          </label>
          <select
            name="reportTemplate"
            value={formData.reportTemplate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
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
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Detailed Problem Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the business challenge, current situation, and what you want to achieve..."
          rows={5}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      {/* Business Context */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Business Context & Background
        </label>
        <textarea
          name="context"
          value={formData.context}
          onChange={handleChange}
          placeholder="Company background, market position, recent changes, constraints..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
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
