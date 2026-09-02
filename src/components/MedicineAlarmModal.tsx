import React, { useEffect, useState } from 'react';
import { Pill, Clock, BellRing, Check, CheckCircle2, Volume2, X } from 'lucide-react';
import { MedicineReminder } from '../types';

interface MedicineAlarmModalProps {
  reminder: MedicineReminder | null;
  onClose: () => void;
  onMarkTaken: (reminderId: number) => void;
}

export const MedicineAlarmModal: React.FC<MedicineAlarmModalProps> = ({
  reminder,
  onClose,
  onMarkTaken,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (reminder) {
      playMedicalChime();
    }
  }, [reminder]);

  const playMedicalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      setIsPlayingAudio(true);

      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(587.33, now, 0.4); // D5
      playTone(739.99, now + 0.2, 0.4); // F#5
      playTone(880.00, now + 0.4, 0.7); // A5

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 1200);
    } catch {
      // audio context may be blocked by browser policy until interaction
    }
  };

  if (!reminder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-teal-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center animate-bounce">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Scheduled Dose in 5 Mins
            </span>
            <h3 className="text-lg font-bold text-slate-900">Medicine Reminder</h3>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Medication</span>
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-600" />
              {reminder.medicine_name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Dosage</span>
            <span className="text-sm font-semibold text-slate-800">{reminder.dosage}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Scheduled Time</span>
            <span className="text-sm font-semibold text-teal-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {reminder.reminder_time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Instructions</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {reminder.before_after_food}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-5 text-center">
          Take with a glass of water as directed by your physician. Ensure food timing compliance for best absorption.
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onMarkTaken(reminder.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Taken</span>
          </button>
          <button
            onClick={playMedicalChime}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
            title="Replay Chime"
          >
            <Volume2 className="w-5 h-5 text-teal-600" />
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            Snooze (5m)
          </button>
        </div>
      </div>
    </div>
  );
};
