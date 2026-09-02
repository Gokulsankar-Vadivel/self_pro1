import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Siren,
  Building2,
  HeartPulse,
  Activity,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { Hospital } from '../types';

interface EmergencySupportPageProps {
  hospitals: Hospital[];
  onNavigate: (page: string, params?: any) => void;
}

export const EmergencySupportPage: React.FC<EmergencySupportPageProps> = ({ hospitals, onNavigate }) => {
  const [sosDispatched, setSosDispatched] = useState(false);
  const [symptomQuery, setSymptomQuery] = useState('');
  const [triageAssessment, setTriageAssessment] = useState<{
    urgency: 'CRITICAL_EMERGENCY' | 'URGENT' | 'STANDARD';
    reason: string;
    protocol: string;
  } | null>(null);

  const emergencyHospitals = hospitals.filter((h) => h.emergency_available === 1);

  const handleDispatchSOS = () => {
    setSosDispatched(true);
    // Simulate audio alert
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}
  };

  const handleEvaluateEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomQuery.trim()) return;

    const lower = symptomQuery.toLowerCase();
    const isCritical = [
      'chest pain', 'heart attack', 'cannot breathe', 'stroke', 'slurred speech',
      'unconscious', 'severe bleeding', 'anaphylaxis', 'worst headache', 'paralysis'
    ].some((k) => lower.includes(k));

    const isUrgent = [
      'high fever', 'fracture', 'asthma', 'vomiting blood', 'burn', 'deep cut', 'seizure'
    ].some((k) => lower.includes(k));

    if (isCritical) {
      setTriageAssessment({
        urgency: 'CRITICAL_EMERGENCY',
        reason: 'Symptoms indicate potential acute cardiovascular, neurological, or airway compromise.',
        protocol: 'Activate 108 / 911 dispatch immediately. Keep patient calm and seated. Do not attempt private transport if ambulance is in transit.',
      });
    } else if (isUrgent) {
      setTriageAssessment({
        urgency: 'URGENT',
        reason: 'Urgent medical attention warranted within 1-2 hours.',
        protocol: 'Proceed directly to the nearest Emergency Room or Trauma Center listed below.',
      });
    } else {
      setTriageAssessment({
        urgency: 'STANDARD',
        reason: 'Symptoms appear non-life-threatening at this moment.',
        protocol: 'You may consult an on-call physician via teleconsultation or use the AI symptom assistant for further evaluation.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Red Alert Header */}
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-widest">
              <Siren className="w-4 h-4 text-amber-200 animate-spin" />
              <span>National Emergency Care & Trauma Hotline</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Emergency SOS Response Center
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              If someone is unresponsive, in respiratory arrest, or exhibiting acute stroke/cardiac distress, trigger rapid dispatch or contact emergency services immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {!sosDispatched ? (
              <button
                onClick={handleDispatchSOS}
                id="emergency-trigger-dispatch-btn"
                className="px-8 py-4 bg-white hover:bg-rose-50 text-rose-700 font-black rounded-2xl text-base shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-rose-700" />
                <span>Simulate 1-Click SOS Dispatch</span>
              </button>
            ) : (
              <div className="p-4 bg-black/40 rounded-2xl border border-rose-300 text-center space-y-1 animate-pulse">
                <span className="text-xs font-bold text-amber-300">🚨 SOS SIGNAL BROADCASTED</span>
                <p className="text-xs text-white">Nearest ambulance team alerted • Emergency contact notified</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Helplines Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
        <a
          href="tel:911"
          className="p-4 bg-white rounded-2xl border-2 border-rose-200 shadow-xs hover:border-rose-400 transition-colors flex items-center justify-between text-rose-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">National Emergency</span>
              <span className="text-lg font-black text-slate-900">108 / 911</span>
            </div>
          </div>
          <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded text-rose-800">Direct Dial</span>
        </a>

        <a
          href="tel:18002221222"
          className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xs hover:border-teal-400 transition-colors flex items-center justify-between text-teal-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Poison Control</span>
              <span className="text-sm font-bold text-slate-900">1-800-222-1222</span>
            </div>
          </div>
          <span className="text-[10px] bg-teal-100 px-2 py-0.5 rounded text-teal-800">Toll Free</span>
        </a>

        <a
          href="tel:988"
          className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xs hover:border-teal-400 transition-colors flex items-center justify-between text-indigo-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Mental Health Crisis</span>
              <span className="text-lg font-black text-slate-900">988</span>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded text-indigo-800">24/7 Helpline</span>
        </a>

        <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Hospital Trauma Beds</span>
            <span className="text-lg font-extrabold text-emerald-400">140+ Beds Ready</span>
          </div>
          <Building2 className="w-8 h-8 text-teal-400" />
        </div>
      </div>

      {/* Emergency Triage Evaluator & First Aid Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rapid Symptom Urgency Evaluator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Rapid Emergency Symptom Evaluator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter current acute symptoms for immediate life-safety classification.
              </p>
            </div>
          </div>

          <form onSubmit={handleEvaluateEmergency} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={symptomQuery}
                onChange={(e) => setSymptomQuery(e.target.value)}
                placeholder="e.g. Crushing chest pressure radiating to arm, cold sweat"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
              >
                Assess
              </button>
            </div>
          </form>

          {triageAssessment && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-3 animate-in fade-in duration-200 ${
                triageAssessment.urgency === 'CRITICAL_EMERGENCY'
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : triageAssessment.urgency === 'URGENT'
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-teal-50 border-teal-300 text-teal-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">
                  Triage Result: {triageAssessment.urgency.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold">Severity: High</span>
              </div>
              <p className="text-xs leading-relaxed">{triageAssessment.reason}</p>
              <div className="p-3 bg-white/80 rounded-xl text-xs font-semibold border border-black/10">
                <strong>Recommended Action:</strong> {triageAssessment.protocol}
              </div>
            </div>
          )}

          {/* Quick First Aid Protocols */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Essential Emergency First-Aid Protocols
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-xs">1. Stroke F.A.S.T Protocol</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>F</strong>ace drooping? <strong>A</strong>rm weakness? <strong>S</strong>peech difficulty? <strong>T</strong>ime to call emergency 108/911.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-xs">2. Heart Attack First Response</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sit patient upright, loosen tight collar, administer chewable Aspirin 325mg if non-allergic, avoid physical exertion.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-xs">3. CPR Hand Placement (Adult)</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Center of chest, push hard and fast (100–120 beats/min) to 2 inches depth. Allow full chest recoil.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-xs">4. Severe Bleeding Control</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Apply firm direct pressure with sterile cloth, elevate limb above heart level, do not remove embedded foreign objects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nearest 24/7 Emergency Hospitals (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-rose-600" />
              <span>Nearest 24/7 ER Hospitals</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Trauma Active
            </span>
          </div>

          <div className="space-y-3">
            {emergencyHospitals.map((hosp) => (
              <div key={hosp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{hosp.name}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {hosp.available_beds} ER Beds
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{hosp.address}, {hosp.city}</span>
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <a href={`tel:${hosp.phone}`} className="font-bold text-rose-700 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{hosp.phone}</span>
                  </a>
                  <button
                    onClick={() => {
                      const query = encodeURIComponent(`${hosp.name}, ${hosp.address}, ${hosp.city}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-[11px]"
                  >
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
