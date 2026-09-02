from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from database import init_db, get_db_connection
from models import UserModel, DoctorModel, HospitalModel
from ml.health_predictor import HealthRiskPredictor
from rag.rag_engine import MedicalRagEngine
from ai.gemini_service import GeminiAssistantService

app = Flask(__name__)
CORS(app)

# Initialize SQLite database on startup
init_db()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "backend": "Python Flask + SQLite"})

# 1. Auth Login
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    identifier = data.get('email') or data.get('username')
    password = data.get('password')
    role = data.get('role')

    user = UserModel.find_by_email_or_username(identifier)
    if not user or user['password_hash'] != password:
        return jsonify({"message": "Invalid credentials."}), 401
    if role and user['role'] != role:
        return jsonify({"message": "Role mismatch."}), 401

    conn = get_db_connection()
    patient = None
    doctor = None
    if user['role'] == 'patient':
        p_row = conn.execute("SELECT * FROM patients WHERE user_id = ?", (user['id'],)).fetchone()
        patient = dict(p_row) if p_row else None
    elif user['role'] == 'doctor':
        d_row = conn.execute("SELECT * FROM doctors WHERE user_id = ?", (user['id'],)).fetchone()
        doctor = dict(d_row) if d_row else None
    conn.close()

    return jsonify({
        "user": {"id": user['id'], "username": user['username'], "email": user['email'], "role": user['role']},
        "patient": patient,
        "doctor": doctor,
        "token": f"jwt_flask_{user['id']}"
    })

# 2. Doctors
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    spec = request.args.get('specialization')
    loc = request.args.get('location')
    hosp_id = request.args.get('hospital_id')
    search = request.args.get('search')
    doctors = DoctorModel.get_all(specialization=spec, location=loc, hospital_id=hosp_id, search=search)
    return jsonify(doctors)

# 3. Hospitals
@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    city = request.args.get('city')
    h_type = request.args.get('type')
    emerg = request.args.get('emergency_only') == 'true'
    dept = request.args.get('department')
    search = request.args.get('search')
    hospitals = HospitalModel.get_all(city=city, hospital_type=h_type, emergency_only=emerg, department=dept, search=search)
    return jsonify(hospitals)

# 4. Appointments
@app.route('/api/appointments', methods=['GET', 'POST'])
def handle_appointments():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json or {}
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, appointment_time, consultation_type, status, symptoms, notes)
            VALUES (?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)
        ''', (
            data.get('patient_id', 1),
            data.get('doctor_id', 1),
            data.get('hospital_id', 1),
            data.get('appointment_date'),
            data.get('appointment_time'),
            data.get('consultation_type', 'Video Call'),
            data.get('symptoms', 'General Consultation'),
            data.get('notes', '')
        ))
        appt_id = cursor.lastrowid
        conn.commit()
        row = conn.execute("SELECT * FROM appointments WHERE id = ?", (appt_id,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201
    else:
        patient_id = request.args.get('patient_id')
        doctor_id = request.args.get('doctor_id')
        sql = '''
            SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization, h.name as hospital_name, p.name as patient_name
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            LEFT JOIN hospitals h ON a.hospital_id = h.id
            LEFT JOIN patients p ON a.patient_id = p.id
            WHERE 1=1
        '''
        params = []
        if patient_id:
            sql += " AND a.patient_id = ?"
            params.append(patient_id)
        if doctor_id:
            sql += " AND a.doctor_id = ?"
            params.append(doctor_id)
        sql += " ORDER BY a.appointment_date DESC"
        rows = conn.execute(sql, params).fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])

# 5. Machine Learning Prediction
@app.route('/api/ml/predict-risk', methods=['POST'])
def predict_ml():
    data = request.json or {}
    result = HealthRiskPredictor.predict(data)
    return jsonify(result)

# 6. AI Health Assistant & RAG
@app.route('/api/ai/symptom-assistant', methods=['POST'])
def ai_assistant():
    data = request.json or {}
    msg = data.get('message', '')
    res = GeminiAssistantService.answer_symptoms(msg, data.get('conversationHistory'), data.get('patientContext'))
    return jsonify(res)

# 7. RAG Documents
@app.route('/api/rag/documents', methods=['GET', 'POST'])
def rag_documents():
    conn = get_db_connection()
    if request.method == 'POST':
        d = request.json or {}
        cursor = conn.cursor()
        cursor.execute("INSERT INTO medical_documents (title, category, content, keywords, source) VALUES (?, ?, ?, ?, ?)",
                       (d.get('title'), d.get('category'), d.get('content'), d.get('keywords', ''), d.get('source', 'Guidelines')))
        doc_id = cursor.lastrowid
        conn.commit()
        row = conn.execute("SELECT * FROM medical_documents WHERE id = ?", (doc_id,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201
    else:
        rows = conn.execute("SELECT * FROM medical_documents ORDER BY id DESC").fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Flask Telemedicine Server running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
