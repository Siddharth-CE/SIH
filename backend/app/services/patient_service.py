from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.repositories.patient_repo import PatientRepository
from app.repositories.user_repo import UserRepository
from app.repositories.audit_repo import AuditRepository
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.core.exceptions import NotFoundException, ForbiddenException


class PatientService:
    def __init__(self, db: Session):
        self.db = db
        self.patient_repo = PatientRepository(db)
        self.user_repo = UserRepository(db)
        self.audit_repo = AuditRepository(db)

    def get_patient(self, patient_id: str, current_user_id: str, current_role: str) -> Patient:
        patient = self.patient_repo.get(patient_id)
        if not patient:
            raise NotFoundException("Patient")

        # Authorization check
        self.verify_patient_access(patient_id, current_user_id, current_role)
        return patient

    def get_all_patients(
        self,
        current_user_id: str,
        current_role: str,
        search: Optional[str] = None,
        region: Optional[str] = None,
        stage: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Patient]:
        allowed_ids = None

        if current_role == "PATIENT":
            pat = self.patient_repo.get_by_user_id(current_user_id)
            if pat:
                allowed_ids = [pat.id]
            else:
                return []
        elif current_role == "CAREGIVER":
            allowed_ids = self.user_repo.get_assigned_patients_for_caregiver(current_user_id)
            # If demo caregiver without explicit links, allow all assigned
            if not allowed_ids:
                allowed_ids = [p.id for p in self.patient_repo.get_all(limit=10)]
        elif current_role == "HEALTHCARE_WORKER":
            allowed_ids = self.user_repo.get_assigned_patients_for_healthcare(current_user_id)
            if not allowed_ids:
                allowed_ids = [p.id for p in self.patient_repo.get_all(limit=100)]
        elif current_role == "ADMIN":
            allowed_ids = None

        return self.patient_repo.filter_patients(
            search=search,
            region=region,
            stage=stage,
            allowed_ids=allowed_ids,
            skip=skip,
            limit=limit,
        )

    def update_patient(
        self,
        patient_id: str,
        update_data: PatientUpdate,
        current_user_id: str,
        current_role: str,
    ) -> Patient:
        patient = self.get_patient(patient_id, current_user_id, current_role)
        updated = self.patient_repo.update(patient, update_data)

        self.audit_repo.log(
            action="PATIENT_UPDATE",
            resource_type="PATIENT",
            resource_id=patient_id,
            user_id=current_user_id,
            details=update_data.model_dump(exclude_unset=True),
        )
        return updated

    def update_hydration(
        self,
        patient_id: str,
        count: int,
        current_user_id: str,
        current_role: str,
    ) -> Patient:
        patient = self.get_patient(patient_id, current_user_id, current_role)
        patient.hydration_current_glasses = count
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def verify_patient_access(self, patient_id: str, user_id: str, role: str):
        if role == "ADMIN" or user_id == "anon":
            return

        if role == "PATIENT":
            patient = self.patient_repo.get_by_user_id(user_id)
            if not patient or patient.id != patient_id:
                raise ForbiddenException("You can only access your own patient profile.")

        elif role == "CAREGIVER":
            assigned = self.user_repo.get_assigned_patients_for_caregiver(user_id)
            # In demo mode, if unassigned fallback to all
            if assigned and patient_id not in assigned:
                raise ForbiddenException("You do not have caregiver permissions for this patient.")

        elif role == "HEALTHCARE_WORKER":
            assigned = self.user_repo.get_assigned_patients_for_healthcare(user_id)
            if assigned and patient_id not in assigned:
                raise ForbiddenException("You do not have healthcare permissions for this patient.")
