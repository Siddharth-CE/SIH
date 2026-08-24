from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.activity_service import ActivityService
from app.schemas.activity import (
    DailyActivityCreate,
    DailyActivityUpdate,
    DailyActivityResponse,
)

router = APIRouter(tags=["Daily Activities & Schedule"])


@router.get(
    "/patients/{patient_id}/activities",
    response_model=List[DailyActivityResponse],
    summary="Get patient daily activities",
)
def get_activities(
    patient_id: str,
    date: Optional[str] = None,
    db: Session = Depends(get_db),
):
    activity_service = ActivityService(db)
    target_date = None
    if date:
        try:
            target_date = date.fromisoformat(date)
        except Exception:
            pass
    return activity_service.get_activities(patient_id, target_date)


@router.post(
    "/activities",
    response_model=DailyActivityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create daily activity",
)
def create_activity(
    activity_in: DailyActivityCreate, db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    return activity_service.create_activity(activity_in)


@router.patch(
    "/activities/{id}/toggle",
    response_model=DailyActivityResponse,
    summary="Toggle activity completion status",
)
def toggle_activity(
    id: str, completed: bool = Query(...), db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    return activity_service.toggle_completion(id, completed)


@router.patch(
    "/activities/{id}",
    response_model=DailyActivityResponse,
    summary="Update activity",
)
def update_activity(
    id: str, update_in: DailyActivityUpdate, db: Session = Depends(get_db)
):
    activity_service = ActivityService(db)
    return activity_service.update_activity(id, update_in)


@router.delete(
    "/activities/{id}",
    summary="Delete activity",
)
def delete_activity(id: str, db: Session = Depends(get_db)):
    activity_service = ActivityService(db)
    success = activity_service.delete_activity(id)
    return {"success": success}
