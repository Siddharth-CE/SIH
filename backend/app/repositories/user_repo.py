from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.relationships import CaregiverPatient, HealthcarePatient
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_phone(self, phone: str) -> Optional[User]:
        return self.db.query(User).filter(User.phone == phone).first()

    def get_by_identifier(self, identifier: str) -> Optional[User]:
        return self.db.query(User).filter(
            (User.email == identifier) | (User.phone == identifier) | (User.id == identifier)
        ).first()

    def get_assigned_patients_for_caregiver(self, caregiver_id: str) -> List[str]:
        links = self.db.query(CaregiverPatient).filter(
            CaregiverPatient.caregiver_id == caregiver_id
        ).all()
        return [l.patient_id for l in links]

    def get_assigned_patients_for_healthcare(self, healthcare_worker_id: str) -> List[str]:
        links = self.db.query(HealthcarePatient).filter(
            HealthcarePatient.healthcare_worker_id == healthcare_worker_id
        ).all()
        return [l.patient_id for l in links]
