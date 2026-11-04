import React, { useState, useEffect } from 'react';
import {
  Filter,
  RotateCcw,
  Users,
  UserX,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
  Plane,
  ShieldCheck
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { analyticsService } from '../services/api';

const COLORS = ['#0284C7', '#06D6A0', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#14B8A6'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: 'All',
    job_role: 'All',
    gender: 'All',
    age_group: 'All',
    overtime: 'All',
    business_travel: 'All'
  });

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getOverview(filters);
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const resetFilters = () => {
    setFilters({
      department: 'All',
      job_role: 'All',
      gender: 'All',
      age_group: 'All',
      overtime: 'All',
      business_travel: 'All'
    });
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Computing Multi-Dimensional Analytics...</p>
      </div>
    );
  }

  const { filter_summary, available_filter_options } = data || {};

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Multi-Dimensional Exploratory Data Analysis</h2>
              <p className="text-xs text-slate-500">
                Filter and slice the genuine 1,470 IBM records across organizational factors
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg">
              Matching Records: <strong className="text-sky-600">{filter_summary?.total || 0}</strong>
            </span>
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdown Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Department */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Departments</option>
              {available_filter_options?.departments?.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Job Role */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Job Role</label>
            <select
              value={filters.job_role}
              onChange={(e) => handleFilterChange('job_role', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-sky-500 truncate"
            >
              <option value="All">All Roles</option>
              {available_filter_options?.job_roles?.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Genders</option>
              {available_filter_options?.genders?.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Age Group</label>
            <select
              value={filters.age_group}
              onChange={(e) => handleFilterChange('age_group', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Age Groups</option>
              {available_filter_options?.age_groups?.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* OverTime */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Overtime Status</label>
            <select
              value={filters.overtime}
              onChange={(e) => handleFilterChange('overtime', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Overtime</option>
              <option value="Yes">Overtime: Yes</option>
              <option value="No">Overtime: No</option>
            </select>
          </div>

          {/* Business Travel */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Business Travel</label>
            <select
              value={filters.business_travel}
              onChange={(e) => handleFilterChange('business_travel', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Travel</option>
              {available_filter_options?.business_travels?.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Subset KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Filtered Workforce</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{filter_summary?.total}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Retained in Subset</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{filter_summary?.retained_count}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Departed in Subset</span>
          <p className="text-xl font-extrabold text-rose-600 mt-0.5">{filter_summary?.attrition_count}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Subset Attrition Rate</span>
          <p className="text-xl font-extrabold text-sky-600 mt-0.5">{filter_summary?.attrition_rate}%</p>
        </div>
      </div>

      {/* Grid of Analytical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department-Wise Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-sky-600" />
            <span>1. Department-Wise Attrition Rate (%)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Comparing departure risk percentage across divisions</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.by_department} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Job Role-Wise Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>2. Job Role-Wise Attrition Ranking (%)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Sorted by highest vulnerability in role</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.by_job_role}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis dataKey="category" type="category" tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#F43F5E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Age Group vs Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>3. Age Bracket vs Attrition</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Younger employees (&lt;30) show markedly higher flight propensity</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.by_age_group} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="retained" name="Retained" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attrition" name="Attrition" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Income Bracket vs Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>4. Monthly Income vs Attrition Rate (%)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Attrition rate declines sharply as compensation scales</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.by_income_bracket} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#06D6A0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Overtime vs Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>5. Overtime Impact on Attrition</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Employees working overtime exhibit ~3x departure rate</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.by_overtime} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Job Satisfaction vs Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>6. Job Satisfaction vs Attrition</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Satisfaction rating 1 (Low) vs 4 (Very High)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.by_job_satisfaction} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Years at Company (Tenure) vs Attrition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>7. Organizational Tenure vs Attrition Rate (%)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Highest vulnerability window is 0-2 years (Novice)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.by_tenure_group} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="attrition_rate"
                  name="Attrition Rate (%)"
                  stroke="#0284C7"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Business Travel Frequency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Plane className="w-4 h-4 text-teal-600" />
            <span>8. Business Travel Frequency Impact</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Frequent travelers face heightened burnout & turnover risk</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.by_business_travel} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val}%`, 'Attrition Rate']}
                />
                <Bar dataKey="attrition_rate" name="Attrition Rate (%)" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
