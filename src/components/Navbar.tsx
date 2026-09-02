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
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  reminderCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  reminderCount = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: HeartPulse },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, highlight: true },
    { id: 'emergency', label: 'Emergency SOS', icon: AlertTriangle, danger: true },
    { id: 'vitals', label: 'Health Vitals', icon: Activity },
    { id: 'ml-prediction', label: 'ML Risk Predictor', icon: BrainCircuit },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
  };

  const getDashboardPage = () => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'doctor') return 'doctor-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    return 'patient-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Emergency Hotline Header Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white px-4 py-1 text-xs flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span>24/7 Smart Telemedicine & Emergency Triage Network</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Emergency Dispatch: <strong className="text-amber-200">108 / 911</strong></span>
          <span className="hidden md:inline text-emerald-100">AI Triage Active</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-800 bg-clip-text text-transparent">
                  Medicare<span className="text-teal-600">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Hospital OS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                Smart Healthcare, Anytime, Anywhere
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.danger
                      ? isActive
                        ? 'bg-rose-600 text-white font-semibold shadow-xs'
                        : 'text-rose-600 hover:bg-rose-50'
                      : item.highlight
                      ? isActive
                        ? 'bg-teal-600 text-white font-semibold shadow-xs'
                        : 'text-teal-700 bg-teal-50/70 hover:bg-teal-100 font-semibold'
                      : isActive
                      ? 'bg-slate-100 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & Auth Area */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Medicine Reminder Shortcut */}
            <button
              onClick={() => handleNavClick('reminders')}
              id="nav-reminders-btn"
              title="Medicine Reminders"
              className="relative p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Pill className="w-5 h-5" />
              {reminderCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-teal-600 text-white rounded-full flex items-center justify-center animate-bounce">
                  {reminderCount}
                </span>
              )}
            </button>

            {/* Quick Book Appointment */}
            <button
              onClick={() => handleNavClick('book-appointment')}
              id="nav-book-appointment-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-lg shadow-sm shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Visit</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => handleNavClick(getDashboardPage())}
                  id="nav-dashboard-btn"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    currentPage.includes('dashboard')
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.username.substring(0, 1)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold leading-tight capitalize">{currentUser.username}</p>
                    <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">{currentUser.role}</span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  id="nav-logout-btn"
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                id="nav-login-btn"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>Portal Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('emergency')}
              className="p-2 text-rose-600 bg-rose-50 rounded-lg"
              title="Emergency SOS"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  item.danger
                    ? 'text-rose-600 bg-rose-50'
                    : isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <button
              onClick={() => handleNavClick('book-appointment')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => handleNavClick('reminders')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
            >
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Medicine Reminders</span>
            </button>

            {currentUser ? (
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleNavClick(getDashboardPage())}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>My Dashboard ({currentUser.role})</span>
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs font-semibold text-rose-600 px-2 py-1 bg-rose-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg text-center"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
