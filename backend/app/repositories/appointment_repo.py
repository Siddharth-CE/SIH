from typing import List
from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.repositories.base import BaseRepository


class AppointmentRepository(BaseRepository[Appointment]):
    def __init__(self, db: Session):
        super().__init__(Appointment, db)

    def get_by_patient(self, patient_id: str) -> List[Appointment]:
        return (
            self.db.query(Appointment)
            .filter(Appointment.patient_id == patient_id)
            .order_by(Appointment.datetime_scheduled.asc())
            .all()
        )
