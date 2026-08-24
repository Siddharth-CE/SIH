from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.memory import FamilyMemory
from app.repositories.base import BaseRepository


class MemoryRepository(BaseRepository[FamilyMemory]):
    def __init__(self, db: Session):
        super().__init__(FamilyMemory, db)

    def get_by_patient(
        self, patient_id: str, category: Optional[str] = None
    ) -> List[FamilyMemory]:
        query = self.db.query(FamilyMemory).filter(FamilyMemory.patient_id == patient_id)
        if category and category != "all":
            query = query.filter(FamilyMemory.category == category)
        return query.order_by(FamilyMemory.favorite.desc(), FamilyMemory.created_at.desc()).all()
