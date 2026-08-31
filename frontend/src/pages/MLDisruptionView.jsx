import React, { useState } from 'react';
import { BrainCircuit, AlertTriangle, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';
import { mlService } from '../services/api';

export default function MLDisruptionView() {
  const [trafficLevel, setTrafficLevel] = useState(0.8);
  const [roadCondition, setRoadCondition] = useState(0.4);
  const [weatherSeverity, setWeatherSeverity] = useState(0.7);
  const [roadCapacity, setRoadCapacity] = useState(0.5);
  const [vehicleLoad, setVehicleLoad] = useState(0.85);
  const [historicalDelay, setHistoricalDelay] = useState(20.0);
  const [distance, setDistance] = useState(12.0);
  const [previousDisruptions, setPreviousDisruptions] = useState(3);

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await mlService.predictDisruption({
        traffic_level: parseFloat(trafficLevel),
        road_condition: parseFloat(roadCondition),
        weather_severity: parseFloat(weatherSeverity),
        road_capacity: parseFloat(roadCapacity),
        historical_delay: parseFloat(historicalDelay),
        distance: parseFloat(distance),
        vehicle_load: parseFloat(vehicleLoad),
        previous_disruptions: parseInt(previousDisruptions)
      });
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="font-bold text-lg text-slate-100">AI Road Disruption Risk Predictor</h2>
              <p className="text-xs text-slate-400">Scikit-Learn Random Forest Classifier trained on post-crisis transportation parameters</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800 font-mono">
            Model: Random Forest (Accuracy 91.5%)
          </span>
        </div>

        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Traffic Level */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Traffic Congestion:</span>
              <span className="text-cyan-400 font-bold">{Math.round(trafficLevel * 100)}%</span>
            </div>
            <input
              type="range" min="0.0" max="1.0" step="0.05"
              value={trafficLevel} onChange={(e) => setTrafficLevel(e.target.value)}
              className="w-full accent-cyan-500 bg-slate-950"
            />
          </div>

          {/* Road Infrastructure Condition */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Road Condition Integrity:</span>
              <span className="text-emerald-400 font-bold">{Math.round(roadCondition * 100)}%</span>
            </div>
            <input
              type="range" min="0.1" max="1.0" step="0.05"
              value={roadCondition} onChange={(e) => setRoadCondition(e.target.value)}
              className="w-full accent-emerald-500 bg-slate-950"
            />
          </div>

          {/* Weather Severity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Weather Severity (Flood/Storm):</span>
              <span className="text-rose-400 font-bold">{Math.round(weatherSeverity * 100)}%</span>
            </div>
            <input
              type="range" min="0.0" max="1.0" step="0.05"
              value={weatherSeverity} onChange={(e) => setWeatherSeverity(e.target.value)}
              className="w-full accent-rose-500 bg-slate-950"
            />
          </div>

          {/* Road Throughput Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Road Capacity:</span>
              <span className="text-amber-400 font-bold">{Math.round(roadCapacity * 100)}%</span>
            </div>
            <input
              type="range" min="0.1" max="1.0" step="0.05"
              value={roadCapacity} onChange={(e) => setRoadCapacity(e.target.value)}
              className="w-full accent-amber-500 bg-slate-950"
            />
          </div>

          {/* Vehicle Cargo Load */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Vehicle Load Factor:</span>
              <span className="text-cyan-400 font-bold">{Math.round(vehicleLoad * 100)}%</span>
            </div>
            <input
              type="range" min="0.1" max="1.0" step="0.05"
              value={vehicleLoad} onChange={(e) => setVehicleLoad(e.target.value)}
              className="w-full accent-cyan-500 bg-slate-950"
            />
          </div>

          {/* Historical Delay */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400">Historical Delay (mins)</label>
            <input
              type="number" value={historicalDelay} onChange={(e) => setHistoricalDelay(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
            />
          </div>

          {/* Distance */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400">Corridor Distance (km)</label>
            <input
              type="number" value={distance} onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
            />
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2 rounded-lg shadow-lg shadow-purple-950/40 text-sm transition-all flex items-center justify-center space-x-2"
            >
              <Cpu className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Running ML Inference...' : 'Predict Disruption Risk'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Output Card */}
      {prediction && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-slate-100">ML Disruption Inference Result</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              prediction.risk_category === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
              prediction.risk_category === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
              prediction.risk_category === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {prediction.risk_category} Risk Category
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Disruption Probability Gauge */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Disruption Probability</span>
              <div className="text-4xl font-extrabold text-purple-400">
                {Math.round(prediction.disruption_probability * 100)}%
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-2 rounded-full"
                  style={{ width: `${Math.round(prediction.disruption_probability * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Predicted Delay */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-1">
              <span className="text-xs text-slate-400 uppercase font-semibold">Predicted Delivery Delay</span>
              <div className="text-4xl font-extrabold text-cyan-400">{prediction.predicted_delay_minutes} <span className="text-sm">min</span></div>
              <p className="text-[11px] text-slate-400">Includes historical baseline & risk factors</p>
            </div>

            {/* Recommendations List */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Actionable AI Advice</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {prediction.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
