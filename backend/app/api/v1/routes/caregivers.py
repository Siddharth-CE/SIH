from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.patient_service import PatientService
from app.services.alert_service import AlertService
from app.schemas.patient import PatientResponse
from app.schemas.alert import AlertResponse
from app.api.deps import get_optional_user
from app.models.user import User

router = APIRouter(prefix="/caregivers", tags=["Caregiver Dashboard"])


@router.get("/assigned-patients", response_model=List[PatientResponse], summary="Get assigned patients for caregiver")
def get_caregiver_patients(
    current_user: User = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    user_id = current_user.id if current_user else "cg-201"
    return patient_service.get_all_patients(
        current_user_id=user_id,
        current_role="CAREGIVER",
        limit=20,
    )


@router.get("/alerts", response_model=List[AlertResponse], summary="Get alerts for caregiver's patients")
def get_caregiver_alerts(
    current_user: User = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    alert_service = AlertService(db)
    user_id = current_user.id if current_user else "cg-201"
    patients = patient_service.get_all_patients(
        current_user_id=user_id,
        current_role="CAREGIVER",
        limit=20,
    )
    patient_ids = [p.id for p in patients]
    return alert_service.get_alerts_for_patients(patient_ids)
