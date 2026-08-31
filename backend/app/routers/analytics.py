from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import Shipment, Road, Disruption

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_analytics_data(db: Session = Depends(get_db)):
    shipments = db.query(Shipment).all()
    roads = db.query(Road).all()
    disruptions = db.query(Disruption).all()

    # Deliveries by status
    status_counts = {}
    for s in shipments:
        status_counts[s.status] = status_counts.get(s.status, 0) + 1
    
    deliveries_by_status = [
        {"name": status, "value": count} for status, count in status_counts.items()
    ]

    # Road congestion distribution
    traffic_data = [
        {"name": r.name[:18] + "...", "traffic": round(r.traffic_level * 100, 1), "risk": round(r.risk_score * 100, 1)}
        for r in roads[:8]
    ]

    # Priority category breakdown
    category_counts = {}
    for s in shipments:
        category_counts[s.category] = category_counts.get(s.category, 0) + 1
    
    priority_distribution = [
        {"category": cat, "count": count} for cat, count in category_counts.items()
    ]

    # Efficiency savings metrics (Original vs Rerouted)
    efficiency_metrics = [
        {"metric": "Average ETA (min)", "standard_route": 48.0, "optimized_route": 29.5},
        {"metric": "Fuel Consumption (L)", "standard_route": 18.2, "optimized_route": 12.8},
        {"metric": "Disruption Exposure (%)", "standard_route": 72.0, "optimized_route": 18.0},
        {"metric": "Transportation Cost ($)", "standard_route": 145.0, "optimized_route": 92.0}
    ]

    return {
        "deliveries_by_status": deliveries_by_status,
        "road_traffic_data": traffic_data,
        "priority_distribution": priority_distribution,
        "efficiency_metrics": efficiency_metrics,
        "total_disruptions_count": len(disruptions),
        "total_active_roads": len(roads)
    }
