from typing import Optional
from datetime import datetime, date
from app.schemas.common import CamelModel


class HydrationCreate(CamelModel):
    patient_id: str
    amount_glasses: int = 1
    source: str = "patient"


class HydrationResponse(CamelModel):
    id: str
    patient_id: str
    amount_glasses: int
    timestamp: datetime
    date_logged: date
    source: str
