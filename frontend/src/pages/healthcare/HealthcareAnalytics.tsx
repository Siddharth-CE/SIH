import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, Badge } from '../../components/ui/Card';
import { WeeklyEngagementChart } from '../../components/charts/EngagementChart';

export const HealthcareAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/healthcare')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cohort List</span>
        </Button>

        <Badge variant="blue" size="md">
          Longitudinal Clinical Research
        </Badge>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2">
          Population Cognitive Analytics 📊
        </h1>
        <p className="text-stone-600 text-lg">
          Aggregate engagement and adherence telemetry across Northeast India rural health centers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <WeeklyEngagementChart />

        <Card variant="warm" className="p-6 border-2 border-stone-200">
          <h3 className="text-xl font-bold text-stone-900 mb-4">
            Regional State Adherence Distribution
          </h3>
          <div className="space-y-3">
            {[
              { state: 'Assam', rate: 94, count: 18 },
              { state: 'Meghalaya', rate: 88, count: 12 },
              { state: 'Manipur', rate: 85, count: 14 },
              { state: 'Nagaland', rate: 91, count: 9 },
              { state: 'Sikkim', rate: 96, count: 7 },
            ].map((st) => (
              <div key={st.state} className="bg-white p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between text-sm font-bold text-stone-800 mb-1.5">
                  <span>{st.state} ({st.count} patients)</span>
                  <span className="text-[#0F4C3A] font-extrabold">{st.rate}% Adherence</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F4C3A] rounded-full"
                    style={{ width: `${st.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="sand" className="p-6 border border-stone-300">
        <div className="flex items-start gap-3 text-stone-600 text-sm leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-900 block mb-0.5">
              Clinical Telemetry Privacy & Data Sovereignity
            </span>
            Patient identifiers are de-identified in aggregate clinical analytics. Data synchronization respects offline cryptographic store-and-forward standards suitable for rural community health networks in Northeast India.
          </div>
        </div>
      </Card>
    </div>
  );
};
