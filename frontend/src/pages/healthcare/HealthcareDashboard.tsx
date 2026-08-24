import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { REGIONAL_PROFILES } from '../../data/mock/initialData';
import type { Patient } from '../../types';

export const HealthcareDashboard: React.FC = () => {
  const { allPatients, setActivePatientId, healthcareWorker } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'adherence' | 'age' | 'streak'>('adherence');

  const filteredPatients = allPatients
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        REGIONAL_PROFILES[p.region]?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
      const matchStage = selectedStage === 'all' || p.stage === selectedStage;

      return matchSearch && matchRegion && matchStage;
    })
    .sort((a, b) => {
      if (sortBy === 'adherence') return b.medicationAdherenceRate - a.medicationAdherenceRate;
      if (sortBy === 'age') return b.age - a.age;
      return b.currentStreakDays - a.currentStreakDays;
    });

  const highAdherenceCount = allPatients.filter((p) => p.medicationAdherenceRate >= 90).length;
  const needsAttentionCount = allPatients.filter(
    (p) => p.overallEngagement === 'needs_attention' || p.medicationAdherenceRate < 80
  ).length;

  const handleInspectPatient = (patient: Patient) => {
    setActivePatientId(patient.id);
    navigate(`/caregiver/patient/${patient.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28">
      {/* Clinic & Specialist Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full w-fit mb-2">
            <Stethoscope className="w-3.5 h-3.5" /> Clinical Cohort Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
            {healthcareWorker.name}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg">
            {healthcareWorker.designation} • {healthcareWorker.centerName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/healthcare/analytics')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Population Analytics</span>
          </Button>
        </div>
      </div>

      {/* Cohort Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Total Cohort
          </div>
          <div className="text-3xl sm:text-4xl font-black text-stone-900">
            {allPatients.length}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-1">
            Enrolled across 8 states
          </div>
        </Card>

        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            High Adherence (&gt;90%)
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#0F4C3A]">
            {highAdherenceCount} Patients
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            Optimal clinical stability
          </div>
        </Card>

        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Follow-Up Required
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-700">
            {needsAttentionCount} Patient
          </div>
          <div className="text-xs text-amber-800 font-semibold mt-1">
            ASHA home visit prompted
          </div>
        </Card>

        <Card variant="warm" className="p-5 border-2 border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Avg Cohort Engagement
          </div>
          <div className="text-3xl sm:text-4xl font-black text-blue-700">
            89.4%
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-1">
            Cognitive game active
          </div>
        </Card>
      </div>

      {/* Cohort Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by patient or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-sm font-semibold text-stone-900 outline-none focus:border-[#0F4C3A]"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-semibold text-stone-900 outline-none bg-white focus:border-[#0F4C3A]"
            >
              <option value="all">All NER Regions</option>
              {Object.values(REGIONAL_PROFILES).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-semibold text-stone-900 outline-none bg-white focus:border-[#0F4C3A]"
            >
              <option value="all">All Dementia Stages</option>
              <option value="early">Early Stage</option>
              <option value="mild">Mild Stage</option>
              <option value="moderate">Moderate Stage</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 text-sm font-semibold text-stone-900 outline-none bg-white focus:border-[#0F4C3A]"
            >
              <option value="adherence">Sort: Medication Adherence</option>
              <option value="streak">Sort: Activity Streak</option>
              <option value="age">Sort: Patient Age</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cohort Clinical Table */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-black uppercase tracking-wider text-stone-500">
                <th className="p-4 pl-6">Patient Name</th>
                <th className="p-4">Region / State</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Adherence</th>
                <th className="p-4">Hydration</th>
                <th className="p-4">Engagement</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredPatients.map((p) => {
                const region = REGIONAL_PROFILES[p.region];

                return (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-extrabold text-stone-900 text-base">{p.name}</div>
                      <div className="text-xs text-stone-500">
                        {p.preferredName} • {p.age} yrs
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-stone-800">{region.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full text-xs">
                        {p.stage}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-black text-base ${
                          p.medicationAdherenceRate >= 90 ? 'text-[#0F4C3A]' : 'text-amber-700'
                        }`}
                      >
                        {p.medicationAdherenceRate}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-stone-800">
                        {p.hydrationCurrentGlasses}/{p.hydrationGoalGlasses} glasses
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                          p.overallEngagement === 'high'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {p.overallEngagement}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => handleInspectPatient(p)}
                        className="text-xs font-bold"
                      >
                        Clinical File →
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
