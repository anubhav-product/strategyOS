import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Message { role: 'user' | 'assistant'; content: string; }

interface ChatPanelProps {
  analysisId: string;
  onClose: () => void;
}

export default function ChatPanel({ analysisId, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your consulting partner for this analysis. Ask me anything — dig deeper into any section, challenge the recommendation, or explore alternatives.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('strategyos_token');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`/api/analyses/${analysisId}/chat`, {
        message: userMsg.content,
        history: messages.slice(-8),
      }, { headers: { Authorization: `Bearer ${token}` } });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I ran into an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const STARTERS = [
    'What are the biggest risks to this plan?',
    'How do we execute Phase 1 with a small team?',
    'What if we have half the budget?',
    'Which option has the fastest ROI?',
  ];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-screen w-full max-w-md z-50 flex flex-col shadow-2xl
        bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <MessageSquare size={15} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">AI Consulting Partner</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask anything about this analysis</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X size={18} className="text-slate-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-br-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starters */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {STARTERS.map(s => (
            <button key={s} onClick={() => setInput(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-cyan-500 dark:hover:text-cyan-400 transition-colors bg-white dark:bg-slate-800/60">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about this analysis..."
            className="field flex-1 text-sm py-2.5" />
          <button onClick={send} disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
