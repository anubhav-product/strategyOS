/**
 * Dashboard Page
 * View and manage engagements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  // Mock data
  const engagements = [
    {
      id: 1,
      title: 'Enterprise Revenue Growth Strategy',
      client: 'Acme Corp',
      date: '2024-04-15',
      status: 'completed',
      impact: '+$5M revenue',
    },
    {
      id: 2,
      title: 'Market Entry Analysis for APAC',
      client: 'TechScale Inc',
      date: '2024-04-10',
      status: 'in-progress',
      impact: 'On track',
    },
    {
      id: 3,
      title: 'Operational Efficiency Program',
      client: 'BuildCo',
      date: '2024-04-01',
      status: 'draft',
      impact: 'Pending review',
    },
  ];

  const metrics = [
    { label: 'Total Analyses', value: '42', icon: <TrendingUp /> },
    { label: 'Implementations', value: '28', icon: <Zap /> },
    { label: 'Avg Impact', value: '+$2.3M', icon: <TrendingUp /> },
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-950 dark:text-white mb-2">Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage and track all consulting engagements</p>
            </div>
            <Link
              to="/analysis"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              New Analysis
            </Link>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/90 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-slate-950 dark:text-white">{metric.value}</p>
                  </div>
                  <div className="text-cyan-400">{metric.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 relative"
        >
          <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search engagements..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </motion.div>

        {/* Engagements Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-600/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/30">
              {engagements.map((engagement, i) => (
                <motion.tr
                  key={engagement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-slate-950 dark:text-white font-medium">
                    <Link to={`/engagement/${engagement.id}`} className="hover:text-cyan-400 transition-colors">
                      {engagement.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{engagement.client}</td>
                  <td className="px-6 py-4 text-slate-300">{engagement.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        engagement.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : engagement.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {engagement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-cyan-400 font-semibold">{engagement.impact}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
