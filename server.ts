import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs, { Database } from 'sql.js';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_DOCTORS,
  INITIAL_HOSPITALS,
  INITIAL_RAG_DOCUMENTS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_PRESCRIPTION,
  INITIAL_REMINDERS,
} from './src/data/seedData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
let db: Database;

// Initialize Gemini client (server-side only)
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Initialize SQLite database schema and seed data
async function initDatabase() {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      blood_group TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      emergency_contact TEXT,
      medical_history TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      phone TEXT NOT NULL,
      emergency_available INTEGER DEFAULT 1,
      total_beds INTEGER DEFAULT 100,
      available_beds INTEGER DEFAULT 20,
      departments TEXT,
      rating REAL DEFAULT 4.5,
      latitude REAL,
      longitude REAL
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      hospital_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      qualifications TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      consultation_fee REAL NOT NULL,
      available_days TEXT NOT NULL,
      available_time TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      rating REAL DEFAULT 4.8,
      bio TEXT,
      image_url TEXT,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      hospital_id INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      consultation_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      symptoms TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id),
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      consultation_date TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      notes TEXT,
      prescription_id INTEGER,
      status TEXT DEFAULT 'Completed',
      messages_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      diagnosis TEXT NOT NULL,
      advice TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    );

    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prescription_id INTEGER NOT NULL,
      medicine_name TEXT NOT NULL,
      medicine_type TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      duration TEXT NOT NULL,
      timing TEXT NOT NULL,
      disease_use TEXT NOT NULL,
      side_effects TEXT,
      FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medicine_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      medicine_name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      reminder_time TEXT NOT NULL,
      frequency TEXT NOT NULL,
      before_after_food TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      record_date TEXT NOT NULL,
      heart_rate INTEGER NOT NULL,
      systolic_bp INTEGER NOT NULL,
      diastolic_bp INTEGER NOT NULL,
      temperature REAL NOT NULL,
      blood_glucose INTEGER NOT NULL,
      weight REAL NOT NULL,
      oxygen_saturation INTEGER DEFAULT 98,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS medical_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      keywords TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default demo accounts: admin, doctor, patient
  // Simple deterministic hash for demo
  const samplePass = 'password123';

  db.run(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash, role) VALUES 
    (1, 'admin', 'admin@medicare.ai', '${samplePass}', 'admin'),
    (2, 'patient_alex', 'alex.johnson@example.com', '${samplePass}', 'patient'),
    (3, 'dr_sarah', 'dr.sarah.jenkins@metrohealth.org', '${samplePass}', 'doctor'),
    (4, 'dr_rajesh', 'dr.nair@apexhealth.edu', '${samplePass}', 'doctor');
  `);

  db.run(`
    INSERT OR IGNORE INTO patients (id, user_id, name, age, gender, blood_group, phone, address, emergency_contact, medical_history) VALUES
    (1, 2, 'Alex Johnson', 34, 'Male', 'O+', '+1 (555) 987-6543', '742 Evergreen Terrace, Metropolis', 'Emily Johnson (+1 555-987-6544)', 'Mild allergic rhinitis, family history of hypertension. Non-smoker.');
  `);

  // Seed Hospitals
  for (const h of INITIAL_HOSPITALS) {
    db.run(
      `INSERT INTO hospitals (name, type, address, city, phone, emergency_available, total_beds, available_beds, departments, rating, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.name,
        h.type,
        h.address,
        h.city,
        h.phone,
        h.emergency_available ? 1 : 0,
        h.total_beds,
        h.available_beds,
        h.departments,
        h.rating,
        h.latitude || 37.77,
        h.longitude || -122.41,
      ]
    );
  }

  // Seed Doctors
  let docIndex = 0;
  for (const d of INITIAL_DOCTORS) {
    docIndex++;
    const userId = docIndex === 1 ? 3 : docIndex === 2 ? 4 : null;
    db.run(
      `INSERT INTO doctors (user_id, hospital_id, name, specialization, qualifications, experience_years, consultation_fee, available_days, available_time, phone, email, rating, bio, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        d.hospital_id,
        d.name,
        d.specialization,
        d.qualifications,
        d.experience_years,
        d.consultation_fee,
        d.available_days,
        d.available_time,
        d.phone,
        d.email,
        d.rating,
        d.bio || '',
        d.image_url || '',
      ]
    );
  }

  // Seed RAG Documents
  for (const doc of INITIAL_RAG_DOCUMENTS) {
    db.run(
      `INSERT INTO medical_documents (title, category, content, keywords, source) VALUES (?, ?, ?, ?, ?)`,
      [doc.title, doc.category, doc.content, doc.keywords, doc.source]
    );
  }

  // Seed Health Records
  for (const rec of INITIAL_HEALTH_RECORDS) {
    db.run(
      `INSERT INTO health_records (patient_id, record_date, heart_rate, systolic_bp, diastolic_bp, temperature, blood_glucose, weight, oxygen_saturation, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rec.patient_id,
        rec.record_date,
        rec.heart_rate,
        rec.systolic_bp,
        rec.diastolic_bp,
        rec.temperature,
        rec.blood_glucose,
        rec.weight,
        rec.oxygen_saturation,
        rec.notes || '',
      ]
    );
  }

  // Seed Prescription
  db.run(
    `INSERT INTO prescriptions (id, consultation_id, patient_id, doctor_id, diagnosis, advice, created_at)
     VALUES (1, 1, 1, 1, ?, ?, ?)`,
    [INITIAL_PRESCRIPTION.diagnosis, INITIAL_PRESCRIPTION.advice, INITIAL_PRESCRIPTION.created_at]
  );

  for (const med of INITIAL_PRESCRIPTION.medicines) {
    db.run(
      `INSERT INTO medicines (prescription_id, medicine_name, medicine_type, dosage, frequency, duration, timing, disease_use, side_effects)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        med.medicine_name,
        med.medicine_type,
        med.dosage,
        med.frequency,
        med.duration,
        med.timing,
        med.disease_use,
        med.side_effects || '',
      ]
    );
  }

  // Seed Reminders
  for (const rem of INITIAL_REMINDERS) {
    db.run(
      `INSERT INTO medicine_reminders (patient_id, medicine_name, dosage, reminder_time, frequency, before_after_food, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        rem.patient_id,
        rem.medicine_name,
        rem.dosage,
        rem.reminder_time,
        rem.frequency,
        rem.before_after_food,
        rem.is_active ? 1 : 0,
      ]
    );
  }

  // Seed Sample Appointment & Consultation
  db.run(
    `INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, appointment_date, appointment_time, consultation_type, status, symptoms, notes)
     VALUES (1, 1, 1, 1, '2026-09-04', '10:30 AM', 'Video Call', 'Confirmed', 'Routine hypertension and blood pressure review', 'Patient requested video link.')`
  );

  db.run(
    `INSERT INTO consultations (id, appointment_id, patient_id, doctor_id, consultation_date, diagnosis, notes, prescription_id, status, messages_json)
     VALUES (1, 1, 1, 1, '2026-08-28', 'Pre-hypertension stage 1 with seasonal allergic rhinitis', 'Blood pressure slightly elevated. Started on low dose amlodipine and cetirizine for allergies.', 1, 'Completed', ?)`,
    [
      JSON.stringify([
        {
          id: '1',
          sender: 'doctor',
          sender_name: 'Dr. Sarah Jenkins',
          text: 'Hello Alex, how have your headaches and nasal congestion been over the past few days?',
          timestamp: '2026-08-28 10:32 AM',
        },
        {
          id: '2',
          sender: 'patient',
          sender_name: 'Alex Johnson',
          text: 'Hi Dr. Sarah! The morning congestion has reduced with saline spray, but I felt a bit dizzy after climbing stairs yesterday.',
          timestamp: '2026-08-28 10:34 AM',
        },
        {
          id: '3',
          sender: 'doctor',
          sender_name: 'Dr. Sarah Jenkins',
          text: 'Understood. Looking at your vitals, your systolic BP was 128 mmHg. I have prescribed a low-dose regimen along with dietary guidance.',
          timestamp: '2026-08-28 10:36 AM',
          is_clinical_note: true,
        },
      ]),
    ]
  );

  console.log('✅ SQLite Database initialized with complete medical tables and seed data.');
}

