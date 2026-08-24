from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from app.models.reminder import Reminder, Medication
from app.repositories.base import BaseRepository


class ReminderRepository(BaseRepository[Reminder]):
    def __init__(self, db: Session):
        super().__init__(Reminder, db)

    def get_by_patient(
        self, patient_id: str, scheduled_date: Optional[date] = None
    ) -> List[Reminder]:
        query = self.db.query(Reminder).filter(Reminder.patient_id == patient_id)
        if scheduled_date:
            query = query.filter(Reminder.scheduled_for_date == scheduled_date)
        return query.order_by(Reminder.time.asc()).all()


class MedicationRepository(BaseRepository[Medication]):
    def __init__(self, db: Session):
        super().__init__(Medication, db)

    def get_by_patient(self, patient_id: str, active_only: bool = True) -> List[Medication]:
        query = self.db.query(Medication).filter(Medication.patient_id == patient_id)
        if active_only:
            query = query.filter(Medication.is_active.is_(True))
        return query.all()
