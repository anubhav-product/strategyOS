import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Zap, TrendingUp, FileText, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import UpgradePrompt from '../components/UpgradePrompt';

interface AnalysisSummary {
  id: string;
  title: string;
  industry: string;
  companySize: string;
  firmStyle: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem('strategyos_user') || 'null'); } catch { return null; } })();
  const token = localStorage.getItem('strategyos_token');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get('/api/analyses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          setAnalyses(res.data.analyses);
          if (res.data.analyses.length >= 3) setShowUpgrade(true);
        }
      })
      .catch(() => toast.error('Could not load analyses'))
      .finally(() => setLoading(false));
  }, [token]);

  const logout = () => {
    localStorage.removeItem('strategyos_token');
    localStorage.removeItem('strategyos_user');
    navigate('/login');
  };

  const filtered = analyses.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.industry.toLowerCase().includes(search.toLowerCase())
  );

  const firmLabel: Record<string, string> = { mckinsey: 'McKinsey', bcg: 'BCG', bain: 'Bain', accenture: 'Accenture' };

  const metrics = [
    { label: 'Total Analyses', value: analyses.length.toString(), icon: <FileText size={20} /> },
    { label: 'This Month', value: analyses.filter(a => new Date(a.createdAt).getMonth() === new Date().getMonth()).length.toString(), icon: <TrendingUp size={20} /> },
    { label: 'Firm Styles Used', value: ([...new Set(analyses.map(a => a.firmStyle))].length || 0).toString(), icon: <Zap size={20} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">
                {user ? `Welcome back, ${user.name || user.email}` : 'Your consulting analyses'}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-end">
              {user && (
                <button onClick={logout}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-sm">
                  <LogOut size={15} /> Sign out
                </button>
              )}
              {!user && (
                <Link to="/login"
                  className="px-4 py-2.5 border border-blue-400/40 dark:border-cyan-500/40 text-blue-600 dark:text-cyan-300 rounded-xl hover:bg-blue-500/8 transition-all text-sm">
                  Sign in to save analyses
                </Link>
              )}
              <Link to="/analysis"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 text-sm font-medium">
                <Plus size={18} /> New Analysis
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((metric, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                </div>
                <div className="text-cyan-500 dark:text-cyan-400">{metric.icon}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showUpgrade && <UpgradePrompt trigger="limit" onClose={() => setShowUpgrade(false)} />}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search analyses..."
            className="field pl-11" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card overflow-hidden rounded-[1.5rem]">
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading analyses...</div>
          ) : !token ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4">Sign in to save and view your analyses history.</p>
              <Link to="/login" className="btn-primary inline-flex">Sign in</Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No analyses yet. Generate your first one!</p>
              <Link to="/analysis" className="btn-primary inline-flex">New Analysis</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/50">
                  {['Title', 'Industry', 'Size', 'Firm Style', 'Date', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map((a, i) => (
                  <motion.tr key={a.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium max-w-xs truncate">{a.title}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{a.industry || '—'}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm capitalize">{a.companySize}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                        {firmLabel[a.firmStyle] || a.firmStyle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Link to={`/engagement/${a.id}`}
                        className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors">
                        View →
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  );
}
