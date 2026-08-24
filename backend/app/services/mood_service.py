from typing import List
from sqlalchemy.orm import Session
from app.models.mood import MoodEntry
from app.repositories.mood_repo import MoodRepository
from app.schemas.mood import MoodEntryCreate


class MoodService:
    def __init__(self, db: Session):
        self.db = db
        self.mood_repo = MoodRepository(db)

    def get_mood_history(self, patient_id: str, limit: int = 50) -> List[MoodEntry]:
        return self.mood_repo.get_by_patient(patient_id, limit)

    def log_mood(self, mood_data: MoodEntryCreate) -> MoodEntry:
        return self.mood_repo.create(mood_data)
