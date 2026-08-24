from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from app.models.activity import DailyActivity
from app.repositories.base import BaseRepository


class ActivityRepository(BaseRepository[DailyActivity]):
    def __init__(self, db: Session):
        super().__init__(DailyActivity, db)

    def get_by_patient(
        self, patient_id: str, scheduled_date: Optional[date] = None
    ) -> List[DailyActivity]:
        query = self.db.query(DailyActivity).filter(DailyActivity.patient_id == patient_id)
        if scheduled_date:
            query = query.filter(DailyActivity.scheduled_for_date == scheduled_date)
        return query.order_by(DailyActivity.time.asc()).all()
