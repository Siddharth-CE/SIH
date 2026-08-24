from typing import Optional
from datetime import date, datetime
from app.schemas.common import CamelModel


class ReminderBase(CamelModel):
    patient_id: str
    title: str
    type: str  # 'medication', 'hydration', 'activity', 'appointment'
    time: str
    time_of_day: str  # 'morning', 'afternoon', 'evening', 'night'
    dosage_or_instruction: Optional[str] = None
    status: str = "pending"  # 'pending', 'completed', 'snoozed', 'missed'
    scheduled_for_date: Optional[date] = None


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(CamelModel):
    title: Optional[str] = None
    type: Optional[str] = None
    time: Optional[str] = None
    time_of_day: Optional[str] = None
    dosage_or_instruction: Optional[str] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None


class ReminderResponse(ReminderBase):
    id: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class MedicationResponse(CamelModel):
    id: str
    patient_id: str
    name: str
    dosage: str
    schedule_times: list
    instructions: Optional[str] = None
    purpose: Optional[str] = None
    active: bool = True
