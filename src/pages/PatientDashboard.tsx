import React, { useState, useEffect } from 'react';
import {
  User,
  HeartPulse,
  Calendar,
  Clock,
  Pill,
  FileText,
  Activity,
  Bot,
  Video,
  Stethoscope,
  AlertCircle,
  Plus,
  CheckCircle2,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Patient, Appointment, Consultation, Prescription, MedicineReminder, HealthRecord } from '../types';
import { api } from '../services/api';

interface PatientDashboardProps {
  patient: Patient | null;
  onNavigate: (page: string, params?: any) => void;
  onTriggerAlarm: (reminder: MedicineReminder) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  onNavigate,
  onTriggerAlarm,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const patientId = patient?.id || 1;

  useEffect(() => {
    fetchDashboardData();
  }, [patientId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appts, consults, rxs, rems, vitals] = await Promise.all([
        api.getAppointments({ patient_id: patientId }),
        api.getConsultations(patientId),
        api.getPrescriptions({ patient_id: patientId }),
        api.getMedicineReminders(patientId),
        api.getHealthRecords(patientId),
      ]);
      setAppointments(appts);
      setConsultations(consults);
      setPrescriptions(rxs);
      setReminders(rems);
      setHealthRecords(vitals);
    } catch (err) {
      console.error('Failed to load patient dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (apptId: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.cancelAppointment(apptId);
        fetchDashboardData();
      } catch (err) {
        alert('Could not cancel appointment.');
      }
    }
  };

  const handleToggleReminder = async (rem: MedicineReminder) => {
    try {
      await api.updateMedicineReminder(rem.id, { is_active: rem.is_active === 1 ? 0 : 1 });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const nextAppt = appointments.find((a) => a.status === 'Confirmed' || a.status === 'Pending');
  const latestVitals = healthRecords[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Header Dossier Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-teal-400/40">
              {patient?.name ? patient.name.substring(0, 1) : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{patient?.name || 'Alex Johnson'}</h1>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  Verified Patient
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1.5">
                <span>Age: <strong className="text-white">{patient?.age || 34} yrs</strong></span>
                <span>Gender: <strong className="text-white">{patient?.gender || 'Male'}</strong></span>
                <span>Blood: <strong className="text-amber-300">{patient?.blood_group || 'O+'}</strong></span>
                <span>Phone: <strong className="text-white">{patient?.phone || '+1 (555) 987-6543'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('book-appointment')}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>AI Triage Assistant</span>
            </button>
          </div>
        </div>

        {/* Medical History Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p>
            <strong className="text-slate-300">Clinical History & Allergies:</strong>{' '}
            {patient?.medical_history || 'Mild allergic rhinitis, family history of hypertension.'}
          </p>
          <span className="text-slate-400 text-[11px] shrink-0">
            Emergency Contact: {patient?.emergency_contact || 'Emily Johnson (+1 555-987-6544)'}
          </span>
        </div>
      </div>

      {/* Quick Action Matrix Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <button
          onClick={() => onNavigate('doctors')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Consult Doctor</h4>
          <p className="text-[11px] text-slate-500">50+ Specialists</p>
        </button>

        <button
          onClick={() => onNavigate('book-appointment')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Book Visit</h4>
          <p className="text-[11px] text-slate-500">Video / Hospital</p>
        </button>

        <button
          onClick={() => onNavigate('prescriptions')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Prescriptions</h4>
          <p className="text-[11px] text-slate-500">{prescriptions.length} Active Records</p>
        </button>

        <button
          onClick={() => onNavigate('reminders')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Pill Alarm</h4>
          <p className="text-[11px] text-slate-500">{reminders.length} Daily Doses</p>
        </button>

        <button
          onClick={() => onNavigate('vitals')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Health Vitals</h4>
          <p className="text-[11px] text-slate-500">BP, Pulse, Glucose</p>
        </button>

        <button
          onClick={() => onNavigate('ml-prediction')}
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">ML Risk Score</h4>
          <p className="text-[11px] text-slate-500">Framingham Engine</p>
        </button>
      </div>

      {/* Main Grid: Left Consultations & Appointments, Right Vitals & Medicines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Next Upcoming Appointment Highlight */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Upcoming Appointments</span>
              </h3>
              <button
                onClick={() => onNavigate('book-appointment')}
                className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active appointments found. Schedule a video consult or clinic visit.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 3).map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{appt.doctor_name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          {appt.consultation_type}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            appt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {appt.doctor_specialization} • {appt.hospital_name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          {appt.appointment_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {appt.appointment_time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {appt.status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() =>
                              onNavigate('consultation', {
                                appointment_id: appt.id,
                                doctor_id: appt.doctor_id,
                                patient_id: patientId,
                              })
                            }
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Room</span>
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Previous Consultations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <span>Previous Clinical Consultations</span>
              </h3>
            </div>

            {consultations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No previous consultations recorded.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {consultations.map((c) => (
                  <div key={c.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{c.doctor_name || 'Dr. Sarah Jenkins'}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{c.consultation_date}</span>
                      </div>
                      <p className="text-xs font-medium text-teal-700 mt-0.5">Diagnosis: {c.diagnosis}</p>
                      {c.notes && <p className="text-xs text-slate-500 mt-1">{c.notes}</p>}
                    </div>
                    <button
                      onClick={() => onNavigate('prescriptions')}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                    >
                      View Rx
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Prescriptions List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Active E-Prescriptions</span>
              </h3>
              <button
                onClick={() => onNavigate('prescriptions')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                All Prescriptions
              </button>
            </div>

            <div className="space-y-3">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 bg-teal-50/40 border border-teal-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rx.diagnosis}</span>
                      <span className="text-[10px] text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded font-semibold">
                        Rx #{rx.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Prescribed by {rx.doctor_name}</p>
                    <p className="text-[11px] text-slate-500">
                      Medicines: {rx.medicines?.map((m) => m.medicine_name).join(', ') || 'Medications listed'}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('prescriptions', { prescription_id: rx.id })}
                    className="px-3.5 py-1.5 bg-white hover:bg-teal-50 text-teal-700 border border-teal-300 rounded-lg text-xs font-bold shrink-0 shadow-2xs"
                  >
                    View Official Rx
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Medicine Reminders */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Today's Medicine Schedule</span>
              </h3>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{rem.medicine_name}</span>
                      <span className="text-[10px] font-normal text-slate-500">({rem.dosage})</span>
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="text-teal-700 font-semibold">{rem.reminder_time}</span>
                      <span>•</span>
                      <span>{rem.before_after_food}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onTriggerAlarm(rem)}
                      className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-bold"
                      title="Test Audio Alarm"
                    >
                      Test Ring
                    </button>
                    <button
                      onClick={() => handleToggleReminder(rem)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        rem.is_active ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'
                      }`}
                      title={rem.is_active ? 'Active' : 'Disabled'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Latest Vitals Snapshot</span>
              </h3>
              <button
                onClick={() => onNavigate('vitals')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Log / History
              </button>
            </div>

            {latestVitals ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px]">Blood Pressure</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {latestVitals.systolic_bp}/{latestVitals.diastolic_bp}{' '}
                    <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px]">Heart Rate</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {latestVitals.heart_rate} <span className="text-[10px] font-normal text-slate-500">bpm</span>
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px]">Blood Glucose</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {latestVitals.blood_glucose}{' '}
                    <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px]">Oxygen (SpO2)</span>
                  <p className="text-sm font-extrabold text-teal-700 mt-0.5">
                    {latestVitals.oxygen_saturation || 98}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No vitals logged yet.</p>
            )}

            <button
              onClick={() => onNavigate('vitals')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Record Today's Vitals
            </button>
          </div>

          {/* Emergency Rapid Contact Pill */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Emergency Preparedness</span>
            </div>
            <p className="text-rose-700 text-[11px] leading-relaxed">
              Your registered emergency contact will be notified automatically if an emergency triage dispatch is initiated.
            </p>
            <button
              onClick={() => onNavigate('emergency')}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs"
            >
              Emergency SOS Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
