import React, { useState, useEffect } from 'react';
import {
  Pill,
  Clock,
  Plus,
  CheckCircle2,
  BellRing,
  Volume2,
  Trash2,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { MedicineReminder, Patient } from '../types';
import { api } from '../services/api';

interface MedicineReminderPageProps {
  patient: Patient | null;
  onTriggerAlarm: (reminder: MedicineReminder) => void;
}

export const MedicineReminderPage: React.FC<MedicineReminderPageProps> = ({
  patient,
  onTriggerAlarm,
}) => {
  const patientId = patient?.id || 1;
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Reminder Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1 Tablet (500mg)');
  const [medTime, setMedTime] = useState('08:00 AM');
  const [medFreq, setMedFreq] = useState('Daily');
  const [medMeal, setMedMeal] = useState('After Meal');

  useEffect(() => {
    loadReminders();
  }, [patientId]);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await api.getMedicineReminders(patientId);
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (rem: MedicineReminder) => {
    try {
      await api.updateMedicineReminder(rem.id, { is_active: rem.is_active === 1 ? 0 : 1 });
      loadReminders();
    } catch (err) {
      alert('Failed to toggle reminder.');
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    try {
      await api.createMedicineReminder({
        patient_id: patientId,
        medicine_name: medName.trim(),
        dosage: medDosage,
        reminder_time: medTime,
        frequency: medFreq,
        before_after_food: medMeal,
        is_active: 1,
      });

      setIsModalOpen(false);
      setMedName('');
      loadReminders();
      alert('New medicine reminder scheduled!');
    } catch (err) {
      alert('Failed to add reminder.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <Pill className="w-3.5 h-3.5" />
            <span>Medication Compliance Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Medicine Schedule & Alarms</h1>
          <p className="text-xs text-slate-300 mt-1">
            Automated alerts with sound synthesis notifications, meal-time reminders, and daily adherence logging.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dose Reminder</span>
        </button>
      </div>

      {/* Adherence Streak Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Compliance Adherence</span>
            <p className="text-xl font-extrabold text-slate-900">96.8%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Daily Doses</span>
            <p className="text-xl font-extrabold text-teal-700">{reminders.filter((r) => r.is_active).length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Consecutive Streak</span>
            <p className="text-xl font-extrabold text-slate-900">14 Days Clean</p>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Scheduled Daily Medication Timeline</span>
          </h3>
          <span className="text-xs text-slate-500">5-minute pre-alerts enabled</span>
        </div>

        <div className="space-y-4">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                rem.is_active
                  ? 'bg-slate-50/70 border-slate-200 hover:border-teal-300'
                  : 'bg-slate-100/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{rem.medicine_name}</h4>
                    <span className="text-xs font-semibold text-slate-500">({rem.dosage})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      {rem.frequency}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                    <span className="font-bold text-teal-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {rem.reminder_time}
                    </span>
                    <span>•</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      {rem.before_after_food}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTriggerAlarm(rem)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Test Alarm Ring</span>
                </button>

                <button
                  onClick={() => handleToggle(rem)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    rem.is_active
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {rem.is_active ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <span>Add Medication Dose</span>
              </h3>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Metformin / Amlodipine"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Dosage</label>
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Dose Time</label>
                  <input
                    type="text"
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    placeholder="e.g. 08:00 AM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Frequency</label>
                  <select
                    value={medFreq}
                    onChange={(e) => setMedFreq(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Meal Relation</label>
                  <select
                    value={medMeal}
                    onChange={(e) => setMedMeal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="After Meal">After Meal</option>
                    <option value="Before Meal">Before Meal</option>
                    <option value="With Meal">With Meal</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Save Dose Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
