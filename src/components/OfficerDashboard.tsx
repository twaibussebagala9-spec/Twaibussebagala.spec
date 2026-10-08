import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CrimeReport, ReportStatus, ReportUrgency } from '../types';
import { UpdateReportModal } from './UpdateReportModal';
import {
  BadgeAlert,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Clock,
  Printer,
  Bell,
  Eye,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';

interface OfficerDashboardProps {
  onOpenReceipt?: (reportId: string) => void;
  onOpenManageAlerts?: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  onOpenReceipt,
  onOpenManageAlerts,
}) => {
  const {
    currentUser,
    reports,
    setSelectedReport,
    setActiveTrackingId,
    setCurrentView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [onlyMyCases, setOnlyMyCases] = useState(false);
  const [editingReport, setEditingReport] = useState<CrimeReport | null>(null);

  // Statistics
  const totalCases = reports.length;
  const pendingReview = reports.filter((r) => r.status === 'Pending Review').length;
  const underInvestigation = reports.filter((r) => r.status === 'Under Investigation').length;
  const criticalCases = reports.filter(
    (r) => r.urgency === 'Critical / Emergency' || r.urgency === 'High'
  ).length;
  const resolvedCases = reports.filter((r) => r.status === 'Resolved').length;

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTrack = r.trackingId.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchLoc = r.location.toLowerCase().includes(q);
      const matchRep = (r.reporterName || '').toLowerCase().includes(q);
      if (!matchTrack && !matchTitle && !matchLoc && !matchRep) return false;
    }

    // Status
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;

    // Urgency
    if (filterUrgency !== 'all' && r.urgency !== filterUrgency) return false;

    // My cases
    if (onlyMyCases) {
      if (!currentUser?.name || !r.assignedOfficer?.includes(currentUser.name.split(' ')[1] || '')) {
        return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Under Investigation':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'In Progress':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Evidence Required':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Dismissed':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getUrgencyBadge = (urgency: ReportUrgency) => {
    switch (urgency) {
      case 'Critical / Emergency':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Low':
        return 'bg-slate-500/20 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Officer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <BadgeAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Command Terminal (officer_dashboard.php)
              </span>
              <span className="text-[10px] font-mono bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800">
                {currentUser?.badgeNumber || 'BADGE #4128'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Detective Case Management Console
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-slate-200">{currentUser?.name || 'Detective Vance'}</strong> • Criminal Investigation Division
            </p>
          </div>
        </div>

        {/* Quick Officer Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenManageAlerts && onOpenManageAlerts()}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Safety Alert</span>
          </button>

          <button
            onClick={() => setCurrentView('report')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>File Supplemental Incident</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Total Queue</div>
          <div className="text-2xl font-black text-white font-mono">{totalCases}</div>
          <div className="text-[11px] text-slate-500 mt-1">Dockets on precinct log</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-amber-400 font-medium mb-1">Pending Triage</div>
          <div className="text-2xl font-black text-amber-300 font-mono">{pendingReview}</div>
          <div className="text-[11px] text-amber-500/80 mt-1">Needs review & assign</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-blue-400 font-medium mb-1">Under Investigation</div>
          <div className="text-2xl font-black text-blue-300 font-mono">{underInvestigation}</div>
          <div className="text-[11px] text-blue-500/80 mt-1">Active field inquiry</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-rose-400 font-medium mb-1">High / Critical</div>
          <div className="text-2xl font-black text-rose-400 font-mono">{criticalCases}</div>
          <div className="text-[11px] text-rose-500/80 mt-1">Immediate priority</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-emerald-400 font-medium mb-1">Cases Resolved</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{resolvedCases}</div>
          <div className="text-[11px] text-emerald-500/80 mt-1">Closed successfully</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID, incident title, location, or reporter..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="In Progress">In Progress</option>
              <option value="Evidence Required">Evidence Required</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>

            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="all">All Urgency</option>
              <option value="Critical / Emergency">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={onlyMyCases}
                onChange={(e) => setOnlyMyCases(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span>My Assigned Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Official Case Docket Queue ({filteredReports.length} Cases)
          </div>
          <span className="text-[11px] text-slate-500">Live Precinct Roster</span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <p className="font-semibold text-slate-300">No cases match the specified filter criteria.</p>
            <p className="text-slate-500">Try clearing the search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case Ref</th>
                  <th className="py-3 px-4">Incident / Category</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Location / District</th>
                  <th className="py-3 px-4">Date Filed</th>
                  <th className="py-3 px-4">Assigned Investigator</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredReports.map((rep) => (
                  <tr
                    key={rep.id}
                    className="hover:bg-slate-850/50 transition-colors group"
                  >
                    {/* Case ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {rep.trackingId}
                      {rep.isAnonymous && (
                        <span className="block text-[10px] text-emerald-400 font-sans font-normal">
                          Anonymous
                        </span>
                      )}
                    </td>

                    {/* Title & Category */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-white leading-tight truncate">
                        {rep.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{rep.category}</div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${getUrgencyBadge(
                          rep.urgency
                        )}`}
                      >
                        {rep.urgency.split(' ')[0]}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="text-slate-200 truncate font-medium">{rep.location}</div>
                      <div className="text-[10px] text-slate-500">{rep.district}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {rep.incidentDate}
                    </td>

                    {/* Investigator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">
                        {rep.assignedOfficer || 'Unassigned'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {rep.assignedBadge || 'Triage Queue'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getStatusBadge(
                          rep.status
                        )}`}
                      >
                        {rep.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingReport(rep)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 font-bold text-[11px] transition-colors"
                          title="Update Status / Log (update_report.php)"
                        >
                          Update Case
                        </button>

                        <button
                          onClick={() => {
                            setSelectedReport(rep);
                            setActiveTrackingId(rep.trackingId);
                            setCurrentView('track');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Open Full Case Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenReceipt && onOpenReceipt(rep.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Print Official Police Summary"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal if opened */}
      {editingReport && (
        <UpdateReportModal
          report={editingReport}
          onClose={() => setEditingReport(null)}
        />
      )}
    </div>
  );
};
