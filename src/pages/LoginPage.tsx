import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  UserPlus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { User as UserType, Patient, Doctor } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserType, patient?: Patient, doctor?: Doctor) => void;
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin'>('patient');

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register Form State
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regAge, setRegAge] = useState(32);
  const [regGender, setRegGender] = useState('Male');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regPhone, setRegPhone] = useState('+1 555-0192');
  const [regSpecialization, setRegSpecialization] = useState('Cardiology');
  const [regQualifications, setRegQualifications] = useState('MBBS, MD');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Quick 1-Click Demo Logins
  const handleQuickDemo = async (role: 'patient' | 'doctor' | 'admin') => {
    setLoading(true);
    setErrorMsg('');
    try {
      let emailOrUser = 'patient_alex';
      if (role === 'doctor') emailOrUser = 'dr_sarah';
      if (role === 'admin') emailOrUser = 'admin';

      const res = await api.login({
        username: emailOrUser,
        password: 'password123',
        role,
      });

      localStorage.setItem('auth_token', res.token);
      onLoginSuccess(res.user, res.patient, res.doctor);
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please provide username/email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login({
        username: identifier,
        password,
        role: selectedRole,
      });

      localStorage.setItem('auth_token', res.token);
      onLoginSuccess(res.user, res.patient, res.doctor);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword || !regFullName) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: selectedRole,
        name: regFullName,
        age: regAge,
        gender: regGender,
        blood_group: regBloodGroup,
        phone: regPhone,
        specialization: regSpecialization,
        qualifications: regQualifications,
      });

      localStorage.setItem('auth_token', res.token);
      setSuccessMsg('Registration successful! Logging in...');
      setTimeout(() => {
        onLoginSuccess(res.user, res.patient, res.doctor);
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Top Role Selector Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white text-center">
          <div className="inline-flex p-2 bg-white/10 rounded-2xl mb-2">
            <Lock className="w-6 h-6 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isRegisterMode ? 'Create New Account' : 'Portal Sign In'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Role-Based Authentication for Patients, Clinicians & Administrators
          </p>

          {/* Role Pill Switcher */}
          <div className="flex bg-slate-800/90 p-1 rounded-xl mt-5 border border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'patient'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'doctor'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hospital Admin</span>
            </button>
          </div>
        </div>

        {/* 1-Click Quick Demo Access Bar */}
        {!isRegisterMode && (
          <div className="bg-teal-50/80 px-6 py-3 border-b border-teal-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-teal-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              1-Click Instant Demo Login:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleQuickDemo('patient')}
                className="px-2 py-1 bg-white hover:bg-teal-100 text-teal-800 font-bold rounded border border-teal-200 shadow-2xs"
              >
                Patient
              </button>
              <button
                onClick={() => handleQuickDemo('doctor')}
                className="px-2 py-1 bg-white hover:bg-teal-100 text-teal-800 font-bold rounded border border-teal-200 shadow-2xs"
              >
                Doctor
              </button>
              <button
                onClick={() => handleQuickDemo('admin')}
                className="px-2 py-1 bg-white hover:bg-teal-100 text-teal-800 font-bold rounded border border-teal-200 shadow-2xs"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          {!isRegisterMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'patient'
                        ? 'patient_alex or alex.johnson@example.com'
                        : selectedRole === 'doctor'
                        ? 'dr_sarah or dr.sarah.jenkins@metrohealth.org'
                        : 'admin'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (default: password123)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="capitalize">Logging in as: <strong className="text-teal-700">{selectedRole}</strong></span>
                <span className="text-slate-400">Default pass: password123</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. johndoe"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Clinical Title *
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder={selectedRole === 'doctor' ? 'Dr. John Doe, MD' : 'John Doe'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {selectedRole === 'patient' && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'doctor' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                    <select
                      value={regSpecialization}
                      onChange={(e) => setRegSpecialization(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pulmonology">Pulmonology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications</label>
                    <input
                      type="text"
                      value={regQualifications}
                      onChange={(e) => setRegQualifications(e.target.value)}
                      placeholder="e.g. MBBS, MD, DM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                id="register-submit-btn"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/25 transition-all disabled:opacity-50"
              >
                {loading ? 'Registering...' : `Create ${selectedRole.toUpperCase()} Account`}
              </button>
            </form>
          )}

          {/* Toggle Register / Login */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="font-bold text-teal-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Need a new patient or doctor account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="font-bold text-teal-600 hover:underline"
                >
                  Register Now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
