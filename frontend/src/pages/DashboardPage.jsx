import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserX,
  UserCheck,
  TrendingDown,
  DollarSign,
  Clock,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BarChart2,
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService } from '../services/api';

const COLORS = ['#0284C7', '#F43F5E', '#06D6A0', '#F59E0B'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getSummary();
      setData(res);
    } catch (err) {
      setError('Failed to load dashboard data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Aggregating IBM HR Workforce Metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <h3 className="font-semibold text-base">Error Loading Dashboard</h3>
            <p className="text-sm mt-0.5">{error || 'Unknown error occurred.'}</p>
          </div>
        </div>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, department_breakdown, overtime_breakdown, key_insights } = data;

  const statCards = [
    {
      title: 'Total Workforce',
      value: kpis.total_employees.toLocaleString(),
      subtext: 'IBM HR Analytics records',
      icon: Users,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-100',
    },
    {
      title: 'Employees Retained',
      value: kpis.retained_count.toLocaleString(),
      subtext: `${(100 - kpis.attrition_rate).toFixed(1)}% workforce stability`,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Employees Departed',
      value: kpis.attrition_count.toLocaleString(),
      subtext: 'Historical attrition count',
      icon: UserX,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
    },
    {
      title: 'Overall Attrition Rate',
      value: `${kpis.attrition_rate}%`,
      subtext: 'Target class prevalence',
      icon: TrendingDown,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#070D1E] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DMBI Capstone • AI Decision Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Workforce Attrition Risk & Analytics Overview
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Continuous surveillance of key attrition indicators across 1,470 employee profiles. Powered by balanced
            machine learning classification algorithms to proactively preserve valuable human capital.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/predict')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/30 flex items-center space-x-2 transition"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Predict Individual Attrition</span>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Explore Multi-Dimension EDA</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all ${stat.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-white shadow-xs ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="px-4 py-2 border-r border-slate-100 last:border-0">
          <span className="text-xs text-slate-500 font-medium">Avg Monthly Income</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">${kpis.avg_monthly_income.toLocaleString()}</p>
        </div>
        <div className="px-4 py-2 border-r border-slate-100 last:border-0">
          <span className="text-xs text-slate-500 font-medium">Average Age</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{kpis.avg_age} years</p>
        </div>
        <div className="px-4 py-2 border-r border-slate-100 last:border-0">
          <span className="text-xs text-slate-500 font-medium">Average Tenure</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{kpis.avg_tenure} years</p>
        </div>
        <div className="px-4 py-2">
          <span className="text-xs text-slate-500 font-medium">Avg Job Satisfaction</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{kpis.avg_satisfaction} / 4.0</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Attrition Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Department-Wise Attrition Comparison</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Headcount distribution between retained and departed employees by department
              </p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_breakdown} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="department" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(value, name) => [value, name === 'retained' ? 'Retained' : 'Attrition']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="retained" name="Retained" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attrition" name="Attrition" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overtime vs Regular Hours Attrition Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Overtime Risk Factor</h3>
            <p className="text-xs text-slate-500 mt-0.5">Attrition proportion by overtime obligation</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overtime_breakdown}
                  dataKey="attrition"
                  nameKey="overtime"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  <Cell fill="#F43F5E" />
                  <Cell fill="#0284C7" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val, name, item) => [
                    `${val} Departed (${item.payload.attrition_rate}% Attrition Rate)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {overtime_breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: idx === 0 ? '#F43F5E' : '#0284C7' }}
                  />
                  <span className="text-slate-700 font-medium">{item.overtime}</span>
                </div>
                <span className="font-bold text-slate-900">{item.attrition_rate}% attrition</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Analytical Insights Callout Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-slate-900 text-base">Key Analytical Insights from Genuine Dataset</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {key_insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start space-x-3 leading-relaxed"
            >
              <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                {idx + 1}
              </div>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
