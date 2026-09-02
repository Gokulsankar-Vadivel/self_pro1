import { Doctor, Hospital, MedicalDocument, Patient, Prescription, HealthRecord, MedicineReminder } from '../types';

export const INITIAL_DOCTORS: Omit<Doctor, 'id'>[] = [
  {
    name: 'Dr. Sarah Jenkins, MD',
    specialization: 'Cardiology',
    hospital_id: 1,
    hospital_name: 'Metro General Hospital & Trauma Center',
    qualifications: 'MBBS, MD (Cardiology), FACC',
    experience_years: 14,
    consultation_fee: 45,
    available_days: 'Mon, Tue, Wed, Thu, Fri',
    available_time: '09:00 AM - 04:00 PM',
    phone: '+1 (555) 234-5678',
    email: 'dr.sarah.jenkins@metrohealth.org',
    rating: 4.9,
    bio: 'Specialist in ischemic heart disease, hypertension management, preventive cardiology, and non-invasive cardiac imaging.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Rajesh Nair, MS, MCh',
    specialization: 'Neurology',
    hospital_id: 2,
    hospital_name: 'Apex Super Specialty Medical Institute',
    qualifications: 'MBBS, MD, DM (Neurology)',
    experience_years: 18,
    consultation_fee: 60,
    available_days: 'Mon, Wed, Fri, Sat',
    available_time: '10:00 AM - 05:00 PM',
    phone: '+1 (555) 345-6789',
    email: 'dr.nair@apexhealth.edu',
    rating: 4.95,
    bio: 'Leading neurologist focusing on acute stroke intervention, epilepsy protocols, chronic migraine therapy, and neuro-rehabilitation.',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Elena Rostova, MD',
    specialization: 'Pediatrics',
    hospital_id: 1,
    hospital_name: 'Metro General Hospital & Trauma Center',
    qualifications: 'MD (Pediatrics), FAAP',
    experience_years: 11,
    consultation_fee: 35,
    available_days: 'Tue, Wed, Thu, Fri, Sat',
    available_time: '08:30 AM - 02:30 PM',
    phone: '+1 (555) 456-7890',
    email: 'elena.rostova@metrohealth.org',
    rating: 4.85,
    bio: 'Dedicated pediatrician providing comprehensive child wellness exams, developmental monitoring, pediatric immunization, and acute illness care.',
    image_url: 'https://images.unsplash.com/photo-1594824813512-5884e8445ee6?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Marcus Vance, MD',
    specialization: 'General Medicine',
    hospital_id: 3,
    hospital_name: 'City Care Community Hospital',
    qualifications: 'MBBS, MD (Internal Medicine)',
    experience_years: 9,
    consultation_fee: 30,
    available_days: 'Mon, Tue, Wed, Thu, Fri, Sat',
    available_time: '08:00 AM - 06:00 PM',
    phone: '+1 (555) 567-8901',
    email: 'marcus.vance@citycare.org',
    rating: 4.8,
    bio: 'Primary care physician specializing in chronic lifestyle diseases (type 2 diabetes, cholesterol, obesity), acute infections, and preventive health screenings.',
    image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Priya Sharma, MD',
    specialization: 'Dermatology',
    hospital_id: 2,
    hospital_name: 'Apex Super Specialty Medical Institute',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experience_years: 8,
    consultation_fee: 40,
    available_days: 'Mon, Tue, Thu, Fri',
    available_time: '11:00 AM - 04:30 PM',
    phone: '+1 (555) 678-9012',
    email: 'priya.sharma@apexhealth.edu',
    rating: 4.9,
    bio: 'Board-certified dermatologist expert in inflammatory skin disorders, eczema, psoriasis, acne management, and cutaneous allergy diagnostics.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Arthur Campbell, MS',
    specialization: 'Orthopedics',
    hospital_id: 4,
    hospital_name: 'State Government District Hospital',
    qualifications: 'MBBS, MS (Orthopedics), MCh Orth',
    experience_years: 16,
    consultation_fee: 25,
    available_days: 'Mon, Wed, Thu, Sat',
    available_time: '09:30 AM - 03:30 PM',
    phone: '+1 (555) 789-0123',
    email: 'arthur.campbell@statehealth.gov',
    rating: 4.75,
    bio: 'Orthopedic specialist in joint preservation, sports injury arthroscopy, spine ergonomics, and geriatric osteoporosis care.',
    image_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. Maya Lin, MD',
    specialization: 'Psychiatry',
    hospital_id: 3,
    hospital_name: 'City Care Community Hospital',
    qualifications: 'MD (Psychiatry), ABPN',
    experience_years: 12,
    consultation_fee: 50,
    available_days: 'Tue, Wed, Thu, Sat',
    available_time: '12:00 PM - 07:00 PM',
    phone: '+1 (555) 890-1234',
    email: 'maya.lin@citycare.org',
    rating: 4.92,
    bio: 'Compassionate psychiatrist providing evidence-based treatment for anxiety, depressive disorders, PTSD, burnout, and adult ADHD.',
    image_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Dr. David Chen, MD',
    specialization: 'Pulmonology',
    hospital_id: 1,
    hospital_name: 'Metro General Hospital & Trauma Center',
    qualifications: 'MBBS, MD (Pulmonary Medicine), FCCP',
    experience_years: 15,
    consultation_fee: 45,
    available_days: 'Mon, Tue, Wed, Fri',
    available_time: '09:00 AM - 03:00 PM',
    phone: '+1 (555) 901-2345',
    email: 'david.chen@metrohealth.org',
    rating: 4.88,
    bio: 'Pulmonologist and critical care expert focusing on asthma control, COPD management, post-viral pulmonary recovery, and sleep apnea.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
  }
];

