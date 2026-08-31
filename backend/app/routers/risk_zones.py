from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import RiskZone
from ..schemas.schemas import RiskZoneSchema

router = APIRouter(prefix="/api/risk-zones", tags=["Risk Zones"])

@router.get("", response_model=List[RiskZoneSchema])
def get_risk_zones(db: Session = Depends(get_db)):
    return db.query(RiskZone).all()
