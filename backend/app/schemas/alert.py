from typing import Optional
from datetime import datetime
from app.schemas.common import CamelModel


class AlertBase(CamelModel):
    patient_id: str
    patient_name: str
    type: str
    severity: str
    title: str
    message: str
    action_required: Optional[str] = None
    read: bool = False
    resolved: bool = False


class AlertCreate(AlertBase):
    pass


class AlertResponse(AlertBase):
    id: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
