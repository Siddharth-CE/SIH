from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.repositories.alert_repo import AlertRepository
from app.schemas.alert import AlertCreate
from app.core.exceptions import NotFoundException


class AlertService:
    def __init__(self, db: Session):
        self.db = db
        self.alert_repo = AlertRepository(db)

    def get_alerts(
        self, patient_id: Optional[str] = None, unresolved_only: bool = False
    ) -> List[Alert]:
        return self.alert_repo.get_by_patient(patient_id, unresolved_only)

    def get_alerts_for_patients(self, patient_ids: List[str]) -> List[Alert]:
        return self.alert_repo.get_by_patients(patient_ids)

    def mark_as_read(self, id: str) -> Alert:
        alert = self.alert_repo.get(id)
        if not alert:
            raise NotFoundException("Alert")
        alert.read = True
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def resolve_alert(self, id: str) -> Alert:
        alert = self.alert_repo.get(id)
        if not alert:
            raise NotFoundException("Alert")
        alert.resolved = True
        alert.resolved_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def create_alert(self, alert_data: AlertCreate) -> Alert:
        return self.alert_repo.create(alert_data)
