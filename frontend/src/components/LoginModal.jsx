import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Activity, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(username, password);
      if (res.data.success) {
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError('Invalid login credentials. Use demo accounts below.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (usr, pwd) => {
    setUsername(usr);
    setPassword(pwd);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1 shadow-lg shadow-cyan-950">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">ReRoute <span className="text-cyan-400">AI</span></h2>
          <p className="text-xs text-slate-400">Post-Crisis Transportation & Logistics Recovery System</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500" required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500" required
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-950/50 text-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Roles Fast Access Buttons */}
        <div className="space-y-2 border-t border-slate-800 pt-4">
          <div className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            Demo Credentials (1-Click Fill)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin('admin', 'admin123')}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-cyan-400 font-medium"
            >
              Manager
            </button>
            <button
              onClick={() => quickLogin('authority', 'authority123')}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-amber-400 font-medium"
            >
              Authority
            </button>
            <button
              onClick={() => quickLogin('driver', 'driver123')}
              className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[11px] text-emerald-400 font-medium"
            >
              Operator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
