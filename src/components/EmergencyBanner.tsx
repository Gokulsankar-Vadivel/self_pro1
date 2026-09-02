import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, MapPin, X, Siren, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onNavigateToEmergency: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onNavigateToEmergency }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white px-4 py-2.5 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="p-1.5 bg-white/20 rounded-full animate-bounce shrink-0">
            <Siren className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold tracking-wide uppercase text-xs bg-black/25 px-2 py-0.5 rounded-full mr-2">
              Emergency Care
            </span>
            <span className="font-medium text-xs sm:text-sm">
              Chest pain, severe breathlessness, or stroke symptoms? Call <strong>108 / 911</strong> immediately.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateToEmergency}
            id="emergency-banner-action-btn"
            className="flex items-center gap-1 px-3 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <span>Emergency Support & ERs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded text-rose-100"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
