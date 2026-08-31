import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Fuel, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { analyticsService } from '../services/api';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.getAnalytics().then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-400">Loading Analytics charts...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center space-x-3">
        <BarChart3 className="w-6 h-6 text-emerald-400" />
        <div>
          <h2 className="font-bold text-lg text-slate-100">Logistics & Route Efficiency Analytics</h2>
          <p className="text-xs text-slate-400">Post-crisis recovery performance charts, congestion metrics & cost savings analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deliveries by Status Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Shipment Status Breakdown</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.deliveries_by_status}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label
                >
                  {data.deliveries_by_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Road Congestion Levels Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Road Traffic Congestion & Risk Scores (%)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.road_traffic_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                <Legend />
                <Bar dataKey="traffic" name="Traffic Level %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="risk" name="Risk Score %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Commodities Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Commodity Volume by Priority Category</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.priority_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                <Bar dataKey="count" name="Shipments Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Optimization Efficiency Delta */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Standard vs Optimized Route Efficiency Savings</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.efficiency_metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                <Legend />
                <Bar dataKey="standard_route" name="Standard Pre-defined Route" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimized_route" name="AI Dynamic Optimized Route" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
