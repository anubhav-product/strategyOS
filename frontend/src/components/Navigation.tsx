/**
 * Navigation Component
 * Premium header with branding
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navigation({ theme, toggleTheme }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-700/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-slate-950 font-bold text-lg">S</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">StrategyOS</p>
            <p className="text-xl font-semibold text-white">Premium Growth AI</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/analysis" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
            Analysis
          </Link>
          <Link to="/dashboard" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/engagement/intro" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
            Engagement
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-slate-900 hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            Sign In
          </button>
        </div>

        <button
          onClick={() => setOpen(open => !open)}
          className="inline-flex md:hidden items-center justify-center rounded-full border border-slate-200/80 bg-white/90 p-2 text-slate-700 hover:text-slate-900 hover:border-cyan-400/70 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:text-white"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="border-t border-slate-700/50 bg-slate-950/95 md:hidden"
        >
          <div className="px-6 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/analysis"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white"
            >
              Analysis
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/engagement/intro"
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white"
            >
              Engagement
            </Link>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="w-full rounded-full border border-slate-700/80 bg-slate-900/90 px-5 py-3 text-slate-200 font-semibold hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 text-white font-semibold">
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
