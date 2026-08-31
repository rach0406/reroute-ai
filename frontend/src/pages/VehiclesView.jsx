import React from 'react';
import { Truck, Fuel, ShieldCheck, MapPin } from 'lucide-react';
import { vehicleService } from '../services/api';

export default function VehiclesView({ vehicles, onRefresh }) {
  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await vehicleService.updateStatus(vehicleId, newStatus);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center space-x-3">
        <Truck className="w-6 h-6 text-blue-400" />
        <div>
          <h2 className="font-bold text-lg text-slate-100">Transport Operator & Fleet Management</h2>
          <p className="text-xs text-slate-400">Monitor active emergency vehicles, medical vans, fuel tankers, capacity, and fuel reserves</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map(v => (
          <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 font-mono">{v.vehicle_code}</span>
                <h3 className="font-bold text-base text-slate-100">{v.type}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                v.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                v.status === 'In Transit' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {v.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Cargo Capacity:</span>
                <span className="font-bold text-slate-100">{v.capacity_tons} Tons</span>
              </div>

              {/* Fuel Level Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fuel Reserve:</span>
                  </span>
                  <span className="font-bold text-amber-400">{v.fuel_level_percent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${v.fuel_level_percent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lat: {v.current_lat.toFixed(4)}, Lng: {v.current_lng.toFixed(4)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Update Status:</span>
              <select
                value={v.status}
                onChange={(e) => handleStatusChange(v.id, e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
              >
                <option value="Available">Available</option>
                <option value="In Transit">In Transit</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
