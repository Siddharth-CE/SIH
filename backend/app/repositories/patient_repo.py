from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.repositories.base import BaseRepository


class PatientRepository(BaseRepository[Patient]):
    def __init__(self, db: Session):
        super().__init__(Patient, db)

    def get_by_user_id(self, user_id: str) -> Optional[Patient]:
        return self.db.query(Patient).filter(Patient.user_id == user_id).first()

    def get_by_ids(self, patient_ids: List[str]) -> List[Patient]:
        return self.db.query(Patient).filter(Patient.id.in_(patient_ids)).all()

    def filter_patients(
        self,
        search: Optional[str] = None,
        region: Optional[str] = None,
        stage: Optional[str] = None,
        allowed_ids: Optional[List[str]] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Patient]:
        query = self.db.query(Patient)

        if allowed_ids is not None:
            query = query.filter(Patient.id.in_(allowed_ids))

        if region and region != "all":
            query = query.filter(Patient.region == region)

        if stage and stage != "all":
            query = query.filter(Patient.stage == stage)

        if search:
            search_fmt = f"%{search.lower()}%"
            query = query.filter(
                (Patient.name.ilike(search_fmt))
                | (Patient.preferred_name.ilike(search_fmt))
                | (Patient.id.ilike(search_fmt))
                | (Patient.region.ilike(search_fmt))
            )

        return query.offset(skip).limit(limit).all()
