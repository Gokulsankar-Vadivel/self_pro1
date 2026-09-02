import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  Star,
  Video,
  DollarSign,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorSearchPageProps {
  doctors: Doctor[];
  initialSearch?: string;
  initialSpecialization?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const DoctorSearchPage: React.FC<DoctorSearchPageProps> = ({
  doctors,
  initialSearch = '',
  initialSpecialization = '',
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialization);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee_asc' | 'fee_desc'>('rating');

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'General Medicine',
    'Dermatology',
    'Orthopedics',
    'Pulmonology',
  ];

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const matchesSearch =
          !searchTerm ||
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.hospital_name && doc.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSpecialty =
          !selectedSpecialty ||
          selectedSpecialty === 'All Specialties' ||
          doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase();

        const matchesCity =
          !selectedCity || (doc.hospital_city && doc.hospital_city.toLowerCase().includes(selectedCity.toLowerCase()));

        return matchesSearch && matchesSpecialty && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'experience') return (b.experience_years || 0) - (a.experience_years || 0);
        if (sortBy === 'fee_asc') return a.consultation_fee - b.consultation_fee;
        if (sortBy === 'fee_desc') return b.consultation_fee - a.consultation_fee;
        return 0;
      });
  }, [doctors, searchTerm, selectedSpecialty, selectedCity, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
            Specialist Physician Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find & Consult Verified Doctors Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search board-certified physicians, view patient ratings and hospital affiliations, and schedule instant encrypted video teleconsultations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name or condition..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {specialties.map((s, i) => (
                <option key={i} value={s === 'All Specialties' ? '' : s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Locations</option>
              <option value="Metropolis">Metropolis</option>
              <option value="West Valley">West Valley</option>
              <option value="South Suburb">South Suburb</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            >
              <option value="rating">Top Rated ★</option>
              <option value="experience">Experience: High</option>
              <option value="fee_asc">Fee: Low to High</option>
              <option value="fee_desc">Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick specialty tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Popular:</span>
          {specialties.slice(1).map((spec, i) => (
            <button
              key={i}
              onClick={() => setSelectedSpecialty(spec === selectedSpecialty ? '' : spec)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Showing {filteredDoctors.length} Verified Doctors</span>
          <span>Encrypted HIPAA/Telemedicine Standard</span>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Doctors Match Your Search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your specialty filter or location keyword.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setSelectedCity('');
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Top Doctor Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-200 shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          ★ {doc.rating || 4.9}
                        </span>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {doc.experience_years}y Exp
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1 truncate">{doc.name}</h3>
                      <p className="text-xs font-semibold text-teal-600 truncate">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400 truncate">{doc.qualifications}</p>
                    </div>
                  </div>

                  {/* Hospital & Timing Box */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-semibold truncate">{doc.hospital_name || 'Metro General Hospital'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doc.available_days} ({doc.available_time})</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold">
                      <span className="text-slate-500 text-[11px]">Consultation Fee:</span>
                      <span className="text-sm text-slate-900">${doc.consultation_fee} / session</span>
                    </div>
                  </div>

                  {doc.bio && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{doc.bio}</p>
                  )}
                </div>

                {/* Card Bottom CTA */}
                <div className="p-6 pt-0 flex gap-2">
                  <button
                    onClick={() => onNavigate('book-appointment', { doctor_id: doc.id })}
                    className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 text-center"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => onNavigate('consultation', { doctor_id: doc.id })}
                    className="p-2.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-xl text-xs font-bold"
                    title="Direct Video Consultation"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
