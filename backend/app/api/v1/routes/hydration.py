from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.hydration_service import HydrationService
from app.schemas.hydration import HydrationCreate, HydrationResponse

router = APIRouter(prefix="/hydration", tags=["Hydration Tracker"])


@router.post(
    "",
    response_model=HydrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log glass of water",
)
def log_water(hydration_in: HydrationCreate, db: Session = Depends(get_db)):
    hydration_service = HydrationService(db)
    return hydration_service.log_hydration(hydration_in)


@router.get(
    "/patients/{patient_id}/today",
    summary="Get today's total glasses of water",
)
def get_today_water(patient_id: str, db: Session = Depends(get_db)):
    hydration_service = HydrationService(db)
    count = hydration_service.get_today_count(patient_id)
    return {"patientId": patient_id, "glassesToday": count}
