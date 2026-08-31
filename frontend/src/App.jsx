import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import LeafletMap from './components/LeafletMap';

// Views
import DashboardView from './pages/DashboardView';
import RouteOptimizerView from './pages/RouteOptimizerView';
import MLDisruptionView from './pages/MLDisruptionView';
import ShipmentsView from './pages/ShipmentsView';
import DisruptionsView from './pages/DisruptionsView';
import VehiclesView from './pages/VehiclesView';
import BottlenecksView from './pages/BottlenecksView';
import AnalyticsView from './pages/AnalyticsView';

// API Services
import {
  dashboardService, networkService, vehicleService,
  shipmentService, disruptionService, riskZoneService,
  bottleneckService, recommendationService
} from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'admin',
    role: 'Logistics Manager',
    full_name: 'Sarah Jenkins (Logistics Chief)'
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMsg, setToastMsg] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // System State Data
  const [summary, setSummary] = useState(null);
  const [locations, setLocations] = useState([]);
  const [roads, setRoads] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [disruptions, setDisruptions] = useState([]);
  const [riskZones, setRiskZones] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const fetchAllData = async () => {
    try {
      const [sumRes, locRes, roadRes, vehRes, shpRes, disRes, rkRes, bnRes, recRes] = await Promise.all([
        dashboardService.getSummary(),
        networkService.getLocations(),
        networkService.getRoads(),
        vehicleService.getVehicles(),
        shipmentService.getShipments(),
        disruptionService.getDisruptions(),
        riskZoneService.getRiskZones(),
        bottleneckService.getBottlenecks(),
        recommendationService.getRecommendations()
      ]);

      setSummary(sumRes.data);
      setLocations(locRes.data);
      setRoads(roadRes.data);
      setVehicles(vehRes.data);
      setShipments(shpRes.data);
      setDisruptions(disRes.data);
      setRiskZones(rkRes.data);
      setBottlenecks(bnRes.data.bottlenecks || []);
      setRecommendations(recRes.data);
    } catch (err) {
      console.error('Failed to load system data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Refresh interval every 10 seconds for dynamic post-crisis monitoring
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateCrisis = async () => {
    setIsSimulating(true);
    try {
      const res = await disruptionService.simulateCrisis('Flash Flood & Infrastructure Damage');
      if (res.data.success) {
        setToastMsg(`⚡ Crisis Simulated! ${res.data.blocked_roads_count} roads blocked, ${res.data.rerouted_shipments_count} shipments dynamically rerouted.`);
        setTimeout(() => setToastMsg(null), 7000);
        await fetchAllData();
      }
    } catch (err) {
      console.error('Crisis simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {!isLoggedIn && (
        <LoginModal onLoginSuccess={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />
      )}

      {/* Header Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={() => setIsLoggedIn(false)}
        onSimulateCrisis={handleSimulateCrisis}
        isSimulating={isSimulating}
      />

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2.5 px-6 text-center text-sm shadow-xl flex items-center justify-center space-x-2 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {activeTab === 'dashboard' && (
            <DashboardView
              summary={summary}
              locations={locations}
              roads={roads}
              vehicles={vehicles}
              riskZones={riskZones}
              bottlenecks={bottlenecks}
              recommendations={recommendations}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'map' && (
            <div className="space-y-4 h-full">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-100">GIS Road Network & Risk Heatmap</h2>
                <span className="text-xs text-slate-400">Showing OpenStreetMap road lines, risk polygons & live location markers</span>
              </div>
              <div className="h-[calc(100vh-180px)]">
                <LeafletMap locations={locations} roads={roads} vehicles={vehicles} riskZones={riskZones} />
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <ShipmentsView
              shipments={shipments}
              locations={locations}
              vehicles={vehicles}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'routes' && (
            <RouteOptimizerView
              locations={locations}
              roads={roads}
              vehicles={vehicles}
              riskZones={riskZones}
            />
          )}

          {activeTab === 'ml' && (
            <MLDisruptionView />
          )}

          {activeTab === 'disruptions' && (
            <DisruptionsView
              disruptions={disruptions}
              roads={roads}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'bottlenecks' && (
            <BottlenecksView
              bottlenecks={bottlenecks}
              recommendations={recommendations}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}
        </main>
      </div>
    </div>
  );
}