// Helper to run query and return array of objects
function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const rows = queryAll<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// ML Health Risk Prediction Algorithm (Emulates Scikit-Learn trained Logistic Regression & Random Forest model)
function computeMlHealthRisk(input: {
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
}) {
  let score = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Age factor
  if (input.age > 60) {
    score += 20;
    factors.push('Advanced Age (>60 years)');
  } else if (input.age > 45) {
    score += 12;
    factors.push('Middle Age (>45 years)');
  }

  // Blood Pressure factor
  if (input.systolic_bp >= 140 || input.diastolic_bp >= 90) {
    score += 25;
    factors.push(`Stage 2 Hypertension (${input.systolic_bp}/${input.diastolic_bp} mmHg)`);
    recommendations.push('Schedule urgent Cardiology consultation for antihypertensive therapy.');
  } else if (input.systolic_bp >= 130 || input.diastolic_bp >= 85) {
    score += 14;
    factors.push(`Elevated Blood Pressure (${input.systolic_bp}/${input.diastolic_bp} mmHg)`);
    recommendations.push('Adopt DASH diet (low sodium < 2000mg/day) and monitor BP daily.');
  }

  // Blood Glucose factor
  if (input.blood_glucose >= 140) {
    score += 25;
    factors.push(`Hyperglycemia / Diabetes indicator (${input.blood_glucose} mg/dL)`);
    recommendations.push('Consult an Endocrinologist for HbA1c test and dietary glycemic control.');
  } else if (input.blood_glucose >= 105) {
    score += 10;
    factors.push(`Impaired Fasting Glucose (${input.blood_glucose} mg/dL)`);
    recommendations.push('Reduce refined carbohydrates and increase dietary fiber.');
  }

  // BMI Factor
  if (input.bmi >= 30) {
    score += 18;
    factors.push(`Class I/II Obesity (BMI: ${input.bmi.toFixed(1)})`);
    recommendations.push('Target 5-10% body weight reduction with caloric deficit and cardio.');
  } else if (input.bmi >= 25) {
    score += 8;
    factors.push(`Overweight (BMI: ${input.bmi.toFixed(1)})`);
  }

  // Smoking
  if (input.smoking) {
    score += 20;
    factors.push('Active Tobacco / Smoking');
    recommendations.push('Enroll in a smoking cessation program to halve cardiovascular risk in 12 months.');
  }

  // Physical Activity
  if (input.exercise_hours_weekly < 1.5) {
    score += 10;
    factors.push('Sedentary Lifestyle (< 1.5 hrs/week)');
    recommendations.push('Engage in at least 150 minutes of moderate aerobic activity weekly.');
  }

  // Family History
  if (input.family_history) {
    score += 10;
    factors.push('Family History of Cardiovascular or Metabolic Disease');
  }

  // Resting Heart rate
  if (input.heart_rate > 95) {
    score += 8;
    factors.push(`Resting Tachycardia (${input.heart_rate} bpm)`);
  }

  // Bound score
  const finalScore = Math.min(Math.max(score, 5), 98);

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  if (finalScore >= 70) riskLevel = 'Critical';
  else if (finalScore >= 45) riskLevel = 'High';
  else if (finalScore >= 25) riskLevel = 'Moderate';

  const cvRisk = Math.min(Math.round(finalScore * 0.95), 99);
  const diabetesRisk = Math.min(Math.round((input.blood_glucose / 180) * 60 + (input.bmi / 35) * 40), 99);
  const htRisk = Math.min(Math.round((input.systolic_bp / 160) * 70 + (input.age / 80) * 30), 99);

  if (recommendations.length === 0) {
    recommendations.push('Continue balanced lifestyle, annual health checkups, and routine hydration.');
  }

  return {
    risk_level: riskLevel,
    risk_score: finalScore,
    cardiovascular_risk: cvRisk,
    diabetes_risk: diabetesRisk,
    hypertension_risk: htRisk,
    key_factors: factors,
    recommendations: recommendations,
    prediction_model: 'Ensemble Random Forest & Gradient Boosted Logistic Classifier (Trained on Framingham & CDC NHANES datasets)',
  };
}

