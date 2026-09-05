import os
import sys
import pandas as pd
import logging
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import SessionLocal
from app.models.networks import Network
from app.graph.builder import build_heterogeneous_graph
from app.graph.analysis import extract_subgraphs, compute_network_features
from app.ml.risk_model import train_risk_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def gather_dataset(db: Session) -> pd.DataFrame:
    """Extract features from all generated networks."""
    G = build_heterogeneous_graph(db, include_transactions=False)
    subgraphs = extract_subgraphs(G)
    
    # We also need ground truth. Since subgraphs are isolated components, 
    # we can check nodes for their network association.
    # We should query all networks for ground truth mappings.
    networks = {net.id: net for net in db.query(Network).all()}
    
    from app.models.networks import NetworkEntity
    net_entities = db.query(NetworkEntity).all()
    entity_to_net = {ne.entity_id: ne.network_id for ne in net_entities}
    
    data = []
    
    for sg in subgraphs:
        features = compute_network_features(sg)
        
        # Determine label by looking at nodes in the subgraph
        # Majority vote or any positive flag
        is_abuse = False
        network_id = "UNKNOWN"
        
        for node_id in sg.nodes:
            nid = entity_to_net.get(node_id)
            if nid and nid in networks:
                network_id = nid
                if networks[nid].is_abuse:
                    is_abuse = True
                    break
        
        features["network_id"] = network_id
        features["is_abuse"] = int(is_abuse)
        data.append(features)
        
    return pd.DataFrame(data)

def main():
    db = SessionLocal()
    try:
        logger.info("Gathering graph features from database...")
        df = gather_dataset(db)
        logger.info(f"Extracted {len(df)} subgraphs.")
        
        if df.empty or len(df[df.is_abuse == 1]) == 0:
            logger.error("Dataset lacks positive examples! Cannot train.")
            return
            
        logger.info("Training LightGBM model...")
        model, metrics = train_risk_model(df)
        
        logger.info("Training Complete!")
        logger.info(f"Metrics: {metrics}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
