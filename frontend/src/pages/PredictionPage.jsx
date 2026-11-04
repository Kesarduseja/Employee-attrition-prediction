import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  History,
  ShieldCheck,
  Percent,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { predictionService } from '../services/api';

const DEFAULT_FORM_VALUES = {
  employee_reference: 'EMP-9042',
  model_choice: 'random_forest',
  Age: 34,
  BusinessTravel: 'Travel_Rarely',
  DailyRate: 800,
  Department: 'Research & Development',
  DistanceFromHome: 8,
  Education: 3,
  EducationField: 'Life Sciences',
  EnvironmentSatisfaction: 3,
  Gender: 'Male',
  HourlyRate: 65,
  JobInvolvement: 3,
  JobLevel: 2,
  JobRole: 'Research Scientist',
  JobSatisfaction: 3,
  MaritalStatus: 'Married',
  MonthlyIncome: 5500,
  MonthlyRate: 14000,
  NumCompaniesWorked: 2,
  OverTime: 'No',
  PercentSalaryHike: 14,
  PerformanceRating: 3,
  RelationshipSatisfaction: 3,
  StockOptionLevel: 1,
  TotalWorkingYears: 8,
  TrainingTimesLastYear: 3,
  WorkLifeBalance: 3,
  YearsAtCompany: 5,
  YearsInCurrentRole: 3,
  YearsSinceLastPromotion: 1,
  YearsWithCurrManager: 3,
};

const PRESETS = {
  high_risk: {
    name: 'High Risk Preset (Overtime + Low Comp + Sales)',
    data: {
      employee_reference: 'EMP-RISK-881',
      model_choice: 'random_forest',
      Age: 26,
      BusinessTravel: 'Travel_Frequently',
      DailyRate: 500,
      Department: 'Sales',
      DistanceFromHome: 24,
      Education: 2,
      EducationField: 'Marketing',
      EnvironmentSatisfaction: 1,
      Gender: 'Female',
      HourlyRate: 55,
      JobInvolvement: 2,
      JobLevel: 1,
      JobRole: 'Sales Representative',
      JobSatisfaction: 1,
      MaritalStatus: 'Single',
      MonthlyIncome: 2400,
      MonthlyRate: 11000,
      NumCompaniesWorked: 4,
      OverTime: 'Yes',
      PercentSalaryHike: 11,
      PerformanceRating: 3,
      RelationshipSatisfaction: 1,
      StockOptionLevel: 0,
      TotalWorkingYears: 3,
      TrainingTimesLastYear: 1,
      WorkLifeBalance: 1,
      YearsAtCompany: 1,
      YearsInCurrentRole: 1,
      YearsSinceLastPromotion: 0,
      YearsWithCurrManager: 0,
    },
  },
  low_risk: {
    name: 'Low Risk Preset (Tenured Leader + High Equity)',
    data: {
      employee_reference: 'EMP-LOYAL-204',
      model_choice: 'random_forest',
      Age: 46,
      BusinessTravel: 'Non-Travel',
      DailyRate: 1100,
      Department: 'Research & Development',
      DistanceFromHome: 3,
      Education: 4,
      EducationField: 'Medical',
      EnvironmentSatisfaction: 4,
      Gender: 'Male',
      HourlyRate: 85,
      JobInvolvement: 4,
      JobLevel: 4,
      JobRole: 'Research Director',
      JobSatisfaction: 4,
      MaritalStatus: 'Married',
      MonthlyIncome: 14500,
      MonthlyRate: 21000,
      NumCompaniesWorked: 1,
      OverTime: 'No',
      PercentSalaryHike: 18,
      PerformanceRating: 3,
      RelationshipSatisfaction: 4,
      StockOptionLevel: 2,
      TotalWorkingYears: 18,
      TrainingTimesLastYear: 4,
      WorkLifeBalance: 3,
      YearsAtCompany: 12,
      YearsInCurrentRole: 8,
      YearsSinceLastPromotion: 2,
      YearsWithCurrManager: 7,
    },
  },
  balanced: {
    name: 'Balanced Mid-Career Preset',
    data: DEFAULT_FORM_VALUES,
  },
};

