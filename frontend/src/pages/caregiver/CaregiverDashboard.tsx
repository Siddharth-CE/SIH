import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { alertService } from '../../services';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';
import type { Patient, Alert } from '../../types';

export const CaregiverDashboard: React.FC = () => {
  const { allPatients, setActivePatientId, setRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    alertService.getAlerts().then(setAlerts);
  }, []);

  const handleSelectPatient = (patient: Patient) => {
    setActivePatientId(patient.id);
    navigate(`/caregiver/patient/${patient.id}`);
  };

  const handleLaunchPatientExperience = (patientId: string) => {
    setActivePatientId(patientId);
    setRole('patient');
    navigate('/patient');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Caregiver Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full w-fit mb-2">
            <Users className="w-3.5 h-3.5" /> Caregiver Telemetry Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
            {t('caregiver.title')}
          </h1>
          <p className="text-stone-600 text-lg sm:text-xl">
            {t('caregiver.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/caregiver/alerts')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Priority Alerts ({alerts.filter((a) => !a.resolved).length})</span>
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            {t('caregiver.totalPatients')}
          </div>
          <div className="text-3xl sm:text-4xl font-black text-stone-900">
            {allPatients.length}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All active today
          </div>
        </Card>

        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Medication Adherence
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0F4C3A]">
            92%
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-1">
            Across active cohort
          </div>
        </Card>

        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Daily Activities Done
          </div>
          <div className="text-3xl sm:text-4xl font-black text-stone-900">
            18 / 20
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            90% target reached
          </div>
        </Card>

        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Active Alerts
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-700">
            {alerts.filter((a) => !a.resolved).length}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-1">
            1 requires gentle hydration follow-up
          </div>
        </Card>
      </div>

      {/* Priority Alerts Feed */}
      {alerts.filter((a) => !a.resolved).length > 0 && (
        <div className="mb-8 bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-900 font-black text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Priority Care Alerts</span>
            </div>
            <button
              onClick={() => navigate('/caregiver/alerts')}
              className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
            >
              View all alerts →
            </button>
          </div>

          <div className="space-y-3">
            {alerts
              .filter((a) => !a.resolved)
              .slice(0, 2)
              .map((alt) => (
                <div
                  key={alt.id}
                  className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-stone-900 text-sm">
                        {alt.patientName}
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        {alt.severity}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-stone-700">{alt.message}</p>
                    {alt.actionRequired && (
                      <p className="text-xs text-amber-800 font-bold mt-1">
                        Action: {alt.actionRequired}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleSelectPatient(allPatients.find((p) => p.id === alt.patientId) || allPatients[0])}
                    className="text-xs font-bold shrink-0"
                  >
                    Inspect Patient
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Assigned Patient Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-stone-900">
            {t('caregiver.patientCards')}
          </h2>
          <span className="text-xs font-bold text-stone-500">
            Click card to view clinical logs & memory progress
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {allPatients.map((patient) => {
            const region = REGIONAL_PROFILES[patient.region];

            return (
              <Card
                key={patient.id}
                variant="warm"
                className="p-6 border-2 border-stone-200 hover:border-[#0F4C3A] transition-all flex flex-col justify-between cursor-pointer group"
                onClick={() => handleSelectPatient(patient)}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F4C3A] bg-[#E7F3ED] px-3 py-1 rounded-full border border-[#BDE0D0]">
                        {region.name} • {patient.stage} dementia
                      </span>
                      <h3 className="text-2xl font-black text-stone-900 mt-2 group-hover:text-[#0F4C3A] transition-colors">
                        {patient.name} ({patient.preferredName})
                      </h3>
                      <div className="text-xs text-stone-500 font-semibold mt-0.5">
                        {patient.age} {t('caregiver.ageYears')} • Contact: {patient.emergencyContact.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          patient.overallEngagement === 'high'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {patient.overallEngagement}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry row */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 my-4 text-center">
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 uppercase">Medication</div>
                      <div className="text-lg font-black text-[#0F4C3A]">
                        {patient.medicationAdherenceRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 uppercase">Hydration</div>
                      <div className="text-lg font-black text-blue-700">
                        {patient.hydrationCurrentGlasses}/{patient.hydrationGoalGlasses}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 uppercase">Streak</div>
                      <div className="text-lg font-black text-amber-700">
                        {patient.currentStreakDays}d
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-stone-700 mb-4 bg-white p-3 rounded-xl border border-stone-200">
                    "{patient.statusSummary}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 text-sm font-bold flex items-center justify-center gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPatient(patient);
                    }}
                  >
                    <span>View Analytics</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    className="text-xs font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchPatientExperience(patient.id);
                    }}
                    title="Launch patient UI for this patient"
                  >
                    Open as Patient
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
