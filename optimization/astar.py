import networkx as nx
from .dijkstra import calculate_edge_weight

def custom_astar(network_graph, source_id, target_id, objective="balanced", priority_level="HIGH"):
    G = network_graph.graph
    if source_id not in G or target_id not in G:
        return None

    heuristic_fn = lambda u, v: network_graph.get_haversine_distance(u, v) / 60.0 # estimated hours * weight factor
    weight_fn = lambda u, v, data: calculate_edge_weight(data, objective=objective, priority_level=priority_level)

    try:
        path = nx.astar_path(G, source_id, target_id, heuristic=heuristic_fn, weight=weight_fn)
        length = nx.astar_path_length(G, source_id, target_id, heuristic=heuristic_fn, weight=weight_fn)
        return {"path": path, "total_cost": length}
    except nx.NetworkXNoPath:
        return None
    except Exception as e:
        print(f"A* Error: {e}")
        return None
