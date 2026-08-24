from typing import List
from sqlalchemy.orm import Session
from app.models.ai_insight import AIInsight
from app.repositories.base import BaseRepository


class AIInsightRepository(BaseRepository[AIInsight]):
    def __init__(self, db: Session):
        super().__init__(AIInsight, db)

    def get_by_patient(self, patient_id: str, limit: int = 10) -> List[AIInsight]:
        return (
            self.db.query(AIInsight)
            .filter(AIInsight.patient_id == patient_id)
            .order_by(AIInsight.generated_at.desc())
            .limit(limit)
            .all()
        )
