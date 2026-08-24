import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Patient, Caregiver, HealthcareWorker } from '../types';
import { patientService } from '../services';
import { INITIAL_CAREGIVERS, INITIAL_HEALTHCARE_WORKERS } from '../data/mock/initialData';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePatient: Patient | null;
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  caregiver: Caregiver;
  healthcareWorker: HealthcareWorker;
  allPatients: Patient[];
  refreshPatients: () => Promise<void>;
  updateCurrentPatient: (data: Partial<Patient>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ner_cognitive_role');
    return (saved as UserRole) || 'patient';
  });

  const [activePatientId, setActivePatientIdState] = useState<string>(() => {
    const saved = localStorage.getItem('ner_cognitive_patient_id');
    return saved || 'pat-101';
  });

  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  const [caregiver] = useState<Caregiver>(INITIAL_CAREGIVERS[0]);
  const [healthcareWorker] = useState<HealthcareWorker>(INITIAL_HEALTHCARE_WORKERS[0]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('ner_cognitive_role', newRole);
  };

  const setActivePatientId = (id: string) => {
    setActivePatientIdState(id);
    localStorage.setItem('ner_cognitive_patient_id', id);
  };

  const refreshPatients = async () => {
    try {
      const patients = await patientService.getPatients();
      setAllPatients(patients);
      const current = patients.find((p) => p.id === activePatientId) || patients[0] || null;
      setActivePatient(current);
    } catch {
      // IndexedDB loading fallback
    }
  };

  useEffect(() => {
    refreshPatients();
  }, [activePatientId]);

  const updateCurrentPatient = async (data: Partial<Patient>) => {
    if (!activePatient) return;
    try {
      const updated = await patientService.updatePatient(activePatient.id, data);
      setActivePatient(updated);
      setAllPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error('Failed to update patient', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        activePatient,
        activePatientId,
        setActivePatientId,
        caregiver,
        healthcareWorker,
        allPatients,
        refreshPatients,
        updateCurrentPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
