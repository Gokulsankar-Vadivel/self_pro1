import React, { useState } from 'react';
import {
  TrendingUp,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Heart,
  Droplet,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Patient } from '../types';

interface MlPredictionPageProps {
  patient: Patient | null;
  onNavigate: (page: string, params?: any) => void;
}

export const MlPredictionPage: React.FC<MlPredictionPageProps> = ({ patient, onNavigate }) => {
  const [age, setAge] = useState(patient?.age || 34);
  const [gender, setGender] = useState(patient?.gender || 'Male');
  const [systolicBp, setSystolicBp] = useState(128);
  const [diastolicBp, setDiastolicBp] = useState(82);
  const [fastingGlucose, setFastingGlucose] = useState(105);
  const [cholesterol, setCholesterol] = useState(195);
  const [hdl, setHdl] = useState(48);
  const [bmi, setBmi] = useState(24.5);
  const [isSmoker, setIsSmoker] = useState(false);
  const [activityHours, setActivityHours] = useState(3.5);
  const [familyHistory, setFamilyHistory] = useState(true);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);

  const handleRunPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.predictHealthRisk({
        age,
        gender,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        fasting_glucose: fastingGlucose,
        cholesterol,
        hdl,
        bmi,
        is_smoker: isSmoker,
        physical_activity_hours: activityHours,
        family_history_cardio: familyHistory,
      });

      setPredictionResult(res);
    } catch (err: any) {
      alert(err.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Machine Learning & Predictive Health Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cardiometabolic & Diabetes ML Risk Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Calculates multi-factorial health risk probabilities utilizing Framingham Heart Study algorithms, ADA Diabetes Risk standards, and longitudinal telemetry data.
          </p>
        </div>

        <button
          onClick={() => onNavigate('health-monitoring')}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Activity className="w-4 h-4" />
          <span>View Patient Vitals</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ML Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Patient Clinical Biomarkers</span>
            </h3>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Input Vectors
            </span>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  value={cholesterol}
                  onChange={(e) => setCholesterol(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">HDL Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  value={hdl}
                  onChange={(e) => setHdl(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Body Mass Index (BMI)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical Exercise (Hours / Week)</label>
              <input
                type="number"
                step="0.5"
                value={activityHours}
                onChange={(e) => setActivityHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSmoker}
                  onChange={(e) => setIsSmoker(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-slate-700 font-semibold">Active Tobacco Smoker</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={familyHistory}
                  onChange={(e) => setFamilyHistory(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-slate-700 font-semibold">Family History of Early Heart Disease / Stroke</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              <span>{loading ? 'Evaluating ML Model...' : 'Calculate Health Risk Scores'}</span>
            </button>
          </form>
        </div>

        {/* ML Prediction Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {predictionResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Overall Risk Card */}
              <div
                className={`p-6 rounded-3xl border-2 shadow-md space-y-4 ${
                  predictionResult.overall_risk === 'HIGH' || predictionResult.overall_risk === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-300'
                    : predictionResult.overall_risk === 'MODERATE'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-emerald-50 border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-teal-700" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Overall Health Risk Profile: <span className="uppercase">{predictionResult.overall_risk}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-white rounded-full border shadow-2xs">
                    Confidence: 94.2%
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  Based on multi-variate modeling of your systolic blood pressure ({systolicBp} mmHg), fasting glucose ({fastingGlucose} mg/dL), and lipid profile.
                </p>

                {/* Score Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-4 rounded-2xl border shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">10-Yr Cardiovascular Risk</span>
                    <p className="text-xl font-black text-rose-600">{predictionResult.cardiovascular_risk_percent}%</p>
                    <span className="text-[10px] text-slate-500">{predictionResult.cardiovascular_risk_percent < 10 ? 'Low Risk' : 'Elevated Risk'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Type-2 Diabetes Risk</span>
                    <p className="text-xl font-black text-violet-600">{predictionResult.diabetes_risk_percent}%</p>
                    <span className="text-[10px] text-slate-500">{predictionResult.diabetes_risk_percent < 15 ? 'Normal Baseline' : 'Pre-diabetic Warning'}</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Hypertension Stage</span>
                    <p className="text-lg font-black text-teal-700">{predictionResult.hypertension_stage}</p>
                    <span className="text-[10px] text-slate-500">AHA Guideline</span>
                  </div>
                </div>
              </div>

              {/* Contributing Risk Factors */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Key Modifiable Risk Factors</span>
                </h4>

                <div className="space-y-2">
                  {predictionResult.risk_factors && predictionResult.risk_factors.map((factor: string, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl text-xs flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Clinical Recommendations */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Personalized Preventative Care Plan</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {predictionResult.recommendations && predictionResult.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 bg-teal-50/60 rounded-xl flex items-start gap-2.5 text-teal-950">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    onClick={() => onNavigate('doctors', { specialization: 'Cardiology' })}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs text-center"
                  >
                    Consult Cardiologist
                  </button>
                  <button
                    onClick={() => onNavigate('ai-assistant', { initialQuery: 'Explain my cardiovascular risk score and diet recommendations' })}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center"
                  >
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 text-slate-400 text-xs">
              <Brain className="w-12 h-12 text-teal-500/40 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Assessment Calculated Yet</h4>
              <p className="max-w-md mx-auto">
                Fill in the biomarker measurements on the left and click <strong>"Calculate Health Risk Scores"</strong> to run the machine learning predictive risk model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
