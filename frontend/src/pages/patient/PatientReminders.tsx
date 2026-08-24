import React, { useState, useEffect } from 'react';
import {
  Pill,
  Droplets,
  Brain,
  Calendar,
  Users,
  Plus,
  CheckCircle2,
  BellRing,
  Trash2,
  RotateCw,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { reminderService } from '../../services';
import type { Reminder, ReminderType } from '../../types';

export const PatientReminders: React.FC = () => {
  const { activePatient } = useAuth();
  const { t } = useLanguage();
  const { playChime } = useAccessibility();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New reminder form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReminderType>('medication');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newInstruction, setNewInstruction] = useState('');

  const loadReminders = async () => {
    if (activePatient?.id) {
      const list = await reminderService.getReminders(activePatient.id);
      setReminders(list);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [activePatient?.id]);

  const handleComplete = async (id: string) => {
    playChime('success');
    const updated = await reminderService.markAsTaken(id);
    setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleSnooze = async (id: string) => {
    playChime('click');
    const updated = await reminderService.snoozeReminder(id);
    setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleDelete = async (id: string) => {
    playChime('click');
    await reminderService.deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !newTitle.trim()) return;

    playChime('success');
    const created = await reminderService.createReminder({
      patientId: activePatient.id,
      title: newTitle,
      type: newType,
      time: newTime,
      timeOfDay: 'morning',
      dosageOrInstruction: newInstruction,
      status: 'pending',
      scheduledForDate: new Date().toISOString().split('T')[0],
    });

    setReminders((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewInstruction('');
  };

  const filteredReminders = reminders.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'medication':
        return Pill;
      case 'hydration':
        return Droplets;
      case 'activity':
        return Brain;
      case 'appointment':
        return Calendar;
      case 'family':
        return Users;
      default:
        return BellRing;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
            {t('reminders.title')} 🔔
          </h1>
          <p className="text-stone-600 text-lg">{t('reminders.subtitle')}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>{t('reminders.addReminder')}</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'all', label: t('reminders.all') },
          { id: 'medication', label: t('reminders.medication') },
          { id: 'hydration', label: t('reminders.hydration') },
          { id: 'activity', label: t('reminders.activity') },
          { id: 'family', label: t('reminders.family') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playChime('click');
              setActiveFilter(tab.id);
            }}
            className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#0F4C3A] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <Card variant="sand" className="p-8 text-center text-stone-500">
            <BellRing className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <p className="text-lg font-bold">{t('reminders.noReminders')}</p>
          </Card>
        ) : (
          filteredReminders.map((rem) => {
            const Icon = getReminderIcon(rem.type);
            const isCompleted = rem.status === 'completed';
            const isSnoozed = rem.status === 'snoozed';

            return (
              <Card
                key={rem.id}
                variant="warm"
                className={`p-5 sm:p-6 border-2 transition-all ${
                  isCompleted
                    ? 'border-emerald-300/80 bg-emerald-50/30'
                    : isSnoozed
                    ? 'border-amber-300/80 bg-amber-50/40'
                    : 'border-[#E2D8C3]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-[#0F4C3A]'
                          : isSnoozed
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#E7F3ED] text-[#0F4C3A]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          {rem.time}
                        </span>
                        <span className="text-xs font-bold capitalize text-stone-500">
                          {rem.type}
                        </span>
                        {isSnoozed && (
                          <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                            Snoozed
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-xl font-bold mt-1 ${
                          isCompleted ? 'line-through text-stone-500' : 'text-stone-900'
                        }`}
                      >
                        {rem.title}
                      </h3>
                      {rem.dosageOrInstruction && (
                        <p className="text-sm text-stone-600 mt-0.5">
                          {rem.dosageOrInstruction}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!isCompleted && (
                      <>
                        <button
                          onClick={() => handleSnooze(rem.id)}
                          className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-300 transition-colors cursor-pointer flex items-center gap-1"
                          title="Snooze for 15 minutes"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>{t('reminders.snooze')}</span>
                        </button>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleComplete(rem.id)}
                          className="text-sm px-4"
                        >
                          {t('reminders.markCompleted')}
                        </Button>
                      </>
                    )}
                    {isCompleted && (
                      <span className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Done
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Daily Reminder"
        subtitle="Schedule a gentle alert for medicine, water, or family check-in."
      >
        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Afternoon Herbal Tea & Blood Sugar"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ReminderType)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900 bg-white"
              >
                <option value="medication">Medication</option>
                <option value="hydration">Hydration</option>
                <option value="activity">Cognitive Activity</option>
                <option value="appointment">Appointment</option>
                <option value="family">Family / Social</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Scheduled Time
              </label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Instructions / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Take 1 tablet with warm milk"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-[#0F4C3A] outline-none font-semibold text-stone-900"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Reminder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
