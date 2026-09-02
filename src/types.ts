export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at?: string;
  patient_id?: number;
  doctor_id?: number;
}

export interface Patient {
  id: number;
  user_id: number;
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  phone: string;
  address: string;
  emergency_contact: string;
  medical_history?: string;
}

export interface Doctor {
  id: number;
  user_id?: number;
  name: string;
  specialization: string;
  hospital_id: number;
  hospital_name?: string;
  qualifications: string;
  experience_years: number;
  consultation_fee: number;
  available_days: string;
  available_time: string;
  phone: string;
  email: string;
  rating: number;
  bio?: string;
  image_url?: string;
}

export interface Hospital {
  id: number;
  name: string;
  type: 'Government' | 'Private' | 'Specialty' | 'Trauma Center';
  address: string;
  city: string;
  phone: string;
  emergency_available: boolean | number;
  total_beds: number;
  available_beds: number;
  departments: string; // JSON or comma-separated
  rating: number;
  available_doctors_count?: number;
  latitude?: number;
  longitude?: number;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type ConsultationType = 'Video Call' | 'Audio Call' | 'In-Clinic' | 'Chat';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  hospital_id: number;
  doctor_name?: string;
  doctor_specialization?: string;
  hospital_name?: string;
  patient_name?: string;
  patient_phone?: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type: ConsultationType;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  created_at: string;
}

export interface ConsultationMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'system';
  sender_name: string;
  text: string;
  timestamp: string;
  is_clinical_note?: boolean;
}

export interface Consultation {
  id: number;
  appointment_id?: number;
  patient_id: number;
  doctor_id: number;
  doctor_name?: string;
  doctor_specialization?: string;
  patient_name?: string;
  consultation_date: string;
  diagnosis: string;
  notes?: string;
  prescription_id?: number;
  status: 'Active' | 'Completed' | 'Scheduled';
  messages_json?: string;
  created_at: string;
}

export interface Medicine {
  id?: number;
  prescription_id?: number;
  medicine_name: string;
  medicine_type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops';
  dosage: string; // e.g. 500mg, 10ml
  frequency: string; // e.g. 1-0-1, Once Daily, Twice Daily
  duration: string; // e.g. 5 Days, 2 Weeks
  timing: 'Before Food' | 'After Food' | 'With Food' | 'As Needed';
  disease_use: string;
  side_effects?: string;
}

export type MedicineItem = Medicine;

export interface Prescription {
  id: number;
  consultation_id?: number;
  patient_id: number;
  doctor_id: number;
  doctor_name?: string;
  doctor_specialization?: string;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  patient_blood_group?: string;
  diagnosis: string;
  advice: string;
  medicines: Medicine[];
  created_at: string;
}

export interface MedicineReminder {
  id: number;
  patient_id: number;
  medicine_name: string;
  dosage: string;
  reminder_time: string; // "08:30"
  frequency: 'Daily' | 'Twice Daily' | 'Weekly' | 'As Needed';
  before_after_food: 'Before Food' | 'After Food' | 'With Food';
  is_active: boolean | number;
  created_at?: string;
}

export interface HealthRecord {
  id: number;
  patient_id: number;
  record_date: string;
  heart_rate: number; // bpm (60-100)
  systolic_bp: number; // mmHg (90-120)
  diastolic_bp: number; // mmHg (60-80)
  temperature: number; // °F (97-99)
  blood_glucose: number; // mg/dL (70-140)
  weight: number; // kg
  oxygen_saturation: number; // % (95-100)
  notes?: string;
  created_at?: string;
}

export interface MedicalDocument {
  id: number;
  title: string;
  category: string;
  content: string;
  keywords: string;
  source: string;
  created_at?: string;
  similarity?: number;
}

export interface MlRiskInput {
  age: number;
  gender: string;
  systolic_bp: number;
  diastolic_bp: number;
  blood_glucose: number;
  heart_rate: number;
  bmi: number;
  smoking: boolean;
  exercise_hours_weekly: number;
  family_history: boolean;
}

export interface MlRiskResult {
  risk_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  risk_score: number; // 0 - 100%
  cardiovascular_risk: number;
  diabetes_risk: number;
  hypertension_risk: number;
  key_factors: string[];
  recommendations: string[];
  prediction_model: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
  retrievedDocs?: MedicalDocument[];
  suggestedSpecialist?: string;
}
