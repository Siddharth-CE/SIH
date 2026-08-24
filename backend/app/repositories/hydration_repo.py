from typing import List
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.hydration import HydrationLog
from app.repositories.base import BaseRepository


class HydrationRepository(BaseRepository[HydrationLog]):
    def __init__(self, db: Session):
        super().__init__(HydrationLog, db)

    def get_by_patient_and_date(
        self, patient_id: str, log_date: date
    ) -> List[HydrationLog]:
        return (
            self.db.query(HydrationLog)
            .filter(
                HydrationLog.patient_id == patient_id,
                HydrationLog.date_logged == log_date,
            )
            .all()
        )

    def get_glasses_count_for_date(self, patient_id: str, log_date: date) -> int:
        total = (
            self.db.query(func.sum(HydrationLog.amount_glasses))
            .filter(
                HydrationLog.patient_id == patient_id,
                HydrationLog.date_logged == log_date,
            )
            .scalar()
        )
        return int(total or 0)