export const INITIAL_HOSPITALS: Omit<Hospital, 'id'>[] = [
  {
    name: 'Metro General Hospital & Trauma Center',
    type: 'Government',
    address: '450 Healthcare Boulevard, Central District',
    city: 'Metropolis',
    phone: '+1 (555) 911-0001',
    emergency_available: true,
    total_beds: 650,
    available_beds: 84,
    departments: 'Emergency & Trauma, Cardiology, Pulmonology, Pediatrics, Neurology, Orthopedics, General Surgery, Radiology, ICU',
    rating: 4.8,
    available_doctors_count: 42,
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    name: 'Apex Super Specialty Medical Institute',
    type: 'Private',
    address: '108 Horizon Park, West Extension',
    city: 'Metropolis',
    phone: '+1 (555) 911-0002',
    emergency_available: true,
    total_beds: 420,
    available_beds: 56,
    departments: 'Cardiovascular Surgery, Neurology & Stroke Unit, Oncology, Dermatology, Nephrology, Robotic Surgery, Neonatal ICU',
    rating: 4.9,
    available_doctors_count: 65,
    latitude: 37.7833,
    longitude: -122.4167,
  },
  {
    name: 'City Care Community Hospital',
    type: 'Private',
    address: '22 South Riverfront Ave',
    city: 'Metropolis',
    phone: '+1 (555) 911-0003',
    emergency_available: true,
    total_beds: 210,
    available_beds: 38,
    departments: 'General Medicine, Psychiatry, Maternity & Child Health, ENT, Ophthalmology, Preventive Health',
    rating: 4.6,
    available_doctors_count: 28,
    latitude: 37.7650,
    longitude: -122.4200,
  },
  {
    name: 'State Government District Hospital',
    type: 'Government',
    address: '10 Civics Avenue, North Sector',
    city: 'Metropolis',
    phone: '+1 (555) 911-0004',
    emergency_available: true,
    total_beds: 800,
    available_beds: 120,
    departments: 'Emergency Room, Orthopedics, Infectious Diseases, Pediatrics, Dialysis Unit, Burn Center, Blood Bank',
    rating: 4.5,
    available_doctors_count: 55,
    latitude: 37.7900,
    longitude: -122.4000,
  },
  {
    name: 'St. Jude Specialty Children & Maternity Hospital',
    type: 'Specialty',
    address: '77 Blossom Hill Way',
    city: 'Metropolis',
    phone: '+1 (555) 911-0005',
    emergency_available: true,
    total_beds: 180,
    available_beds: 24,
    departments: 'Pediatric Emergency, Neonatal ICU, Pediatric Cardiology, Obstetrics & Gynecology, Child Psychology',
    rating: 4.95,
    available_doctors_count: 32,
    latitude: 37.7500,
    longitude: -122.4300,
  },
  {
    name: 'Greenfield Suburban Health Center',
    type: 'Private',
    address: '942 Pinecrest Lane, East Suburbs',
    city: 'Eastville',
    phone: '+1 (555) 911-0006',
    emergency_available: false,
    total_beds: 90,
    available_beds: 19,
    departments: 'Family Medicine, Outpatient Clinics, Physiotherapy, Diagnostics & Lab, Minor Procedures',
    rating: 4.4,
    available_doctors_count: 14,
    latitude: 37.8000,
    longitude: -122.3800,
  }
];

