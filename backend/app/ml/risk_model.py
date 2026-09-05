import pandas as pd
import lightgbm as lgb
import shap
import pickle
import os
from typing import Dict, Any, Tuple
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score

MODEL_PATH = os.path.join(os.path.dirname(__file__), "lgbm_model.pkl")

def train_risk_model(df: pd.DataFrame) -> Tuple[lgb.Booster, Dict[str, float]]:
    """
    Trains a LightGBM risk model on graph features.
    `df` must contain a target column 'is_abuse' and a group column 'network_id'
    to prevent data leakage during splitting.
    """
    # Features to use
    features = [
        "node_count", "edge_count", "density", "num_customers",
        "num_devices", "num_ips", "num_transactions", "max_device_degree",
        "max_ip_degree", "time_span_seconds", "transaction_velocity",
        "device_reuse_ratio", "ip_reuse_ratio"
    ]
    
    # Simple train-test split for now
    X = df[features]
    y = df["is_abuse"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    train_data = lgb.Dataset(X_train, label=y_train)
    test_data = lgb.Dataset(X_test, label=y_test, reference=train_data)
    
    params = {
        "objective": "binary",
        "metric": "binary_logloss",
        "boosting_type": "gbdt",
        "learning_rate": 0.05,
        "num_leaves": 31,
        "verbose": -1
    }
    
    model = lgb.train(
        params,
        train_data,
        num_boost_round=100,
        valid_sets=[test_data]
    )
    
    # Save model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
        
    # Evaluate
    y_pred_prob = model.predict(X_test)
    y_pred = (y_pred_prob > 0.5).astype(int)
    
    metrics = {
        "precision": precision_score(y_test, y_pred, zero_division=0),
        "recall": recall_score(y_test, y_pred, zero_division=0),
        "f1": f1_score(y_test, y_pred, zero_division=0)
    }
    
    return model, metrics

def predict_risk(features: Dict[str, Any]) -> Tuple[float, Any]:
    """
    Predicts risk for a given network and returns the risk score and SHAP explanations.
    """
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
        
    df = pd.DataFrame([features])
    
    feature_cols = [
        "node_count", "edge_count", "density", "num_customers",
        "num_devices", "num_ips", "num_transactions", "max_device_degree",
        "max_ip_degree", "time_span_seconds", "transaction_velocity",
        "device_reuse_ratio", "ip_reuse_ratio"
    ]
    
    # Predict
    score = model.predict(df[feature_cols])[0]
    
    # SHAP explainer
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df[feature_cols])
    
    # Format SHAP evidence (simplified)
    evidence = {}
    
    # LightGBM binary objective can sometimes return list of arrays
    sv = shap_values[1] if isinstance(shap_values, list) else shap_values
    
    for idx, col in enumerate(feature_cols):
        evidence[col] = float(sv[0][idx])
        
    return float(score), evidence
