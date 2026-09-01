import React from 'react';
import {
  LayoutDashboard, Map, Package, Navigation,
  BrainCircuit, AlertOctagon, Truck, AlertTriangle,
  BarChart3, ChevronRight
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'map', label: 'GIS Network Map', icon: Map },
  { id: 'shipments', label: 'Shipments', icon: Package },
  { id: 'routes', label: 'Route Optimizer', icon: Navigation },
  { id: 'ml', label: 'AI ML Disruption', icon: BrainCircuit },
  { id: 'disruptions', label: 'Crisis & Disruptions', icon: AlertOctagon },
  { id: 'vehicles', label: 'Fleet Management', icon: Truck },
  { id: 'bottlenecks', label: 'Bottlenecks', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-800/60 flex flex-col justify-between py-6 flex-shrink-0">
      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-0.5">
        <div className="px-3 pb-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="truncate text-xs">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3 h-3 text-cyan-500/60 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="px-3">
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Engine</span>
            <span className="text-cyan-400 font-mono text-[10px]">RF + NetworkX</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Status</span>
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Live</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
