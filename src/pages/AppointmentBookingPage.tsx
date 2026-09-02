import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Building2,
  MessageSquare,
  CheckCircle2,
  User,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Doctor, Hospital, Patient } from '../types';
import { api } from '../services/api';

interface AppointmentBookingPageProps {
  doctors: Doctor[];
  hospitals: Hospital[];
  patient: Patient | null;
  selectedDoctorId?: number;
  onNavigate: (page: string, params?: any) => void;
  onBookingSuccess: () => void;
}

export const AppointmentBookingPage: React.FC<AppointmentBookingPageProps> = ({
  doctors,
  hospitals,
  patient,
  selectedDoctorId,
  onNavigate,
  onBookingSuccess,
}) => {
  const [docId, setDocId] = useState<number>(selectedDoctorId || (doctors[0]?.id || 1));
  const [consultType, setConsultType] = useState<'Video Call' | 'Audio Call' | 'In-Clinic' | 'Chat'>('Video Call');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('10:00 AM');
  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  useEffect(() => {
    if (selectedDoctorId) {
      setDocId(selectedDoctorId);
    }
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
  }, [selectedDoctorId]);

  const selectedDoctor = doctors.find((d) => d.id === docId) || doctors[0];
  const selectedHospital = hospitals.find((h) => h.id === selectedDoctor?.hospital_id) || hospitals[0];

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert('Please describe your chief medical symptoms.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createAppointment({
        patient_id: patient?.id || 1,
        doctor_id: docId,
        hospital_id: selectedDoctor?.hospital_id || 1,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        consultation_type: consultType,
        symptoms: symptoms.trim(),
        notes: notes.trim(),
      });

      setConfirmedBooking(res);
      onBookingSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Appointment Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Your Clinical Booking is Verified!
            </h2>
            <p className="text-xs text-slate-500">
              Booking Ref: #{confirmedBooking.id} • Transmitted to Doctor's Schedule
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-900">{selectedDoctor?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Specialization:</span>
              <span className="font-semibold text-teal-700">{selectedDoctor?.specialization}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-bold text-slate-900">{appointmentDate} at {appointmentTime}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Consultation Mode:</span>
              <span className="font-bold text-teal-700">{consultType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hospital:</span>
              <span className="font-semibold text-slate-900">{selectedHospital?.name}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('patient-dashboard')}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Go to Patient Dashboard
            </button>
            <button
              onClick={() =>
                onNavigate('consultation', {
                  appointment_id: confirmedBooking.id,
                  doctor_id: docId,
                  patient_id: patient?.id || 1,
                })
              }
              className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Enter Telehealth Room</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('doctors')}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Directory</span>
        </button>
        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          Encrypted Booking Gateway
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Step-by-Step Clinical Scheduling</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule Your Telemedicine Consultation</h1>
          <p className="text-xs text-slate-300 mt-1">
            Choose your preferred doctor, consultation channel, appointment date and slot.
          </p>
        </div>

        <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Step 1: Select Doctor */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Choose Physician / Specialist</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {doctors.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDocId(d.id)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    docId === d.id
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <img
                    src={d.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                    alt={d.name}
                    className="w-10 h-10 rounded-xl object-cover border"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold text-slate-900 truncate">{d.name}</p>
                    <p className="text-teal-700 font-medium truncate">{d.specialization}</p>
                    <p className="text-slate-500 font-bold">${d.consultation_fee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Consultation Mode */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Select Consultation Mode</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 'Video Call', icon: Video, desc: 'HD Video + Realtime Audio' },
                { type: 'Audio Call', icon: Phone, desc: 'Direct Voice Hotline' },
                { type: 'In-Clinic', icon: Building2, desc: 'Physical Hospital Visit' },
                { type: 'Chat', icon: MessageSquare, desc: 'Secure Messaging Room' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = consultType === m.type;
                return (
                  <div
                    key={m.type}
                    onClick={() => setConsultType(m.type as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center space-y-2 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl mx-auto flex items-center justify-center ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.type}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Date & Slot */}
          <div className="space-y-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Date & Time Slot</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setAppointmentTime(slot)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        appointmentTime === slot
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Chief Complaint & Symptoms */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">4</span>
              <span>Chief Complaint / Symptoms *</span>
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              placeholder="Please describe your primary medical symptoms, how long you have experienced them, and any previous medications taken..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Review & Submit */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 text-center sm:text-left">
              <p>Consultation Fee: <strong className="text-slate-900 text-sm">${selectedDoctor?.consultation_fee || 45}</strong></p>
              <p className="text-[11px] text-slate-500">Includes secure digital prescription & 7-day follow-up chat.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Confirming...' : 'Confirm & Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
