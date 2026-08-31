import sys
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Shipment, Location, Road
from app.schemas.schemas import ShipmentCreateRequest, ShipmentResponse

# Absolute import for optimization
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from optimization.optimizer import RouteOptimizer

router = APIRouter(prefix="/api/shipments", tags=["Shipments"])

@router.get("", response_model=List[ShipmentResponse])
def get_shipments(db: Session = Depends(get_db)):
    return db.query(Shipment).all()

@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment_by_id(shipment_id: int, db: Session = Depends(get_db)):
    shp = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shp:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shp

@router.post("", response_model=ShipmentResponse)
def create_shipment(payload: ShipmentCreateRequest, db: Session = Depends(get_db)):
    count = db.query(Shipment).count() + 101
    code = f"SHP-{count}"
    
    priority_score = 50.0
    if payload.category == "CRITICAL":
        priority_score += 45.0
    elif payload.category == "HIGH":
        priority_score += 30.0
    elif payload.category == "MEDIUM":
        priority_score += 15.0

    if payload.urgency_level == "CRITICAL":
        priority_score += 10.0

    new_shp = Shipment(
        shipment_code=code,
        commodity_name=payload.commodity_name,
        category=payload.category,
        quantity=payload.quantity,
        origin_id=payload.origin_id,
        destination_id=payload.destination_id,
        urgency_level=payload.urgency_level,
        priority_score=min(100.0, priority_score),
        deadline_hours=payload.deadline_hours,
        vehicle_id=payload.vehicle_id,
        status="Pending",
        current_eta_minutes=35.0,
        current_risk_category="LOW",
        route_nodes=[payload.origin_id, payload.destination_id]
    )
    db.add(new_shp)
    db.commit()
    db.refresh(new_shp)
    return new_shp

@router.post("/{shipment_id}/reroute")
def reroute_shipment(shipment_id: int, algorithm: str = "Dijkstra", db: Session = Depends(get_db)):
    shp = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shp:
        raise HTTPException(status_code=404, detail="Shipment not found")

    locations = [l.__dict__ for l in db.query(Location).all()]
    roads = [r.__dict__ for r in db.query(Road).all()]

    optimizer = RouteOptimizer()
    res = optimizer.optimize_route(
        locations=locations,
        roads=roads,
        source_id=shp.origin_id,
        target_id=shp.destination_id,
        commodity_priority=shp.category,
        algorithm=algorithm,
        objective="safest" if shp.category == "CRITICAL" else "balanced"
    )

    if res.get("success"):
        shp.route_nodes = res["path_nodes"]
        shp.current_eta_minutes = res["estimated_eta_minutes"]
        shp.current_risk_category = res["risk_category"]
        if res["risk_category"] in ["HIGH", "CRITICAL"]:
            shp.status = "At Risk"
        else:
            shp.status = "In Transit"
        db.commit()

    return res
