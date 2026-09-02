import {
  User,
  Patient,
  Doctor,
  Hospital,
  Appointment,
  Consultation,
  Prescription,
  MedicineReminder,
  HealthRecord,
  MedicalDocument,
  MlRiskInput,
  MlRiskResult,
} from '../types';

const API_BASE = '/api';

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { email?: string; username?: string; password: string; role?: string }) =>
    request<{ user: User; patient?: Patient; doctor?: Doctor; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: {
    username: string;
    email: string;
    password: string;
    role: string;
    name: string;
    age?: number;
    gender?: string;
    blood_group?: string;
    phone?: string;
    address?: string;
    specialization?: string;
    hospital_id?: number;
    qualifications?: string;
    experience_years?: number;
    consultation_fee?: number;
  }) =>
    request<{ user: User; patient?: Patient; doctor?: Doctor; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCurrentUser: () =>
    request<{ user: User; patient?: Patient; doctor?: Doctor }>('/auth/me'),

  // Doctors
  getDoctors: (params?: { specialization?: string; location?: string; hospital_id?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.specialization) query.append('specialization', params.specialization);
    if (params?.location) query.append('location', params.location);
    if (params?.hospital_id) query.append('hospital_id', params.hospital_id.toString());
    if (params?.search) query.append('search', params.search);
    return request<Doctor[]>(`/doctors?${query.toString()}`);
  },

  getDoctorById: (id: number) => request<Doctor>(`/doctors/${id}`),

  createDoctor: (doctor: Partial<Doctor>) =>
    request<Doctor>('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    }),

  // Hospitals
  getHospitals: (params?: { city?: string; type?: string; emergency_only?: boolean; department?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.city) query.append('city', params.city);
    if (params?.type) query.append('type', params.type);
    if (params?.emergency_only) query.append('emergency_only', 'true');
    if (params?.department) query.append('department', params.department);
    if (params?.search) query.append('search', params.search);
    return request<Hospital[]>(`/hospitals?${query.toString()}`);
  },

  getHospitalById: (id: number) => request<Hospital>(`/hospitals/${id}`),

  createHospital: (hospital: Partial<Hospital>) =>
    request<Hospital>('/hospitals', {
      method: 'POST',
      body: JSON.stringify(hospital),
    }),

  // Appointments
  getAppointments: (params?: { patient_id?: number; doctor_id?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.patient_id) query.append('patient_id', params.patient_id.toString());
    if (params?.doctor_id) query.append('doctor_id', params.doctor_id.toString());
    if (params?.status) query.append('status', params.status);
    return request<Appointment[]>(`/appointments?${query.toString()}`);
  },

  createAppointment: (appointment: Partial<Appointment>) =>
    request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    }),

  updateAppointmentStatus: (id: number, status: string, notes?: string) =>
    request<Appointment>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  // Consultations
  getConsultations: (params?: { patient_id?: number; doctor_id?: number }) => {
    const query = new URLSearchParams();
    if (params?.patient_id) query.append('patient_id', params.patient_id.toString());
    if (params?.doctor_id) query.append('doctor_id', params.doctor_id.toString());
    return request<Consultation[]>(`/consultations?${query.toString()}`);
  },

  getConsultationById: (id: number) => request<Consultation>(`/consultations/${id}`),

  createConsultation: (consultation: Partial<Consultation>) =>
    request<Consultation>('/consultations', {
      method: 'POST',
      body: JSON.stringify(consultation),
    }),

  addConsultationMessage: (id: number, message: { sender: string; sender_name: string; text: string; is_clinical_note?: boolean }) =>
    request<Consultation>(`/consultations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    }),

  // Prescriptions
  getPrescriptions: (params?: { patient_id?: number; doctor_id?: number }) => {
    const query = new URLSearchParams();
    if (params?.patient_id) query.append('patient_id', params.patient_id.toString());
    if (params?.doctor_id) query.append('doctor_id', params.doctor_id.toString());
    return request<Prescription[]>(`/prescriptions?${query.toString()}`);
  },

  getPrescriptionById: (id: number) => request<Prescription>(`/prescriptions/${id}`),

  createPrescription: (prescription: Partial<Prescription>) =>
    request<Prescription>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    }),

  // Medicine Reminders
  getReminders: (patient_id?: number) => {
    const query = patient_id ? `?patient_id=${patient_id}` : '';
    return request<MedicineReminder[]>(`/reminders${query}`);
  },

  getMedicineReminders: (patient_id?: number) => {
    const query = patient_id ? `?patient_id=${patient_id}` : '';
    return request<MedicineReminder[]>(`/reminders${query}`);
  },

  createReminder: (reminder: Partial<MedicineReminder>) =>
    request<MedicineReminder>('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminder),
    }),

  createMedicineReminder: (reminder: Partial<MedicineReminder>) =>
    request<MedicineReminder>('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminder),
    }),

  deleteReminder: (id: number) =>
    request<{ success: boolean }>(`/reminders/${id}`, {
      method: 'DELETE',
    }),

  toggleReminder: (id: number, is_active: boolean) =>
    request<MedicineReminder>(`/reminders/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active }),
    }),

  updateMedicineReminder: (id: number, update: Partial<MedicineReminder>) =>
    request<MedicineReminder>(`/reminders/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    }),

  cancelAppointment: (id: number) =>
    request<Appointment>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Cancelled' }),
    }),

  // Health Records (Vitals)
  getHealthRecords: (patient_id?: number) => {
    const query = patient_id ? `?patient_id=${patient_id}` : '';
    return request<HealthRecord[]>(`/health-records${query}`);
  },

  createHealthRecord: (record: Partial<HealthRecord>) =>
    request<HealthRecord>('/health-records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  // AI & RAG
  chatWithAi: (payload: {
    message: string;
    conversationHistory?: any[];
    patientContext?: any;
  }) =>
    request<{
      response: string;
      isEmergency: boolean;
      retrievedDocs: MedicalDocument[];
      suggestedSpecialist?: string;
      confidence?: number;
    }>('/ai/symptom-assistant', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  askAiSymptomAssistant: (payload: {
    message: string;
    conversationHistory?: any[];
    patientContext?: any;
  }) =>
    request<{
      response: string;
      isEmergency: boolean;
      retrievedDocs: MedicalDocument[];
      suggestedSpecialist?: string;
      confidence?: number;
    }>('/ai/symptom-assistant', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // RAG Knowledge Management
  getMedicalDocuments: (category?: string, query?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    return request<MedicalDocument[]>(`/rag/documents?${params.toString()}`);
  },

  getRagDocuments: (category?: string, query?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    return request<MedicalDocument[]>(`/rag/documents?${params.toString()}`);
  },

  queryRag: (query: string) =>
    request<{ documents: MedicalDocument[]; answer: string }>('/rag/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),

  queryRagKnowledge: (query?: string, category?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    return request<MedicalDocument[]>(`/rag/documents?${params.toString()}`);
  },

  createMedicalDocument: (doc: Partial<MedicalDocument>) =>
    request<MedicalDocument>('/rag/documents', {
      method: 'POST',
      body: JSON.stringify(doc),
    }),

  addRagDocument: (doc: Partial<MedicalDocument>) =>
    request<MedicalDocument>('/rag/documents', {
      method: 'POST',
      body: JSON.stringify(doc),
    }),

  deleteMedicalDocument: (id: number) =>
    request<{ success: boolean }>(`/rag/documents/${id}`, {
      method: 'DELETE',
    }),

  // Machine Learning
  predictHealthRisk: (input: any) =>
    request<any>('/ml/predict-risk', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  // System Stats (Admin)
  getSystemStats: () =>
    request<{
      total_patients: number;
      total_doctors: number;
      total_hospitals: number;
      total_appointments: number;
      total_consultations: number;
      total_prescriptions: number;
      total_documents: number;
      recent_activity: { type: string; title: string; time: string }[];
    }>('/admin/stats'),

  // Emergency Triage
  triageEmergency: (symptoms: string) =>
    request<{
      isEmergency: boolean;
      severity: 'Mild' | 'Moderate' | 'Urgent' | 'Critical';
      advice: string;
      recommendedAction: string;
      nearbyEmergencyHospitals: Hospital[];
    }>('/emergency/triage', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    }),
};
