import React, { useState } from 'react';
import { Package, Plus, Navigation, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { shipmentService } from '../services/api';

export default function ShipmentsView({ shipments, locations, vehicles, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [reroutingId, setReroutingId] = useState(null);

  // Form State
  const [commodityName, setCommodityName] = useState('Emergency Blood Packs & Vaccines');
  const [category, setCategory] = useState('CRITICAL');
  const [quantity, setQuantity] = useState(4.0);
  const [originId, setOriginId] = useState(locations[1]?.id || 2);
  const [destinationId, setDestinationId] = useState(locations[4]?.id || 5);
  const [urgencyLevel, setUrgencyLevel] = useState('CRITICAL');

  const locationMap = React.useMemo(() => {
    const map = {};
    locations.forEach(loc => { map[loc.id] = loc.name; });
    return map;
  }, [locations]);

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      await shipmentService.createShipment({
        commodity_name: commodityName,
        category: category,
        quantity: parseFloat(quantity),
        origin_id: parseInt(originId),
        destination_id: parseInt(destinationId),
        urgency_level: urgencyLevel,
        deadline_hours: urgencyLevel === 'CRITICAL' ? 2.0 : 8.0
      });
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to create shipment:', err);
    }
  };

  const handleReroute = async (shipmentId) => {
    setReroutingId(shipmentId);
    try {
      await shipmentService.rerouteShipment(shipmentId, 'Dijkstra');
      onRefresh();
    } catch (err) {
      console.error('Reroute failed:', err);
    } finally {
      setReroutingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="font-bold text-lg text-slate-100">Relief Shipment Logistics Management</h2>
            <p className="text-xs text-slate-400">Track priority relief supplies, ETA predictions, risk categories, and dynamic graph rerouting</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-950/40 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Urgent Shipment</span>
        </button>
      </div>

      {/* Shipments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <th className="py-3 px-4">Code / Commodity</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Origin & Destination</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA & Risk</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
              {shipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-cyan-400">{shp.shipment_code}</div>
                    <div className="text-xs text-slate-300">{shp.commodity_name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      shp.category === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      shp.category === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400'
                    }`}>
                      {shp.category} ({Math.round(shp.priority_score)})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <div className="text-slate-300 font-medium">{locationMap[shp.origin_id] || `Node ${shp.origin_id}`}</div>
                    <div className="text-slate-400">➔ {locationMap[shp.destination_id] || `Node ${shp.destination_id}`}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-300">{shp.quantity} Tons</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      shp.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400' :
                      shp.status === 'At Risk' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      'bg-cyan-950 text-cyan-400'
                    }`}>
                      {shp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <div className="font-bold text-slate-100">{shp.current_eta_minutes} min</div>
                    <div className={`font-semibold ${
                      shp.current_risk_category === 'CRITICAL' ? 'text-red-400' :
                      shp.current_risk_category === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {shp.current_risk_category} Risk
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleReroute(shp.id)}
                      disabled={reroutingId === shp.id}
                      className="px-3 py-1 bg-slate-800 hover:bg-cyan-900 text-cyan-300 rounded border border-slate-700 text-xs font-semibold transition-all inline-flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${reroutingId === shp.id ? 'animate-spin' : ''}`} />
                      <span>{reroutingId === shp.id ? 'Rerouting...' : 'Auto-Reroute'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-100 border-b border-slate-800 pb-2">Dispatch New Relief Shipment</h3>
            <form onSubmit={handleCreateShipment} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Commodity Name</label>
                <input
                  type="text" value={commodityName} onChange={(e) => setCommodityName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200" required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Quantity (Tons)</label>
                  <input type="number" step="0.5" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Origin Facility</label>
                  <select value={originId} onChange={(e) => setOriginId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
                    {locations.map(loc => <option key={`mod-src-${loc.id}`} value={loc.id}>{loc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Destination Target</label>
                  <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
                    {locations.map(loc => <option key={`mod-tgt-${loc.id}`} value={loc.id}>{loc.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-500 shadow-lg shadow-cyan-950/50">Dispatch Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
