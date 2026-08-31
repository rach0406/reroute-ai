import React from 'react';
import {
  LayoutDashboard, Map, Package, Navigation,
  BrainCircuit, AlertOctagon, Truck, AlertTriangle,
  BarChart3, Settings
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'map', label: 'GIS Network Map', icon: Map },
  { id: 'shipments', label: 'Shipment Management', icon: Package },
  { id: 'routes', label: 'Route Optimizer', icon: Navigation },
  { id: 'ml', label: 'AI ML Disruption', icon: BrainCircuit },
  { id: 'disruptions', label: 'Crisis & Disruptions', icon: AlertOctagon },
  { id: 'vehicles', label: 'Fleet Management', icon: Truck },
  { id: 'bottlenecks', label: 'Bottlenecks & Recs', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Decision Support System
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>Engine:</span>
          <span className="text-cyan-400 font-mono">RandomForest + NetworkX</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <span className="text-emerald-400 font-medium flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1"></span> Live Monitor
          </span>
        </div>
      </div>
    </aside>
  );
}
