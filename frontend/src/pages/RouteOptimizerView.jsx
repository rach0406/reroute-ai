import React, { useState } from 'react';
import { Navigation, ShieldCheck, Zap, DollarSign, Clock, Fuel, AlertTriangle, Layers } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import { routeService } from '../services/api';

export default function RouteOptimizerView({ locations, roads, vehicles, riskZones }) {
  const [sourceId, setSourceId] = useState(locations[0]?.id || 1);
  const [targetId, setTargetId] = useState(locations[4]?.id || 5);
  const [commodityPriority, setCommodityPriority] = useState('CRITICAL');
  const [algorithm, setAlgorithm] = useState('Dijkstra');
  const [objective, setObjective] = useState('safest');
  const [loading, setLoading] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await routeService.optimizeRoute({
        source_id: parseInt(sourceId),
        target_id: parseInt(targetId),
        commodity_priority: commodityPriority,
        algorithm: algorithm,
        objective: objective
      });
      if (res.data.success) {
        setOptimizedResult(res.data);
      } else {
        setErrorMsg(res.data.message || 'No navigable route available under current crisis blockages.');
        setOptimizedResult(null);
      }
    } catch (err) {
      setErrorMsg('Route optimization request failed. Check backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <Navigation className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="font-bold text-lg text-slate-100">AI Dynamic Multi-Factor Route Optimizer</h2>
            <p className="text-xs text-slate-400">NetworkX graph solver balancing distance, travel time, traffic pressure, fuel consumption, and risk score penalties</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleOptimize} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Origin Location</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {locations.map(loc => (
                <option key={`src-${loc.id}`} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Destination Target</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {locations.map(loc => (
                <option key={`tgt-${loc.id}`} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Commodity Priority</label>
            <select
              value={commodityPriority}
              onChange={(e) => setCommodityPriority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="CRITICAL">🔴 CRITICAL (Medical / Vaccine)</option>
              <option value="HIGH">🟠 HIGH (Water / Ration Kits)</option>
              <option value="MEDIUM">🔵 MEDIUM (Shelter Tents)</option>
              <option value="LOW">🟢 LOW (General Cargo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Algorithm & Objective</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Dijkstra">Dijkstra</option>
                <option value="A*">A* Search</option>
              </select>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="safest">Safest Path</option>
                <option value="fastest">Fastest ETA</option>
                <option value="lowest_cost">Lowest Cost</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg shadow-cyan-950/40 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Calculating...' : 'Compute Route'}</span>
            </button>
          </div>
        </form>
      </div>

      {errorMsg && (
        <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-xl flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Results Section */}
      {optimizedResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map displaying Path (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-slate-200 flex items-center justify-between">
              <span>Optimized Route Visualization ({optimizedResult.algorithm_used})</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Path Nodes: {optimizedResult.path_nodes.join(' → ')}
              </span>
            </h3>
            <div className="h-[420px]">
              <LeafletMap
                locations={locations}
                roads={roads}
                vehicles={vehicles}
                riskZones={riskZones}
                highlightedPathNodes={optimizedResult.path_nodes}
              />
            </div>
          </div>

          {/* Metrics & Rationale Card (1 col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">
              Route Evaluation Summary
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estimated ETA</span>
                </div>
                <div className="text-lg font-bold text-cyan-400">{optimizedResult.estimated_eta_minutes} min</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Distance</span>
                </div>
                <div className="text-lg font-bold text-emerald-400">{optimizedResult.total_distance_km} km</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>Average Risk</span>
                </div>
                <div className="text-lg font-bold text-rose-400">{Math.round(optimizedResult.average_risk_score * 100)}%</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. Fuel</span>
                </div>
                <div className="text-lg font-bold text-amber-400">{optimizedResult.total_fuel_liters} L</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Total Transportation Cost:</span>
                <span className="font-bold text-emerald-400 text-base">${optimizedResult.estimated_cost_usd}</span>
              </div>
            </div>

            {/* Rationale Callout */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Decision Rationale</div>
              <p className="text-xs text-slate-300 leading-relaxed">{optimizedResult.decision_rationale}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
