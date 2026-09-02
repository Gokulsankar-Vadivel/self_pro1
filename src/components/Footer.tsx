import React from 'react';
import { HeartPulse, PhoneCall, ShieldAlert, FileText, Database, Bot, Stethoscope, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Medicare<span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Smart Healthcare, Anytime, Anywhere. An integrated AI-powered Telemedicine, Hospital Management, and Emergency Triage Ecosystem.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Central Medical Hub, Metropolis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>contact@medicare.ai</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Clinical Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-teal-400 transition-colors">
                  Find Doctors & Specialists
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hospitals')} className="hover:text-teal-400 transition-colors">
                  Hospital Locator & ER Beds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book-appointment')} className="hover:text-teal-400 transition-colors">
                  Book Teleconsultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vitals')} className="hover:text-teal-400 transition-colors">
                  Health Vitals Monitoring
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reminders')} className="hover:text-teal-400 transition-colors">
                  Medicine Reminders
                </button>
              </li>
            </ul>
          </div>

          {/* AI & Innovation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">AI & Analytics</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('ai-assistant')} className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-teal-400" />
                  <span>AI Symptom Assistant</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rag-knowledge')} className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>RAG Knowledge Index</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ml-prediction')} className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                  <span>ML Health Risk Engine</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="hover:text-rose-400 transition-colors flex items-center gap-1 text-rose-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency SOS Dispatch</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>24/7 Rapid Helplines</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-700 pb-1">
                <span className="text-slate-400">National Ambulance:</span>
                <span className="font-bold text-white">108 / 911</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-1">
                <span className="text-slate-400">Emergency Trauma:</span>
                <span className="font-bold text-white">+1 (555) 911-0001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Poison Control:</span>
                <span className="font-bold text-white">1-800-222-1222</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('emergency')}
              className="mt-3 w-full py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors text-center"
            >
              Open Emergency Triage
            </button>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left leading-relaxed">
            <strong className="text-slate-400">Clinical Disclaimer:</strong> This platform provides general health intelligence, tele-consultation coordination, and retrieval-augmented informational support. It does not replace emergency medical response or definitive diagnostic examinations.
          </p>
          <div className="flex items-center gap-6 shrink-0 text-slate-400">
            <span>React + Python Flask + SQLite</span>
            <span>Final Year College Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
