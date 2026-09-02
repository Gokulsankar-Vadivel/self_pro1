import React, { useState } from 'react';
import {
  HeartPulse,
  Stethoscope,
  Building2,
  CalendarCheck,
  Bot,
  AlertTriangle,
  Activity,
  BrainCircuit,
  Pill,
  ShieldCheck,
  Clock,
  Video,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Flame,
} from 'lucide-react';
import { Doctor, Hospital } from '../types';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  doctors: Doctor[];
  hospitals: Hospital[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, doctors, hospitals }) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [symptomInput, setSymptomInput] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('doctors', { search: quickSearch.trim() });
    }
  };

  const handleQuickSymptomCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptomInput.trim()) {
      onNavigate('ai-assistant', { initialQuery: symptomInput.trim() });
    } else {
      onNavigate('ai-assistant');
    }
  };

  const services = [
    {
      icon: Video,
      title: 'HD Teleconsultation',
      desc: 'Connect with board-certified physicians via encrypted video calls, voice sessions, or secure medical chat.',
      page: 'doctors',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      icon: Bot,
      title: 'AI Health Triage & RAG',
      desc: 'Retrieval-Augmented clinical assistant grounded in verified medical documents for real-time guidance.',
      page: 'ai-assistant',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      icon: Pill,
      title: 'Digital E-Prescriptions',
      desc: 'Direct prescription generation with dosage schedules, food instructions, drug interaction flags, and QR validation.',
      page: 'prescriptions',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: Clock,
      title: 'Smart Pill Reminders',
      desc: 'Automated 5-minute pre-alerts, audible audio chimes, and adherence tracking for chronic medications.',
      page: 'reminders',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      icon: Activity,
      title: 'Vitals & Trend Analytics',
      desc: 'Interactive Chart.js tracking for Blood Pressure, Heart Rate, Glucose, SpO2, Temperature, and BMI.',
      page: 'vitals',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      icon: BrainCircuit,
      title: 'ML Health Risk Predictor',
      desc: 'Machine learning ensemble models calculating cardiovascular, diabetic, and hypertension risk probabilities.',
      page: 'ml-prediction',
      color: 'bg-violet-50 text-violet-700 border-violet-200',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-slate-50 to-white pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-300 text-teal-800 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                <span>Next-Gen Medical Telemedicine & Hospital Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Healthcare, <br />
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Seamless digital consultations, immediate AI triage assistance with RAG knowledge grounding, smart e-prescriptions, vitals monitoring, and 24/7 emergency coordination.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('doctors')}
                  id="hero-consult-doctor-btn"
                  className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Consult a Doctor</span>
                </button>

                <button
                  onClick={() => onNavigate('hospitals')}
                  id="hero-find-hospital-btn"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-sm shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span>Find Nearby Hospital</span>
                </button>

                <button
                  onClick={() => onNavigate('ai-assistant')}
                  id="hero-ai-assistant-btn"
                  className="flex items-center gap-2 px-5 py-3.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  <Bot className="w-5 h-5 text-cyan-600" />
                  <span>AI Symptom Triage</span>
                </button>
              </div>

              {/* Quick Search Doctor / Hospital */}
              <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    placeholder="Search doctor by name, specialty (e.g., Cardiology, Pediatrics) or hospital..."
                    className="w-full pl-11 pr-24 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Trust & Key Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">50+</p>
                  <p className="text-xs text-slate-500">Verified Specialists</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">15+</p>
                  <p className="text-xs text-slate-500">Partner Hospitals</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-teal-600">24/7</p>
                  <p className="text-xs text-slate-500">Emergency & Triage</p>
                </div>
              </div>
            </div>

            {/* Right Hero Clinical Card preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5">
                {/* Header status */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Clinical Portal</h4>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Doctors Online Now
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Telemedicine 3.0
                  </span>
                </div>

                {/* AI Triage Teaser Box */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 rounded-xl border border-teal-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-slate-900">Instant AI Symptom Check</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Describe how you feel in plain English. Our RAG-powered engine evaluates urgency and recommends relevant medical specialists.
                  </p>
                  <form onSubmit={handleQuickSymptomCheck} className="flex gap-2">
                    <input
                      type="text"
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      placeholder="e.g. Mild headache & fever for 2 days"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      Analyze
                    </button>
                  </form>
                </div>

                {/* Quick Doctor Online Card */}
                {doctors.length > 0 && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3">
                    <img
                      src={doctors[0].image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                      alt={doctors[0].name}
                      className="w-12 h-12 rounded-xl object-cover border border-teal-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{doctors[0].name}</h5>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          ★ {doctors[0].rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700 font-medium truncate">{doctors[0].specialization}</p>
                      <p className="text-[10px] text-slate-500 truncate">{doctors[0].hospital_name || 'Metro General Hospital'}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('book-appointment', { doctor_id: doctors[0].id })}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors"
                    >
                      Consult
                    </button>
                  </div>
                )}

                {/* Live ER Bed Availability Badge */}
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    City Emergency Beds Available:
                  </span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    140+ Beds Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Comprehensive Digital Health Suite
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Patients, Clinicians & Hospitals
          </h2>
          <p className="text-sm text-slate-600">
            End-to-end medical workflows connected via secure REST APIs, SQLite database persistence, AI triage, and scikit-learn ML health models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate(svc.page)}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${svc.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-700">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Health Assistant Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden border border-teal-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
                <Bot className="w-4 h-4 text-teal-400" />
                <span>RAG Retrieval Augmented Generation Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                AI Health Assistant with Medical Knowledge Retrieval
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Unlike generic chatbots, our medical AI engine retrieves authoritative clinical guidelines (AHA, ADA, CDC, WHO) from the local SQLite knowledge collection before crafting structured recommendations, detecting emergency red flags, and suggesting the exact specialist.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-500/20"
                >
                  Launch AI Assistant
                </button>
                <button
                  onClick={() => onNavigate('rag-knowledge')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 transition-colors"
                >
                  View Medical Knowledge Index
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-800/80 backdrop-blur rounded-2xl p-5 border border-slate-700/80 space-y-3 text-xs">
              <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>RAG Retrieval Workflow</span>
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700">
                  <span className="text-teal-400 font-semibold">1. Symptom Input:</span>
                  <p className="text-slate-300 text-[11px]">User enters complaints (e.g. chest tightness, fever).</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700">
                  <span className="text-teal-400 font-semibold">2. Document Retrieval:</span>
                  <p className="text-slate-300 text-[11px]">SQLite RAG engine matches verified medical docs.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700">
                  <span className="text-teal-400 font-semibold">3. LLM Synthesis:</span>
                  <p className="text-slate-300 text-[11px]">Produces structured advice + disclaimer + emergency safety check.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Expert Medical Specialists
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Consult Top Verified Physicians
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Experienced doctors across Cardiology, Neurology, Pediatrics, Orthopedics, Pulmonology, and Dermatology.
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 px-4 py-2 bg-teal-50 rounded-lg border border-teal-200 shrink-0 self-start sm:self-auto"
          >
            <span>View All Doctors ({doctors.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-200 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      ★ {doc.rating} Rating
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 leading-tight">{doc.name}</h4>
                    <p className="text-xs text-teal-600 font-semibold">{doc.specialization}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="truncate"><strong>Hospital:</strong> {doc.hospital_name || 'General Hospital'}</p>
                  <p><strong>Experience:</strong> {doc.experience_years} Years</p>
                  <p className="truncate"><strong>Timing:</strong> {doc.available_time}</p>
                  <p className="text-teal-700 font-bold"><strong>Fee:</strong> ${doc.consultation_fee} / consult</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onNavigate('book-appointment', { doctor_id: doc.id })}
                  className="w-full py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors text-center"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-3xl p-8 lg:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-200" />
              <span>24/7 Rapid Emergency Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Life-Threatening Emergency Support
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              If you or someone nearby experiences crushing chest pain, difficulty breathing, acute trauma, or signs of stroke, do not wait. Trigger immediate emergency assistance.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold">
              <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                Ambulance: 108 / 911
              </span>
              <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                Trauma Units: Active
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('emergency')}
              id="home-emergency-triage-btn"
              className="px-6 py-3.5 bg-white hover:bg-rose-50 text-rose-700 font-extrabold rounded-xl text-sm shadow-md transition-all hover:scale-105"
            >
              Open Emergency Triage & ER Finder
            </button>
            <button
              onClick={() => onNavigate('hospitals', { emergency_only: true })}
              className="px-6 py-3.5 bg-rose-900/60 hover:bg-rose-900 text-white font-bold rounded-xl text-sm border border-rose-400/40 transition-colors"
            >
              Nearby ER Hospitals
            </button>
          </div>
        </div>
      </section>

      {/* Technology & Architecture Section (Final-Year Project Highlights) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
              Technical Architecture & Stack
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Professional Final-Year Medical Engineering Project
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-teal-700 block mb-1">Frontend</span>
              <p className="text-slate-600">React.js + Tailwind CSS</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-teal-700 block mb-1">Backend</span>
              <p className="text-slate-600">Python Flask + Express</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-teal-700 block mb-1">Database</span>
              <p className="text-slate-600">SQLite (11 Tables)</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-teal-700 block mb-1">AI & RAG</span>
              <p className="text-slate-600">Gemini LLM + Retrieval</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-teal-700 block mb-1">Machine Learning</span>
              <p className="text-slate-600">Scikit-Learn Risk Model</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-extrabold text-teal-700 block mb-1">Visualization</span>
              <p className="text-slate-600">Chart.js + Lucide</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
