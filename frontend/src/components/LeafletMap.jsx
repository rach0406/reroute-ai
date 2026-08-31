import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon helper based on location type
const createCustomIcon = (type, blocked = false) => {
  let color = '#06b6d4'; // default cyan
  if (type === 'Hospital') color = '#a855f7'; // purple
  else if (type === 'Medical Supply Center') color = '#ef4444'; // red
  else if (type === 'Food Distribution Center') color = '#eab308'; // yellow
  else if (type === 'Relief Camp') color = '#10b981'; // green
  else if (type === 'Fuel Depot') color = '#f97316'; // orange
  else if (type === 'Vehicle') color = '#3b82f6'; // blue

  const svgHtml = `
    <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px ${color}aa;">
      <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function LeafletMap({
  locations = [],
  roads = [],
  vehicles = [],
  riskZones = [],
  highlightedPathNodes = [],
  center = [17.4150, 78.4600],
  zoom = 12
}) {
  const locationMap = React.useMemo(() => {
    const map = {};
    locations.forEach(loc => { map[loc.id] = loc; });
    return map;
  }, [locations]);

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
        {/* OpenStreetMap Dark Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Risk Zones Polygons / Circles */}
        {riskZones.map(zone => {
          const color = zone.risk_level === 'CRITICAL' ? '#ef4444' : (zone.risk_level === 'HIGH' ? '#f97316' : '#eab308');
          if (zone.geojson_polygon && zone.geojson_polygon.coordinates) {
            const coords = zone.geojson_polygon.coordinates[0].map(c => [c[1], c[0]]);
            return (
              <Polygon
                key={`zone-${zone.id}`}
                positions={coords}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.25, weight: 2, dashArray: '4,4' }}
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 uppercase">
                      {zone.risk_level} Risk Zone
                    </span>
                    <h4 className="font-bold text-sm text-white">{zone.name}</h4>
                    <p className="text-xs text-slate-300">Radius: {zone.radius_km} km hazard radius</p>
                  </div>
                </Popup>
              </Polygon>
            );
          } else {
            return (
              <Circle
                key={`zone-circle-${zone.id}`}
                center={[zone.center_lat, zone.center_lng]}
                radius={zone.radius_km * 1000}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.2, weight: 2 }}
              />
            );
          }
        })}

        {/* Road Polylines */}
        {roads.map(road => {
          const srcLoc = locationMap[road.source_id];
          const tgtLoc = locationMap[road.target_id];
          if (!srcLoc || !tgtLoc) return null;

          const isBlocked = road.blocked;
          let color = '#10b981'; // Green (low risk)
          if (road.risk_score > 0.7) color = '#ef4444'; // Red
          else if (road.risk_score > 0.4) color = '#f97316'; // Orange
          else if (road.risk_score > 0.2) color = '#eab308'; // Yellow

          if (isBlocked) color = '#dc2626';

          return (
            <Polyline
              key={`road-${road.id}`}
              positions={[
                [srcLoc.latitude, srcLoc.longitude],
                [tgtLoc.latitude, tgtLoc.longitude]
              ]}
              pathOptions={{
                color: isBlocked ? '#ef4444' : color,
                weight: isBlocked ? 5 : 4,
                dashArray: isBlocked ? '8, 8' : undefined,
                opacity: isBlocked ? 0.9 : 0.75
              }}
            >
              <Popup>
                <div className="p-2 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{road.name}</span>
                    {isBlocked ? (
                      <span className="text-xs font-bold text-red-500 bg-red-950 px-2 py-0.5 rounded border border-red-800">BLOCKED</span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">OPEN</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
                    <div>Distance: <span className="font-semibold text-white">{road.distance} km</span></div>
                    <div>Travel Time: <span className="font-semibold text-white">{road.travel_time} min</span></div>
                    <div>Traffic: <span className="font-semibold text-amber-400">{Math.round(road.traffic_level * 100)}%</span></div>
                    <div>Risk Score: <span className="font-semibold text-rose-400">{Math.round(road.risk_score * 100)}%</span></div>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Highlighted Dynamic Optimized Path */}
        {highlightedPathNodes.length >= 2 && (
          <Polyline
            positions={highlightedPathNodes.map(id => {
              const loc = locationMap[id];
              return loc ? [loc.latitude, loc.longitude] : null;
            }).filter(Boolean)}
            pathOptions={{ color: '#06b6d4', weight: 7, opacity: 0.9, lineCap: 'round' }}
          />
        )}

        {/* Location Markers */}
        {locations.map(loc => (
          <Marker
            key={`loc-${loc.id}`}
            position={[loc.latitude, loc.longitude]}
            icon={createCustomIcon(loc.type)}
          >
            <Popup>
              <div className="p-1 space-y-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {loc.type}
                </span>
                <h3 className="font-bold text-sm text-white">{loc.name}</h3>
                <p className="text-xs text-slate-300">{loc.address}</p>
                <div className="text-[11px] text-slate-400">Contact: {loc.contact_person}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vehicle Markers */}
        {vehicles.map(v => (
          <Marker
            key={`veh-${v.id}`}
            position={[v.current_lat, v.current_lng]}
            icon={createCustomIcon('Vehicle')}
          >
            <Popup>
              <div className="p-1 space-y-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  {v.vehicle_code} ({v.type})
                </span>
                <div className="text-xs text-slate-200">Capacity: {v.capacity_tons} Tons</div>
                <div className="text-xs text-slate-300">Fuel Level: {v.fuel_level_percent}%</div>
                <div className="text-xs font-semibold text-emerald-400">Status: {v.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
