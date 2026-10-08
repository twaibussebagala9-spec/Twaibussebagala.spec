import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicAlert, AlertSeverity } from '../types';
import { ManageAlertsModal } from './ManageAlertsModal';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Archive,
  Trash2,
  Calendar,
  MapPin,
  Plus,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    currentUser,
    currentRole,
    toggleAlertStatus,
    deleteAlert,
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);

  const isOfficerOrAdmin = currentRole === 'officer' || currentRole === 'admin';

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchDesc = a.description.toLowerCase().includes(q);
      const matchLoc = a.location.toLowerCase().includes(q);
      const matchDist = a.district.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchDist) return false;
    }
    return true;
  });

  const getBorderAndBg = (severity: AlertSeverity, isActive: boolean) => {
    if (!isActive) return 'border-slate-800 bg-slate-900/40 opacity-70';
    switch (severity) {
      case 'critical':
        return 'border-rose-500/50 bg-rose-950/20';
      case 'warning':
        return 'border-amber-500/50 bg-amber-950/20';
      case 'advisory':
        return 'border-blue-500/50 bg-blue-950/20';
    }
  };

  const getBadgeStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-600 text-white border-rose-500';
      case 'warning':
        return 'bg-amber-600 text-white border-amber-500';
      case 'advisory':
        return 'bg-blue-600 text-white border-blue-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Bell className="w-4 h-4" />
            <span>Community Bulletins (alerts.php)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Public Safety Alerts & Bulletins
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live warnings issued by precinct command concerning criminal activity patterns, extreme
            weather, amber alerts, and neighborhood advisories.
          </p>
        </div>

        {isOfficerOrAdmin && (
          <button
            onClick={() => setShowManageModal(true)}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast New Alert (manage_alerts.php)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterSeverity === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Bulletins ({alerts.length})
          </button>

          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filterSeverity === 'critical'
                ? 'bg-rose-600 text-white'
                : 'text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Critical</span>
          </button>

          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterSeverity === 'warning'
                ? 'bg-amber-600 text-white'
                : 'text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            Warnings
          </button>

          <button
            onClick={() => setFilterSeverity('advisory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterSeverity === 'advisory'
                ? 'bg-blue-600 text-white'
                : 'text-blue-400 hover:bg-blue-950/40'
            }`}
          >
            Advisories
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts or district..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No public safety alerts found matching your criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-2xl p-6 sm:p-7 transition-all ${getBorderAndBg(
                alert.severity,
                alert.isActive
              )} space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>

                  <span className="text-xs font-bold text-slate-300">
                    {alert.category}
                  </span>

                  {!alert.isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      ARCHIVED / EXPIRED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Issued: {alert.createdAt}</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>Expires: {alert.expiresAt}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-black text-white mb-2 leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Affected Location & District */}
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>Impacted Location: </strong>
                  {alert.location} ({alert.district})
                </span>
              </div>

              {/* Action Guidance Callout */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Recommended Community Precaution & Action:
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.actionGuidance}
                  </p>
                </div>
              </div>

              {/* Footer Meta & Officer Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
                <div>
                  <span>Broadcast Origin: </span>
                  <strong className="text-slate-200">{alert.broadcastBy}</strong>
                </div>

                {isOfficerOrAdmin && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleAlertStatus(alert.id)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>{alert.isActive ? 'Archive Bulletin' : 'Reactivate'}</span>
                    </button>

                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      {showManageModal && (
        <ManageAlertsModal onClose={() => setShowManageModal(false)} />
      )}
    </div>
  );
};
