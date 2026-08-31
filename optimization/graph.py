import math
import networkx as nx

class RoadNetworkGraph:
    def __init__(self, locations=None, roads=None):
        self.graph = nx.DiGraph()
        self.locations = {}
        if locations and roads:
            self.build_graph(locations, roads)

    def build_graph(self, locations, roads):
        self.graph.clear()
        self.locations = {loc["id"]: loc for loc in locations}
        
        # Add nodes with metadata
        for loc in locations:
            self.graph.add_node(
                loc["id"],
                name=loc["name"],
                type=loc["type"],
                latitude=loc["latitude"],
                longitude=loc["longitude"]
            )
            
        # Add edges with attributes
        for road in roads:
            if road.get("blocked", False):
                continue # Skip blocked roads or set weight to infinity
                
            source = road["source_id"]
            target = road["target_id"]
            distance = float(road.get("distance", 1.0))
            travel_time = float(road.get("travel_time", 5.0))
            traffic_level = float(road.get("traffic_level", 0.1)) # 0.0 - 1.0
            risk_score = float(road.get("risk_score", 0.0))       # 0.0 - 1.0
            fuel_cost = float(road.get("fuel_cost", 1.0))         # liters/dollars
            capacity = float(road.get("capacity", 1.0))           # throughput ratio
            
            # Base directed edge
            self._add_edge(source, target, road["id"], road["name"], distance, travel_time, traffic_level, risk_score, fuel_cost, capacity)
            
            # Two-way road support if bidirectional flag or default
            if road.get("is_bidirectional", True):
                self._add_edge(target, source, road["id"], road["name"], distance, travel_time, traffic_level, risk_score, fuel_cost, capacity)

    def _add_edge(self, u, v, road_id, name, dist, time, traffic, risk, fuel, capacity):
        self.graph.add_edge(
            u, v,
            road_id=road_id,
            name=name,
            distance=dist,
            travel_time=time,
            traffic_level=traffic,
            risk_score=risk,
            fuel_cost=fuel,
            capacity=capacity
        )

    def get_haversine_distance(self, u_id, v_id):
        if u_id not in self.locations or v_id not in self.locations:
            return 0.0
        u_lat, u_lng = self.locations[u_id]["latitude"], self.locations[u_id]["longitude"]
        v_lat, v_lng = self.locations[v_id]["latitude"], self.locations[v_id]["longitude"]
        
        # Haversine formula in km
        R = 6371.0 # Earth radius km
        dlat = math.radians(v_lat - u_lat)
        dlng = math.radians(v_lng - u_lng)
        a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(u_lat)) * math.cos(math.radians(v_lat)) * math.sin(dlng / 2.0)**2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return R * c
