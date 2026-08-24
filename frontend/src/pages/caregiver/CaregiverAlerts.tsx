import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { alertService } from '../../services';
import type { Alert } from '../../types';

export const CaregiverAlerts: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    alertService.getAlerts().then(setAlerts);
  }, []);

  const handleResolve = async (id: string) => {
    const updated = await alertService.resolveAlert(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/caregiver')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
        Priority Alerts & Follow-Ups 🚨
      </h1>
      <p className="text-stone-600 text-lg mb-8">
        Adherence exceptions and hydration flags requiring gentle caregiver assistance.
      </p>

      <div className="space-y-4">
        {alerts.map((alt) => (
          <Card
            key={alt.id}
            variant="warm"
            className={`p-6 border-2 transition-all ${
              alt.resolved
                ? 'border-stone-200 opacity-60 bg-stone-50'
                : alt.severity === 'warning'
                ? 'border-amber-300 bg-amber-50/50'
                : 'border-stone-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-stone-900 text-lg">
                    {alt.patientName}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      alt.severity === 'warning'
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-emerald-100 text-emerald-950'
                    }`}
                  >
                    {alt.severity}
                  </span>
                  {alt.resolved && (
                    <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                      Resolved
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-stone-900 mt-1">{alt.title}</h3>
                <p className="text-stone-700 text-base mt-1">{alt.message}</p>

                {alt.actionRequired && (
                  <div className="mt-3 bg-white p-3 rounded-xl border border-amber-200 text-sm font-bold text-amber-900">
                    Suggested Action: {alt.actionRequired}
                  </div>
                )}
              </div>

              {!alt.resolved ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleResolve(alt.id)}
                  className="shrink-0"
                >
                  Mark Resolved
                </Button>
              ) : (
                <span className="text-xs font-bold text-stone-500 shrink-0">
                  ✓ Action Logged
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
