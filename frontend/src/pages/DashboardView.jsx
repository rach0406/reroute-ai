import React from 'react';
import {
  Package, CheckCircle2, AlertTriangle, AlertOctagon,
  HeartPulse, Clock, DollarSign, Activity, ArrowUpRight
} from 'lucide-react';
import LeafletMap from '../components/LeafletMap';

export default function DashboardView({
  summary,
  locations,
  roads,
  vehicles,
  riskZones,
  bottlenecks,
  recommendations,
  onNavigateTab
}) {
  const cards = [
    { label: 'Active Shipments', value: summary?.active_shipments ?? 0, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Deliveries Completed', value: summary?.completed_deliveries ?? 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'At-Risk Shipments', value: summary?.at_risk_shipments ?? 0, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Road Disruptions', value: summary?.road_disruptions ?? 0, icon: AlertOctagon, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Critical Deliveries', value: summary?.critical_deliveries ?? 0, icon: HeartPulse, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Avg Delay (mins)', value: `${summary?.avg_delivery_delay_minutes ?? 0} m`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Estimated Logistics Cost', value: `$${summary?.total_estimated_cost_usd ?? 0}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Network Risk Score', value: `${Math.round((summary?.network_risk_score ?? 0) * 100)}%`, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border ${card.bg} space-y-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg`}>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Interactive Map & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Map Panel (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Regional GIS Transportation Recovery Network</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time OpenStreetMap with risk zone overlays & vehicle positions</p>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 flex-shrink-0"
            >
              <span>Expand Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[480px]">
            <LeafletMap locations={locations} roads={roads} vehicles={vehicles} riskZones={riskZones} />
          </div>
        </div>

        {/* Live Recovery Recommendations & Top Bottlenecks Sidebar (1 col) */}
        <div className="space-y-7">
          {/* Recovery Recommendations */}
          <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>AI Recovery Recommendations</span>
              </h3>
              <button
                onClick={() => onNavigateTab('bottlenecks')}
                className="text-xs text-cyan-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {recommendations.slice(0, 3).map(rec => (
                <div key={rec.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-400">{rec.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      rec.urgency === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {rec.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Logistics Bottlenecks */}
          <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Detected Bottlenecks</span>
              </h3>
            </div>

            <div className="space-y-3">
              {bottlenecks.slice(0, 3).map(bn => (
                <div key={bn.road_id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{bn.road_name}</span>
                    <span className="text-xs font-bold text-rose-400">{bn.bottleneck_score} pts</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, bn.bottleneck_score)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{bn.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
