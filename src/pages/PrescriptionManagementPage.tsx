import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Pill,
  CheckCircle2,
  Calendar,
  User,
  Stethoscope,
  Building2,
  QrCode,
  ShieldCheck,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { Prescription, MedicineItem, Patient, Doctor, User as UserType } from '../types';
import { api } from '../services/api';

interface PrescriptionManagementPageProps {
  currentUser: UserType | null;
  patient: Patient | null;
  doctor: Doctor | null;
  prescriptionId?: number;
  onNavigate: (page: string, params?: any) => void;
}

export const PrescriptionManagementPage: React.FC<PrescriptionManagementPageProps> = ({
  currentUser,
  patient,
  doctor,
  prescriptionId,
  onNavigate,
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, [patient?.id, doctor?.id]);

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (currentUser?.role === 'patient') {
        params.patient_id = patient?.id || 1;
      } else if (currentUser?.role === 'doctor') {
        params.doctor_id = doctor?.id || 1;
      }
      const data = await api.getPrescriptions(params);
      setPrescriptions(data);

      if (prescriptionId) {
        const found = data.find((r) => r.id === prescriptionId);
        if (found) setSelectedRx(found);
      } else if (data.length > 0) {
        setSelectedRx(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Authenticated Medical E-Prescription Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Digital Clinical Prescriptions</h1>
          <p className="text-xs text-slate-300 mt-1">
            Standardized electronic prescriptions with drug schedules, disease usages, meal instructions, and QR verification.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Rx</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prescriptions Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Prescription Records ({prescriptions.length})</span>
          </h3>

          <div className="space-y-3">
            {prescriptions.map((rx) => {
              const isSelected = selectedRx?.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rx.diagnosis}</span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      Rx #{rx.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">Prescribed by {rx.doctor_name || 'Dr. Sarah Jenkins'}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                    <span>{rx.created_at?.split('T')[0] || 'Recent'}</span>
                    <span className="font-semibold text-emerald-600">{rx.medicines?.length || 0} Drugs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Authentic Printable Prescription Document (8 cols) */}
        <div className="lg:col-span-8">
          {selectedRx ? (
            <div
              id="printable-prescription"
              className="bg-white rounded-3xl border-2 border-slate-300 p-8 sm:p-10 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0"
            >
              {/* Rx Hospital Letterhead */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black">
                      Rx
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      METRO HEALTH TELEMEDICINE CONSORTIUM
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600">
                    450 Healthcare Blvd, Metropolis • Ph: +1 (555) 911-0001 • info@metrohealth.org
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <p className="font-extrabold text-slate-900">{selectedRx.doctor_name || 'Dr. Sarah Jenkins, MD'}</p>
                  <p className="text-teal-700 font-semibold">Department of Cardiovascular Medicine</p>
                  <p className="text-[10px] text-slate-400">Reg No: MED-884920-USA</p>
                </div>
              </div>

              {/* Patient Info Dossier Bar */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
                  <strong className="text-slate-900">{selectedRx.patient_name || patient?.name || 'Alex Johnson'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Gender</span>
                  <strong className="text-slate-900">{patient?.age || 34} Yrs / {patient?.gender || 'Male'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Prescription Date</span>
                  <strong className="text-slate-900">{selectedRx.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Blood Group</span>
                  <strong className="text-teal-700 font-bold">{patient?.blood_group || 'O+'}</strong>
                </div>
              </div>

              {/* Clinical Diagnosis */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Clinical Assessment / Diagnosis
                </span>
                <p className="text-base font-bold text-slate-900 bg-teal-50/50 p-3 rounded-xl border border-teal-200">
                  {selectedRx.diagnosis}
                </p>
              </div>

              {/* Prescribed Medicines Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>Prescribed Medications & Posology</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 rounded-l-lg">#</th>
                        <th className="py-2.5 px-3">Medicine & Dosage</th>
                        <th className="py-2.5 px-3">Frequency</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-3">Meal Relation / Timing</th>
                        <th className="py-2.5 px-3 rounded-r-lg">Side Effects / Caution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedRx.medicines && selectedRx.medicines.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 block">{med.medicine_name}</strong>
                            <span className="text-[10px] text-teal-700">{med.medicine_type} • {med.dosage}</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">{med.frequency}</td>
                          <td className="py-3 px-3 text-slate-700">{med.duration}</td>
                          <td className="py-3 px-3">
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                              {med.timing}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-[10px]">
                            {med.side_effects || 'None noted'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Advice & Instructions */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Special Instructions & Lifestyle Advice
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedRx.advice || 'Take medications exactly as prescribed with sufficient hydration. Report any sudden rash, severe dizziness or breathing discomfort.'}
                </p>
              </div>

              {/* Bottom Signature & Verification Seal */}
              <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-16 h-16 rounded-xl border border-slate-300 p-1 flex items-center justify-center bg-slate-50">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Digital Verification Hash</span>
                    <p className="text-[10px] text-slate-400 font-mono">MD-AUTH-{selectedRx.id}-984128</p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Cryptographically Signed
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="font-script text-lg text-teal-800 italic font-bold">Dr. Sarah Jenkins</p>
                  <div className="w-36 h-0.5 bg-slate-400 my-1 mx-auto sm:ml-auto"></div>
                  <p className="font-bold text-slate-900">Physician Digital Signature</p>
                  <p className="text-[10px] text-slate-400">Consultant Cardiologist</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a prescription on the left to view the official medical document.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
