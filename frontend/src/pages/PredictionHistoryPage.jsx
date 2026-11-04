import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  AlertTriangle,
  FileText,
  Calendar,
  X,
  CheckCircle2,
  BrainCircuit,
  Database
} from 'lucide-react';
import { predictionService } from '../services/api';

export default function PredictionHistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [riskFilter, classFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (riskFilter !== 'All') params.risk_category = riskFilter;
      if (classFilter !== 'All') params.predicted_class = classFilter;
      const data = await predictionService.getHistory(params);
      setRecords(data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id) => {
    try {
      await predictionService.deletePrediction(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirmId(null);
      if (selectedRecord?.id === id) setSelectedRecord(null);
      setActionMsg({ type: 'success', text: `Prediction record #${id} successfully deleted from SQLite.` });
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Failed to delete record. Try again.' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Prediction Audit History</h2>
              <p className="text-xs text-slate-500">
                Persistent employee assessments stored in SQLite database via SQLAlchemy ORM
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg self-start sm:self-auto">
            Total Records: <strong className="text-sky-600">{records.length}</strong>
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Employee Reference (e.g. EMP-9042)..."
              className="w-full text-xs pl-9 pr-20 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-md transition"
            >
              Search
            </button>
          </form>

          <div className="flex items-center space-x-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Risk Tiers</option>
              <option value="High Risk">High Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Low Risk">Low Risk</option>
            </select>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Classes</option>
              <option value="Yes">Predicted: Yes</option>
              <option value="No">Predicted: No</option>
            </select>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading SQLite records...
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Prediction Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Run a prediction in the "Attrition Prediction" tab to generate and store records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Employee Ref</th>
                  <th className="py-3 px-4">Predicted Attrition</th>
                  <th className="py-3 px-4">Flight Probability</th>
                  <th className="py-3 px-4">Risk Tier</th>
                  <th className="py-3 px-4">Model Applied</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">#{rec.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{rec.employee_reference}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          rec.predicted_class === 'Yes'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rec.predicted_class === 'Yes' ? 'Yes (Leaving)' : 'No (Retained)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {(rec.risk_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          rec.risk_category === 'High Risk'
                            ? 'bg-rose-50 border border-rose-200 text-rose-700'
                            : rec.risk_category === 'Medium Risk'
                            ? 'bg-amber-50 border border-amber-200 text-amber-700'
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        }`}
                      >
                        {rec.risk_category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">{rec.model_name}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(rec.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        title="View Full Profile Details"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(rec.id)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Prediction Profile Details: {selectedRecord.employee_reference}
                </h3>
                <span className="text-xs text-slate-500">Record ID #{selectedRecord.id}</span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Predicted Class:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRecord.predicted_class}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Probability:</span>
                  <span className="font-bold text-sky-600 text-sm">
                    {(selectedRecord.risk_probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Risk Tier:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRecord.risk_category}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Stored Input Feature Values (JSON Payload)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {Object.entries(selectedRecord.input_features || {}).map(([key, val]) => (
                    <div key={key} className="border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500 block text-[10px] truncate">{key}:</span>
                      <strong className="text-slate-800 truncate block">{String(val)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete prediction record #{deleteConfirmId} from SQLite? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
