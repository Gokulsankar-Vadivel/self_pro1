import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  Video,
  FileText,
  Check,
  X,
  Plus,
  Activity,
  BrainCircuit,
  Pill,
  Send,
  AlertCircle,
  CheckCircle2,
  Building2,
  Phone,
} from 'lucide-react';
import { Doctor, Appointment, Prescription, MedicineItem, Patient } from '../types';
import { api } from '../services/api';

interface DoctorDashboardProps {
  doctor: Doctor | null;
  onNavigate: (page: string, params?: any) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctor, onNavigate }) => {
  const doctorId = doctor?.id || 1;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  // E-Prescription Modal State
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedApptForRx, setSelectedApptForRx] = useState<Appointment | null>(null);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxAdvice, setRxAdvice] = useState('');
  const [rxMedicines, setRxMedicines] = useState<MedicineItem[]>([
    {
      medicine_name: 'Amlodipine Besylate',
      medicine_type: 'Tablet',
      dosage: '5 mg',
      frequency: 'Once daily (OD)',
      duration: '30 Days',
      timing: 'Morning (09:00 AM)',
      disease_use: 'Hypertension',
      side_effects: 'Mild ankle edema, dizziness',
    },
  ]);

  useEffect(() => {
    fetchDoctorData();
  }, [doctorId]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [appts, rxs] = await Promise.all([
        api.getAppointments({ doctor_id: doctorId }),
        api.getPrescriptions({ doctor_id: doctorId }),
      ]);
      setAppointments(appts);
      setPrescriptions(rxs);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (apptId: number, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      await api.updateAppointmentStatus(apptId, status);
      fetchDoctorData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleAddMedicineRow = () => {
    setRxMedicines([
      ...rxMedicines,
      {
        medicine_name: '',
        medicine_type: 'Tablet',
        dosage: '500 mg',
        frequency: 'Twice daily (BD)',
        duration: '7 Days',
        timing: 'After Food (01:00 PM & 08:00 PM)',
        disease_use: '',
        side_effects: '',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxMedicines(rxMedicines.filter((_, i) => i !== index));
  };

  const handleUpdateMedicineField = (index: number, field: keyof MedicineItem, val: string) => {
    const updated = [...rxMedicines];
    updated[index] = { ...updated[index], [field]: val };
    setRxMedicines(updated);
  };

  const handleOpenRxModal = (appt: Appointment) => {
    setSelectedApptForRx(appt);
    setRxDiagnosis(appt.symptoms || 'Clinical Examination Follow-up');
    setRxAdvice('Drink plenty of fluids, limit sodium intake, and monitor blood pressure morning and evening.');
    setIsPrescriptionModalOpen(true);
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptForRx) return;

    try {
      await api.createPrescription({
        patient_id: selectedApptForRx.patient_id,
        doctor_id: doctorId,
        diagnosis: rxDiagnosis,
        advice: rxAdvice,
        medicines: rxMedicines,
      });

      // Mark appointment as completed
      await api.updateAppointmentStatus(selectedApptForRx.id, 'Completed');

      setIsPrescriptionModalOpen(false);
      fetchDoctorData();
      alert('E-Prescription issued and transmitted to patient successfully!');
    } catch (err) {
      alert('Failed to create prescription.');
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={doctor?.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
            alt={doctor?.name || 'Doctor'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{doctor?.name || 'Dr. Sarah Jenkins, MD'}</h1>
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-teal-500/30 text-teal-300 border border-teal-400/40">
                {doctor?.specialization || 'Cardiology'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {doctor?.qualifications || 'MBBS, MD, FACC'} • {doctor?.experience_years || 14} Years Experience • {doctor?.hospital_name || 'Metro General Hospital'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Consultation Fee</p>
            <p className="text-lg font-extrabold text-teal-300">${doctor?.consultation_fee || 45} / Session</p>
          </div>
          <button
            onClick={() => onNavigate('consultation')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Open Teleconsult Room</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pending Requests</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingAppointments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Confirmed Today</span>
          <p className="text-2xl font-extrabold text-teal-600 mt-1">{confirmedAppointments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">E-Prescriptions Issued</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{prescriptions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Patient Satisfaction</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">99.4%</p>
        </div>
      </div>

      {/* Patient Appointments Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Patient Consultation Schedule</span>
          </h3>
          <span className="text-xs text-slate-500">Total: {appointments.length} Consultations</span>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No scheduled appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-900">{appt.patient_name || 'Patient'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {appt.consultation_type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : appt.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : appt.status === 'Completed'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <strong>Reported Symptoms / Chief Complaint:</strong> {appt.symptoms || 'General Checkup'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {appt.appointment_date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {appt.appointment_time}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {appt.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'Confirmed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {appt.status === 'Confirmed' && (
                    <>
                      <button
                        onClick={() =>
                          onNavigate('consultation', {
                            appointment_id: appt.id,
                            doctor_id: doctorId,
                            patient_id: appt.patient_id,
                          })
                        }
                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Start Video Call</span>
                      </button>

                      <button
                        onClick={() => handleOpenRxModal(appt)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Write E-Prescription</span>
                      </button>
                    </>
                  )}

                  {appt.status === 'Completed' && (
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Prescription Issued</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Prescription Modal */}
      {isPrescriptionModalOpen && selectedApptForRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Clinical E-Prescription Studio
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Issue Digital Rx for {selectedApptForRx.patient_name}
                </h3>
              </div>
              <button
                onClick={() => setIsPrescriptionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPrescription} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Diagnosis & Assessment *
                </label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Hypertension Stage 1 / Allergic Bronchitis"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Medicine rows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Prescribed Medications ({rxMedicines.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {rxMedicines.map((med, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-800">Drug #{idx + 1}</span>
                        {rxMedicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicineRow(idx)}
                            className="text-rose-600 text-xs font-semibold hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Medicine Name</label>
                          <input
                            type="text"
                            value={med.medicine_name}
                            onChange={(e) => handleUpdateMedicineField(idx, 'medicine_name', e.target.value)}
                            placeholder="e.g. Amoxicillin / Metformin"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Type</label>
                          <select
                            value={med.medicine_type}
                            onChange={(e) => handleUpdateMedicineField(idx, 'medicine_type', e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          >
                            <option value="Tablet">Tablet</option>
                            <option value="Capsule">Capsule</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                            <option value="Inhaler">Inhaler</option>
                            <option value="Drops">Drops</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMedicineField(idx, 'dosage', e.target.value)}
                            placeholder="e.g. 500 mg"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Frequency</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => handleUpdateMedicineField(idx, 'frequency', e.target.value)}
                            placeholder="e.g. Twice daily (BD)"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleUpdateMedicineField(idx, 'duration', e.target.value)}
                            placeholder="e.g. 7 Days / 1 Month"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Meal Timing</label>
                          <input
                            type="text"
                            value={med.timing}
                            onChange={(e) => handleUpdateMedicineField(idx, 'timing', e.target.value)}
                            placeholder="e.g. After meals"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Advice, Dietary Guidance & Lifestyle *
                </label>
                <textarea
                  value={rxAdvice}
                  onChange={(e) => setRxAdvice(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  placeholder="Clinical instructions, hydration, restrictions, next checkup date..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPrescriptionModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20"
                >
                  Sign & Issue Digital Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
