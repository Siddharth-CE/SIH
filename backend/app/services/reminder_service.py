from typing import List, Optional
from datetime import date, datetime, timezone
from sqlalchemy.orm import Session
from app.models.reminder import Reminder, Medication
from app.repositories.reminder_repo import ReminderRepository, MedicationRepository
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.core.exceptions import NotFoundException


class ReminderService:
    def __init__(self, db: Session):
        self.db = db
        self.reminder_repo = ReminderRepository(db)
        self.med_repo = MedicationRepository(db)

    def get_reminders(
        self, patient_id: str, scheduled_date: Optional[date] = None
    ) -> List[Reminder]:
        return self.reminder_repo.get_by_patient(patient_id, scheduled_date)

    def get_reminder_by_id(self, id: str) -> Reminder:
        rem = self.reminder_repo.get(id)
        if not rem:
            raise NotFoundException("Reminder")
        return rem

    def create_reminder(self, reminder_data: ReminderCreate) -> Reminder:
        return self.reminder_repo.create(reminder_data)

    def update_reminder(self, id: str, update_data: ReminderUpdate) -> Reminder:
        rem = self.get_reminder_by_id(id)
        return self.reminder_repo.update(rem, update_data)

    def update_status(self, id: str, status: str) -> Reminder:
        rem = self.get_reminder_by_id(id)
        rem.status = status
        if status == "completed":
            rem.completed_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(rem)
        return rem

    def delete_reminder(self, id: str) -> bool:
        return self.reminder_repo.delete(id)

    def get_medications(self, patient_id: str) -> List[Medication]:
        return self.med_repo.get_by_patient(patient_id)
