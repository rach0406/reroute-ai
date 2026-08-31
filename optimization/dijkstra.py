import heapq
import networkx as nx

def calculate_edge_weight(data, objective="balanced", priority_level="HIGH"):
    distance = data.get("distance", 1.0)
    travel_time = data.get("travel_time", 5.0)
    traffic = data.get("traffic_level", 0.0)
    risk = data.get("risk_score", 0.0)
    fuel = data.get("fuel_cost", 1.0)
    
    # Priority weighting adjustments: Emergency/Medical goods severely penalize risk & delay
    risk_multiplier = 35.0 if priority_level in ["CRITICAL", "EMERGENCY"] else (20.0 if priority_level == "HIGH" else 10.0)
    traffic_multiplier = 2.0 if priority_level in ["CRITICAL", "EMERGENCY"] else 1.2

    if objective == "fastest":
        return travel_time * (1.0 + traffic * traffic_multiplier) + risk * 5.0 + distance * 0.1
    elif objective == "safest":
        return risk * (risk_multiplier * 2.0) + travel_time * (1.0 + traffic) + distance * 0.2
    elif objective == "lowest_cost":
        return fuel * 2.5 + distance * 1.5 + travel_time * 0.5 + risk * 5.0
    else: # balanced
        return (
            distance * 0.5 +
            travel_time * (1.0 + traffic * traffic_multiplier) +
            risk * risk_multiplier +
            fuel * 1.0
        )

def custom_dijkstra(network_graph, source_id, target_id, objective="balanced", priority_level="HIGH"):
    G = network_graph.graph
    if source_id not in G or target_id not in G:
        return None

    weight_fn = lambda u, v, data: calculate_edge_weight(data, objective=objective, priority_level=priority_level)
    
    try:
        path = nx.dijkstra_path(G, source_id, target_id, weight=weight_fn)
        length = nx.dijkstra_path_length(G, source_id, target_id, weight=weight_fn)
        return {"path": path, "total_cost": length}
    except nx.NetworkXNoPath:
        return None
    except Exception as e:
        print(f"Dijkstra error: {e}")
        return None
