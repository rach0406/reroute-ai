import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldAlert, RefreshCw, LogOut, UserCheck } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onSimulateCrisis, isSimulating }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSimulateClick = () => {
    setShowConfirm(true);
  };

  const confirmCrisis = () => {
    setShowConfirm(false);
    onSimulateCrisis();
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 sticky top-0 z-40 flex items-center justify-between">
      {/* Brand Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-wide">ReRoute <span className="text-cyan-400">AI</span></span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">v1.0.0</span>
          </div>
          <p className="text-xs text-slate-400">Post-Crisis Logistics & Supply Chain Recovery System</p>
        </div>
      </div>

      {/* Center Actions: Crisis Simulator Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSimulateClick}
          disabled={isSimulating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-lg shadow-lg shadow-red-900/40 border border-red-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <ShieldAlert className={`w-5 h-5 ${isSimulating ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{isSimulating ? 'Simulating Crisis...' : '⚡ SIMULATE CRISIS'}</span>
        </button>
      </div>

      {/* Right User Status */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <div className="text-xs">
            <span className="text-slate-400">Role: </span>
            <span className="text-slate-200 font-medium">{currentUser?.role || 'Logistics Manager'}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Logout"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Crisis Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-bounce" />
              <h3 className="text-lg font-bold text-white">Trigger Crisis Simulation</h3>
            </div>
            <p className="text-sm text-slate-300">
              This will simulate a major flash flood event: blocking arterial highways, surging traffic on surrounding bypasses, triggering automated AI dynamic rerouting for all active relief shipments, and generating recovery recommendations.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmCrisis}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 text-sm shadow-lg shadow-red-900/50"
              >
                Execute Crisis Event
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
