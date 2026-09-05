import os
import sys
import pandas as pd
import numpy as np
import logging
from sqlalchemy.orm import Session
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import precision_score, recall_score, f1_score
import lightgbm as lgb

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import SessionLocal
from scripts.train_model import gather_dataset

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def sanity_check():
    db = SessionLocal()
    try:
        logger.info("Gathering entire dataset for sanity check...")
        df = gather_dataset(db)
        
        features = [
            "node_count", "edge_count", "density", "num_customers",
            "num_devices", "num_ips", "num_transactions", "max_device_degree",
            "max_ip_degree", "time_span_seconds", "transaction_velocity",
            "device_reuse_ratio", "ip_reuse_ratio"
        ]
        
        X = df[features]
        y = df["is_abuse"]
        
        logger.info(f"Dataset Size: {len(df)} subgraphs. Positive labels: {y.sum()}")
        
        if y.sum() < 2:
            logger.error("Not enough positive labels for cross-validation.")
            return

        kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        precisions, recalls, f1s = [], [], []
        
        feature_importance_acc = np.zeros(len(features))
        
        for train_idx, test_idx in kf.split(X, y):
            X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
            y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
            
            train_data = lgb.Dataset(X_train, label=y_train)
            model = lgb.train(
                {"objective": "binary", "metric": "binary_logloss", "verbose": -1},
                train_data,
                num_boost_round=50
            )
            
            y_pred = (model.predict(X_test) > 0.5).astype(int)
            precisions.append(precision_score(y_test, y_pred, zero_division=0))
            recalls.append(recall_score(y_test, y_pred, zero_division=0))
            f1s.append(f1_score(y_test, y_pred, zero_division=0))
            
            feature_importance_acc += model.feature_importance(importance_type="gain")
            
        logger.info(f"CV Precision: {np.mean(precisions):.4f} (+/- {np.std(precisions):.4f})")
        logger.info(f"CV Recall: {np.mean(recalls):.4f} (+/- {np.std(recalls):.4f})")
        logger.info(f"CV F1 Score: {np.mean(f1s):.4f} (+/- {np.std(f1s):.4f})")
        
        importance_df = pd.DataFrame({
            "Feature": features,
            "Importance": feature_importance_acc / 5.0
        }).sort_values(by="Importance", ascending=False)
        
        logger.info("\nFeature Importances (Gain):")
        logger.info(importance_df.to_string(index=False))
        
    finally:
        db.close()

if __name__ == "__main__":
    sanity_check()