export default function PredictionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const applyPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].data);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await predictionService.predict(formData);
      setResult(res);
      // Auto-scroll to results on mobile
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Inference error occurred. Check input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Preset Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-sky-600" />
            <span>Employee Attrition Risk Prediction</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Input employee profile attributes to generate real-time AI flight-risk probability and factor diagnostics.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Load Quick Preset:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('high_risk')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium transition"
          >
            High Risk Profile
          </button>
          <button
            type="button"
            onClick={() => applyPreset('low_risk')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-medium transition"
          >
            Low Risk Profile
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-medium transition"
          >
            Reset Default
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Assessment on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meta & Algorithm Selector */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee Reference Code
                </label>
                <input
                  type="text"
                  required
                  name="employee_reference"
                  value={formData.employee_reference}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                  placeholder="e.g. EMP-9042"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classification Algorithm
                </label>
                <select
                  name="model_choice"
                  value={formData.model_choice}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                >
                  <option value="random_forest">Random Forest Classifier (Ensemble - Highest Sensitivity / Recall)</option>
                  <option value="logistic_regression">Logistic Regression Classifier (Linear Probabilistic - Highest Accuracy & AUC)</option>
                  <option value="decision_tree">Decision Tree Classifier (Single Tree - Rule-Based Interpretability)</option>
                </select>
              </div>
            </div>

            {/* SECTION 1: Personal & Commute Demographics */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Demographics & Commute
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Age (18-65)</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Marital Status</label>
                  <select
                    name="MaritalStatus"
                    value={formData.MaritalStatus}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Distance From Home (mi)</label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    name="DistanceFromHome"
                    value={formData.DistanceFromHome}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Role & Department */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Department & Job Role
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Department</label>
                  <select
                    name="Department"
                    value={formData.Department}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="Research & Development">Research & Development</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Job Role</label>
                  <select
                    name="JobRole"
                    value={formData.JobRole}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg truncate"
                  >
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Research Scientist">Research Scientist</option>
                    <option value="Laboratory Technician">Laboratory Technician</option>
                    <option value="Manufacturing Director">Manufacturing Director</option>
                    <option value="Healthcare Representative">Healthcare Representative</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Research Director">Research Director</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Job Level (1-5)</label>
                  <select
                    name="JobLevel"
                    value={formData.JobLevel}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Education Level</label>
                  <select
                    name="Education"
                    value={formData.Education}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Below College</option>
                    <option value="2">2 - College</option>
                    <option value="3">3 - Bachelor's Degree</option>
                    <option value="4">4 - Master's Degree</option>
                    <option value="5">5 - Doctorate (PhD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Education Field</label>
                  <select
                    name="EducationField"
                    value={formData.EducationField}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="Life Sciences">Life Sciences</option>
                    <option value="Medical">Medical</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technical Degree">Technical Degree</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Compensation & Performance */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                3. Compensation & Performance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Monthly Income ($)</label>
                  <input
                    type="number"
                    min="1000"
                    max="22000"
                    step="50"
                    name="MonthlyIncome"
                    value={formData.MonthlyIncome}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Daily Rate ($)</label>
                  <input
                    type="number"
                    min="100"
                    max="1500"
                    name="DailyRate"
                    value={formData.DailyRate}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    name="HourlyRate"
                    value={formData.HourlyRate}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Stock Option Level</label>
                  <select
                    name="StockOptionLevel"
                    value={formData.StockOptionLevel}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="0">0 - None</option>
                    <option value="1">1 - Tier 1</option>
                    <option value="2">2 - Tier 2</option>
                    <option value="3">3 - Tier 3 (High)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Percent Salary Hike (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="30"
                    name="PercentSalaryHike"
                    value={formData.PercentSalaryHike}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Performance Rating</label>
                  <select
                    name="PerformanceRating"
                    value={formData.PerformanceRating}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="3">3 - Excellent</option>
                    <option value="4">4 - Outstanding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Previous Employers</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    name="NumCompaniesWorked"
                    value={formData.NumCompaniesWorked}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Career Tenure */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                4. Career & Company Tenure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Total Career (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="45"
                    name="TotalWorkingYears"
                    value={formData.TotalWorkingYears}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">At Company (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    name="YearsAtCompany"
                    value={formData.YearsAtCompany}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Current Role (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    name="YearsInCurrentRole"
                    value={formData.YearsInCurrentRole}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Since Promo (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    name="YearsSinceLastPromotion"
                    value={formData.YearsSinceLastPromotion}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">With Mgr (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    name="YearsWithCurrManager"
                    value={formData.YearsWithCurrManager}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: Workplace Sentiment & Work-Life Balance */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                5. Workplace Sentiment & Satisfaction Ratings
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold text-rose-600">
                    OverTime Duty
                  </label>
                  <select
                    name="OverTime"
                    value={formData.OverTime}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="No">No Overtime</option>
                    <option value="Yes">Yes (Regular Overtime)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Business Travel</label>
                  <select
                    name="BusinessTravel"
                    value={formData.BusinessTravel}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="Non-Travel">Non-Travel</option>
                    <option value="Travel_Rarely">Travel Rarely</option>
                    <option value="Travel_Frequently">Travel Frequently</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Job Satisfaction</label>
                  <select
                    name="JobSatisfaction"
                    value={formData.JobSatisfaction}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - High</option>
                    <option value="4">4 - Very High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Environment Sat.</label>
                  <select
                    name="EnvironmentSatisfaction"
                    value={formData.EnvironmentSatisfaction}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - High</option>
                    <option value="4">4 - Very High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Work-Life Balance</label>
                  <select
                    name="WorkLifeBalance"
                    value={formData.WorkLifeBalance}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Bad</option>
                    <option value="2">2 - Good</option>
                    <option value="3">3 - Better</option>
                    <option value="4">4 - Best</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Job Involvement</label>
                  <select
                    name="JobInvolvement"
                    value={formData.JobInvolvement}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - High</option>
                    <option value="4">4 - Very High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Relationship Sat.</label>
                  <select
                    name="RelationshipSatisfaction"
                    value={formData.RelationshipSatisfaction}
                    onChange={handleChange}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - High</option>
                    <option value="4">4 - Very High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                All 24 required model features validated prior to inference.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/30 flex items-center space-x-2 transition disabled:opacity-50"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>{loading ? 'Evaluating ML Model...' : 'Run Attrition Prediction'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results & Diagnostics Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-5">
              {/* Top Result Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between ${
                  result.risk_category === 'High Risk'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : result.risk_category === 'Medium Risk'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Prediction Outcome
                  </span>
                  <div className="text-2xl font-black mt-0.5 flex items-center space-x-2">
                    <span>Attrition: {result.predicted_class}</span>
                  </div>
                  <span className="text-xs font-semibold mt-1 inline-block">
                    {result.risk_category} Tier
                  </span>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-2xl font-extrabold ${
                    result.risk_category === 'High Risk'
                      ? 'bg-rose-600 text-white'
                      : result.risk_category === 'Medium Risk'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {result.risk_percentage}%
                </div>
              </div>

              {/* Probability Meter with Threshold Marker */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Estimated Departure Probability</span>
                  <span className="font-mono font-bold text-slate-900">{result.risk_percentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.risk_category === 'High Risk'
                        ? 'bg-rose-500'
                        : result.risk_category === 'Medium Risk'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, result.risk_percentage)}%` }}
                  />
                  {/* Threshold mark line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                    style={{ left: `${result.threshold_used * 100}%` }}
                    title={`Decision Threshold: ${result.threshold_used}`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Safe)</span>
                  <span className="text-slate-700 font-semibold">
                    Cut-off Threshold: {(result.threshold_used * 100).toFixed(0)}%
                  </span>
                  <span>100% (Imminent)</span>
                </div>
              </div>

              {/* Model & Persistence Confirmation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Evaluated Model:</span>
                  <span className="font-semibold text-slate-800">{result.model_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Database Entry:</span>
                  <span className="font-semibold text-sky-700 font-mono">
                    ID #{result.history_id} ({formData.employee_reference})
                  </span>
                </div>
              </div>

              {/* Natural Language Explanation */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  System Assessment Summary
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150">
                  {result.explanation}
                </p>
              </div>

              {/* Key Factor Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Contributing Risk Indicators
                </h4>
                <ul className="space-y-1.5">
                  {result.key_factors.map((factor, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 flex items-start space-x-2 bg-slate-50 p-2 rounded-lg"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{result.disclaimer}</span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/history')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>View in Prediction History</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div className="max-w-xs">
                <h3 className="font-bold text-slate-900 text-base">Inference Engine Awaiting Input</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter employee details on the left form or select a quick preset to compute real-time attrition risk.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 text-[11px] text-slate-600 text-left space-y-1 w-full max-w-sm">
                <div className="font-semibold text-slate-800">Operational Highlights:</div>
                <div>• Automatic ColumnTransformer one-hot & scaling pipeline</div>
                <div>• Stratified decision threshold applied (0.48 / 0.60)</div>
                <div>• Instant SQLite audit persistence via SQLAlchemy</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
