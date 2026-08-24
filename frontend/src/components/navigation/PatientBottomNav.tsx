import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Calendar, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export const PatientBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { playChime } = useAccessibility();

  const navItems = [
    { to: '/patient', label: t('nav.home'), icon: Home, exact: true },
    { to: '/patient/play', label: t('nav.play'), icon: Gamepad2 },
    { to: '/patient/today', label: t('nav.today'), icon: Calendar },
    { to: '/patient/progress', label: t('nav.progress'), icon: TrendingUp },
    { to: '/patient/memories', label: t('nav.memories'), icon: ImageIcon },
  ];

  return (
    <nav
      aria-label="Patient Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c352c]/90 backdrop-blur-2xl border-t border-emerald-500/25 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] px-2 py-2 safe-area-pb"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-5 gap-1 sm:gap-2">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => playChime('click')}
            className={({ isActive }) =>
              `min-h-[58px] touch-target-senior flex flex-col items-center justify-center rounded-2xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] font-bold scale-[1.03] border border-emerald-300/40'
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white font-semibold'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform ${
                    isActive ? 'scale-110 text-white' : 'text-emerald-300/70'
                  }`}
                />
                <span className="text-xs sm:text-sm mt-0.5 tracking-tight line-clamp-1">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
