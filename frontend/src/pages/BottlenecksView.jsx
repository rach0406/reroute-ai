import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { recommendationService } from '../services/api';

export default function BottlenecksView({ bottlenecks, recommendations, onRefresh }) {
  const handleApply = async (recId) => {
    try {
      await recommendationService.applyRecommendation(recId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6 text-amber-400" />
        <div>
          <h2 className="font-bold text-lg text-slate-100">Logistics Bottlenecks & AI Recovery Recommendations</h2>
          <p className="text-xs text-slate-400">Automated corridor constraint analysis & decision-support recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Recommendations List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
            Actionable AI Recovery Recommendations
          </h3>

          <div className="space-y-3">
            {recommendations.map(rec => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyan-400">{rec.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rec.urgency === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {rec.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                  <span className="text-slate-400">Status: <span className="font-semibold text-slate-200">{rec.status}</span></span>
                  {rec.status !== 'Applied' && (
                    <button
                      onClick={() => handleApply(rec.id)}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded text-xs transition-all flex items-center space-x-1 shadow-md shadow-cyan-950"
                    >
                      <span>Apply Recommendation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Bottlenecks Score Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
            Top Network Bottlenecks
          </h3>

          <div className="space-y-3">
            {bottlenecks.map(bn => (
              <div key={bn.road_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">{bn.road_name}</span>
                  <span className="font-extrabold text-sm text-rose-400">{bn.bottleneck_score} Points</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 text-center py-1">
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Traffic</div>
                    <div className="font-bold text-amber-400">{bn.traffic_pressure}%</div>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Capacity Restr.</div>
                    <div className="font-bold text-rose-400">{bn.capacity_constraint}%</div>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-400">Disruption Risk</div>
                    <div className="font-bold text-purple-400">{bn.disruption_risk}%</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">"{bn.recommendation}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
