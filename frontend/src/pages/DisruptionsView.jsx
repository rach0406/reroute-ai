import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { disruptionService, networkService } from '../services/api';

export default function DisruptionsView({ disruptions, roads, onRefresh }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedCrisis, setSelectedCrisis] = useState('Flash Flood & Infrastructure Damage');

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await disruptionService.simulateCrisis(selectedCrisis);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleToggleBlock = async (roadId, currentBlocked) => {
    try {
      await networkService.toggleRoadBlockage(roadId, !currentBlocked);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Crisis Simulator Action Card */}
      <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/40 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3 text-red-400">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
          <div>
            <h2 className="font-bold text-xl text-white">Post-Crisis Disaster Simulation Board</h2>
            <p className="text-xs text-slate-300">Inject real-time crisis scenarios to test AI dynamic rerouting & resilience algorithms</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <select
            value={selectedCrisis}
            onChange={(e) => setSelectedCrisis(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500 w-full sm:w-80"
          >
            <option value="Flash Flood & Infrastructure Damage">🌊 Flash Flood & Dam Surge</option>
            <option value="Severe Earth Tremor & Bridge Blockage">🌋 Earth Tremor & Bridge Damage</option>
            <option value="Cyclone Debris & Highway Obstruction">🌀 Cyclone Debris Gridlock</option>
          </select>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-lg shadow-lg shadow-red-950/50 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <ShieldAlert className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Executing Simulation...' : 'Simulate Crisis Now'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Active Disruptions & Road Blockage Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Disruptions Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Active Road Network Disruptions ({disruptions.length})</span>
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {disruptions.map(dis => (
              <div key={dis.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-red-400">{dis.disruption_code}: {dis.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                    {dis.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{dis.location_description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Cause: {dis.cause}</span>
                  <span>Impact: {Math.round(dis.traffic_impact_factor * 100)}% traffic surge</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Road Blockage Toggles */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
            Road Segment Status Controls
          </h3>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {roads.map(road => (
              <div key={road.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-200">{road.name}</div>
                  <div className="text-[11px] text-slate-400">
                    Distance: {road.distance} km | Risk: {Math.round(road.risk_score * 100)}%
                  </div>
                </div>

                <button
                  onClick={() => handleToggleBlock(road.id, road.blocked)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    road.blocked
                      ? 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  {road.blocked ? 'BLOCKED (Click to Unblock)' : 'OPEN (Click to Block)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
