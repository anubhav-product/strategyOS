import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
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
        if (mode === 'register') localStorage.removeItem('strategyos_onboarded');
        toast.success(mode === 'login' ? `Welcome back${res.data.user?.name ? `, ${res.data.user.name.split(' ')[0]}` : ''}!` : 'Account created!');
        navigate('/analysis');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setEmail(''); setPassword(''); setName('');
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15 dark:opacity-8"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 65%)' }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo mark */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">StrategyOS</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/60 p-8">

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-7">
            {(['login', 'register'] as const).map(m => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form key={mode} onSubmit={submit}
              initial={{ opacity: 0, x: mode === 'login' ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 12 : -12 }}
              transition={{ duration: 0.18 }}
              className="space-y-4">

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Anubhav Sharma" autoComplete="name"
                    className="field" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required autoComplete="email"
                  className="field" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs text-blue-600 dark:text-cyan-400 hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="field pr-11" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                ) : (
                  <>{mode === 'login' ? 'Sign in' : 'Create account'}<ArrowRight size={16} /></>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400">or</span>
            </div>
          </div>

          <button type="button" onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all">
            Continue without account →
          </button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          By signing up you agree to our terms. No credit card required.
        </motion.p>
      </div>
    </div>
  );
}
