from typing import Optional
from datetime import datetime
from app.schemas.common import CamelModel


class MoodEntryBase(CamelModel):
    patient_id: str
    mood: str
    note: Optional[str] = None
    logged_by: str = "patient"


class MoodEntryCreate(MoodEntryBase):
    pass


class MoodEntryResponse(MoodEntryBase):
    id: str
    logged_at: datetime