export const INITIAL_RAG_DOCUMENTS: Omit<MedicalDocument, 'id'>[] = [
  {
    title: 'Emergency Triage Protocols & Red-Flag Symptoms',
    category: 'Emergency Medicine',
    keywords: 'chest pain, shortness of breath, stroke, FAST, anaphylaxis, severe bleeding, cardiac arrest, emergency',
    source: 'American Heart Association & WHO Emergency Guidelines 2025',
    content: `RED FLAG EMERGENCY CRITERIA:
1. Acute Chest Pain: Crushing, substernal tightness radiating to left arm, jaw, or shoulder accompanied by diaphoresis (sweating), nausea, or shortness of breath suggests Acute Coronary Syndrome (Myocardial Infarction). Requires immediate 911/108 activation and Aspirin 325mg if not contraindicated.
2. Stroke Symptoms (FAST Protocol): Facial drooping, Arm weakness, Slurred Speech, Time to call emergency. Every minute saved preserves brain tissue (thrombolytic window < 4.5 hours).
3. Severe Dyspnea (Shortness of breath): Inability to speak in full sentences, cyanosis (blue lips/fingers), oxygen saturation < 90%, stridor.
4. Anaphylaxis: Sudden hives, throat tightness, wheezing, swelling of tongue or lips after allergen ingestion/sting. Immediate Epinephrine auto-injector needed.
5. Severe Altered Mental State or Unconsciousness: Unresponsive, severe confusion, sudden severe "worst headache of life" (Thunderclap headache / Subarachnoid Hemorrhage).
ACTIONS: Immediately advise patient to contact emergency services (108/911) or proceed to the nearest Emergency Department. Do not delay emergency response with tele-triage.`
  },
  {
    title: 'Clinical Hypertension Management Guidelines (JNC-8 & AHA)',
    category: 'Cardiovascular Care',
    keywords: 'hypertension, blood pressure, systolic, diastolic, amlodipine, lisinopril, DASH diet, sodium',
    source: 'AHA / ACC High Blood Pressure Guidelines',
    content: `BLOOD PRESSURE CLASSIFICATION:
- Normal: Systolic < 120 mmHg and Diastolic < 80 mmHg.
- Elevated: Systolic 120-129 mmHg and Diastolic < 80 mmHg.
- Stage 1 Hypertension: Systolic 130-139 mmHg OR Diastolic 80-89 mmHg.
- Stage 2 Hypertension: Systolic ≥ 140 mmHg OR Diastolic ≥ 90 mmHg.
- Hypertensive Crisis: Systolic > 180 mmHg and/or Diastolic > 120 mmHg (Emergency if target organ damage present).

FIRST-LINE PHARMACOTHERAPY:
- ACE Inhibitors (e.g., Lisinopril 10-20 mg daily) or ARBs (e.g., Losartan 50 mg daily).
- Calcium Channel Blockers (e.g., Amlodipine 5 mg daily).
- Thiazide Diuretics (e.g., Chlorthalidone or Hydrochlorothiazide 12.5-25 mg daily).

NON-PHARMACOLOGICAL LIFESTYLE MODIFICATIONS:
- Sodium restriction (< 2,000 mg/day).
- DASH Diet (Dietary Approaches to Stop Hypertension): Rich in fruits, vegetables, whole grains, potassium, and low-fat dairy.
- Regular Aerobic Exercise: Minimum 150 minutes of moderate-intensity exercise per week.
- Weight reduction: Expect ~1 mmHg reduction per 1 kg loss.`
  },
  {
    title: 'Type 2 Diabetes Mellitus Diagnostic and Glycemic Standards',
    category: 'Endocrinology',
    keywords: 'diabetes, blood glucose, HbA1c, fasting glucose, metformin, insulin, hypoglycemia, diet',
    source: 'American Diabetes Association (ADA) Standards of Care',
    content: `DIAGNOSTIC CRITERIA FOR DIABETES:
- Fasting Plasma Glucose (FPG) ≥ 126 mg/dL (7.0 mmol/L) after 8 hours of fasting.
- 2-Hour Oral Glucose Tolerance Test (OGTT) ≥ 200 mg/dL (11.1 mmol/L).
- Glycated Hemoglobin (HbA1c) ≥ 6.5%.
- Random Blood Glucose ≥ 200 mg/dL in the presence of classic symptoms (polyuria, polydipsia, unexplained weight loss).

TARGET GLYCEMIC GOALS FOR ADULTS:
- Fasting / Pre-prandial Glucose: 80 - 130 mg/dL.
- Post-prandial (1-2 hours after meal): < 180 mg/dL.
- Overall HbA1c: < 7.0% for most non-pregnant adults.

MANAGEMENT:
- First-line oral hypoglycemic: Metformin 500-1000 mg twice daily with meals to reduce GI side effects.
- SGLT2 inhibitors (Empagliflozin, Dapagliflozin) or GLP-1 receptor agonists if cardiovascular or renal comorbidities are present.
- Hypoglycemia Alert (< 70 mg/dL): Rule of 15 - Consume 15 grams of fast-acting carbohydrate (4 oz juice or 3-4 glucose tabs), recheck in 15 minutes.`
  },
  {
    title: 'Upper Respiratory Tract Infections vs. Viral Pneumonia Protocols',
    category: 'Pulmonology',
    keywords: 'cough, fever, sore throat, cold, flu, pneumonia, bronchodilator, antibiotic stewardship',
    source: 'CDC Respiratory Illness & Infectious Disease Guidelines',
    content: `DIFFERENTIATION:
- Common Cold / Viral Rhinitis: Rhinorrhea, nasal congestion, mild scratchy throat, low-grade fever (< 100.4°F), clear chest sounds. Self-limiting in 7-10 days.
- Acute Bronchitis: Cough (productive or dry) lasting 1-3 weeks. Antibiotics are NOT recommended for uncomplicated acute bronchitis in healthy adults (90%+ viral).
- Community-Acquired Pneumonia (CAP): High fever, productive cough with rust-colored or purulent sputum, pleuritic chest pain, tachypnea (> 20 breaths/min), focal crackles/rales on auscultation, SpO2 < 94%.

SUPPORTIVE CARE:
- Adequate hydration, saline nasal irrigation, Paracetamol/Acetaminophen 500-650 mg q6h for fever/myalgia (max 3000 mg/day).
- Dextromethorphan or Honey (for adults and children > 1 year) for nocturnal cough suppression.
- Red Flags: Sustained fever > 38.5°C (> 101.3°F) for > 3 days, SpO2 drop below 94%, severe breathlessness, hemoptysis (coughing blood) -> urgent physician evaluation.`
  },
  {
    title: 'Gastroenteritis, Dehydration Assessment and ORS Guidelines',
    category: 'Gastroenterology',
    keywords: 'vomiting, diarrhea, stomach pain, food poisoning, dehydration, ORS, electrolytes, probiotics',
    source: 'World Health Organization (WHO) Diarrheal Disease Protocols',
    content: `CLINICAL EVALUATION:
- Acute Gastroenteritis is defined as sudden onset of loose stools (≥ 3 in 24 hours), often with nausea, vomiting, crampy abdominal pain, and fever.
- Assessment of Dehydration:
  * Mild: Thirst, moist mucous membranes, normal skin turgor.
  * Moderate: Dry mouth, sunken eyes, decreased urine output, mild tachycardia.
  * Severe: Lethargy, delayed capillary refill (> 3 sec), hypotension, anuria (requires IV fluids).

REHYDRATION THERAPY:
- Oral Rehydration Salts (ORS): Low-osmolarity WHO ORS solution taken in small, frequent sips (50-100 mL after each loose stool).
- Dietary management: Small frequent bland meals (BRAT diet: Bananas, Rice, Applesauce, Toast, boiled potatoes). Avoid dairy, high-fat, caffeine, and spicy foods during acute phase.
- Warning Signs: Blood in stool (dysentery), continuous vomiting preventing fluid retention for > 12 hours, high fever > 38.9°C (102°F), severe localized right lower quadrant pain (rule out appendicitis).`
  },
  {
    title: 'Dermatological Lesions & Allergic Rash Management',
    category: 'Dermatology',
    keywords: 'rash, hives, eczema, dermatitis, itching, hydrocortisone, antihistamines, skin allergy',
    source: 'American Academy of Dermatology (AAD) Clinical Protocols',
    content: `COMMON PRESENTATIONS:
- Contact Dermatitis: Erythematous, pruritic patches localized to allergen/irritant contact areas (e.g., metals, detergents, poison ivy).
- Acute Urticaria (Hives): Transient, raised, blanchable erythematous wheals with intense pruritus. May resolve in 24 hours in one spot and appear elsewhere.
- Atopic Dermatitis (Eczema): Dry, scaly, erythematous lichenified plaques, commonly in flexural creases (antecubital and popliteal fossae).

MANAGEMENT:
- Second-generation oral antihistamines (Cetirizine 10 mg, Loratadine 10 mg, Fexofenadine 180 mg) once daily for itch and allergic wheals.
- Mild topical corticosteroid (Hydrocortisone 1% cream) applied thinly twice daily for localized inflammatory flares (avoid prolonged facial application).
- Emollient moisturizers applied within 3 minutes of bathing to restore skin barrier.
- Emergency Signs: Angioedema (swelling of face, lips, tongue), difficulty breathing, or target-like bullseye lesions with fever (Erythema Multiforme / SJS).`
  }
];

