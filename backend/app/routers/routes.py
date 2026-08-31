import sys
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Location, Road
from app.schemas.schemas import RouteOptimizeRequest, RouteOptimizeResponse

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from optimization.optimizer import RouteOptimizer

router = APIRouter(prefix="/api/routes", tags=["Route Optimization"])

@router.post("/optimize", response_model=RouteOptimizeResponse)
def optimize_route_api(payload: RouteOptimizeRequest, db: Session = Depends(get_db)):
    locations = [l.__dict__ for l in db.query(Location).all()]
    roads = [r.__dict__ for r in db.query(Road).all()]

    if not locations or not roads:
        raise HTTPException(status_code=400, detail="Road network data empty. Please seed database.")

    optimizer = RouteOptimizer()
    result = optimizer.optimize_route(
        locations=locations,
        roads=roads,
        source_id=payload.source_id,
        target_id=payload.target_id,
        commodity_priority=payload.commodity_priority,
        algorithm=payload.algorithm,
        objective=payload.objective
    )

    if not result.get("success"):
        return RouteOptimizeResponse(
            success=False,
            algorithm_used=payload.algorithm,
            objective=payload.objective,
            commodity_priority=payload.commodity_priority,
            path_nodes=[],
            path_coordinates=[],
            traversed_road_ids=[],
            total_distance_km=0.0,
            estimated_eta_minutes=0.0,
            average_risk_score=1.0,
            risk_category="CRITICAL",
            total_fuel_liters=0.0,
            estimated_cost_usd=0.0,
            decision_rationale="Failed to compute route.",
            message=result.get("message", "No safe route available.")
        )

    return RouteOptimizeResponse(**result)
