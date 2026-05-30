/**
 * Engagement Detail Page
 * View specific engagement and execution tracking
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function EngagementPage() {
  const { id } = useParams();

  // Mock execution data
  const executionData = [
    { week: 'W1', planned: 20, actual: 18, target: 25 },
    { week: 'W2', planned: 35, actual: 38, target: 50 },
    { week: 'W3', planned: 50, actual: 52, target: 75 },
    { week: 'W4', planned: 65, actual: 68, target: 100 },
  ];

  const kpiData = [
    { metric: 'Revenue Growth', current: 12, target: 15 },
    { metric: 'Customer Retention', current: 85, target: 90 },
    { metric: 'Operational Efficiency', current: 68, target: 80 },
    { metric: 'Market Share', current: 22, target: 28 },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-950 dark:text-white mb-2">Enterprise Revenue Growth Strategy</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Acme Corp | Status: In Progress | Started: Apr 15, 2024</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-3xl">
            This engagement page outlines the current strategic initiative, what it is about, and how execution is progressing. It gives stakeholders a quick view of key performance indicators, milestone status, and what the project will deliver next.
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold">
              Implementation Phase
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
              On Track
            </span>
          </div>
        </motion.div>

        {/* Execution Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 bg-white/90 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Execution Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={executionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* KPI Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-white/90 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">KPI Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kpiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="metric" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="current" fill="#06b6d4" />
              <Bar dataKey="target" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Phase Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              name: 'Phase 1: Foundation',
              progress: 100,
              status: 'completed',
              items: ['Steering committee', 'Quick wins', 'Resource plan'],
            },
            {
              name: 'Phase 2: Acceleration',
              progress: 68,
              status: 'in-progress',
              items: ['Capability building', 'Customer feedback', 'Pilot launch'],
            },
            {
              name: 'Phase 3: Scale',
              progress: 0,
              status: 'pending',
              items: ['Market expansion', 'Optimization', 'Strategic review'],
            },
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="p-6 bg-white/90 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl"
            >
              <h3 className="font-semibold text-slate-950 dark:text-white mb-2">{phase.name}</h3>
              <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all ${
                    phase.status === 'completed'
                      ? 'bg-green-500'
                      : phase.status === 'in-progress'
                      ? 'bg-blue-500'
                      : 'bg-slate-600'
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 mb-3">{phase.progress}% Complete</p>
              <ul className="space-y-1 text-sm text-slate-300">
                {phase.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
