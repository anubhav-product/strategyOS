import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, LayoutDashboard, Sparkles } from 'lucide-react';

interface NavigationProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navigation({ theme, toggleTheme }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem('strategyos_user') || 'null'); } catch { return null; } })();

  const navLink = (to: string, label: string) => (
    <Link to={to} onClick={() => setOpen(false)}
      className={`text-sm font-medium transition-colors ${
        location.pathname === to
          ? 'text-blue-600 dark:text-cyan-400'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      }`}>
      {label}
    </Link>
  );

  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">StrategyOS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLink('/', 'Home')}
          {navLink('/analysis', 'New Analysis')}
          {navLink('/dashboard', 'Dashboard')}

          <button onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <Link to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <LayoutDashboard size={15} />
              {user.name?.split(' ')[0] || 'Dashboard'}
            </Link>
          ) : (
            <Link to="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(v => !v)}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-950/95 px-5 py-4 space-y-3">
          {navLink('/', 'Home')}
          {navLink('/analysis', 'New Analysis')}
          {navLink('/dashboard', 'Dashboard')}
          <div className="flex gap-2 pt-1">
            <button onClick={() => { toggleTheme(); setOpen(false); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </button>
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-center text-slate-700 dark:text-slate-300">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold text-center">
                Sign in
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
