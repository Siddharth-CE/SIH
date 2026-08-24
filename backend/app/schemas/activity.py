from typing import Optional
from datetime import date, datetime
from app.schemas.common import CamelModel


class DailyActivityBase(CamelModel):
    patient_id: str
    time: str
    time_of_day: str
    type: str
    default_title: str
    custom_title: Optional[str] = None
    cultural_context: Optional[str] = None
    completed: bool = False
    scheduled_for_date: Optional[date] = None
    duration_minutes: Optional[int] = None


class DailyActivityCreate(DailyActivityBase):
    pass


class DailyActivityUpdate(CamelModel):
    custom_title: Optional[str] = None
    completed: Optional[bool] = None
    completed_at: Optional[datetime] = None


class DailyActivityResponse(DailyActivityBase):
    id: str
    completed_at: Optional[datetime] = None
    created_at: datetime
