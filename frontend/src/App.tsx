/**
 * StrategyOS Frontend - Main App Component
 * Premium consulting dashboard UI
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import AnalysisPage from './pages/AnalysisPage';
import DashboardPage from './pages/DashboardPage';
import EngagementPage from './pages/EngagementPage';
import './styles/index.css';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('strategyos-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('strategyos-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-white' : 'min-h-screen bg-slate-50 text-slate-950'}>
        <Navigation theme={theme} toggleTheme={toggleTheme} />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/engagement/:id" element={<EngagementPage />} />
          </Routes>
        </AnimatePresence>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#1e293b' : '#f8fafc',
              color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
              border: theme === 'dark' ? '1px solid #475569' : '1px solid #cbd5e1',
            },
          }}
        />
      </div>
    </Router>
  );
}
