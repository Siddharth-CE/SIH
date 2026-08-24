from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.alert_service import AlertService
from app.schemas.alert import AlertCreate, AlertResponse

router = APIRouter(prefix="/alerts", tags=["Caregiver Alerts"])


@router.get("", response_model=List[AlertResponse], summary="List all priority alerts")
def get_alerts(
    patient_id: Optional[str] = None,
    unresolved_only: bool = False,
    db: Session = Depends(get_db),
):
    alert_service = AlertService(db)
    return alert_service.get_alerts(patient_id, unresolved_only)


@router.patch("/{id}/read", response_model=AlertResponse, summary="Mark alert as read")
def mark_alert_read(id: str, db: Session = Depends(get_db)):
    alert_service = AlertService(db)
    return alert_service.mark_as_read(id)


@router.patch("/{id}/resolve", response_model=AlertResponse, summary="Mark alert as resolved")
def resolve_alert(id: str, db: Session = Depends(get_db)):
    alert_service = AlertService(db)
    return alert_service.resolve_alert(id)


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED, summary="Create alert")
def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    alert_service = AlertService(db)
    return alert_service.create_alert(alert_in)