export const INITIAL_PATIENT: Patient = {
  id: 1,
  user_id: 2,
  name: 'Alex Johnson',
  age: 34,
  gender: 'Male',
  blood_group: 'O+',
  phone: '+1 (555) 987-6543',
  address: '742 Evergreen Terrace, Metropolis',
  emergency_contact: 'Emily Johnson (+1 555-987-6544)',
  medical_history: 'Mild allergic rhinitis, family history of hypertension. Non-smoker.',
};

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 1,
    patient_id: 1,
    record_date: '2026-08-25 08:30',
    heart_rate: 74,
    systolic_bp: 122,
    diastolic_bp: 78,
    temperature: 98.4,
    blood_glucose: 96,
    weight: 72.5,
    oxygen_saturation: 99,
    notes: 'Morning routine check. Felt energetic.',
  },
  {
    id: 2,
    patient_id: 1,
    record_date: '2026-08-27 09:00',
    heart_rate: 78,
    systolic_bp: 126,
    diastolic_bp: 82,
    temperature: 98.6,
    blood_glucose: 104,
    weight: 72.8,
    oxygen_saturation: 98,
    notes: 'Post light breakfast check.',
  },
  {
    id: 3,
    patient_id: 1,
    record_date: '2026-08-29 08:15',
    heart_rate: 72,
    systolic_bp: 120,
    diastolic_bp: 79,
    temperature: 98.2,
    blood_glucose: 92,
    weight: 72.3,
    oxygen_saturation: 99,
    notes: 'Fasting vitals. Normal range.',
  },
  {
    id: 4,
    patient_id: 1,
    record_date: '2026-08-31 08:45',
    heart_rate: 80,
    systolic_bp: 128,
    diastolic_bp: 84,
    temperature: 99.1,
    blood_glucose: 110,
    weight: 72.6,
    oxygen_saturation: 98,
    notes: 'Mild fatigue reported after late work night.',
  },
  {
    id: 5,
    patient_id: 1,
    record_date: '2026-09-02 08:00',
    heart_rate: 75,
    systolic_bp: 121,
    diastolic_bp: 77,
    temperature: 98.5,
    blood_glucose: 95,
    weight: 72.1,
    oxygen_saturation: 99,
    notes: 'Latest vitals. Optimal cardiovascular indicators.',
  }
];

