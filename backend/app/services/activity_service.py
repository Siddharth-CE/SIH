from typing import List, Optional
from datetime import date, datetime, timezone
from sqlalchemy.orm import Session
from app.models.activity import DailyActivity
from app.repositories.activity_repo import ActivityRepository
from app.schemas.activity import DailyActivityCreate, DailyActivityUpdate
from app.core.exceptions import NotFoundException


class ActivityService:
    def __init__(self, db: Session):
        self.db = db
        self.activity_repo = ActivityRepository(db)

    def get_activities(
        self, patient_id: str, scheduled_date: Optional[date] = None
    ) -> List[DailyActivity]:
        return self.activity_repo.get_by_patient(patient_id, scheduled_date)

    def toggle_completion(self, activity_id: str, completed: bool) -> DailyActivity:
        act = self.activity_repo.get(activity_id)
        if not act:
            raise NotFoundException("DailyActivity")
        act.completed = completed
        act.completed_at = datetime.now(timezone.utc) if completed else None
        self.db.commit()
        self.db.refresh(act)
        return act

    def create_activity(self, activity_data: DailyActivityCreate) -> DailyActivity:
        return self.activity_repo.create(activity_data)

    def update_activity(self, id: str, update_data: DailyActivityUpdate) -> DailyActivity:
        act = self.activity_repo.get(id)
        if not act:
            raise NotFoundException("DailyActivity")
        return self.activity_repo.update(act, update_data)

    def delete_activity(self, id: str) -> bool:
        return self.activity_repo.delete(id)
