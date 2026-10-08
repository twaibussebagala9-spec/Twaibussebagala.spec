import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DISTRICTS } from '../data/mockData';
import { AlertSeverity } from '../types';
import { Bell, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface ManageAlertsModalProps {
  onClose: () => void;
}

export const ManageAlertsModal: React.FC<ManageAlertsModalProps> = ({ onClose }) => {
  const { createAlert, currentUser, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Public Safety');
  const [severity, setSeverity] = useState<AlertSeverity>('warning');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [actionGuidance, setActionGuidance] = useState('');
  const [expiresAt, setExpiresAt] = useState('2026-10-15 11:59 PM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !actionGuidance.trim()) {
      showToast('Please fill out all required fields for the public bulletin', 'warning');
      return;
    }

    createAlert({
      title: title.trim(),
      category: category.trim(),
      severity,
      district,
      location: location.trim() || district,
      description: description.trim(),
      actionGuidance: actionGuidance.trim(),
      expiresAt: expiresAt.trim(),
      broadcastBy: currentUser?.name
        ? `${currentUser.name} (${currentUser.badgeNumber || 'CID'})`
        : 'Emergency Operations Center',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Broadcast Public Safety Bulletin (manage_alerts.php)
              </h2>
              <p className="text-xs text-slate-400">
                Official citizen advisory broadcast to web portal and mobile alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Severity & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Severity Level *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['critical', 'warning', 'advisory'] as AlertSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                      severity === sev
                        ? sev === 'critical'
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : sev === 'warning'
                          ? 'bg-amber-600 border-amber-500 text-white'
                          : 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Property Crime Alert / Severe Weather"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Alert Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spate of Daytime Package Thefts along Birch Street"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* District & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Precinct District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Specific Streets / Radius
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 100-400 Block of Birch St & Elm"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Incident Situation Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the pattern, suspects observed, vehicles to look out for, or hazard situation..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Guidance */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Community Action / Preventative Guidance *
            </label>
            <textarea
              rows={2}
              value={actionGuidance}
              onChange={(e) => setActionGuidance(e.target.value)}
              placeholder="What actions should community members take? (e.g. lock side gates, request signature delivery, report gray SUV...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30"
            >
              <Bell className="w-4 h-4" />
              <span>Broadcast Bulletin to Public</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
