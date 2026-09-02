import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  User,
  Stethoscope,
  Send,
  Sparkles,
  Paperclip,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Doctor, Patient, User as UserType } from '../types';
import { api } from '../services/api';

interface DirectConsultationPageProps {
  currentUser: UserType | null;
  patient: Patient | null;
  doctor: Doctor | null;
  appointmentId?: number;
  onNavigate: (page: string, params?: any) => void;
}

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  senderName: string;
  text: string;
  time: string;
}

export const DirectConsultationPage: React.FC<DirectConsultationPageProps> = ({
  currentUser,
  patient,
  doctor,
  appointmentId = 1,
  onNavigate,
}) => {
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(145);
  const [callActive, setCallActive] = useState(true);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'doctor',
      senderName: 'Dr. Sarah Jenkins, MD',
      text: 'Good day! I have reviewed your preliminary symptoms and latest blood pressure reading. How have you been feeling since yesterday?',
      time: '10:01 AM',
    },
    {
      id: '2',
      sender: 'patient',
      senderName: 'Alex Johnson',
      text: 'Hello Doctor. The headache has subsided somewhat, but I still feel mild tightness in the back of my neck especially in the evening.',
      time: '10:02 AM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any;
    if (callActive) {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const isDoctor = currentUser?.role === 'doctor';
    const newMsg: Message = {
      id: String(Date.now()),
      sender: isDoctor ? 'doctor' : 'patient',
      senderName: isDoctor ? doctor?.name || 'Doctor' : patient?.name || 'Patient',
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to conclude this telemedicine consultation session?')) {
      setCallActive(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Teleconsult Header Bar */}
      <div className="bg-slate-900 rounded-2xl px-6 py-3.5 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight">HD Encrypted Telemedicine Room</h1>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30">
                Session #{appointmentId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dr. Sarah Jenkins (Cardiology) & Alex Johnson (Patient)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono font-bold text-amber-300">
            {formatDuration(callDurationSeconds)}
          </div>
          <button
            onClick={() => onNavigate('prescriptions')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Prescriptions</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream (8 cols) & Clinical Chat / Dossier (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Canvas Area */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-950 rounded-3xl p-4 sm:p-6 text-white min-h-[520px] shadow-xl relative overflow-hidden border border-slate-800">
          {/* Main Remote Feed (Doctor / Patient) */}
          <div className="relative flex-1 flex items-center justify-center rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            {isVideoActive ? (
              <div className="relative w-full h-full min-h-[380px] flex items-center justify-center bg-radial from-slate-800 to-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                  alt="Doctor Stream"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Dr. Sarah Jenkins, MD (Cardiologist)</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-2">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <VideoOff className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-300">Camera Feed Paused</p>
                <p className="text-xs text-slate-500">Encrypted audio stream remains active</p>
              </div>
            )}

            {/* Picture-in-Picture Local User View */}
            <div className="absolute top-4 right-4 w-32 sm:w-44 h-24 sm:h-32 bg-slate-800 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"
                alt="Self view"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-2 text-[10px] font-bold bg-black/60 px-1.5 py-0.5 rounded text-white">
                You (Alex)
              </div>
            </div>
          </div>

          {/* WebRTC Interactive Control Bar */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4 mt-2">
            <button
              onClick={() => setIsAudioActive(!isAudioActive)}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isAudioActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
              title={isAudioActive ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isAudioActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoActive(!isVideoActive)}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isVideoActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
              title={isVideoActive ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3.5 rounded-2xl font-bold transition-all ${
                isScreenSharing
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Share Medical Reports / Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl flex items-center gap-2 text-sm shadow-md transition-all hover:scale-105"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">End Session</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar: Clinical Chat & Quick Vitals */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[520px] overflow-hidden">
          {/* Top Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical In-Call Chat</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              HIPAA Encrypted
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg) => {
              const isDoctor = msg.sender === 'doctor';
              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl max-w-[90%] space-y-1 ${
                    isDoctor
                      ? 'bg-teal-50/80 border border-teal-200 text-slate-800 mr-auto rounded-tl-none'
                      : 'bg-slate-900 text-white ml-auto rounded-tr-none'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-bold ${isDoctor ? 'text-teal-800' : 'text-teal-300'}`}>
                      {msg.senderName}
                    </span>
                    <span className={isDoctor ? 'text-slate-400' : 'text-slate-400'}>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Doctor Prescription Trigger */}
          <div className="p-2 bg-teal-50/60 border-t border-teal-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-teal-900 font-semibold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              Rx Ready to Transmit
            </span>
            <button
              onClick={() => onNavigate('prescriptions')}
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px]"
            >
              Open Rx Pad
            </button>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send message to physician..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
