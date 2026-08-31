from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import Road
from ..schemas.schemas import BottleneckResponse, BottleneckItem

router = APIRouter(prefix="/api/bottlenecks", tags=["Logistics Bottlenecks"])

@router.get("", response_model=BottleneckResponse)
def get_logistics_bottlenecks(db: Session = Depends(get_db)):
    roads = db.query(Road).all()
    bottlenecks = []
    
    for r in roads:
        traffic_p = r.traffic_level * 35.0
        cap_p = (1.0 - r.capacity) * 30.0
        risk_p = r.risk_score * 25.0
        block_p = 10.0 if r.blocked else 0.0
        
        score = traffic_p + cap_p + risk_p + block_p
        
        if score > 40.0:
            rec = "Deploy traffic management unit and detour non-essential heavy vehicles."
            if r.blocked:
                rec = "CRITICAL: Corridor completely blocked by crisis damage. Apply emergency reroute."
            elif r.traffic_level > 0.8:
                rec = "High congestion detected; stagger dispatch windows."

            bottlenecks.append(BottleneckItem(
                road_id=r.id,
                road_name=r.name,
                bottleneck_score=round(score, 1),
                traffic_pressure=round(r.traffic_level * 100.0, 1),
                capacity_constraint=round((1.0 - r.capacity) * 100.0, 1),
                disruption_risk=round(r.risk_score * 100.0, 1),
                recommendation=rec
            ))

    bottlenecks.sort(key=lambda x: x.bottleneck_score, reverse=True)
    return BottleneckResponse(bottlenecks=bottlenecks[:6])
