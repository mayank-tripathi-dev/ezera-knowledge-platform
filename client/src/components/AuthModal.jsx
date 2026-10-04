import React, { useState } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, UserCheck, Eye, LogIn } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen } = useCanvas();
  const { login, register, demoLogin, loading } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student/Client'
  });

  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isRegisterMode) {
        await register(formData);
      } else {
        await login({ email: formData.email, password: formData.password });
      }
      setIsAuthOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    }
  };

  const handleDemoClick = async (role) => {
    setErrorMsg('');
    await demoLogin(role);
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
              {isRegisterMode ? 'Create Platform Account' : 'Enterprise Sign In'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Ezera Tech Identity & Access Management
            </p>
          </div>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Demo Login Bar */}
        <div className="p-5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
            1-Click Quick Demo Sign In
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoClick('Architect')}
              className="flex flex-col items-center p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#5ABDB2] rounded-xl text-center transition-all group"
            >
              <ShieldCheck className="w-4 h-4 text-[#5ABDB2] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">Architect</span>
              <span className="text-[9px] text-slate-400 font-mono">Full Creator</span>
            </button>

            <button
              onClick={() => handleDemoClick('Admin')}
              className="flex flex-col items-center p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 rounded-xl text-center transition-all group"
            >
              <UserCheck className="w-4 h-4 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">Admin</span>
              <span className="text-[9px] text-slate-400 font-mono">Sys Control</span>
            </button>

            <button
              onClick={() => handleDemoClick('Student/Client')}
              className="flex flex-col items-center p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 rounded-xl text-center transition-all group"
            >
              <Eye className="w-4 h-4 text-cyan-500 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">Client</span>
              <span className="text-[9px] text-slate-400 font-mono">Read-Only</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-mono">
              {errorMsg}
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label className="block text-slate-500 font-mono mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Aris Thorne"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#5ABDB2]"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-500 font-mono mb-1">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="architect@ezeratech.ae"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#5ABDB2]"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-mono mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#5ABDB2]"
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-slate-500 font-mono mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#5ABDB2]"
              >
                <option value="Architect">Architect / Creator</option>
                <option value="Admin">Admin</option>
                <option value="Student/Client">Student / Client</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#0B0F17] dark:bg-[#5ABDB2] text-white dark:text-[#0B0F17] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Modal Footer Switch Mode */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center text-xs text-slate-500 font-mono">
          {isRegisterMode ? (
            <button
              onClick={() => setIsRegisterMode(false)}
              className="hover:text-[#5ABDB2] underline"
            >
              Already have an account? Sign In
            </button>
          ) : (
            <button
              onClick={() => setIsRegisterMode(true)}
              className="hover:text-[#5ABDB2] underline"
            >
              Need a new account? Register Here
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
