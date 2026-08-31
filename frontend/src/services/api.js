import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
};

export const networkService = {
  getRoads: () => api.get('/roads'),
  getLocations: () => api.get('/roads/locations'),
  toggleRoadBlockage: (roadId, blocked) => api.put(`/roads/${roadId}/block?blocked=${blocked}`),
};

export const vehicleService = {
  getVehicles: () => api.get('/vehicles'),
  updateStatus: (vehicleId, status) => api.put(`/vehicles/${vehicleId}/status?status_name=${status}`),
};

export const shipmentService = {
  getShipments: () => api.get('/shipments'),
  getShipmentById: (id) => api.get(`/shipments/${id}`),
  createShipment: (data) => api.post('/shipments', data),
  rerouteShipment: (id, algorithm = 'Dijkstra') => api.post(`/shipments/${id}/reroute?algorithm=${algorithm}`),
};

export const disruptionService = {
  getDisruptions: () => api.get('/disruptions'),
  createDisruption: (data) => api.post('/disruptions', data),
  simulateCrisis: (crisisType = 'Severe Regional Flood') => api.post('/disruptions/simulate', { crisis_type: crisisType }),
};

export const mlService = {
  predictDisruption: (payload) => api.post('/predict/disruption', payload),
};

export const routeService = {
  optimizeRoute: (payload) => api.post('/routes/optimize', payload),
};

export const riskZoneService = {
  getRiskZones: () => api.get('/risk-zones'),
};

export const bottleneckService = {
  getBottlenecks: () => api.get('/bottlenecks'),
};

export const recommendationService = {
  getRecommendations: () => api.get('/recommendations'),
  applyRecommendation: (id) => api.put(`/recommendations/${id}/apply`),
};

export const analyticsService = {
  getAnalytics: () => api.get('/analytics'),
};

export default api;
