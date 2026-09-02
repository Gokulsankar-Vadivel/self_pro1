import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  MapPin,
  PhoneCall,
  AlertTriangle,
  Bed,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  Star,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Hospital } from '../types';

interface HospitalFinderPageProps {
  hospitals: Hospital[];
  initialEmergencyOnly?: boolean;
  onNavigate: (page: string, params?: any) => void;
}

export const HospitalFinderPage: React.FC<HospitalFinderPageProps> = ({
  hospitals,
  initialEmergencyOnly = false,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(initialEmergencyOnly);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        !searchTerm ||
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.departments && h.departments.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCity = !selectedCity || h.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesType = !selectedType || h.type.toLowerCase() === selectedType.toLowerCase();
      const matchesEmergency = !emergencyOnly || h.emergency_available === 1;

      return matchesSearch && matchesCity && matchesType && matchesEmergency;
    });
  }, [hospitals, searchTerm, selectedCity, selectedType, emergencyOnly]);

  const openMapsDirections = (hosp: Hospital) => {
    const query = encodeURIComponent(`${hosp.name}, ${hosp.address}, ${hosp.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
            Network Hospital Directory & ICU Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find Partner Hospitals & Emergency Trauma Centers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time emergency bed capacity, specialized clinical departments, telephone dispatch, and turn-by-turn navigation.
          </p>
        </div>

        <button
          onClick={() => onNavigate('emergency')}
          className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <AlertTriangle className="w-4 h-4 text-amber-200" />
          <span>Emergency ER Triage Hub</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hospital name, address, or department..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Cities</option>
              <option value="Metropolis">Metropolis</option>
              <option value="West Valley">West Valley</option>
              <option value="South Suburb">South Suburb</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Super Specialty">Super Specialty</option>
              <option value="Trauma Center">Trauma Center</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 cursor-pointer w-full justify-center">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>24/7 ER Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Found {filteredHospitals.length} Network Hospitals</span>
          <span>Verified Trauma Accreditations</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all p-6 sm:p-7 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">{hosp.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>{hosp.address}, {hosp.city}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                    ★ {hosp.rating || 4.8}
                  </span>
                </div>

                {/* Bed Capacity Meter */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-teal-600" />
                      <span>Live Bed Capacity:</span>
                    </span>
                    <span className="font-extrabold text-emerald-700">
                      {hosp.available_beds} Available / {hosp.total_beds} Total
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full"
                      style={{ width: `${((hosp.available_beds || 0) / (hosp.total_beds || 1)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                    <span>Emergency Status: <strong className="text-emerald-600">24/7 Trauma Ready</strong></span>
                    <span>Facility Type: <strong>{hosp.type}</strong></span>
                  </div>
                </div>

                {/* Departments Tag Cloud */}
                {hosp.departments && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Clinical Departments</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {hosp.departments.split(',').map((dept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                        >
                          {dept.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={`tel:${hosp.phone}`}
                  className="flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-800"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{hosp.phone}</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openMapsDirections(hosp)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-teal-600" />
                    <span>Get Directions</span>
                  </button>
                  <button
                    onClick={() => onNavigate('book-appointment', { hospital_id: hosp.id })}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-xs"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
