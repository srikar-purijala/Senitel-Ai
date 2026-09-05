import networkx as nx
from typing import List, Dict, Any

def extract_subgraphs(G: nx.MultiGraph) -> List[nx.MultiGraph]:
    """
    Extracts all connected components from the graph as individual subgraphs.
    This effectively isolates distinct behavioral networks.
    """
    components = nx.connected_components(G)
    subgraphs = [G.subgraph(c).copy() for c in components]
    return subgraphs

def compute_network_features(subgraph: nx.MultiGraph) -> Dict[str, Any]:
    """
    Computes graph intelligence features for a specific network.
    These features are used for the ML risk model and human interpretability.
    """
    nodes = list(subgraph.nodes(data=True))
    edges = list(subgraph.edges(data=True))
    
    # Entity counts
    entity_counts = {}
    for _, data in nodes:
        etype = data.get("entity_type", "UNKNOWN")
        entity_counts[etype] = entity_counts.get(etype, 0) + 1
        
    num_customers = entity_counts.get("CUSTOMER", 0)
    num_devices = entity_counts.get("DEVICE", 0)
    num_ips = entity_counts.get("IP", 0)
    num_transactions = entity_counts.get("TRANSACTION", 0)
    
    # Calculate density & degree stats
    density = nx.density(subgraph)
    degrees = dict(subgraph.degree())
    
    # Max degree specifically for devices and IPs (indicators of coordination)
    device_degrees = [degrees[n] for n, d in nodes if d.get("entity_type") == "DEVICE"]
    ip_degrees = [degrees[n] for n, d in nodes if d.get("entity_type") == "IP"]
    
    max_device_degree = max(device_degrees) if device_degrees else 0
    max_ip_degree = max(ip_degrees) if ip_degrees else 0
    
    # Temporal Density
    timestamps = [d.get("timestamp") for u, v, d in edges if "timestamp" in d and d.get("timestamp") is not None]
    if timestamps:
        time_span_seconds = (max(timestamps) - min(timestamps)).total_seconds()
        transaction_velocity = num_transactions / (time_span_seconds / 3600.0) if time_span_seconds > 0 else num_transactions
    else:
        time_span_seconds = 0
        transaction_velocity = 0

    return {
        "node_count": len(nodes),
        "edge_count": len(edges),
        "density": density,
        "num_customers": num_customers,
        "num_devices": num_devices,
        "num_ips": num_ips,
        "num_transactions": num_transactions,
        "max_device_degree": max_device_degree,
        "max_ip_degree": max_ip_degree,
        "time_span_seconds": time_span_seconds,
        "transaction_velocity": transaction_velocity,
        "device_reuse_ratio": num_customers / num_devices if num_devices > 0 else 0,
        "ip_reuse_ratio": num_customers / num_ips if num_ips > 0 else 0
    }
