import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Activity, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
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
      setError('Invalid login credentials. Use a demo account below.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (usr, pwd) => {
    setUsername(usr);
    setPassword(pwd);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex overflow-hidden">
      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 p-12">
        {/* Animated background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Top brand */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/30">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-wide">
              ReRoute <span className="text-cyan-400">AI</span>
            </span>
            <div className="text-xs text-slate-400 font-mono">v1.0.0</div>
          </div>
        </div>

        {/* Center headline */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-black text-white leading-tight">
            Post-Crisis<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Logistics Recovery
            </span><br />
            Command Center
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            AI-powered dynamic rerouting, real-time GIS network analysis, and multi-factor route optimization built for crisis response.
          </p>

          {/* Feature highlights */}
          <div className="space-y-3 mt-8">
            {[
              { icon: Zap, text: 'Real-time AI route optimization via NetworkX', color: 'text-cyan-400' },
              { icon: Globe, text: 'Live GIS road network with risk zone overlays', color: 'text-blue-400' },
              { icon: Shield, text: 'RandomForest ML disruption prediction engine', color: 'text-emerald-400' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-lg bg-slate-800/60 border border-slate-700`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-xs text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="relative z-10 text-xs text-slate-600">
          © 2026 ReRoute AI — Crisis Logistics Intelligence Platform
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile brand (shown on small screens) */}
          <div className="lg:hidden flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2.5 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white">
              ReRoute <span className="text-cyan-400">AI</span>
            </span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Sign in</h2>
            <p className="text-sm text-slate-400">Access the control center with your credentials.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-slate-600"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-slate-600"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-950/50 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo credentials */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
              Demo Credentials — 1-click fill
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Manager', usr: 'admin', pwd: 'admin123', color: 'text-cyan-400 border-cyan-800/50 hover:border-cyan-600/50 hover:bg-cyan-950/30' },
                { label: 'Authority', usr: 'authority', pwd: 'authority123', color: 'text-amber-400 border-amber-800/50 hover:border-amber-600/50 hover:bg-amber-950/30' },
                { label: 'Operator', usr: 'driver', pwd: 'driver123', color: 'text-emerald-400 border-emerald-800/50 hover:border-emerald-600/50 hover:bg-emerald-950/30' },
              ].map(({ label, usr, pwd, color }) => (
                <button
                  key={label}
                  onClick={() => quickLogin(usr, pwd)}
                  className={`py-2.5 px-3 bg-slate-900 border rounded-xl text-xs font-semibold transition-all ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
