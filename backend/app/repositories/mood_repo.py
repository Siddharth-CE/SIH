from typing import List
from sqlalchemy.orm import Session
from app.models.mood import MoodEntry
from app.repositories.base import BaseRepository


class MoodRepository(BaseRepository[MoodEntry]):
    def __init__(self, db: Session):
        super().__init__(MoodEntry, db)

    def get_by_patient(self, patient_id: str, limit: int = 50) -> List[MoodEntry]:
        return (
            self.db.query(MoodEntry)
            .filter(MoodEntry.patient_id == patient_id)
            .order_by(MoodEntry.logged_at.desc())
            .limit(limit)
            .all()
        )
