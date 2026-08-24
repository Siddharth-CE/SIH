from typing import List
from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.repositories.appointment_repo import AppointmentRepository
from app.schemas.appointment import AppointmentCreate
from app.core.exceptions import NotFoundException


class AppointmentService:
    def __init__(self, db: Session):
        self.db = db
        self.appointment_repo = AppointmentRepository(db)

    def get_appointments(self, patient_id: str) -> List[Appointment]:
        return self.appointment_repo.get_by_patient(patient_id)

    def create_appointment(self, appointment_data: AppointmentCreate) -> Appointment:
        return self.appointment_repo.create(appointment_data)

    def delete_appointment(self, id: str) -> bool:
        return self.appointment_repo.delete(id)
