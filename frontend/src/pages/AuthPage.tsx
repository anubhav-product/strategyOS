import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Brain,       label: 'AI-Powered Engine',    desc: 'Claude generates real consulting-grade analysis tailored to your problem.' },
  { icon: BarChart3,   label: 'Executive Reports',     desc: 'Board-ready output with KPIs, execution plans, and risk frameworks.' },
  { icon: ShieldCheck, label: 'Saved to Your Account', desc: 'Every analysis persists so you can revisit, share, and iterate.' },
];

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Email and password required'); return; }
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { email, password, name };
      const res = await axios.post(endpoint, body);
      if (res.data.success) {
        localStorage.setItem('strategyos_token', res.data.token);
        localStorage.setItem('strategyos_user', JSON.stringify(res.data.user));
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
        navigate('/analysis');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full opacity-15 dark:opacity-8 animate-float"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-8 dark:opacity-5"
          style={{ background: 'radial-gradient(ellipse, #6366f1, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left panel — feature highlights */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="hidden lg:block">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400 mb-3 font-semibold">StrategyOS</p>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Your AI-powered<br />
            <span className="gradient-text">consulting partner</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">
            Generate McKinsey-grade strategy documents in minutes.
            Save, revisit, and refine your analyses any time.
          </p>

          <div className="space-y-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-start gap-4 p-4 glass-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <f.icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-0.5">{f.label}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right panel — auth form */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="glass-card p-8">
            {/* Mobile header */}
            <div className="lg:hidden mb-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400 mb-1 font-semibold">StrategyOS</p>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-blue-600 dark:text-cyan-400 hover:underline font-medium">
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" className="field" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required className="field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required className="field" />
              </div>

              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                disabled={loading} type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl mt-2 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700/60">
              <button onClick={() => navigate('/analysis')}
                className="w-full py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Continue without account →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
