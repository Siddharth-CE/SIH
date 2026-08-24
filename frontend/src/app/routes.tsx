import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from '../pages/landing/LandingPage';
import { PatientHome } from '../pages/patient/PatientHome';
import { GameSelection } from '../pages/patient/GameSelection';
import { TodayRoutine } from '../pages/patient/TodayRoutine';
import { PatientReminders } from '../pages/patient/PatientReminders';
import { PatientProgress } from '../pages/patient/PatientProgress';
import { MemoryBoard } from '../pages/patient/MemoryBoard';
import { PatientSettings } from '../pages/patient/PatientSettings';
import { CaregiverDashboard } from '../pages/caregiver/CaregiverDashboard';
import { CaregiverPatientDetail } from '../pages/caregiver/CaregiverPatientDetail';
import { CaregiverAlerts } from '../pages/caregiver/CaregiverAlerts';
import { HealthcareDashboard } from '../pages/healthcare/HealthcareDashboard';
import { HealthcareAnalytics } from '../pages/healthcare/HealthcareAnalytics';

// Games
import { MemoryMatch } from '../components/games/MemoryMatch';
import { ObjectRecall } from '../components/games/ObjectRecall';
import { PatternRecognition } from '../components/games/PatternRecognition';
import { AttentionTap } from '../components/games/AttentionTap';
import { EmotionRecognition } from '../components/games/EmotionRecognition';
import { RoutineRecall } from '../components/games/RoutineRecall';

// Layout elements
import { TopBar } from '../components/navigation/TopBar';
import { PatientBottomNav } from '../components/navigation/PatientBottomNav';
import { AccessibilityBar } from '../components/accessibility/AccessibilityBar';
import { ThreeBackground } from '../components/ui/ThreeBackground';

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isPatientRoute = location.pathname.startsWith('/patient');
  const isGameActive = location.pathname.startsWith('/patient/game/');

  return (
    <div className="min-h-screen flex flex-col premium-bg-canvas text-stone-100 relative overflow-x-hidden selection:bg-emerald-400 selection:text-black">
      {/* 3D Animated WebGL Moving Canvas */}
      <ThreeBackground />

      {/* Top Accessibility & Demo Toggle Strip */}
      <AccessibilityBar />

      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Page Content */}
      <main className="flex-1 relative z-10">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Patient Experience */}
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/patient/play" element={<GameSelection />} />
          <Route path="/patient/game/memory" element={<MemoryMatch />} />
          <Route path="/patient/game/recall" element={<ObjectRecall />} />
          <Route path="/patient/game/pattern" element={<PatternRecognition />} />
          <Route path="/patient/game/attention" element={<AttentionTap />} />
          <Route path="/patient/game/emotion" element={<EmotionRecognition />} />
          <Route path="/patient/game/routine" element={<RoutineRecall />} />
          <Route path="/patient/today" element={<TodayRoutine />} />
          <Route path="/patient/reminders" element={<PatientReminders />} />
          <Route path="/patient/progress" element={<PatientProgress />} />
          <Route path="/patient/memories" element={<MemoryBoard />} />
          <Route path="/patient/settings" element={<PatientSettings />} />

          {/* Caregiver Portal */}
          <Route path="/caregiver" element={<CaregiverDashboard />} />
          <Route path="/caregiver/patient/:id" element={<CaregiverPatientDetail />} />
          <Route path="/caregiver/reminders" element={<PatientReminders />} />
          <Route path="/caregiver/alerts" element={<CaregiverAlerts />} />

          {/* Healthcare Worker Portal */}
          <Route path="/healthcare" element={<HealthcareDashboard />} />
          <Route path="/healthcare/patients" element={<HealthcareDashboard />} />
          <Route path="/healthcare/analytics" element={<HealthcareAnalytics />} />

          {/* Fallback to Landing */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {/* Senior-first Bottom Navigation (Visible on patient screens, except during full-focus game play) */}
      {isPatientRoute && !isGameActive && <PatientBottomNav />}
    </div>
  );
};
