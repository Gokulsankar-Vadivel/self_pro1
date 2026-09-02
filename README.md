# AI Telemedicine & Hospital Management System
> **Tagline:** Smart Healthcare, Anytime, Anywhere  
> **Final-Year College Project** | Complete Full-Stack Medical Telehealth Platform

---

## 🌟 Project Overview

**AI Telemedicine & Hospital Management System** is a production-grade, responsive healthcare platform that connects patients, licensed physicians, and hospital administrations. It integrates **Gemini AI LLM** for clinical symptom triage, **Retrieval-Augmented Generation (RAG)** over verified medical guidelines, a **Machine Learning health risk engine** (Framingham & ADA algorithms), Chart.js longitudinal vitals tracking, WebRTC teleconsultation simulation, and sound-synthesized medicine reminders.

---

## 🚀 Key Modules & Capabilities

1. **AI Healthcare Assistant & Triage**
   - Gemini 2.5/Flash-powered conversational medical assistant with red-flag emergency detection.
   - Retrieval-Augmented Generation (RAG) fetching clinical documents from the medical corpus.
   - Suggested medical specialties and direct 1-click specialist appointment booking.

2. **Doctor Directory & Booking Wizard**
   - Search by specialty, location, rating, and fee.
   - Step-by-step booking: Video Call, Audio Call, In-Clinic, or Chat.

3. **Live Teleconsultation Room**
   - Encrypted HD video stream controls (Camera, Microphone, Screen Sharing, Session Timer).
   - Real-time clinical text chat and in-call prescription generator.

4. **Digital Medical Prescriptions (Rx)**
   - Official prescription format with doctor signature, hospital header, drug dosage table, meal timing, and QR code cryptographic verification.
   - 1-click printable & exportable view.

5. **Patient Dashboard & Vitals Telemetry**
   - Complete patient medical profile (Age, Blood Group, Allergies, Emergency Contacts).
   - Interactive Chart.js graphs for Blood Pressure (Systolic/Diastolic), Heart Rate, and Blood Glucose trends.
   - Longitudinal health logs with classification tags.

6. **Machine Learning Health Risk Prediction**
   - Multi-variate predictive engine evaluating 10-Year Cardiovascular Disease Risk (Framingham Model), Type-2 Diabetes Risk (ADA guidelines), and Hypertension Progression.
   - Actionable lifestyle and clinical intervention plans.

7. **Smart Medicine Schedule & Web Audio Alarm**
   - Dose scheduler with morning/afternoon/night & before/after food instructions.
   - Interactive browser Web Audio synthesizer alarm modal with snooze & adherence tracking.

8. **Hospital Finder & 24/7 Emergency Center**
   - Real-time ICU and emergency trauma bed availability tracker.
   - 1-Click SOS emergency dispatch simulation with acoustic alarm.
   - Stroke F.A.S.T., CPR, and acute trauma first-aid protocols.

9. **Role-Based Portals**
   - **Patient Portal:** Appointments, health records, reminders, prescriptions.
   - **Doctor Portal:** Consultation queue, patient records, digital Rx pad, availability scheduling.
   - **Hospital / Admin Portal:** Bed capacity management, physician registry, analytics, patient admissions.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Chart.js, React-Chartjs-2
- **Backend:** Express & Node.js Full-Stack proxy / Python Flask REST API
- **Database:** SQLite embedded relational database
- **AI & RAG:** Google Gemini 2.5 SDK (`@google/genai`), SQLite Knowledge Retrieval Corpus
- **Analytics:** Framingham Heart & Finnish Diabetes ML Risk Scoring Models

---

## 📦 Installation & Setup

### 1. Frontend & Full-Stack Node Dev Server
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build for production
npm run build
```

### 2. Python Flask Backend (Optional Standalone Backend)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # Starts Flask REST API on http://localhost:5000
```

### 3. Environment Variables
Create a `.env` file with:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🩺 Demo Credentials (Quick Login)

| Role | Email | Password | Preloaded Features |
|---|---|---|---|
| **Patient** | `alex.johnson@example.com` | `patient123` | Active appointments, vitals history, prescriptions, alarms |
| **Doctor** | `doctor.sarah@metrohealth.org` | `doctor123` | Patient queue, telemedicine room, digital Rx pad |
| **Hospital Admin** | `admin@metrohealth.org` | `admin123` | Bed tracker, doctor roster, system metrics |

---

## 📄 License & Academic Attribution
Developed as an academic final-year project demonstrating modern healthcare informatics, AI-assisted triage, and telemedicine systems.
