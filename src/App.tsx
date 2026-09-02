import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyBanner } from './components/EmergencyBanner';
import { MedicineAlarmModal } from './components/MedicineAlarmModal';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AiHealthAssistantPage } from './pages/AiHealthAssistantPage';
import { DoctorSearchPage } from './pages/DoctorSearchPage';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage';
import { DirectConsultationPage } from './pages/DirectConsultationPage';
import { PrescriptionManagementPage } from './pages/PrescriptionManagementPage';
import { MedicineReminderPage } from './pages/MedicineReminderPage';
import { HospitalFinderPage } from './pages/HospitalFinderPage';
import { EmergencySupportPage } from './pages/EmergencySupportPage';
import { HealthMonitoringPage } from './pages/HealthMonitoringPage';
import { MlPredictionPage } from './pages/MlPredictionPage';
import { RagKnowledgePage } from './pages/RagKnowledgePage';

import { User, Patient, Doctor, Hospital, MedicineReminder } from './types';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('telemedicine_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 1,
          email: 'alex.johnson@example.com',
          role: 'patient',
          first_name: 'Alex',
          last_name: 'Johnson',
          phone: '+1 555-0199',
        };
  });

  const [patient, setPatient] = useState<Patient | null>({
    id: 1,
    user_id: 1,
    name: 'Alex Johnson',
    age: 34,
    gender: 'Male',
    blood_group: 'O+',
    address: '742 Evergreen Terrace, Metropolis',
    emergency_contact: '+1 555-911-0001 (Emily Johnson - Spouse)',
    allergies: 'Penicillin, Peanuts',
    chronic_conditions: 'Mild Hypertension',
  });

  const [doctor, setDoctor] = useState<Doctor | null>({
    id: 1,
    user_id: 2,
    name: 'Dr. Sarah Jenkins, MD',
    specialization: 'Cardiology',
    qualifications: 'MD (Cardiology), FACC, Harvard Med',
    experience_years: 12,
    consultation_fee: 65,
    hospital_name: 'Metro General Hospital',
    available_days: 'Mon - Fri',
    available_time: '09:00 AM - 04:00 PM',
    bio: 'Board-certified clinical cardiologist specializing in preventative coronary care and telemetry.',
    rating: 4.9,
  });

  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<any>({});

  // Active Medicine Alarm state
  const [activeAlarm, setActiveAlarm] = useState<MedicineReminder | null>(null);

  useEffect(() => {
    loadDirectoryData();
  }, []);

  const loadDirectoryData = async () => {
    try {
      const [docs, hosps] = await Promise.all([
        api.getDoctors(),
        api.getHospitals(),
      ]);
      setDoctorsList(docs);
      setHospitalsList(hosps);
    } catch (err) {
      console.error('Directory data load:', err);
    }
  };

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: User, profile?: any) => {
    setCurrentUser(user);
    localStorage.setItem('telemedicine_user', JSON.stringify(user));

    if (user.role === 'patient') {
      if (profile) setPatient(profile);
      setCurrentPage('patient-dashboard');
    } else if (user.role === 'doctor') {
      if (profile) setDoctor(profile);
      setCurrentPage('doctor-dashboard');
    } else if (user.role === 'admin' || user.role === 'hospital_admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('telemedicine_user');
    setCurrentPage('login');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            doctors={doctorsList}
            hospitals={hospitalsList}
          />
        );

      case 'login':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        );

      case 'patient-dashboard':
        return (
          <PatientDashboard
            patient={patient}
            onNavigate={handleNavigate}
            onTriggerAlarm={(rem) => setActiveAlarm(rem)}
          />
        );

      case 'doctor-dashboard':
        return (
          <DoctorDashboard
            doctor={doctor}
            onNavigate={handleNavigate}
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'ai-assistant':
        return (
          <AiHealthAssistantPage
            initialQuery={navParams.initialQuery}
            onNavigate={handleNavigate}
          />
        );

      case 'doctors':
        return (
          <DoctorSearchPage
            doctors={doctorsList}
            initialSearch={navParams.search}
            initialSpecialization={navParams.specialization}
            onNavigate={handleNavigate}
          />
        );

      case 'book-appointment':
        return (
          <AppointmentBookingPage
            doctors={doctorsList}
            hospitals={hospitalsList}
            patient={patient}
            selectedDoctorId={navParams.doctor_id}
            onNavigate={handleNavigate}
            onBookingSuccess={loadDirectoryData}
          />
        );

      case 'consultation':
        return (
          <DirectConsultationPage
            currentUser={currentUser}
            patient={patient}
            doctor={doctor}
            appointmentId={navParams.appointment_id}
            onNavigate={handleNavigate}
          />
        );

      case 'prescriptions':
        return (
          <PrescriptionManagementPage
            currentUser={currentUser}
            patient={patient}
            doctor={doctor}
            prescriptionId={navParams.prescription_id}
            onNavigate={handleNavigate}
          />
        );

      case 'medicine-reminders':
        return (
          <MedicineReminderPage
            patient={patient}
            onTriggerAlarm={(rem) => setActiveAlarm(rem)}
          />
        );

      case 'hospitals':
        return (
          <HospitalFinderPage
            hospitals={hospitalsList}
            initialEmergencyOnly={navParams.emergency_only}
            onNavigate={handleNavigate}
          />
        );

      case 'emergency':
        return (
          <EmergencySupportPage
            hospitals={hospitalsList}
            onNavigate={handleNavigate}
          />
        );

      case 'health-monitoring':
        return (
          <HealthMonitoringPage
            patient={patient}
            onNavigate={handleNavigate}
          />
        );

      case 'ml-prediction':
        return (
          <MlPredictionPage
            patient={patient}
            onNavigate={handleNavigate}
          />
        );

      case 'rag-knowledge':
        return (
          <RagKnowledgePage
            onNavigate={handleNavigate}
          />
        );

      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            doctors={doctorsList}
            hospitals={hospitalsList}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Urgent Emergency Banner */}
      <EmergencyBanner onOpenEmergency={() => handleNavigate('emergency')} />

      {/* Global Navigation Header */}
      <Navbar
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Medicine Alarm Audio Modal Trigger */}
      {activeAlarm && (
        <MedicineAlarmModal
          reminder={activeAlarm}
          onClose={() => setActiveAlarm(null)}
          onAcknowledge={() => {
            setActiveAlarm(null);
            alert(`Dose for ${activeAlarm.medicine_name} recorded as taken!`);
          }}
        />
      )}
    </div>
  );
}
