import React from 'react';
import {
  Info,
  ShieldCheck,
  Target,
  Database,
  BrainCircuit,
  Code2,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Hero Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
          <Info className="w-3.5 h-3.5" />
          <span>Academic DMBI Capstone Project</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          HR Insight: Employee Attrition Prediction & Analytics System
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          A full-stack, enterprise-grade decision-support application developed to assist Human Resource departments in
          detecting early warning signs of employee turnover using machine learning classification, exploratory data
          mining, and relational database persistence.
        </p>
      </div>

      {/* Problem Statement & Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">The Hidden Cost of Employee Turnover</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Employee attrition creates severe organizational disruption through recruitment replacement costs (often
            50% to 200% of an employee's annual salary), training cycles, knowledge drain, and reduced team morale.
            Traditionally, HR managers only discover dissatisfaction when an exit interview is submitted—when it is
            already too late to intervene.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>System Objective</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Proactive Retention Decision-Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To provide HR analysts with an objective, data-driven framework that synthesizes workplace factors (overtime,
            compensation, career progression, work-life balance) and computes individual attrition probabilities before
            resignation occurs.
          </p>
        </div>
      </div>

      {/* Dataset & Preprocessing Architecture */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-teal-600 font-bold text-sm">
          <Database className="w-4 h-4" />
          <span>IBM HR Analytics Dataset Details</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-slate-500 text-[11px] block">Dataset Records</span>
            <strong className="text-slate-900 text-base">1,470 Employees</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Original Attributes</span>
            <strong className="text-slate-900 text-base">35 Features</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Attrition Prevalence</span>
            <strong className="text-rose-600 text-base">16.12% (237 Yes)</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Retained Prevalence</span>
            <strong className="text-emerald-600 text-base">83.88% (1,233 No)</strong>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            <strong>Data Preprocessing Pipeline:</strong> Implemented with Scikit-Learn’s{' '}
            <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded">ColumnTransformer</code> and{' '}
            <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded">Pipeline</code>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Constant Column Elimination:</strong> Dropped non-informative columns:{' '}
              <em>EmployeeCount</em> (always 1), <em>Over18</em> (always 'Y'), <em>StandardHours</em> (always 80), and{' '}
              <em>EmployeeNumber</em> (arbitrary identifier).
            </li>
            <li>
              <strong>Target Variable Encoding:</strong> Binary mapped (1 for Attrition='Yes', 0 for 'No').
            </li>
            <li>
              <strong>Stratified Splitting:</strong> 80/20 train-test split preserving the 16.1% imbalanced ratio.
            </li>
            <li>
              <strong>Leakage Prevention:</strong> Preprocessing pipelines are fitted exclusively on training data.
            </li>
          </ul>
        </div>
      </div>

      {/* Machine Learning Algorithms */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-sky-600 font-bold text-sm">
          <BrainCircuit className="w-4 h-4" />
          <span>Machine Learning Algorithms & Imbalance Strategy</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Naive Majority Baseline</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always predicts 'No'. Demonstrates 83.9% accuracy but 0% recall, highlighting why standard accuracy is
              useless on imbalanced enterprise data.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Decision Tree Classifier</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interpretable single tree using Gini impurity and balanced class weights. Evaluated with optimal validation
              threshold (0.60).
            </p>
          </div>
          <div className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/30 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm text-teal-900">Random Forest Classifier</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Ensemble of 120 trees with balanced weights and 0.48 decision threshold. Achieved superior generalization
              with ~60% recall and 0.79 ROC-AUC.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
          <Code2 className="w-4 h-4" />
          <span>Technology Stack Architecture</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Frontend</strong>
            <p className="text-slate-600">React.js, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons, Axios</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Backend API</strong>
            <p className="text-slate-600">Python, FastAPI, Pydantic V2, Uvicorn, RESTful Endpoints</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Machine Learning</strong>
            <p className="text-slate-600">Scikit-learn, Pandas, NumPy, Joblib Pipelines</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Database & Testing</strong>
            <p className="text-slate-600">SQLite, SQLAlchemy ORM, Pytest, HTTPX</p>
          </div>
        </div>
      </div>

      {/* Ethical Considerations & Fair ML */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
          <HeartHandshake className="w-4 h-4" />
          <span>Ethical Considerations & System Governance</span>
        </div>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 font-medium">
            "This platform is strictly an assistive decision-support tool. It must NEVER be used to automate
            termination, disciplinary actions, denial of promotion, or punitive workplace decisions."
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Supportive Intervention:</strong> Predictions should trigger supportive career development,
              mentorship, work-life balance reviews, and compensation equity checks.
            </li>
            <li>
              <strong>Probabilistic Disclaimer:</strong> Models output statistical estimates, not certainties.
              Individual employee decisions remain autonomous and multifaceted.
            </li>
            <li>
              <strong>Privacy & Auditability:</strong> Sensitive personal identifiers are omitted, and prediction history
              is strictly auditable.
            </li>
          </ul>
        </div>
      </div>

      {/* Limitations & Future Scope */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Limitations & Future Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-800 block">Current Limitations:</strong>
            <p>• Cross-sectional dataset: lacks continuous time-series sentiment over multi-year quarters.</p>
            <p>• External macroeconomic shifts (e.g. industry recessions) are not captured in static dataset.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-800 block">Future Enhancements:</strong>
            <p>• SHAP / LIME explainability waterfall charts for individual prediction weights.</p>
            <p>• Integration with live HRIS systems (Workday, BambooHR) via secure webhooks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
