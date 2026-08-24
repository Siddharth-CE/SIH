from typing import Optional
from datetime import datetime
from app.schemas.common import CamelModel


class AppointmentBase(CamelModel):
    patient_id: str
    doctor_name: str
    specialty: str
    clinic_or_hospital: str
    location: str
    date_str: str
    time: str
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentResponse(AppointmentBase):
    id: str
    created_at: datetime
