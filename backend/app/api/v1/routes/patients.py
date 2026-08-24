from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.patient_service import PatientService
from app.schemas.patient import PatientResponse, PatientUpdate
from app.schemas.mood import MoodEntryCreate, MoodEntryResponse
from app.services.mood_service import MoodService
from app.api.deps import get_current_user, get_optional_user
from app.models.user import User

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("", response_model=List[PatientResponse], summary="List patients with filtering and RBAC")
def list_patients(
    search: Optional[str] = None,
    region: Optional[str] = None,
    stage: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    user_id = current_user.id if current_user else "anon"
    role = current_user.role.value if current_user else "HEALTHCARE_WORKER"
    return patient_service.get_all_patients(
        current_user_id=user_id,
        current_role=role,
        search=search,
        region=region,
        stage=stage,
        skip=skip,
        limit=limit,
    )


@router.get("/{id}", response_model=PatientResponse, summary="Get single patient by ID")
def get_patient(
    id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    user_id = current_user.id if current_user else "anon"
    role = current_user.role.value if current_user else "HEALTHCARE_WORKER"
    return patient_service.get_patient(id, user_id, role)


@router.patch("/{id}", response_model=PatientResponse, summary="Update patient profile fields")
def update_patient(
    id: str,
    update_data: PatientUpdate,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    user_id = current_user.id if current_user else "anon"
    role = current_user.role.value if current_user else "CAREGIVER"
    return patient_service.update_patient(id, update_data, user_id, role)


@router.post("/{id}/hydration", response_model=PatientResponse, summary="Update patient hydration count")
def update_hydration(
    id: str,
    count: int = Query(..., ge=0, le=20),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    patient_service = PatientService(db)
    user_id = current_user.id if current_user else "anon"
    role = current_user.role.value if current_user else "PATIENT"
    return patient_service.update_hydration(id, count, user_id, role)


@router.post("/{id}/mood", response_model=MoodEntryResponse, summary="Log mood for patient")
def log_patient_mood(
    id: str,
    mood_in: MoodEntryCreate,
    db: Session = Depends(get_db),
):
    mood_service = MoodService(db)
    # Ensure ID matches path
    mood_in.patientId = id
    return mood_service.log_mood(mood_in)


@router.get("/{id}/mood", response_model=List[MoodEntryResponse], summary="Get mood history for patient")
def get_patient_moods(
    id: str,
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    mood_service = MoodService(db)
    return mood_service.get_mood_history(id, limit)
