from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import Vehicle
from ..schemas.schemas import VehicleSchema

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleSchema])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()

@router.put("/{vehicle_id}/status")
def update_vehicle_status(vehicle_id: int, status_name: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle.status = status_name
    db.commit()
    return {"message": f"Vehicle {vehicle.vehicle_code} status updated to {status_name}"}
