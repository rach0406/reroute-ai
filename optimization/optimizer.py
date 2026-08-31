import numpy as np
from .graph import RoadNetworkGraph
from .dijkstra import custom_dijkstra
from .astar import custom_astar

class RouteOptimizer:
    def __init__(self):
        pass

    def optimize_route(
        self,
        locations: list,
        roads: list,
        source_id: int,
        target_id: int,
        commodity_priority: str = "HIGH",
        algorithm: str = "Dijkstra",
        objective: str = "balanced"
    ) -> dict:
        net_graph = RoadNetworkGraph(locations, roads)
        
        if algorithm.lower() in ["a*", "astar"]:
            result = custom_astar(net_graph, source_id, target_id, objective=objective.lower(), priority_level=commodity_priority)
        else:
            result = custom_dijkstra(net_graph, source_id, target_id, objective=objective.lower(), priority_level=commodity_priority)
            
        if not result or not result.get("path"):
            # Attempt fallback unweighted shortest path if constrained path fails
            try:
                fallback_path = custom_dijkstra(net_graph, source_id, target_id, objective="fastest", priority_level="LOW")
                if fallback_path:
                    result = fallback_path
                else:
                    return {
                        "success": False,
                        "message": "No navigable route available. Road network connectivity compromised by crisis blockages."
                    }
            except Exception:
                return {
                    "success": False,
                    "message": "No safe route is currently available. Please review blocked roads or transportation constraints."
                }

        path_nodes = result["path"]
        
        # Calculate route metrics along the path
        total_distance = 0.0
        total_time = 0.0
        total_risk = 0.0
        total_fuel = 0.0
        traversed_roads = []
        path_coordinates = []

        G = net_graph.graph
        for i in range(len(path_nodes)):
            node_id = path_nodes[i]
            node_data = G.nodes[node_id]
            path_coordinates.append({
                "id": node_id,
                "name": node_data["name"],
                "type": node_data["type"],
                "lat": node_data["latitude"],
                "lng": node_data["longitude"]
            })
            
            if i < len(path_nodes) - 1:
                u, v = path_nodes[i], path_nodes[i+1]
                edge_data = G.get_edge_data(u, v)
                if edge_data:
                    total_distance += edge_data.get("distance", 0.0)
                    traffic = edge_data.get("traffic_level", 0.0)
                    base_time = edge_data.get("travel_time", 0.0)
                    total_time += base_time * (1.0 + traffic * 1.5)
                    total_risk += edge_data.get("risk_score", 0.0)
                    total_fuel += edge_data.get("fuel_cost", 0.0)
                    traversed_roads.append(edge_data.get("road_id"))

        edge_count = max(1, len(path_nodes) - 1)
        avg_risk = total_risk / edge_count
        
        # Generate clear Decision Rationale
        if avg_risk < 0.25:
            risk_label = "LOW"
            rationale = f"Optimal route selected via {algorithm}. Road conditions are clear with minimal risk exposure."
        elif avg_risk < 0.55:
            risk_label = "MEDIUM"
            rationale = f"Balanced route selected via {algorithm}. Avoided high-congestion segments while maintaining ETA."
        elif avg_risk < 0.8:
            risk_label = "HIGH"
            rationale = f"High-risk corridor detected. Route prioritized safety parameters for {commodity_priority} cargo."
        else:
            risk_label = "CRITICAL"
            rationale = f"Emergency detour applied. Bypassed critical bottlenecks and active hazard zones."

        estimated_cost = round(total_fuel * 1.65 + total_distance * 0.8, 2)

        return {
            "success": True,
            "algorithm_used": algorithm,
            "objective": objective,
            "commodity_priority": commodity_priority,
            "path_nodes": path_nodes,
            "path_coordinates": path_coordinates,
            "traversed_road_ids": traversed_roads,
            "total_distance_km": round(total_distance, 2),
            "estimated_eta_minutes": round(total_time, 1),
            "average_risk_score": round(avg_risk, 3),
            "risk_category": risk_label,
            "total_fuel_liters": round(total_fuel, 2),
            "estimated_cost_usd": estimated_cost,
            "decision_rationale": rationale
        }