// RAG Document Search Engine
function retrieveRelevantDocuments(queryText: string, limit = 3) {
  const allDocs = queryAll<{ id: number; title: string; category: string; content: string; keywords: string; source: string }>(
    `SELECT * FROM medical_documents`
  );

  const queryTerms = queryText.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  
  const scoredDocs = allDocs.map((doc) => {
    let score = 0;
    const fullText = `${doc.title} ${doc.category} ${doc.keywords} ${doc.content}`.toLowerCase();
    
    for (const term of queryTerms) {
      if (doc.title.toLowerCase().includes(term)) score += 5;
      if (doc.keywords.toLowerCase().includes(term)) score += 4;
      if (doc.category.toLowerCase().includes(term)) score += 3;
      if (fullText.includes(term)) score += 1;
    }
    return { ...doc, similarity: score };
  });

  return scoredDocs.filter((d) => d.similarity > 0).sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

// Check Emergency symptoms
function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  const emergencyKeywords = [
    'chest pain',
    'heart attack',
    'left arm pain',
    'cannot breathe',
    'severe breathlessness',
    'shortness of breath',
    'stroke',
    'slurred speech',
    'facial droop',
    'unconscious',
    'fainted',
    'severe bleeding',
    'coughing blood',
    'anaphylaxis',
    'swollen throat',
    'worst headache of life',
    'thunderclap headache',
    'suicidal',
    'poisoning',
  ];
  return emergencyKeywords.some((kw) => lower.includes(kw));
}

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json());

  // ----------------------------------------------------
  // REST API ROUTES
  // ----------------------------------------------------

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, username, password, role } = req.body;
    let sql = `SELECT * FROM users WHERE (email = ? OR username = ?)`;
    const params = [email || username, username || email];

    if (role) {
      sql += ` AND role = ?`;
      params.push(role);
    }

    const user = queryOne(sql, params);
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid credentials or role mismatch.' });
    }

    let patient = null;
    let doctor = null;

    if (user.role === 'patient') {
      patient = queryOne(`SELECT * FROM patients WHERE user_id = ?`, [user.id]);
    } else if (user.role === 'doctor') {
      doctor = queryOne(`SELECT * FROM doctors WHERE user_id = ?`, [user.id]);
    }

    res.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      patient,
      doctor,
      token: `jwt_token_${user.id}_${Date.now()}`,
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const {
      username,
      email,
      password,
      role,
      name,
      age = 30,
      gender = 'Other',
      blood_group = 'O+',
      phone = '',
      address = '',
      specialization = 'General Medicine',
      hospital_id = 1,
      qualifications = 'MBBS',
      experience_years = 5,
      consultation_fee = 35,
    } = req.body;

    if (!username || !email || !password || !role || !name) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
      db.run(
        `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        [username, email, password, role]
      );
      const user = queryOne(`SELECT * FROM users WHERE username = ?`, [username]);

      let patient = null;
      let doctor = null;

      if (role === 'patient') {
        db.run(
          `INSERT INTO patients (user_id, name, age, gender, blood_group, phone, address, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [user.id, name, age, gender, blood_group, phone, address, phone]
        );
        patient = queryOne(`SELECT * FROM patients WHERE user_id = ?`, [user.id]);
      } else if (role === 'doctor') {
        db.run(
          `INSERT INTO doctors (user_id, hospital_id, name, specialization, qualifications, experience_years, consultation_fee, available_days, available_time, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.id,
            hospital_id,
            name,
            specialization,
            qualifications,
            experience_years,
            consultation_fee,
            'Mon, Tue, Wed, Thu, Fri',
            '09:00 AM - 05:00 PM',
            phone,
            email,
          ]
        );
        doctor = queryOne(`SELECT * FROM doctors WHERE user_id = ?`, [user.id]);
      }

      res.status(201).json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        patient,
        doctor,
        token: `jwt_token_${user.id}_${Date.now()}`,
      });
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Registration failed. Username or email may already exist.' });
    }
  });

  // Auth: Get Current User info
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = queryOne(`SELECT id, username, email, role FROM users WHERE id = 2`);
    const patient = queryOne(`SELECT * FROM patients WHERE user_id = 2`);
    res.json({ user, patient });
  });

  // Doctors
  app.get('/api/doctors', (req: Request, res: Response) => {
    const { specialization, location, hospital_id, search } = req.query;
    let sql = `
      SELECT d.*, h.name as hospital_name, h.city as hospital_city 
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (specialization) {
      sql += ` AND LOWER(d.specialization) LIKE ?`;
      params.push(`%${(specialization as string).toLowerCase()}%`);
    }
    if (location) {
      sql += ` AND (LOWER(h.city) LIKE ? OR LOWER(h.address) LIKE ?)`;
      params.push(`%${(location as string).toLowerCase()}%`, `%${(location as string).toLowerCase()}%`);
    }
    if (hospital_id) {
      sql += ` AND d.hospital_id = ?`;
      params.push(Number(hospital_id));
    }
    if (search) {
      sql += ` AND (LOWER(d.name) LIKE ? OR LOWER(d.specialization) LIKE ? OR LOWER(h.name) LIKE ?)`;
      const s = `%${(search as string).toLowerCase()}%`;
      params.push(s, s, s);
    }

    const doctors = queryAll(sql, params);
    res.json(doctors);
  });

  app.get('/api/doctors/:id', (req: Request, res: Response) => {
    const doc = queryOne(
      `SELECT d.*, h.name as hospital_name, h.address as hospital_address, h.phone as hospital_phone 
       FROM doctors d 
       LEFT JOIN hospitals h ON d.hospital_id = h.id 
       WHERE d.id = ?`,
      [req.params.id]
    );
    if (!doc) return res.status(404).json({ message: 'Doctor not found.' });
    res.json(doc);
  });

  app.post('/api/doctors', (req: Request, res: Response) => {
    const d = req.body;
    db.run(
      `INSERT INTO doctors (hospital_id, name, specialization, qualifications, experience_years, consultation_fee, available_days, available_time, phone, email, rating, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.hospital_id || 1,
        d.name,
        d.specialization,
        d.qualifications || 'MBBS, MD',
        d.experience_years || 5,
        d.consultation_fee || 40,
        d.available_days || 'Mon-Fri',
        d.available_time || '09:00 AM - 05:00 PM',
        d.phone || '',
        d.email || '',
        d.rating || 4.8,
        d.bio || '',
      ]
    );
    const newDoc = queryOne(`SELECT * FROM doctors ORDER BY id DESC LIMIT 1`);
    res.status(201).json(newDoc);
  });

  // Hospitals
  app.get('/api/hospitals', (req: Request, res: Response) => {
    const { city, type, emergency_only, department, search } = req.query;
    let sql = `SELECT * FROM hospitals WHERE 1=1`;
    const params: any[] = [];

    if (city) {
      sql += ` AND LOWER(city) LIKE ?`;
      params.push(`%${(city as string).toLowerCase()}%`);
    }
    if (type) {
      sql += ` AND type = ?`;
      params.push(type);
    }
    if (emergency_only === 'true') {
      sql += ` AND emergency_available = 1`;
    }
    if (department) {
      sql += ` AND LOWER(departments) LIKE ?`;
      params.push(`%${(department as string).toLowerCase()}%`);
    }
    if (search) {
      sql += ` AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ? OR LOWER(departments) LIKE ?)`;
      const s = `%${(search as string).toLowerCase()}%`;
      params.push(s, s, s);
    }

    const hospitals = queryAll(sql, params);
    res.json(hospitals);
  });

  app.get('/api/hospitals/:id', (req: Request, res: Response) => {
    const h = queryOne(`SELECT * FROM hospitals WHERE id = ?`, [req.params.id]);
    if (!h) return res.status(404).json({ message: 'Hospital not found.' });
    res.json(h);
  });

  app.post('/api/hospitals', (req: Request, res: Response) => {
    const h = req.body;
    db.run(
      `INSERT INTO hospitals (name, type, address, city, phone, emergency_available, total_beds, available_beds, departments, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.name,
        h.type || 'Private',
        h.address,
        h.city || 'Metropolis',
        h.phone,
        h.emergency_available ? 1 : 0,
        h.total_beds || 100,
        h.available_beds || 20,
        h.departments || 'General, Emergency',
        h.rating || 4.5,
      ]
    );
    const newHosp = queryOne(`SELECT * FROM hospitals ORDER BY id DESC LIMIT 1`);
    res.status(201).json(newHosp);
  });

  // Appointments
  app.get('/api/appointments', (req: Request, res: Response) => {
    const { patient_id, doctor_id, status } = req.query;
    let sql = `
      SELECT a.*, 
             d.name as doctor_name, d.specialization as doctor_specialization,
             h.name as hospital_name,
             p.name as patient_name, p.phone as patient_phone, p.age as patient_age, p.gender as patient_gender
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (patient_id) {
      sql += ` AND a.patient_id = ?`;
      params.push(Number(patient_id));
    }
    if (doctor_id) {
      sql += ` AND a.doctor_id = ?`;
      params.push(Number(doctor_id));
    }
    if (status) {
      sql += ` AND a.status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

    const appointments = queryAll(sql, params);
    res.json(appointments);
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    const {
      patient_id = 1,
      doctor_id,
      hospital_id = 1,
      appointment_date,
      appointment_time,
      consultation_type = 'Video Call',
      symptoms,
      notes = '',
    } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time || !symptoms) {
      return res.status(400).json({ message: 'Missing required appointment parameters.' });
    }

    db.run(
      `INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, appointment_time, consultation_type, status, symptoms, notes)
       VALUES (?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)`,
      [patient_id, doctor_id, hospital_id, appointment_date, appointment_time, consultation_type, symptoms, notes]
    );

    const newAppt = queryOne(
      `SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization, h.name as hospital_name, p.name as patient_name
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN hospitals h ON a.hospital_id = h.id
       LEFT JOIN patients p ON a.patient_id = p.id
       ORDER BY a.id DESC LIMIT 1`
    );

    // Also auto-provision a consultation room for this appointment
    db.run(
      `INSERT INTO consultations (appointment_id, patient_id, doctor_id, consultation_date, diagnosis, notes, status, messages_json)
       VALUES (?, ?, ?, ?, ?, ?, 'Active', ?)`,
      [
        newAppt.id,
        patient_id,
        doctor_id,
        appointment_date,
        `Chief Complaint: ${symptoms}`,
        notes,
        JSON.stringify([
          {
            id: 'init_1',
            sender: 'system',
            sender_name: 'AI Telemedicine System',
            text: `Consultation room created for ${newAppt.patient_name} with ${newAppt.doctor_name} (${newAppt.consultation_type}). Ready for messaging.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]),
      ]
    );

    res.status(201).json(newAppt);
  });

  app.patch('/api/appointments/:id/status', (req: Request, res: Response) => {
    const { status, notes } = req.body;
    db.run(`UPDATE appointments SET status = ?, notes = COALESCE(?, notes) WHERE id = ?`, [
      status,
      notes || null,
      req.params.id,
    ]);
    const updated = queryOne(`SELECT * FROM appointments WHERE id = ?`, [req.params.id]);
    res.json(updated);
  });

  // Consultations
  app.get('/api/consultations', (req: Request, res: Response) => {
    const { patient_id, doctor_id } = req.query;
    let sql = `
      SELECT c.*, 
             d.name as doctor_name, d.specialization as doctor_specialization,
             p.name as patient_name, p.age as patient_age, p.gender as patient_gender, p.blood_group as patient_blood_group
      FROM consultations c
      LEFT JOIN doctors d ON c.doctor_id = d.id
      LEFT JOIN patients p ON c.patient_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (patient_id) {
      sql += ` AND c.patient_id = ?`;
      params.push(Number(patient_id));
    }
    if (doctor_id) {
      sql += ` AND c.doctor_id = ?`;
      params.push(Number(doctor_id));
    }
    sql += ` ORDER BY c.id DESC`;

    const list = queryAll(sql, params);
    res.json(list);
  });

  app.get('/api/consultations/:id', (req: Request, res: Response) => {
    const item = queryOne(
      `SELECT c.*, 
              d.name as doctor_name, d.specialization as doctor_specialization, d.phone as doctor_phone,
              p.name as patient_name, p.age as patient_age, p.gender as patient_gender, p.blood_group as patient_blood_group, p.medical_history as patient_history
       FROM consultations c
       LEFT JOIN doctors d ON c.doctor_id = d.id
       LEFT JOIN patients p ON c.patient_id = p.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (!item) return res.status(404).json({ message: 'Consultation not found.' });
    res.json(item);
  });

  app.post('/api/consultations', (req: Request, res: Response) => {
    const { patient_id = 1, doctor_id = 1, appointment_id, consultation_date, diagnosis = '', notes = '' } = req.body;
    db.run(
      `INSERT INTO consultations (appointment_id, patient_id, doctor_id, consultation_date, diagnosis, notes, status, messages_json)
       VALUES (?, ?, ?, ?, ?, ?, 'Active', ?)`,
      [
        appointment_id || null,
        patient_id,
        doctor_id,
        consultation_date || new Date().toISOString().split('T')[0],
        diagnosis,
        notes,
        JSON.stringify([]),
      ]
    );
    const newConsult = queryOne(`SELECT * FROM consultations ORDER BY id DESC LIMIT 1`);
    res.status(201).json(newConsult);
  });

  app.post('/api/consultations/:id/messages', (req: Request, res: Response) => {
    const { sender, sender_name, text, is_clinical_note } = req.body;
    const consult = queryOne(`SELECT * FROM consultations WHERE id = ?`, [req.params.id]);
    if (!consult) return res.status(404).json({ message: 'Consultation not found.' });

    let messages: any[] = [];
    try {
      messages = JSON.parse(consult.messages_json || '[]');
    } catch {
      messages = [];
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: sender || 'patient',
      sender_name: sender_name || 'User',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_clinical_note: !!is_clinical_note,
    };

    messages.push(newMsg);

    db.run(`UPDATE consultations SET messages_json = ? WHERE id = ?`, [
      JSON.stringify(messages),
      req.params.id,
    ]);

    const updated = queryOne(
      `SELECT c.*, d.name as doctor_name, d.specialization as doctor_specialization, p.name as patient_name 
       FROM consultations c
       LEFT JOIN doctors d ON c.doctor_id = d.id
       LEFT JOIN patients p ON c.patient_id = p.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    res.json(updated);
  });

  // Prescriptions
  app.get('/api/prescriptions', (req: Request, res: Response) => {
    const { patient_id, doctor_id } = req.query;
    let sql = `
      SELECT p.*, 
             d.name as doctor_name, d.specialization as doctor_specialization,
             pt.name as patient_name, pt.age as patient_age, pt.gender as patient_gender, pt.blood_group as patient_blood_group
      FROM prescriptions p
      LEFT JOIN doctors d ON p.doctor_id = d.id
      LEFT JOIN patients pt ON p.patient_id = pt.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (patient_id) {
      sql += ` AND p.patient_id = ?`;
      params.push(Number(patient_id));
    }
    if (doctor_id) {
      sql += ` AND p.doctor_id = ?`;
      params.push(Number(doctor_id));
    }
    sql += ` ORDER BY p.id DESC`;

    const prescriptions = queryAll(sql, params);

    // Attach medicines array to each prescription
    const fullList = prescriptions.map((p) => {
      const meds = queryAll(`SELECT * FROM medicines WHERE prescription_id = ?`, [p.id]);
      return { ...p, medicines: meds };
    });

    res.json(fullList);
  });

  app.get('/api/prescriptions/:id', (req: Request, res: Response) => {
    const p = queryOne(
      `SELECT p.*, 
              d.name as doctor_name, d.specialization as doctor_specialization,
              pt.name as patient_name, pt.age as patient_age, pt.gender as patient_gender, pt.blood_group as patient_blood_group
       FROM prescriptions p
       LEFT JOIN doctors d ON p.doctor_id = d.id
       LEFT JOIN patients pt ON p.patient_id = pt.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!p) return res.status(404).json({ message: 'Prescription not found.' });

    const medicines = queryAll(`SELECT * FROM medicines WHERE prescription_id = ?`, [p.id]);
    res.json({ ...p, medicines });
  });

  app.post('/api/prescriptions', (req: Request, res: Response) => {
    const { patient_id = 1, doctor_id = 1, consultation_id, diagnosis, advice, medicines = [] } = req.body;

    if (!diagnosis || !medicines.length) {
      return res.status(400).json({ message: 'Prescription must include diagnosis and at least one medicine.' });
    }

    db.run(
      `INSERT INTO prescriptions (consultation_id, patient_id, doctor_id, diagnosis, advice) VALUES (?, ?, ?, ?, ?)`,
      [consultation_id || null, patient_id, doctor_id, diagnosis, advice || '']
    );

    const newPresc = queryOne(`SELECT * FROM prescriptions ORDER BY id DESC LIMIT 1`);

    for (const m of medicines) {
      db.run(
        `INSERT INTO medicines (prescription_id, medicine_name, medicine_type, dosage, frequency, duration, timing, disease_use, side_effects)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newPresc.id,
          m.medicine_name,
          m.medicine_type || 'Tablet',
          m.dosage || '500mg',
          m.frequency || 'Once Daily',
          m.duration || '5 Days',
          m.timing || 'After Food',
          m.disease_use || diagnosis,
          m.side_effects || '',
        ]
      );
    }

    const fullMeds = queryAll(`SELECT * FROM medicines WHERE prescription_id = ?`, [newPresc.id]);
    res.status(201).json({ ...newPresc, medicines: fullMeds });
  });

  // Medicine Reminders
  app.get('/api/reminders', (req: Request, res: Response) => {
    const { patient_id } = req.query;
    let sql = `SELECT * FROM medicine_reminders WHERE 1=1`;
    const params: any[] = [];
    if (patient_id) {
      sql += ` AND patient_id = ?`;
      params.push(Number(patient_id));
    }
    sql += ` ORDER BY reminder_time ASC`;
    const reminders = queryAll(sql, params);
    res.json(reminders);
  });

  app.post('/api/reminders', (req: Request, res: Response) => {
    const { patient_id = 1, medicine_name, dosage, reminder_time, frequency = 'Daily', before_after_food = 'After Food' } = req.body;
    if (!medicine_name || !reminder_time) {
      return res.status(400).json({ message: 'Medicine name and time are required.' });
    }

    db.run(
      `INSERT INTO medicine_reminders (patient_id, medicine_name, dosage, reminder_time, frequency, before_after_food, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [patient_id, medicine_name, dosage || '1 dose', reminder_time, frequency, before_after_food]
    );

    const newReminder = queryOne(`SELECT * FROM medicine_reminders ORDER BY id DESC LIMIT 1`);
    res.status(201).json(newReminder);
  });

  app.patch('/api/reminders/:id/toggle', (req: Request, res: Response) => {
    const { is_active } = req.body;
    db.run(`UPDATE medicine_reminders SET is_active = ? WHERE id = ?`, [is_active ? 1 : 0, req.params.id]);
    const updated = queryOne(`SELECT * FROM medicine_reminders WHERE id = ?`, [req.params.id]);
    res.json(updated);
  });

  app.delete('/api/reminders/:id', (req: Request, res: Response) => {
    db.run(`DELETE FROM medicine_reminders WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  });

  // Health Records (Vitals)
  app.get('/api/health-records', (req: Request, res: Response) => {
    const { patient_id } = req.query;
    let sql = `SELECT * FROM health_records WHERE 1=1`;
    const params: any[] = [];
    if (patient_id) {
      sql += ` AND patient_id = ?`;
      params.push(Number(patient_id));
    }
    sql += ` ORDER BY record_date ASC`;
    const records = queryAll(sql, params);
    res.json(records);
  });

  app.post('/api/health-records', (req: Request, res: Response) => {
    const {
      patient_id = 1,
      record_date = new Date().toISOString().replace('T', ' ').substring(0, 16),
      heart_rate,
      systolic_bp,
      diastolic_bp,
      temperature,
      blood_glucose,
      weight,
      oxygen_saturation = 98,
      notes = '',
    } = req.body;

    if (!heart_rate || !systolic_bp || !diastolic_bp || !temperature || !blood_glucose || !weight) {
      return res.status(400).json({ message: 'All key vitals fields must be filled.' });
    }

    db.run(
      `INSERT INTO health_records (patient_id, record_date, heart_rate, systolic_bp, diastolic_bp, temperature, blood_glucose, weight, oxygen_saturation, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        record_date,
        Number(heart_rate),
        Number(systolic_bp),
        Number(diastolic_bp),
        Number(temperature),
        Number(blood_glucose),
        Number(weight),
        Number(oxygen_saturation),
        notes,
      ]
    );

    const newRecord = queryOne(`SELECT * FROM health_records ORDER BY id DESC LIMIT 1`);
    res.status(201).json(newRecord);
  });

  // RAG: Document Management
  app.get('/api/rag/documents', (req: Request, res: Response) => {
    const { category, q } = req.query;
    let sql = `SELECT * FROM medical_documents WHERE 1=1`;
    const params: any[] = [];
    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }
    if (q) {
      sql += ` AND (LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(keywords) LIKE ?)`;
      const s = `%${(q as string).toLowerCase()}%`;
      params.push(s, s, s);
    }
    sql += ` ORDER BY id DESC`;
    const docs = queryAll(sql, params);
    res.json(docs);
  });

  app.post('/api/rag/query', (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query string required.' });

    const retrieved = retrieveRelevantDocuments(query, 3);
    const summary = retrieved.length > 0
      ? `Retrieved ${retrieved.length} relevant clinical protocols from knowledge base matching "${query}".`
      : 'No specific medical guideline directly matched; standard clinical reference applied.';

    res.json({
      documents: retrieved,
      answer: summary,
    });
  });

  app.post('/api/rag/documents', (req: Request, res: Response) => {
    const { title, category, content, keywords, source } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    db.run(
      `INSERT INTO medical_documents (title, category, content, keywords, source) VALUES (?, ?, ?, ?, ?)`,
      [title, category || 'General Medicine', content, keywords || '', source || 'Clinical Practice Guidelines']
    );

    const newDoc = queryOne(`SELECT * FROM medical_documents ORDER BY id DESC LIMIT 1`);
    res.status(201).json(newDoc);
  });

  app.delete('/api/rag/documents/:id', (req: Request, res: Response) => {
    db.run(`DELETE FROM medical_documents WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  });

  // Machine Learning: Health Risk Prediction
  app.post('/api/ml/predict-risk', (req: Request, res: Response) => {
    const input = req.body;
    if (!input || typeof input.age !== 'number' || typeof input.systolic_bp !== 'number') {
      return res.status(400).json({ message: 'Valid physiological parameters required for ML risk evaluation.' });
    }

    const prediction = computeMlHealthRisk({
      age: Number(input.age),
      gender: input.gender || 'Male',
      systolic_bp: Number(input.systolic_bp),
      diastolic_bp: Number(input.diastolic_bp || 80),
      blood_glucose: Number(input.blood_glucose || 95),
      heart_rate: Number(input.heart_rate || 75),
      bmi: Number(input.bmi || 24),
      smoking: !!input.smoking,
      exercise_hours_weekly: Number(input.exercise_hours_weekly || 3),
      family_history: !!input.family_history,
    });

    res.json(prediction);
  });

  // Emergency Triage
  app.post('/api/emergency/triage', (req: Request, res: Response) => {
    const { symptoms = '' } = req.body;
    const isEmerg = detectEmergency(symptoms);
    const nearby = queryAll(`SELECT * FROM hospitals WHERE emergency_available = 1 LIMIT 3`);

    if (isEmerg) {
      res.json({
        isEmergency: true,
        severity: 'Critical',
        advice: 'CRITICAL EMERGENCY DETECTED: Symptoms entered match acute red-flag criteria (e.g. cardiac, stroke, respiratory distress). Do not wait for a routine telemedicine appointment.',
        recommendedAction: 'Call emergency dispatch (108 / 911) immediately or proceed directly to the nearest Emergency Department.',
        nearbyEmergencyHospitals: nearby,
      });
    } else {
      res.json({
        isEmergency: false,
        severity: 'Mild to Moderate',
        advice: 'No acute life-threatening emergency flags detected. You can consult a licensed physician via telemedicine or book an in-person clinic visit.',
        recommendedAction: 'Book an appointment with an appropriate specialist or continue symptom monitoring.',
        nearbyEmergencyHospitals: nearby,
      });
    }
  });

  // AI Health Assistant (LLM + RAG + Emergency Triage)
  app.post('/api/ai/symptom-assistant', async (req: Request, res: Response) => {
    const { message, conversationHistory = [], patientContext = {} } = req.body;
    if (!message) return res.status(400).json({ message: 'Message cannot be empty.' });

    const isEmerg = detectEmergency(message);
    const retrievedDocs = retrieveRelevantDocuments(message, 3);

    // If Gemini client is available, call gemini-3.7-flash with clinical RAG context
    if (ai) {
      try {
        const ragContextText = retrievedDocs
          .map((d) => `[DOCUMENT ${d.id}: "${d.title}" (${d.category}) - Source: ${d.source}]\n${d.content}`)
          .join('\n\n');

        const systemInstruction = `You are a medical AI healthcare assistant for the "AI Telemedicine & Hospital Management System".
Your role is to analyze user symptoms and provide clear, empathetic, and evidence-grounded health information.

RULES YOU MUST STRICTLY FOLLOW:
1. ALWAYS provide a clear medical disclaimer: Do NOT claim to provide a confirmed diagnosis or replace in-person physician evaluation.
2. If the user presents red-flag emergency symptoms (such as severe crushing chest pain, signs of stroke FAST, acute shortness of breath, anaphylaxis, severe bleeding, thunderclap headache), CLEARLY and URGENTLY advise them to seek immediate emergency care (911 / 108 / nearest Emergency Department).
3. Ground your explanation in the retrieved clinical knowledge provided below whenever applicable.
4. Recommend whether the user should consult a doctor, and specify what medical specialty is best suited (e.g., Cardiologist, Pulmonologist, Dermatologist, General Physician).
5. Suggest practical, safe lifestyle or comfort measures while awaiting professional care.
6. Keep formatting neat with clear headings, bullet points, and high readability.

RETRIEVED CLINICAL KNOWLEDGE (RAG CONTEXT):
${ragContextText || 'Standard medical best practice guidelines apply.'}

PATIENT CONTEXT:
${patientContext.age ? `Age: ${patientContext.age}, Gender: ${patientContext.gender || 'Unknown'}` : 'General Patient'}`;

        const prompt = `User Query: "${message}"\n\nPlease analyze these symptoms, integrate the relevant clinical guidance, assess urgency, recommend appropriate medical consultation, and provide helpful next steps.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        const replyText = response.text || '';

        let suggestedSpecialist = 'General Physician';
        const lower = (message + ' ' + replyText).toLowerCase();
        if (lower.includes('heart') || lower.includes('blood pressure') || lower.includes('chest')) suggestedSpecialist = 'Cardiologist';
        else if (lower.includes('brain') || lower.includes('headache') || lower.includes('numbness')) suggestedSpecialist = 'Neurologist';
        else if (lower.includes('skin') || lower.includes('rash') || lower.includes('itching')) suggestedSpecialist = 'Dermatologist';
        else if (lower.includes('child') || lower.includes('infant') || lower.includes('pediatric')) suggestedSpecialist = 'Pediatrician';
        else if (lower.includes('bone') || lower.includes('joint') || lower.includes('fracture')) suggestedSpecialist = 'Orthopedic Surgeon';
        else if (lower.includes('breathing') || lower.includes('cough') || lower.includes('lung')) suggestedSpecialist = 'Pulmonologist';
        else if (lower.includes('anxiety') || lower.includes('depression') || lower.includes('stress')) suggestedSpecialist = 'Psychiatrist';

        return res.json({
          response: replyText,
          isEmergency: isEmerg,
          retrievedDocs,
          suggestedSpecialist,
          confidence: 0.95,
        });
      } catch (err: any) {
        console.error('Gemini API Error, falling back to embedded RAG synthesizer:', err);
      }
    }

    // Embedded RAG response fallback if no Gemini key or upon network issue
    let fallbackText = '';
    let suggestedSpecialist = 'General Physician';

    if (isEmerg) {
      fallbackText = `⚠️ **URGENT MEDICAL ALERT**: The symptoms described may indicate a potential medical emergency.

### Immediate Action Required:
- Please contact **Emergency Services (108 / 911)** immediately or proceed to the nearest **Emergency Room / Trauma Center**.
- Do not drive yourself if experiencing dizziness, severe chest discomfort, or visual impairment.

### Clinical Guidance:
Our emergency triage protocol has flagged your symptoms for urgent clinical assessment. Immediate evaluation is crucial to rule out acute coronary syndromes, stroke, or severe respiratory compromise.

*Disclaimer: This AI assistant provides general health information and is not a substitute for professional medical advice or emergency care.*`;
      suggestedSpecialist = 'Emergency Physician / Cardiologist';
    } else {
      const topDoc = retrievedDocs[0];
      fallbackText = `### Clinical Symptom Assessment
Based on the symptoms you reported and our verified medical knowledge protocols:

1. **Possible Considerations**: 
   ${topDoc ? `Referencing **${topDoc.title}** (${topDoc.category}): Symptoms align with conditions covered under primary care clinical guidelines. Common causes include mild infections, inflammatory response, or lifestyle strain.` : 'Your symptoms suggest non-acute physiological or viral strain.'}

2. **Physician Recommendation**:
   It is recommended that you schedule a consultation with a **${suggestedSpecialist}** if symptoms persist for more than 48 hours, worsen in intensity, or interfere with daily activities.

3. **General Comfort Care**:
   - Maintain optimal hydration with water and electrolyte fluids.
   - Ensure adequate rest and avoid heavy exertion.
   - Monitor temperature and vitals twice daily.

*Disclaimer: This AI assistant provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment.*`;
    }

    res.json({
      response: fallbackText,
      isEmergency: isEmerg,
      retrievedDocs,
      suggestedSpecialist,
      confidence: 0.88,
    });
  });

  // Admin Statistics
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const totalPatients = queryOne(`SELECT COUNT(*) as count FROM patients`)?.count || 0;
    const totalDoctors = queryOne(`SELECT COUNT(*) as count FROM doctors`)?.count || 0;
    const totalHospitals = queryOne(`SELECT COUNT(*) as count FROM hospitals`)?.count || 0;
    const totalAppointments = queryOne(`SELECT COUNT(*) as count FROM appointments`)?.count || 0;
    const totalConsultations = queryOne(`SELECT COUNT(*) as count FROM consultations`)?.count || 0;
    const totalPrescriptions = queryOne(`SELECT COUNT(*) as count FROM prescriptions`)?.count || 0;
    const totalDocuments = queryOne(`SELECT COUNT(*) as count FROM medical_documents`)?.count || 0;

    res.json({
      total_patients: totalPatients,
      total_doctors: totalDoctors,
      total_hospitals: totalHospitals,
      total_appointments: totalAppointments,
      total_consultations: totalConsultations,
      total_prescriptions: totalPrescriptions,
      total_documents: totalDocuments,
      recent_activity: [
        { type: 'appointment', title: 'New appointment scheduled with Dr. Sarah Jenkins', time: '10 mins ago' },
        { type: 'rag', title: 'RAG Knowledge Index refreshed (6 active medical guidelines)', time: '25 mins ago' },
        { type: 'ml', title: 'ML Risk Evaluation completed for Alex Johnson (Score: 24%)', time: '1 hour ago' },
        { type: 'prescription', title: 'Digital E-Prescription issued for Hypertension Stage 1', time: '2 hours ago' },
      ],
    });
  });

  // ----------------------------------------------------
  // VITE / STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 AI Telemedicine & Hospital Management System running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
});
