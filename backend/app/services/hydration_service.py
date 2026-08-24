from typing import List
from datetime import date, datetime, timezone
from sqlalchemy.orm import Session
from app.models.hydration import HydrationLog
from app.models.patient import Patient
from app.repositories.hydration_repo import HydrationRepository
from app.repositories.patient_repo import PatientRepository
from app.schemas.hydration import HydrationCreate


class HydrationService:
    def __init__(self, db: Session):
        self.db = db
        self.hydration_repo = HydrationRepository(db)
        self.patient_repo = PatientRepository(db)

    def log_hydration(self, hydration_data: HydrationCreate) -> HydrationLog:
        log_entry = HydrationLog(
            patient_id=hydration_data.patientId,
            amount_glasses=hydration_data.amountGlasses,
            timestamp=datetime.now(timezone.utc),
            date_logged=date.today(),
            source=hydration_data.source,
        )
        created = self.hydration_repo.create(log_entry)

        # Update patient count
        total = self.hydration_repo.get_glasses_count_for_date(
            hydration_data.patientId, date.today()
        )
        patient = self.patient_repo.get(hydration_data.patientId)
        if patient:
            patient.hydration_current_glasses = total
            self.db.commit()

        return created

    def get_today_count(self, patient_id: str) -> int:
        return self.hydration_repo.get_glasses_count_for_date(patient_id, date.today())
