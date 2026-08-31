from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import Road, Location
from ..schemas.schemas import RoadSchema, LocationSchema

router = APIRouter(prefix="/api/roads", tags=["Road Network"])

@router.get("", response_model=List[RoadSchema])
def get_all_roads(db: Session = Depends(get_db)):
    return db.query(Road).all()

@router.get("/locations", response_model=List[LocationSchema])
def get_all_locations(db: Session = Depends(get_db)):
    return db.query(Location).all()

@router.put("/{road_id}/block")
def toggle_road_blockage(road_id: int, blocked: bool, db: Session = Depends(get_db)):
    road = db.query(Road).filter(Road.id == road_id).first()
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")
    road.blocked = blocked
    if blocked:
        road.risk_score = 0.95
        road.traffic_level = 1.0
    else:
        road.risk_score = 0.2
        road.traffic_level = 0.3
    db.commit()
    return {"message": f"Road '{road.name}' blockage status updated to {blocked}"}
