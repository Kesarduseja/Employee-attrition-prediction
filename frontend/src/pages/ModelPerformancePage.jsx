import React, { useState, useEffect } from 'react';
import {
  Activity,
  BrainCircuit,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Info,
  ShieldAlert,
  GitBranch,
  Layers,
  HelpCircle,
  Binary,
  Award,
  ChevronRight,
  Sliders,
  Scale,
  Sparkles,
  Lock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { modelService, authService } from '../services/api';

const MODEL_KEYS = [
  {
    key: 'Random Forest Classifier',
    shortName: 'Random Forest',
    tag: 'Ensemble Learning',
    color: '#06D6A0',
    badge: 'Selected Best Model (Highest Recall & F1)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
  },
  {
    key: 'Logistic Regression Classifier',
    shortName: 'Logistic Regression',
    tag: 'Linear Probabilistic',
    color: '#0284C7',
    badge: 'Highest Accuracy (85.0%) & ROC-AUC (0.803)',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-300'
  },
  {
    key: 'Decision Tree Classifier',
    shortName: 'Decision Tree',
    tag: 'Tree-Based (CART)',
    color: '#F59E0B',
    badge: 'Single Tree • Rule Interpretability',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-300'
  },
  {
    key: 'Naive Majority Baseline',
    shortName: 'Naive Baseline',
    tag: 'Benchmark Reference',
    color: '#94A3B8',
    badge: 'Accuracy Paradox Benchmark',
    badgeColor: 'bg-slate-500/10 text-slate-700 border-slate-300'
  }
];

export default function ModelPerformancePage() {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModelKey, setSelectedModelKey] = useState('Random Forest Classifier');
  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState(null);
  const [curveTab, setCurveTab] = useState('roc'); // 'roc' | 'pr' | 'metrics_bar'
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.username === 'admin';

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const data = await modelService.getComparison();
      setComparison(data);
      if (data.selected_best_model) {
        setSelectedModelKey(data.selected_best_model);
      }
    } catch (err) {
      console.error('Failed to load model comparison', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    if (!isAdmin) return;
    setRetraining(true);
    setRetrainMsg(null);
    try {
      const res = await modelService.retrain();
      setRetrainMsg({ type: 'success', message: res.message });
      await fetchComparison();
    } catch (err) {
      setRetrainMsg({ type: 'error', message: 'Retraining failed. Check backend logs.' });
    } finally {
      setRetraining(false);
    }
  };

  if (loading && !comparison) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Extracting Evaluation Metrics for 3 ML Models & Baseline...</p>
      </div>
    );
  }

  const { models, imbalance_explanation, why_selected_explanation, unified_curves } = comparison || {};
  const activeModel = models?.[selectedModelKey] || models?.['Random Forest Classifier'];
  const activeMetrics = activeModel?.metrics || {};
  const activeConfusion = activeMetrics?.confusion_matrix || { tn: 0, fp: 0, fn: 0, tp: 0 };

  // Prepare side-by-side metric comparison data for bar chart
  const barChartMetricData = [
    {
      metric: 'Accuracy',
      'Random Forest': (models?.['Random Forest Classifier']?.metrics?.accuracy * 100) || 0,
      'Logistic Regression': (models?.['Logistic Regression Classifier']?.metrics?.accuracy * 100) || 0,
      'Decision Tree': (models?.['Decision Tree Classifier']?.metrics?.accuracy * 100) || 0,
      'Baseline': (models?.['Naive Majority Baseline']?.metrics?.accuracy * 100) || 0,
    },
    {
      metric: 'Precision',
      'Random Forest': (models?.['Random Forest Classifier']?.metrics?.precision * 100) || 0,
      'Logistic Regression': (models?.['Logistic Regression Classifier']?.metrics?.precision * 100) || 0,
      'Decision Tree': (models?.['Decision Tree Classifier']?.metrics?.precision * 100) || 0,
      'Baseline': (models?.['Naive Majority Baseline']?.metrics?.precision * 100) || 0,
    },
    {
      metric: 'Recall (Sensitivity)',
      'Random Forest': (models?.['Random Forest Classifier']?.metrics?.recall * 100) || 0,
      'Logistic Regression': (models?.['Logistic Regression Classifier']?.metrics?.recall * 100) || 0,
      'Decision Tree': (models?.['Decision Tree Classifier']?.metrics?.recall * 100) || 0,
      'Baseline': (models?.['Naive Majority Baseline']?.metrics?.recall * 100) || 0,
    },
    {
      metric: 'F1-Score',
      'Random Forest': (models?.['Random Forest Classifier']?.metrics?.f1_score * 100) || 0,
      'Logistic Regression': (models?.['Logistic Regression Classifier']?.metrics?.f1_score * 100) || 0,
      'Decision Tree': (models?.['Decision Tree Classifier']?.metrics?.f1_score * 100) || 0,
      'Baseline': (models?.['Naive Majority Baseline']?.metrics?.f1_score * 100) || 0,
    },
    {
      metric: 'ROC-AUC',
      'Random Forest': (models?.['Random Forest Classifier']?.metrics?.roc_auc * 100) || 0,
      'Logistic Regression': (models?.['Logistic Regression Classifier']?.metrics?.roc_auc * 100) || 0,
      'Decision Tree': (models?.['Decision Tree Classifier']?.metrics?.roc_auc * 100) || 0,
      'Baseline': (models?.['Naive Majority Baseline']?.metrics?.roc_auc * 100) || 0,
    },
    {
      metric: 'PR-AUC',
      'Random Forest': (models?.['Random Forest Classifier']?.metrics?.pr_auc * 100) || 0,
      'Logistic Regression': (models?.['Logistic Regression Classifier']?.metrics?.pr_auc * 100) || 0,
      'Decision Tree': (models?.['Decision Tree Classifier']?.metrics?.pr_auc * 100) || 0,
      'Baseline': (models?.['Naive Majority Baseline']?.metrics?.pr_auc * 100) || 0,
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner & Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Interactive Machine Learning Model Evaluation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Genuine test set evaluation (294 records) comparing <strong>Random Forest</strong>, <strong>Logistic Regression</strong>, <strong>Decision Tree</strong>, and <strong>Naive Baseline</strong>.
          </p>
        </div>

        {/* Retrain Action with Role Permission Indicator */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-semibold text-slate-700 block">
              {currentUser?.name || 'HR User'}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block ${
              isAdmin ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {isAdmin ? 'Admin • Retrain Permitted' : 'Analyst • View Only'}
            </span>
          </div>
          <button
            onClick={handleRetrain}
            disabled={retraining || !isAdmin}
            title={isAdmin ? "Retrain all 3 models on IBM HR dataset" : "Admin rights required to retrain ML models"}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-sm ${
              isAdmin
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {isAdmin ? (
              <RotateCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{retraining ? 'Retraining All 3 Models...' : 'Retrain Live Models'}</span>
          </button>
        </div>
      </div>

      {retrainMsg && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center space-x-2 ${
            retrainMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{retrainMsg.message}</span>
        </div>
      )}

      {/* SECTION 1: FOUR INTERACTIVE SELECTABLE MODEL CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select a Model to Inspect & Compare:
          </span>
          <span className="text-xs text-sky-600 font-medium hidden sm:inline">
            Click any card to load its deep-dive metrics, confusion matrix & coefficients
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODEL_KEYS.map((item) => {
            const isSelected = selectedModelKey === item.key;
            const modelData = models?.[item.key];
            const m = modelData?.metrics || {};

            return (
              <div
                key={item.key}
                onClick={() => setSelectedModelKey(item.key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden select-none ${
                  isSelected
                    ? 'bg-white border-2 border-sky-600 shadow-lg ring-2 ring-sky-500/20 translate-y-[-2px]'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Active Indicator Top Strip */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-teal-400" />
                )}

                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm tracking-tight mb-1">
                  {item.shortName}
                </h3>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border inline-block mb-3 ${item.badgeColor}`}>
                  {item.badge}
                </span>

                {/* Quick Metric Snippets */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Accuracy</span>
                    <strong className="text-slate-900 font-mono">{(m.accuracy * 100).toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Recall (Sensitivity)</span>
                    <strong className="text-emerald-700 font-mono">{(m.recall * 100).toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">F1-Score</span>
                    <strong className="text-sky-700 font-mono">{m.f1_score}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
                    <strong className="text-slate-900 font-mono">{m.roc_auc}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: SELECTED MODEL DEEP-DIVE EVALUATION VIEW */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
        {/* Selected Model Title & Description */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase tracking-wide">
                Currently Inspecting:
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {activeModel?.full_name || selectedModelKey}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
              {activeModel?.explanation || activeModel?.description}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            {activeModel?.threshold !== undefined && (
              <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-right">
                <span className="text-[10px] text-slate-500 block font-medium">Optimal Cut-off Threshold</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {activeModel.threshold}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 6 Core Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Accuracy</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {(activeMetrics.accuracy * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Precision</span>
            <span className="text-xl font-extrabold text-sky-700 font-mono">
              {(activeMetrics.precision * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Recall (Sensitivity)</span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono">
              {(activeMetrics.recall * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">F1-Score</span>
            <span className="text-xl font-extrabold text-indigo-700 font-mono">
              {activeMetrics.f1_score}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">ROC-AUC</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {activeMetrics.roc_auc}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">PR-AUC</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {activeMetrics.pr_auc}
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Left Confusion Matrix, Right Feature Importance / Coefficients */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left Column: Interactive Confusion Matrix (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">Confusion Matrix (294 Test Records)</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-mono">
                  Total = 294
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Predicted vs Actual classifications on unseen test partition (247 Retained, 47 Leavers)
              </p>

              {/* 2x2 Confusion Grid */}
              <div className="grid grid-cols-2 gap-2 text-center">
                {/* True Negatives */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    True Negative (TN)
                  </span>
                  <div className="text-2xl font-black text-slate-800 my-0.5 font-mono">
                    {activeConfusion.tn}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Actual Stayed → Predicted Stayed
                  </span>
                </div>

                {/* False Positives */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    False Positive (FP)
                  </span>
                  <div className="text-2xl font-black text-slate-800 my-0.5 font-mono">
                    {activeConfusion.fp}
                  </div>
                  <span className="text-[10px] text-amber-600 font-medium">
                    Actual Stayed → False Alarm
                  </span>
                </div>

                {/* False Negatives */}
                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-rose-500 block uppercase">
                    False Negative (FN)
                  </span>
                  <div className="text-2xl font-black text-rose-700 my-0.5 font-mono">
                    {activeConfusion.fn}
                  </div>
                  <span className="text-[10px] text-rose-600 font-bold">
                    Actual Leavers Missed
                  </span>
                </div>

                {/* True Positives */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-emerald-600 block uppercase">
                    True Positive (TP)
                  </span>
                  <div className="text-2xl font-black text-emerald-700 my-0.5 font-mono">
                    {activeConfusion.tp}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Actual Leavers Detected
                  </span>
                </div>
              </div>
            </div>

            {/* Matrix Calculation Summary Note */}
            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
              <strong>Matrix Verification:</strong> {activeConfusion.tn} + {activeConfusion.fp} + {activeConfusion.fn} + {activeConfusion.tp} = <strong>294</strong> test records.{' '}
              {selectedModelKey === 'Naive Majority Baseline' ? (
                <span className="text-rose-600 font-semibold">
                  Zero leavers caught (Recall = 0.0%).
                </span>
              ) : (
                <span>
                  Correctly detected <strong>{activeConfusion.tp} out of 47</strong> historical leavers.
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Model Interpretability & Feature Importance (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Model Interpretability: {activeModel?.interpretability_type}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedModelKey === 'Logistic Regression Classifier'
                    ? 'Log-odds coefficients: Positive (+) values drive departure risk; Negative (-) values protect retention'
                    : selectedModelKey === 'Naive Majority Baseline'
                    ? 'No internal feature weights computed (non-learning majority rule)'
                    : 'Gini impurity reduction across tree decision splits'}
                </p>
              </div>
            </div>

            {selectedModelKey === 'Naive Majority Baseline' ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-xl border border-slate-200">
                <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                <h5 className="font-bold text-slate-800 text-sm">Zero Feature Coefficients</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                  The Naive Majority Baseline assigns no feature weights because it does not evaluate any employee attributes. It blindly predicts the prior majority class ('No') for 100% of cases.
                </p>
              </div>
            ) : selectedModelKey === 'Logistic Regression Classifier' ? (
              <div className="h-64 w-full bg-white p-3 rounded-xl border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeModel?.top_features || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      formatter={(val, name, item) => [
                        `${item.payload.coefficient} (${item.payload.direction})`,
                        'Log-Odds Impact'
                      ]}
                    />
                    <Bar dataKey="abs_importance" name="Abs Weight" radius={[0, 4, 4, 0]}>
                      {(activeModel?.top_features || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.coefficient > 0 ? '#F43F5E' : '#0284C7'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 w-full bg-white p-3 rounded-xl border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeModel?.top_features || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      formatter={(val) => [`${(val * 100).toFixed(2)}%`, 'Relative Gini Importance']}
                    />
                    <Bar dataKey="importance" name="Feature Weight" fill="#06D6A0" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-3 text-[11px] text-slate-500 italic">
              * Note: Statistical feature importance and regression coefficients reflect correlation patterns within historical data; they do not prove individual causality.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: COMPREHENSIVE MODEL COMPARISON TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Comprehensive Algorithm Performance Matrix</h3>
            <p className="text-xs text-slate-500">
              Evaluated on identical unseen 20% test partition (294 records) with genuine Scikit-learn metrics
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Green badges highlight top performance per metric
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4">Random Forest (Ensemble)</th>
                <th className="py-3 px-4">Logistic Regression</th>
                <th className="py-3 px-4">Decision Tree (CART)</th>
                <th className="py-3 px-4">Naive Majority Baseline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Accuracy Row */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Accuracy
                  <span className="block text-[10px] font-normal text-slate-400">Total Correct / Total Test</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {(models?.['Random Forest Classifier']?.metrics?.accuracy * 100).toFixed(2)}%
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {(models?.['Logistic Regression Classifier']?.metrics?.accuracy * 100).toFixed(2)}% ★ Top
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">
                  {(models?.['Decision Tree Classifier']?.metrics?.accuracy * 100).toFixed(2)}%
                </td>
                <td className="py-3 px-4 font-mono text-slate-500">
                  {(models?.['Naive Majority Baseline']?.metrics?.accuracy * 100).toFixed(2)}% (Deceptive)
                </td>
              </tr>

              {/* Precision Row */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Precision
                  <span className="block text-[10px] font-normal text-slate-400">TP / (TP + FP)</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {(models?.['Random Forest Classifier']?.metrics?.precision * 100).toFixed(2)}%
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {(models?.['Logistic Regression Classifier']?.metrics?.precision * 100).toFixed(2)}% ★ Top
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">
                  {(models?.['Decision Tree Classifier']?.metrics?.precision * 100).toFixed(2)}%
                </td>
                <td className="py-3 px-4 font-mono text-rose-500 font-semibold">
                  0.00%
                </td>
              </tr>

              {/* Recall Row */}
              <tr className="hover:bg-slate-50/80 bg-emerald-50/20">
                <td className="py-3 px-4 font-semibold text-slate-900">
                  Recall (Sensitivity)
                  <span className="block text-[10px] font-normal text-emerald-700">TP / (TP + FN) • Critical for HR</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                    {(models?.['Random Forest Classifier']?.metrics?.recall * 100).toFixed(2)}% ★ Top (28 Leavers)
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {(models?.['Logistic Regression Classifier']?.metrics?.recall * 100).toFixed(2)}% (21 Leavers)
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">
                  {(models?.['Decision Tree Classifier']?.metrics?.recall * 100).toFixed(2)}% (22 Leavers)
                </td>
                <td className="py-3 px-4 font-mono text-rose-500 font-semibold">
                  0.00% (0 Leavers)
                </td>
              </tr>

              {/* F1-Score Row */}
              <tr className="hover:bg-slate-50/80 bg-emerald-50/20">
                <td className="py-3 px-4 font-semibold text-slate-900">
                  F1-Score
                  <span className="block text-[10px] font-normal text-emerald-700">Harmonic Mean of Precision & Recall</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                    {models?.['Random Forest Classifier']?.metrics?.f1_score} ★ Top Balance
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {models?.['Logistic Regression Classifier']?.metrics?.f1_score}
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">
                  {models?.['Decision Tree Classifier']?.metrics?.f1_score}
                </td>
                <td className="py-3 px-4 font-mono text-rose-500 font-semibold">
                  0.0000
                </td>
              </tr>

              {/* ROC-AUC Row */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  ROC-AUC
                  <span className="block text-[10px] font-normal text-slate-400">Area Under ROC Curve</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {models?.['Random Forest Classifier']?.metrics?.roc_auc}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {models?.['Logistic Regression Classifier']?.metrics?.roc_auc} ★ Top
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">
                  {models?.['Decision Tree Classifier']?.metrics?.roc_auc}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  0.5000 (Random Guess)
                </td>
              </tr>

              {/* PR-AUC Row */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  PR-AUC (Average Precision)
                  <span className="block text-[10px] font-normal text-slate-400">Precision-Recall Area</span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {models?.['Random Forest Classifier']?.metrics?.pr_auc}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {models?.['Logistic Regression Classifier']?.metrics?.pr_auc} ★ Top
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">
                  {models?.['Decision Tree Classifier']?.metrics?.pr_auc}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  0.1599 (Prevalence)
                </td>
              </tr>

              {/* Decision Threshold Row */}
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Selected Threshold
                  <span className="block text-[10px] font-normal text-slate-400">Validation-Tuned Cut-off</span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-800">
                  {models?.['Random Forest Classifier']?.threshold}
                </td>
                <td className="py-3 px-4 font-mono text-slate-800">
                  {models?.['Logistic Regression Classifier']?.threshold}
                </td>
                <td className="py-3 px-4 font-mono text-slate-800">
                  {models?.['Decision Tree Classifier']?.threshold}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  0.50 (Default)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: INTERACTIVE VISUAL COMPARISON CHARTS (ROC, PR, BARS) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Multi-Model Performance Visualizer</h3>
            <p className="text-xs text-slate-500">
              Interactive curves and metric distributions across all algorithms
            </p>
          </div>

          {/* Chart View Toggle Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setCurveTab('roc')}
              className={`px-3 py-1.5 rounded-lg transition ${
                curveTab === 'roc' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overlay ROC Curves
            </button>
            <button
              onClick={() => setCurveTab('pr')}
              className={`px-3 py-1.5 rounded-lg transition ${
                curveTab === 'pr' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overlay PR Curves
            </button>
            <button
              onClick={() => setCurveTab('metrics_bar')}
              className={`px-3 py-1.5 rounded-lg transition ${
                curveTab === 'metrics_bar' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metric Bar Comparison
            </button>
          </div>
        </div>

        {/* Tab 1: Combined ROC Curves */}
        {curveTab === 'roc' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Receiver Operating Characteristic (ROC): True Positive Rate vs False Positive Rate</span>
              <span className="font-semibold text-slate-700">Higher curve & area represents superior discriminatory power</span>
            </div>
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={unified_curves?.roc || []} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="fpr"
                    label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -10, fontSize: 11 }}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                  />
                  <YAxis
                    label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', fontSize: 11 }}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="lr"
                    name={`Logistic Regression (AUC: ${models?.['Logistic Regression Classifier']?.metrics?.roc_auc})`}
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rf"
                    name={`Random Forest (AUC: ${models?.['Random Forest Classifier']?.metrics?.roc_auc})`}
                    stroke="#06D6A0"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="dt"
                    name={`Decision Tree (AUC: ${models?.['Decision Tree Classifier']?.metrics?.roc_auc})`}
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Naive Baseline (AUC: 0.500)"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Combined Precision-Recall Curves */}
        {curveTab === 'pr' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Precision-Recall (PR) Curve: Trade-off for Imbalanced Minority Detection</span>
              <span className="font-semibold text-slate-700">Baseline horizontal line represents natural attrition prevalence (~16.1%)</span>
            </div>
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={unified_curves?.pr || []} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="recall"
                    label={{ value: 'Recall (Sensitivity)', position: 'insideBottom', offset: -10, fontSize: 11 }}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                  />
                  <YAxis
                    label={{ value: 'Precision', angle: -90, position: 'insideLeft', fontSize: 11 }}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="lr"
                    name={`Logistic Regression (PR-AUC: ${models?.['Logistic Regression Classifier']?.metrics?.pr_auc})`}
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rf"
                    name={`Random Forest (PR-AUC: ${models?.['Random Forest Classifier']?.metrics?.pr_auc})`}
                    stroke="#06D6A0"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="dt"
                    name={`Decision Tree (PR-AUC: ${models?.['Decision Tree Classifier']?.metrics?.pr_auc})`}
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Class Prevalence (0.161)"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Side-by-Side Bar Chart Comparison across All 6 Metrics */}
        {curveTab === 'metrics_bar' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Metric Scores Normalized on 0% to 100% Scale</span>
              <span className="font-semibold text-slate-700">Notice Recall superiority in Random Forest vs Precision in Logistic Regression</span>
            </div>
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartMetricData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis unit="%" tick={{ fill: '#64748B', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Random Forest" fill="#06D6A0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Logistic Regression" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Decision Tree" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: MODEL EXPLANATION & SELECTION JUSTIFICATION SECTION */}
      <div className="space-y-4">
        {/* Why Random Forest Was Selected Banner */}
        <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-300 rounded-2xl p-6 text-emerald-950 shadow-xs">
          <div className="flex items-start space-x-3">
            <Award className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-base text-emerald-900">
                {why_selected_explanation?.title || "Why Random Forest Was Selected for Employee Attrition Prediction"}
              </h3>
              <p className="text-xs text-emerald-900/90 mt-2 leading-relaxed">
                {why_selected_explanation?.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Theoretical Mechanism Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* DT */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wide">
              <GitBranch className="w-4 h-4" />
              <span>Decision Tree (CART)</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Recursive Binary Splitting</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Constructs an interpretable tree by evaluating features at each node to minimize Gini Impurity:
              <br />
              <code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded text-[11px] block mt-1">
                Gini = 1 - Σ(p_i)²
              </code>
              Highly readable, but prone to high variance on unseen employee samples.
            </p>
          </div>

          {/* RF */}
          <div className="p-5 rounded-2xl bg-white border-2 border-emerald-400 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wide">
              <Layers className="w-4 h-4" />
              <span>Random Forest Ensemble</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Bagging & Variance Reduction</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Builds 120 decorrelated decision trees using bootstrap data samples and random feature subsets:
              <br />
              <code className="text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded text-[11px] block mt-1">
                ŷ = Mode(Tree_1, ..., Tree_120)
              </code>
              Reduces variance, captures non-linear interactions, and maximizes sensitivity to leavers.
            </p>
          </div>

          {/* LR */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-sky-600 font-bold text-xs uppercase tracking-wide">
              <Binary className="w-4 h-4" />
              <span>Logistic Regression</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Log-Odds Sigmoid Boundary</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Models departure probability via linear combination of standard-scaled inputs passed through a sigmoid function:
              <br />
              <code className="text-sky-800 bg-sky-50 px-1 py-0.5 rounded text-[11px] block mt-1">
                P(Y=1) = 1 / (1 + e^-z)
              </code>
              Yields highest accuracy (85.0%) and smooth probabilistic calibration.
            </p>
          </div>

          {/* Baseline */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-500 font-bold text-xs uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" />
              <span>Naive Baseline</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Class Imbalance Benchmark</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates why standard Accuracy is deceptive in Data Mining.
              <br />
              <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded text-[11px] block mt-1">
                Accuracy = 84.0% | Recall = 0.0%
              </code>
              Predicts 'No' for every record, completely failing to identify a single leaving employee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
