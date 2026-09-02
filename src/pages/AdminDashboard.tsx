import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  Users,
  Calendar,
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Sparkles,
} from 'lucide-react';
import { Doctor, Hospital, Appointment, MedicalDocument } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'hospitals' | 'appointments' | 'rag'>('overview');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ragDocs, setRagDocs] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // New Doctor Modal
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialization, setDocSpecialization] = useState('Cardiology');
  const [docQual, setDocQual] = useState('MBBS, MD');
  const [docExp, setDocExp] = useState(10);
  const [docFee, setDocFee] = useState(40);
  const [docHospitalId, setDocHospitalId] = useState(1);
  const [docTime, setDocTime] = useState('09:00 AM - 05:00 PM');
  const [docDays, setDocDays] = useState('Mon, Tue, Wed, Thu, Fri');

  // New Hospital Modal
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [hospName, setHospName] = useState('');
  const [hospType, setHospType] = useState('Government');
  const [hospCity, setHospCity] = useState('Metropolis');
  const [hospAddress, setHospAddress] = useState('');
  const [hospPhone, setHospPhone] = useState('+1 (555) 911-0000');
  const [hospTotalBeds, setHospTotalBeds] = useState(300);
  const [hospAvailableBeds, setHospAvailableBeds] = useState(45);
  const [hospDepts, setHospDepts] = useState('Emergency, Cardiology, Pediatrics, Neurology');

  // New RAG Doc Modal
  const [isRagModalOpen, setIsRagModalOpen] = useState(false);
  const [ragTitle, setRagTitle] = useState('');
  const [ragCategory, setRagCategory] = useState('Cardiology');
  const [ragKeywords, setRagKeywords] = useState('');
  const [ragContent, setRagContent] = useState('');
  const [ragSource, setRagSource] = useState('Clinical Guidelines Standard');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [docList, hospList, apptList, docRagList] = await Promise.all([
        api.getDoctors(),
        api.getHospitals(),
        api.getAppointments(),
        api.getRagDocuments(),
      ]);
      setDoctors(docList);
      setHospitals(hospList);
      setAppointments(apptList);
      setRagDocs(docRagList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDoctor({
        hospital_id: docHospitalId,
        name: docName,
        specialization: docSpecialization,
        qualifications: docQual,
        experience_years: docExp,
        consultation_fee: docFee,
        available_days: docDays,
        available_time: docTime,
      });
      setIsDoctorModalOpen(false);
      setDocName('');
      loadAllData();
      alert('New Doctor added successfully!');
    } catch (err) {
      alert('Failed to add doctor.');
    }
  };

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createHospital({
        name: hospName,
        type: hospType,
        address: hospAddress,
        city: hospCity,
        phone: hospPhone,
        emergency_available: 1,
        total_beds: hospTotalBeds,
        available_beds: hospAvailableBeds,
        departments: hospDepts,
        rating: 4.8,
      });
      setIsHospitalModalOpen(false);
      setHospName('');
      setHospAddress('');
      loadAllData();
      alert('Hospital registered successfully!');
    } catch (err) {
      alert('Failed to add hospital.');
    }
  };

  const handleCreateRagDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addRagDocument({
        title: ragTitle,
        category: ragCategory,
        content: ragContent,
        keywords: ragKeywords,
        source: ragSource,
      });
      setIsRagModalOpen(false);
      setRagTitle('');
      setRagContent('');
      setRagKeywords('');
      loadAllData();
      alert('Verified medical document indexed into RAG database!');
    } catch (err) {
      alert('Failed to index document.');
    }
  };

  const totalBeds = hospitals.reduce((acc, h) => acc + (h.total_beds || 0), 0);
  const totalAvailableBeds = hospitals.reduce((acc, h) => acc + (h.available_beds || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight">Hospital System Administration Hub</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time management for Doctors, Partner Hospitals, Bed Capacity, and RAG Medical Intelligence.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Doctor</span>
          </button>
          <button
            onClick={() => setIsHospitalModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Add Hospital</span>
          </button>
          <button
            onClick={() => setIsRagModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Index RAG Doc</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: Activity },
          { id: 'doctors', label: `Doctors (${doctors.length})`, icon: Stethoscope },
          { id: 'hospitals', label: `Hospitals (${hospitals.length})`, icon: Building2 },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'rag', label: `RAG Knowledge Base (${ragDocs.length})`, icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Registered Doctors</span>
              <p className="text-2xl font-extrabold text-teal-700 mt-1">{doctors.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Network Hospitals</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{hospitals.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Bed Capacity</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalBeds}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Available ER Beds</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalAvailableBeds}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">{appointments.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">RAG Clinical Docs</span>
              <p className="text-2xl font-extrabold text-violet-600 mt-1">{ragDocs.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Hospital Bed Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>Hospital Emergency Bed Capacity</span>
                </h3>
                <span className="text-xs font-semibold text-emerald-600">
                  {Math.round((totalAvailableBeds / (totalBeds || 1)) * 100)}% Available
                </span>
              </div>

              <div className="space-y-3">
                {hospitals.map((hosp) => (
                  <div key={hosp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{hosp.name}</span>
                      <span className="font-bold text-teal-700">
                        {hosp.available_beds} / {hosp.total_beds} Beds Available
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full"
                        style={{ width: `${((hosp.available_beds || 0) / (hosp.total_beds || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Recent Consultations & Bookings</span>
              </h3>

              <div className="space-y-2.5">
                {appointments.slice(0, 4).map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{a.doctor_name}</p>
                      <p className="text-slate-500 text-[11px]">{a.appointment_date} at {a.appointment_time} ({a.consultation_type})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-50 text-teal-700 border border-teal-200">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Registered Medical Doctors</h3>
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Hospital Affiliation</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Consultation Fee</th>
                  <th className="py-3 px-4">Available Schedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <img
                        src={d.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                        alt={d.name}
                        className="w-7 h-7 rounded-full object-cover border"
                      />
                      <span>{d.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-teal-700 font-semibold">{d.specialization}</td>
                    <td className="py-3.5 px-4 text-slate-600">{d.hospital_name || 'General Hospital'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{d.experience_years} yrs</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${d.consultation_fee}</td>
                    <td className="py-3.5 px-4 text-slate-500">{d.available_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hospitals Tab */}
      {activeTab === 'hospitals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Network Hospitals & Trauma Centers</h3>
            <button
              onClick={() => setIsHospitalModalOpen(true)}
              className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hospital</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map((h) => (
              <div key={h.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{h.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {h.type}
                  </span>
                </div>
                <p className="text-slate-500">{h.address}, {h.city}</p>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-medium">
                  <span>Available Beds: <strong className="text-emerald-700">{h.available_beds}</strong></span>
                  <span>Total: <strong>{h.total_beds}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAG Knowledge Base Tab */}
      {activeTab === 'rag' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">RAG Medical Knowledge Repository</h3>
              <p className="text-xs text-slate-500">Authoritative clinical documents indexed into SQLite for LLM RAG triage.</p>
            </div>
            <button
              onClick={() => setIsRagModalOpen(true)}
              className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guideline Doc</span>
            </button>
          </div>

          <div className="space-y-3">
            {ragDocs.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>{doc.title}</span>
                  </h4>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {doc.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{doc.content}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                  <span>Keywords: <strong className="text-slate-600">{doc.keywords}</strong></span>
                  <span>Source: <strong className="text-teal-700">{doc.source}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Register New Doctor</h3>
            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Doctor Full Name & Degree *</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Robert Chen, MD"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Specialization</label>
                  <select
                    value={docSpecialization}
                    onChange={(e) => setDocSpecialization(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pulmonology">Pulmonology</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    value={docExp}
                    onChange={(e) => setDocExp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Hospital</label>
                  <select
                    value={docHospitalId}
                    onChange={(e) => setDocHospitalId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={docFee}
                    onChange={(e) => setDocFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {isHospitalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Network Hospital</h3>
            <form onSubmit={handleCreateHospital} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Hospital Name *</label>
                <input
                  type="text"
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  placeholder="e.g. City Central Care Institute"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Hospital Type</label>
                  <select
                    value={hospType}
                    onChange={(e) => setHospType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Super Specialty">Super Specialty</option>
                    <option value="Trauma Center">Trauma Center</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={hospCity}
                    onChange={(e) => setHospCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">Address *</label>
                <input
                  type="text"
                  value={hospAddress}
                  onChange={(e) => setHospAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Total Beds</label>
                  <input
                    type="number"
                    value={hospTotalBeds}
                    onChange={(e) => setHospTotalBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Available Beds</label>
                  <input
                    type="number"
                    value={hospAvailableBeds}
                    onChange={(e) => setHospAvailableBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsHospitalModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Add Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add RAG Document Modal */}
      {isRagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Index Medical Document into RAG</h3>
            <form onSubmit={handleCreateRagDoc} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Document Title *</label>
                <input
                  type="text"
                  value={ragTitle}
                  onChange={(e) => setRagTitle(e.target.value)}
                  placeholder="e.g. Pediatric Asthma Inhaler & Bronchospasm Protocol"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <input
                    type="text"
                    value={ragCategory}
                    onChange={(e) => setRagCategory(e.target.value)}
                    placeholder="e.g. Pulmonology / Pediatrics"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={ragKeywords}
                    onChange={(e) => setRagKeywords(e.target.value)}
                    placeholder="e.g. asthma, wheezing, albuterol"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">Clinical Knowledge / Protocol Text *</label>
                <textarea
                  value={ragContent}
                  onChange={(e) => setRagContent(e.target.value)}
                  rows={4}
                  placeholder="Full clinical guidance and safety thresholds..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs mt-1"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRagModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Index into SQLite RAG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
