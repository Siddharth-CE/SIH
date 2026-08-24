from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.appointment_service import AppointmentService
from app.schemas.appointment import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["Doctor & Clinic Appointments"])


@router.get(
    "/patients/{patient_id}",
    response_model=List[AppointmentResponse],
    summary="Get appointments for patient",
)
def get_appointments(patient_id: str, db: Session = Depends(get_db)):
    appointment_service = AppointmentService(db)
    return appointment_service.get_appointments(patient_id)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new appointment",
)
def create_appointment(
    appointment_in: AppointmentCreate, db: Session = Depends(get_db)
):
    appointment_service = AppointmentService(db)
    return appointment_service.create_appointment(appointment_in)


@router.delete(
    "/{id}",
    summary="Delete appointment",
)
def delete_appointment(id: str, db: Session = Depends(get_db)):
    appointment_service = AppointmentService(db)
    success = appointment_service.delete_appointment(id)
    return {"success": success}
