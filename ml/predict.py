import os
import joblib
import pandas as pd
import numpy as np

class DisruptionPredictor:
    def __init__(self, model_dir="C:/Users/rachita.sabbathi/.gemini/antigravity/scratch/reroute-ai/ml/models"):
        self.model_path = os.path.join(model_dir, "disruption_model.pkl")
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.metrics = None
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            print(f"Model file not found at {self.model_path}. Training new model...")
            from ml.train_model import train_disruption_model
            artifact = train_disruption_model()
            self.model = artifact["model"]
            self.scaler = artifact["scaler"]
            self.feature_names = artifact["feature_names"]
            self.metrics = artifact["metrics"]
        else:
            artifact = joblib.load(self.model_path)
            self.model = artifact["model"]
            self.scaler = artifact["scaler"]
            self.feature_names = artifact["feature_names"]
            self.metrics = artifact.get("metrics", {})

    def predict_disruption(
        self,
        traffic_level: float,
        road_condition: float,
        weather_severity: float,
        road_capacity: float,
        historical_delay: float,
        distance: float,
        demand_level: float = 0.5,
        vehicle_load: float = 0.7,
        previous_disruptions: int = 1
    ) -> dict:
        if self.model is None:
            self._load_model()
            
        input_dict = {
            "traffic_level": traffic_level,
            "road_condition": road_condition,
            "weather_severity": weather_severity,
            "road_capacity": road_capacity,
            "historical_delay": historical_delay,
            "distance": distance,
            "demand_level": demand_level,
            "vehicle_load": vehicle_load,
            "previous_disruptions": previous_disruptions
        }
        
        df_input = pd.DataFrame([input_dict])[self.feature_names]
        scaled_input = self.scaler.transform(df_input)
        
        disruption_prob = float(self.model.predict_proba(scaled_input)[0][1])
        
        # Risk Categorization
        if disruption_prob < 0.25:
            risk_category = "LOW"
        elif disruption_prob < 0.55:
            risk_category = "MEDIUM"
        elif disruption_prob < 0.80:
            risk_category = "HIGH"
        else:
            risk_category = "CRITICAL"
            
        # Predicted delay formula (combines base historical + risk factor)
        predicted_delay = float(np.round(historical_delay + (disruption_prob * 45.0) + (traffic_level * 20.0), 1))
        
        # Formulate actionable advice
        recommendations = []
        if disruption_prob > 0.6:
            recommendations.append("Immediate dynamic rerouting recommended to avoid corridor disruption.")
        if traffic_level > 0.75:
            recommendations.append("High traffic congestion detected; restrict non-essential heavy vehicles.")
        if road_condition < 0.4:
            recommendations.append("Road infrastructure severely degraded; route medical & high-priority emergency supplies only.")
        if weather_severity > 0.7:
            recommendations.append("Severe weather active; alert transport operators of reduced speed and flood risk.")
        if not recommendations:
            recommendations.append("Road segment clear; operate standard dispatch schedule.")

        return {
            "disruption_probability": np.round(disruption_prob, 4),
            "risk_category": risk_category,
            "predicted_delay_minutes": predicted_delay,
            "features_evaluated": input_dict,
            "recommendations": recommendations
        }

if __name__ == "__main__":
    predictor = DisruptionPredictor()
    res = predictor.predict_disruption(
        traffic_level=0.85,
        road_condition=0.3,
        weather_severity=0.8,
        road_capacity=0.4,
        historical_delay=20.0,
        distance=15.0,
        demand_level=0.9,
        vehicle_load=0.85,
        previous_disruptions=3
    )
    print("Sample ML Prediction Output:")
    print(res)
