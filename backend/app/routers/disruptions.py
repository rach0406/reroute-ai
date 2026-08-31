import sys
import os
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Disruption, Road, Shipment, Location, Recommendation
from app.schemas.schemas import DisruptionCreateRequest, DisruptionResponse, CrisisSimulateRequest, CrisisSimulateResponse

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from optimization.optimizer import RouteOptimizer

router = APIRouter(prefix="/api/disruptions", tags=["Disruptions"])

@router.get("", response_model=List[DisruptionResponse])
def get_disruptions(db: Session = Depends(get_db)):
    return db.query(Disruption).all()

@router.post("", response_model=DisruptionResponse)
def create_disruption(payload: DisruptionCreateRequest, db: Session = Depends(get_db)):
    count = db.query(Disruption).count() + 301
    code = f"DIS-{count}"
    
    dis = Disruption(
        disruption_code=code,
        title=payload.title,
        location_description=payload.location_description,
        affected_road_ids=payload.affected_road_ids,
        severity=payload.severity,
        status="Active",
        start_time=datetime.utcnow(),
        expected_duration_hours=12.0,
        cause=payload.cause,
        traffic_impact_factor=0.8
    )
    db.add(dis)
    
    for r_id in payload.affected_road_ids:
        road = db.query(Road).filter(Road.id == r_id).first()
        if road:
            road.blocked = True
            road.risk_score = 0.95
            road.traffic_level = 1.0

    db.commit()
    db.refresh(dis)
    return dis

@router.post("/simulate", response_model=CrisisSimulateResponse)
def simulate_crisis(payload: CrisisSimulateRequest, db: Session = Depends(get_db)):
    crisis_type = payload.crisis_type or "Flash Flood & Infrastructure Damage"
    target_road_ids = payload.blocked_road_ids or [1, 8]
    
    blocked_count = 0
    for r_id in target_road_ids:
        road = db.query(Road).filter(Road.id == r_id).first()
        if road:
            road.blocked = True
            road.risk_score = 0.98
            road.traffic_level = 1.0
            road.road_condition = 0.1
            blocked_count += 1

    surged_roads = db.query(Road).filter(~Road.id.in_(target_road_ids)).all()
    for s_road in surged_roads:
        s_road.traffic_level = min(1.0, s_road.traffic_level + 0.35)
        s_road.risk_score = min(0.9, s_road.risk_score + 0.25)
        s_road.travel_time = round(s_road.travel_time * 1.4, 1)

    dis_code = f"CRISIS-{int(datetime.utcnow().timestamp())}"
    crisis_disruption = Disruption(
        disruption_code=dis_code,
        title=f"CRISIS SIMULATION: {crisis_type}",
        location_description="Primary Logistics Corridors NH-65 & District Bridge",
        affected_road_ids=target_road_ids,
        severity="CRITICAL",
        status="Active",
        start_time=datetime.utcnow(),
        expected_duration_hours=24.0,
        cause=f"Simulated Crisis: {crisis_type}",
        traffic_impact_factor=0.95
    )
    db.add(crisis_disruption)

    locations = [l.__dict__ for l in db.query(Location).all()]
    all_roads = [r.__dict__ for r in db.query(Road).all()]
    optimizer = RouteOptimizer()

    active_shipments = db.query(Shipment).filter(Shipment.status.in_(["Pending", "In Transit", "Assigned"])).all()
    affected_count = len(active_shipments)
    rerouted_count = 0

    for shp in active_shipments:
        res = optimizer.optimize_route(
            locations=locations,
            roads=all_roads,
            source_id=shp.origin_id,
            target_id=shp.destination_id,
            commodity_priority=shp.category,
            algorithm="Dijkstra",
            objective="safest" if shp.category == "CRITICAL" else "balanced"
        )
        if res.get("success"):
            shp.route_nodes = res["path_nodes"]
            shp.current_eta_minutes = res["estimated_eta_minutes"]
            shp.current_risk_category = res["risk_category"]
            shp.status = "At Risk" if res["risk_category"] in ["HIGH", "CRITICAL"] else "In Transit"
            rerouted_count += 1

    rec1 = Recommendation(
        title=f"Emergency Crisis Rerouting Applied ({crisis_type})",
        category="Route Reroute",
        description=f"Primary corridors (Roads {target_road_ids}) blocked. Rerouted {rerouted_count} shipments via safe bypasses.",
        urgency="CRITICAL",
        status="Applied"
    )
    rec2 = Recommendation(
        title="Prioritize Medical Transport Vehicle Allocation",
        category="Priority Dispatch",
        description="Surge medical emergency priority for Apex Trauma Hospital shipments. Dispatch high-speed escort vans.",
        urgency="HIGH",
        status="Pending"
    )
    db.add(rec1)
    db.add(rec2)
    db.commit()

    return CrisisSimulateResponse(
        success=True,
        crisis_title=f"{crisis_type} Triggered",
        blocked_roads_count=blocked_count,
        affected_shipments_count=affected_count,
        rerouted_shipments_count=rerouted_count,
        message=f"Crisis successfully simulated! Blocked {blocked_count} roads and dynamically rerouted {rerouted_count} active shipments."
    )
