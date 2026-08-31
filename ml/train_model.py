import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def train_disruption_model(
    data_path="C:/Users/rachita.sabbathi/.gemini/antigravity/scratch/reroute-ai/ml/data/transportation_data.csv",
    model_output_dir="C:/Users/rachita.sabbathi/.gemini/antigravity/scratch/reroute-ai/ml/models"
):
    if not os.path.exists(data_path):
        import sys
        sys.path.append(os.path.dirname(__file__))
        from data.generate_dataset import generate_transportation_dataset
        generate_transportation_dataset(data_path)

    df = pd.read_csv(data_path)
    
    feature_cols = [
        "traffic_level", "road_condition", "weather_severity",
        "road_capacity", "historical_delay", "distance",
        "demand_level", "vehicle_load", "previous_disruptions"
    ]
    
    X = df[feature_cols]
    y = df["disruption"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    
    y_pred = rf_model.predict(X_test_scaled)
    y_proba = rf_model.predict_proba(X_test_scaled)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)
    
    print(f"Random Forest Disruption Model Metrics:")
    print(f"  Accuracy:  {acc:.4f}")
    print(f"  Precision: {prec:.4f}")
    print(f"  Recall:    {rec:.4f}")
    print(f"  F1 Score:  {f1:.4f}")
    print(f"  ROC AUC:   {auc:.4f}")
    
    os.makedirs(model_output_dir, exist_ok=True)
    model_path = os.path.join(model_output_dir, "disruption_model.pkl")
    scaler_path = os.path.join(model_output_dir, "scaler.pkl")
    
    artifact = {
        "model": rf_model,
        "scaler": scaler,
        "feature_names": feature_cols,
        "metrics": {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1),
            "roc_auc": float(auc)
        }
    }
    
    joblib.dump(artifact, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"Model successfully saved to {model_path}")
    return artifact

if __name__ == "__main__":
    train_disruption_model()
