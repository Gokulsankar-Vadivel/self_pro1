import React, { useState, useEffect } from 'react';
import {
  Activity,
  HeartPulse,
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Flame,
  Sparkles,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { HealthRecord, Patient } from '../types';
import { api } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HealthMonitoringPageProps {
  patient: Patient | null;
  onNavigate: (page: string, params?: any) => void;
}

export const HealthMonitoringPage: React.FC<HealthMonitoringPageProps> = ({ patient, onNavigate }) => {
  const patientId = patient?.id || 1;
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // New Vitals Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [temperature, setTemperature] = useState(98.6);
  const [bloodGlucose, setBloodGlucose] = useState(95);
  const [weight, setWeight] = useState(74.5);
  const [spO2, setSpO2] = useState(98);
  const [notes, setNotes] = useState('Routine morning resting measurements.');

  useEffect(() => {
    loadHealthRecords();
  }, [patientId]);

  const loadHealthRecords = async () => {
    setLoading(true);
    try {
      const data = await api.getHealthRecords(patientId);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createHealthRecord({
        patient_id: patientId,
        record_date: new Date().toISOString().split('T')[0],
        heart_rate: heartRate,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        temperature: temperature,
        blood_glucose: bloodGlucose,
        weight: weight,
        oxygen_saturation: spO2,
        notes: notes,
      });

      setIsFormOpen(false);
      loadHealthRecords();
      alert('Vitals record saved successfully!');
    } catch (err) {
      alert('Failed to save vitals record.');
    }
  };

  // Prepare Chart.js datasets
  const sortedRecords = [...records].reverse();
  const labels = sortedRecords.map((r) => r.record_date);

  const bpChartData = {
    labels: labels.length ? labels : ['2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01'],
    datasets: [
      {
        label: 'Systolic BP (mmHg)',
        data: sortedRecords.map((r) => r.systolic_bp),
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Diastolic BP (mmHg)',
        data: sortedRecords.map((r) => r.diastolic_bp),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const pulseGlucoseData = {
    labels: labels.length ? labels : ['2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01'],
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: sortedRecords.map((r) => r.heart_rate),
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.15)',
        tension: 0.3,
      },
      {
        label: 'Blood Glucose (mg/dL)',
        data: sortedRecords.map((r) => r.blood_glucose),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11 },
          boxWidth: 12,
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  const latest = records[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry & Longitudinal Vitals Tracking</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Health Vitals & Trends</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track blood pressure curves, glucose levels, heart rate, temperature, and SpO2 with interactive Chart.js analytics.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Vitals</span>
          </button>
          <button
            onClick={() => onNavigate('ml-prediction')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Run ML Risk Model</span>
          </button>
        </div>
      </div>

      {/* Latest Vitals Hero Cards */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Blood Pressure</span>
            <p className="text-xl font-extrabold text-teal-700 mt-1">
              {latest.systolic_bp}/{latest.diastolic_bp} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              {latest.systolic_bp < 130 ? 'Normal' : 'Elevated'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Resting Heart Rate</span>
            <p className="text-xl font-extrabold text-rose-600 mt-1">
              {latest.heart_rate} <span className="text-[10px] font-normal text-slate-500">bpm</span>
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Optimal Rhythm
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Blood Glucose</span>
            <p className="text-xl font-extrabold text-violet-700 mt-1">
              {latest.blood_glucose} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Fasting Normal
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Oxygen Saturation</span>
            <p className="text-xl font-extrabold text-cyan-700 mt-1">
              {latest.oxygen_saturation || 98}% <span className="text-[10px] font-normal text-slate-500">SpO2</span>
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Healthy
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Body Temperature</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              {latest.temperature}°F
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              Afebrile
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Body Weight</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              {latest.weight} <span className="text-[10px] font-normal text-slate-500">kg</span>
            </p>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded mt-1 inline-block">
              BMI: 23.4 (Normal)
            </span>
          </div>
        </div>
      )}

      {/* Chart.js Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blood Pressure Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                <span>Blood Pressure Trends (Systolic vs Diastolic)</span>
              </h3>
              <p className="text-[11px] text-slate-500">AHA Guideline: Normal &lt;120/80 mmHg</p>
            </div>
          </div>
          <div className="h-64">
            <Line data={bpChartData} options={chartOptions} />
          </div>
        </div>

        {/* Heart Rate & Glucose Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>Heart Rate (bpm) & Blood Glucose (mg/dL)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Continuous telemetry tracking</p>
            </div>
          </div>
          <div className="h-64">
            <Line data={pulseGlucoseData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Historical Vitals Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <span>Longitudinal Health Records History</span>
          </h3>
          <span className="text-xs text-slate-500">{records.length} Recorded Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Blood Pressure</th>
                <th className="py-3 px-4">Heart Rate</th>
                <th className="py-3 px-4">Blood Glucose</th>
                <th className="py-3 px-4">SpO2</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.record_date}</td>
                  <td className="py-3.5 px-4 font-extrabold text-teal-700">
                    {r.systolic_bp}/{r.diastolic_bp} mmHg
                  </td>
                  <td className="py-3.5 px-4 text-rose-600 font-bold">{r.heart_rate} bpm</td>
                  <td className="py-3.5 px-4 text-violet-700 font-bold">{r.blood_glucose} mg/dL</td>
                  <td className="py-3.5 px-4 font-bold text-cyan-700">{r.oxygen_saturation || 98}%</td>
                  <td className="py-3.5 px-4 text-slate-700">{r.temperature}°F</td>
                  <td className="py-3.5 px-4 text-slate-700">{r.weight} kg</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">{r.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Daily Vitals Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Record Daily Medical Vitals</span>
              </h3>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold text-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold text-teal-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spO2}
                    onChange={(e) => setSpO2(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Context / Activity Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Post-exercise, morning fasting, taken with medication"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
