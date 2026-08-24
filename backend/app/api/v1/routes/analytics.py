from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import (
    PatientAnalyticsOverview,
    HealthcareCohortOverview,
)

router = APIRouter(prefix="/analytics", tags=["Clinical & Population Analytics"])


@router.get(
    "/patients/{patient_id}",
    response_model=PatientAnalyticsOverview,
    summary="Get aggregated patient cognitive and adherence analytics",
)
def get_patient_analytics(patient_id: str, db: Session = Depends(get_db)):
    analytics_service = AnalyticsService(db)
    return analytics_service.get_patient_analytics(patient_id)


@router.get(
    "/healthcare/overview",
    response_model=HealthcareCohortOverview,
    summary="Get population-level cohort analytics across NER states",
)
def get_healthcare_overview(db: Session = Depends(get_db)):
    analytics_service = AnalyticsService(db)
    return analytics_service.get_healthcare_overview()
