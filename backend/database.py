import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'telemedicine.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.executescript('''
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
    ''')

    # Seed initial test data
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (id, username, email, password_hash, role) VALUES (1, 'admin', 'admin@medicare.ai', 'password123', 'admin');")
        cursor.execute("INSERT INTO users (id, username, email, password_hash, role) VALUES (2, 'patient_alex', 'alex.johnson@example.com', 'password123', 'patient');")
        cursor.execute("INSERT INTO users (id, username, email, password_hash, role) VALUES (3, 'dr_sarah', 'dr.sarah.jenkins@metrohealth.org', 'password123', 'doctor');")
        
        cursor.execute('''
        INSERT INTO patients (id, user_id, name, age, gender, blood_group, phone, address, emergency_contact, medical_history)
        VALUES (1, 2, 'Alex Johnson', 34, 'Male', 'O+', '+1 (555) 987-6543', '742 Evergreen Terrace, Metropolis', 'Emily Johnson (+1 555-987-6544)', 'Mild allergic rhinitis, family history of hypertension.');
        ''')

        cursor.execute('''
        INSERT INTO hospitals (id, name, type, address, city, phone, emergency_available, total_beds, available_beds, departments, rating)
        VALUES 
        (1, 'Metro General Hospital & Trauma Center', 'Government', '450 Healthcare Blvd', 'Metropolis', '+1 (555) 911-0001', 1, 650, 84, 'Emergency & Trauma, Cardiology, Pulmonology, Pediatrics, Neurology', 4.8),
        (2, 'Apex Super Specialty Medical Institute', 'Private', '108 Horizon Park', 'Metropolis', '+1 (555) 911-0002', 1, 420, 56, 'Cardiovascular Surgery, Neurology & Stroke Unit, Oncology, Dermatology', 4.9);
        ''')

        cursor.execute('''
        INSERT INTO doctors (id, user_id, hospital_id, name, specialization, qualifications, experience_years, consultation_fee, available_days, available_time, phone, email, rating, bio)
        VALUES (1, 3, 1, 'Dr. Sarah Jenkins, MD', 'Cardiology', 'MBBS, MD (Cardiology), FACC', 14, 45, 'Mon, Tue, Wed, Thu, Fri', '09:00 AM - 04:00 PM', '+1 (555) 234-5678', 'dr.sarah.jenkins@metrohealth.org', 4.9, 'Cardiologist specializing in preventive heart care, hypertension, and ischemic heart disease.');
        ''')

        cursor.execute('''
        INSERT INTO medical_documents (title, category, content, keywords, source)
        VALUES ('Emergency Triage Protocols & Red-Flag Symptoms', 'Emergency Medicine', 'RED FLAG EMERGENCY CRITERIA: Acute chest pain radiating to left arm/jaw with diaphoresis requires immediate 911/108 activation. Stroke FAST protocol: Facial droop, Arm weakness, Slurred speech, Time to call emergency. Severe dyspnea SpO2 < 90%. Do not delay emergency response with tele-triage.', 'chest pain, shortness of breath, stroke, FAST, anaphylaxis, emergency', 'AHA & WHO Guidelines');
        ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("SQLite database initialized successfully.")
