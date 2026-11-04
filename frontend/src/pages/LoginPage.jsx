import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Lock, User, ArrowRight, AlertCircle, Info, Database, BrainCircuit } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('hradmin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Use demo: admin / hradmin123');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-4xl grid md:grid-cols-5 bg-white/5 backdrop-blur-md border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side: Project Context & Highlights */}
        <div className="md:col-span-2 bg-[#070D1E]/80 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white tracking-tight">HR Insight</h2>
                <span className="text-[11px] text-teal-400 font-semibold tracking-wider uppercase">
                  DMBI Project System
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              An end-to-end Machine Learning decision-support platform designed to predict and analyze employee attrition
              risks using the IBM HR Analytics dataset.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <BrainCircuit className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-medium">Random Forest & Decision Tree</strong>
                  Trained with balanced class weights and threshold tuning.
                </span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <Database className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-medium">SQLite & SQLAlchemy</strong>
                  Prediction history storage with audit logs and retrieval.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
            DMBI Capstone Project • College Submission Ready
          </div>
        </div>

        {/* Right Side: Demo Authentication Form */}
        <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/40">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">HR Portal Access</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your demo HR credentials to access analytics and prediction tools.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                  placeholder="e.g. admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-medium text-sm rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Quick One-Click Demo Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'hradmin123')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <span>Admin: admin / hradmin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('analyst', 'analyst2026')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-teal-300 border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <span>Analyst: analyst / analyst2026</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Academic demo login for role-based evaluation & testing.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
