from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import Shipment, Road, Disruption
from ..schemas.schemas import DashboardSummaryResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    active_shipments = db.query(Shipment).filter(Shipment.status.in_(["In Transit", "Assigned", "Pending", "At Risk"])).count()
    completed_deliveries = db.query(Shipment).filter(Shipment.status == "Delivered").count()
    at_risk_shipments = db.query(Shipment).filter(
        (Shipment.status == "At Risk") | (Shipment.current_risk_category.in_(["HIGH", "CRITICAL"]))
    ).count()
    
    road_disruptions = db.query(Disruption).filter(Disruption.status == "Active").count()
    critical_deliveries = db.query(Shipment).filter(Shipment.category == "CRITICAL").count()
    
    roads = db.query(Road).all()
    avg_risk = sum(r.risk_score for r in roads) / max(1, len(roads)) if roads else 0.25
    
    shipments = db.query(Shipment).all()
    total_cost = sum(s.quantity * 45.0 + s.current_eta_minutes * 1.8 for s in shipments) if shipments else 1250.0
    avg_delay = sum(s.current_eta_minutes * 0.35 for s in shipments) / max(1, len(shipments)) if shipments else 18.5
    
    return DashboardSummaryResponse(
        active_shipments=active_shipments,
        completed_deliveries=completed_deliveries,
        at_risk_shipments=at_risk_shipments,
        road_disruptions=road_disruptions,
        critical_deliveries=critical_deliveries,
        avg_delivery_delay_minutes=round(avg_delay, 1),
        total_estimated_cost_usd=round(total_cost, 2),
        network_risk_score=round(avg_risk, 3)
    )
