from typing import Optional, List
from datetime import datetime
from app.schemas.common import CamelModel


class FamilyMemoryBase(CamelModel):
    patient_id: str
    title: str
    relationship_or_place: str
    category: str
    description: str
    date_or_era: Optional[str] = None
    tags: List[str] = []
    favorite: bool = False
    image_url: Optional[str] = None
    audio_clip_url: Optional[str] = None


class FamilyMemoryCreate(FamilyMemoryBase):
    pass


class FamilyMemoryUpdate(CamelModel):
    title: Optional[str] = None
    description: Optional[str] = None
    favorite: Optional[bool] = None
    tags: Optional[List[str]] = None


class FamilyMemoryResponse(FamilyMemoryBase):
    id: str
    created_at: datetime
