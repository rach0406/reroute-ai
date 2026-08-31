from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import Recommendation
from ..schemas.schemas import RecommendationResponse

router = APIRouter(prefix="/api/recommendations", tags=["Recovery Recommendations"])

@router.get("", response_model=List[RecommendationResponse])
def get_recommendations(db: Session = Depends(get_db)):
    return db.query(Recommendation).order_by(Recommendation.id.desc()).all()

@router.put("/{rec_id}/apply")
def apply_recommendation(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.status = "Applied"
    db.commit()
    return {"message": f"Recommendation '{rec.title}' applied successfully!"}
