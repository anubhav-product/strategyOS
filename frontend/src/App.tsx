/**
 * StrategyOS Frontend - Main App Component
 * Premium consulting dashboard UI
 */

import React, { useState } from 'react';
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
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/engagement/:id" element={<EngagementPage />} />
          </Routes>
        </AnimatePresence>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #475569',
            },
          }}
        />
      </div>
    </Router>
  );
}