export const INITIAL_PRESCRIPTION: Prescription = {
  id: 1,
  consultation_id: 1,
  patient_id: 1,
  doctor_id: 1,
  doctor_name: 'Dr. Sarah Jenkins, MD',
  doctor_specialization: 'Cardiology',
  patient_name: 'Alex Johnson',
  patient_age: 34,
  patient_gender: 'Male',
  patient_blood_group: 'O+',
  diagnosis: 'Pre-hypertension stage 1 with seasonal allergic rhinitis',
  advice: 'Maintain low sodium DASH diet (< 2000mg/day). 30 mins brisk walking daily. Keep a weekly blood pressure diary.',
  created_at: '2026-08-28',
  medicines: [
    {
      medicine_name: 'Amlodipine Besylate',
      medicine_type: 'Tablet',
      dosage: '5 mg',
      frequency: 'Once Daily (Morning)',
      duration: '30 Days',
      timing: 'After Food',
      disease_use: 'Blood pressure control & arterial relaxation',
      side_effects: 'Mild ankle edema, headache, flushing',
    },
    {
      medicine_name: 'Cetirizine HCl',
      medicine_type: 'Tablet',
      dosage: '10 mg',
      frequency: 'Once Daily (Bedtime)',
      duration: '10 Days',
      timing: 'After Food',
      disease_use: 'Allergic rhinitis & nasal congestion relief',
      side_effects: 'Mild drowsiness, dry mouth',
    },
    {
      medicine_name: 'Coenzyme Q10 + Omega-3',
      medicine_type: 'Capsule',
      dosage: '100 mg',
      frequency: 'Once Daily (Noon)',
      duration: '60 Days',
      timing: 'With Food',
      disease_use: 'Cardiovascular antioxidant support',
      side_effects: 'Mild gastrointestinal upset',
    }
  ]
};

export const INITIAL_REMINDERS: MedicineReminder[] = [
  {
    id: 1,
    patient_id: 1,
    medicine_name: 'Amlodipine Besylate 5mg',
    dosage: '1 Tablet',
    reminder_time: '08:30',
    frequency: 'Daily',
    before_after_food: 'After Food',
    is_active: true,
  },
  {
    id: 2,
    patient_id: 1,
    medicine_name: 'Omega-3 + CoQ10 100mg',
    dosage: '1 Capsule',
    reminder_time: '13:00',
    frequency: 'Daily',
    before_after_food: 'With Food',
    is_active: true,
  },
  {
    id: 3,
    patient_id: 1,
    medicine_name: 'Cetirizine 10mg',
    dosage: '1 Tablet',
    reminder_time: '21:30',
    frequency: 'Daily',
    before_after_food: 'After Food',
    is_active: true,
  }
];
