from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.memory import FamilyMemory
from app.repositories.memory_repo import MemoryRepository
from app.schemas.memory import FamilyMemoryCreate, FamilyMemoryUpdate
from app.core.exceptions import NotFoundException


class MemoryService:
    def __init__(self, db: Session):
        self.db = db
        self.memory_repo = MemoryRepository(db)

    def get_memories(
        self, patient_id: str, category: Optional[str] = None
    ) -> List[FamilyMemory]:
        return self.memory_repo.get_by_patient(patient_id, category)

    def create_memory(self, memory_data: FamilyMemoryCreate) -> FamilyMemory:
        return self.memory_repo.create(memory_data)

    def toggle_favorite(self, memory_id: str) -> FamilyMemory:
        mem = self.memory_repo.get(memory_id)
        if not mem:
            raise NotFoundException("FamilyMemory")
        mem.favorite = not mem.favorite
        self.db.commit()
        self.db.refresh(mem)
        return mem

    def update_memory(self, memory_id: str, update_data: FamilyMemoryUpdate) -> FamilyMemory:
        mem = self.memory_repo.get(memory_id)
        if not mem:
            raise NotFoundException("FamilyMemory")
        return self.memory_repo.update(mem, update_data)

    def delete_memory(self, memory_id: str) -> bool:
        return self.memory_repo.delete(memory_id)
