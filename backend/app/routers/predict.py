import sys
import os
from fastapi import APIRouter, HTTPException
from ..schemas.schemas import MLPredictRequest, MLPredictResponse

# Adjust path to find ml module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from ml.predict import DisruptionPredictor

router = APIRouter(prefix="/api/predict", tags=["ML Predictions"])
predictor_instance = None

def get_predictor():
    global predictor_instance
    if predictor_instance is None:
        model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "models"))
        predictor_instance = DisruptionPredictor(model_dir=model_dir)
    return predictor_instance

@router.post("/disruption", response_model=MLPredictResponse)
def predict_road_disruption(payload: MLPredictRequest):
    try:
        pred = get_predictor()
        res = pred.predict_disruption(
            traffic_level=payload.traffic_level,
            road_condition=payload.road_condition,
            weather_severity=payload.weather_severity,
            road_capacity=payload.road_capacity,
            historical_delay=payload.historical_delay,
            distance=payload.distance,
            demand_level=payload.demand_level,
            vehicle_load=payload.vehicle_load,
            previous_disruptions=payload.previous_disruptions
        )
        return MLPredictResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Prediction Error: {str(e)}")
