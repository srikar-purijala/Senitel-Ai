import networkx as nx
from sqlalchemy.orm import Session
from app.models.entities import Entity
from app.models.relationships import Edge
from app.models.transactions import Transaction

def build_heterogeneous_graph(db: Session, include_transactions=False) -> nx.MultiGraph:
    """
    Builds a NetworkX MultiGraph from the database edges.
    """
    G = nx.MultiGraph()
    
    # 1. Load entities as nodes
    entities = db.query(Entity).all()
    for ent in entities:
        G.add_node(
            ent.id,
            entity_type=ent.entity_type,
            entity_value=ent.entity_value,
            is_synthetic=ent.is_synthetic
        )
        
    # 2. Load explicitly mapped edges
    edges = db.query(Edge).all()
    for edge in edges:
        G.add_edge(
            edge.source_entity_id,
            edge.target_entity_id,
            key=edge.id,
            relationship_type=edge.relationship_type,
            timestamp=edge.timestamp,
            weight=edge.weight
        )
        
    # 3. Optionally add transactions as nodes with implicit edges
    if include_transactions:
        txns = db.query(Transaction).all()
        for txn in txns:
            G.add_node(
                txn.id,
                entity_type="TRANSACTION",
                amount=txn.amount,
                timestamp=txn.timestamp,
                status=txn.status,
                is_abuse=txn.is_abuse
            )
            # Add implicit edges to participating entities
            G.add_edge(txn.customer_id, txn.id, relationship_type="PLACED")
            G.add_edge(txn.id, txn.merchant_id, relationship_type="PAID_TO")
            G.add_edge(txn.id, txn.device_id, relationship_type="VIA_DEVICE")
            G.add_edge(txn.id, txn.ip_id, relationship_type="VIA_IP")
            G.add_edge(txn.id, txn.payment_instrument_id, relationship_type="FUNDED_BY")
            
    return G
