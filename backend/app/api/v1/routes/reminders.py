from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.reminder_service import ReminderService
from app.schemas.reminder import (
    ReminderCreate,
    ReminderUpdate,
    ReminderResponse,
    MedicationResponse,
)

router = APIRouter(tags=["Reminders & Medications"])


@router.get(
    "/patients/{patient_id}/reminders",
    response_model=List[ReminderResponse],
    summary="Get reminders for patient",
)
def get_patient_reminders(
    patient_id: str,
    date: Optional[str] = None,
    db: Session = Depends(get_db),
):
    reminder_service = ReminderService(db)
    target_date = None
    if date:
        try:
            target_date = date.fromisoformat(date)
        except Exception:
            pass
    return reminder_service.get_reminders(patient_id, target_date)


@router.post(
    "/reminders",
    response_model=ReminderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new reminder",
)
def create_reminder(
    reminder_in: ReminderCreate, db: Session = Depends(get_db)
):
    reminder_service = ReminderService(db)
    return reminder_service.create_reminder(reminder_in)


@router.patch(
    "/reminders/{id}",
    response_model=ReminderResponse,
    summary="Update reminder",
)
def update_reminder(
    id: str, update_in: ReminderUpdate, db: Session = Depends(get_db)
):
    reminder_service = ReminderService(db)
    return reminder_service.update_reminder(id, update_in)


@router.patch(
    "/reminders/{id}/status",
    response_model=ReminderResponse,
    summary="Update reminder status",
)
def update_reminder_status(
    id: str,
    status: str = Query(..., pattern="^(pending|completed|snoozed|missed)$"),
    db: Session = Depends(get_db),
):
    reminder_service = ReminderService(db)
    return reminder_service.update_status(id, status)


@router.delete(
    "/reminders/{id}",
    summary="Delete reminder",
)
def delete_reminder(id: str, db: Session = Depends(get_db)):
    reminder_service = ReminderService(db)
    success = reminder_service.delete_reminder(id)
    return {"success": success}


@router.get(
    "/patients/{patient_id}/medications",
    response_model=List[MedicationResponse],
    summary="Get patient medications",
)
def get_patient_medications(patient_id: str, db: Session = Depends(get_db)):
    reminder_service = ReminderService(db)
    return reminder_service.get_medications(patient_id)
