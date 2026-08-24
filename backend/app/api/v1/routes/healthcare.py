from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.patient_service import PatientService
from app.services.analytics_service import AnalyticsService
from app.schemas.patient import PatientResponse
from app.schemas.analytics import HealthcareCohortOverview
from app.api.deps import get_optional_user
from app.models.user import User

router = APIRouter(prefix="/healthcare", tags=["Healthcare Specialist Hub"])


@router.get("/cohort", response_model=List[PatientResponse], summary="Get clinical cohort list with multi-factor triage filtering")
def get_healthcare_cohort(
    search: Optional[str] = None,
    region: Optional[str] = None,
    stage: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    current_user: User = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    user_id = current_user.id if current_user else "hw-301"
    return patient_service.get_all_patients(
        current_user_id=user_id,
        current_role="HEALTHCARE_WORKER",
        search=search,
        region=region,
        stage=stage,
        skip=skip,
        limit=limit,
    )


@router.get("/analytics", response_model=HealthcareCohortOverview, summary="Get population-level clinical telemetry")
def get_healthcare_analytics(db: Session = Depends(get_db)):
    analytics_service = AnalyticsService(db)
    return analytics_service.get_healthcare_overview()
