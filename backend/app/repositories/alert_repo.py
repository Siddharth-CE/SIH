from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.repositories.base import BaseRepository


class AlertRepository(BaseRepository[Alert]):
    def __init__(self, db: Session):
        super().__init__(Alert, db)

    def get_by_patient(self, patient_id: Optional[str] = None, unresolved_only: bool = False) -> List[Alert]:
        query = self.db.query(Alert)
        if patient_id:
            query = query.filter(Alert.patient_id == patient_id)
        if unresolved_only:
            query = query.filter(Alert.resolved.is_(False))
        return query.order_by(Alert.resolved.asc(), Alert.created_at.desc()).all()

    def get_by_patients(self, patient_ids: List[str]) -> List[Alert]:
        return (
            self.db.query(Alert)
            .filter(Alert.patient_id.in_(patient_ids))
            .order_by(Alert.resolved.asc(), Alert.created_at.desc())
            .all()
        )
