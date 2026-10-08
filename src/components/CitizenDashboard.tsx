import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CrimeReport, ReportStatus } from '../types';
import {
  FileText,
  User,
  Plus,
  Search,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

interface CitizenDashboardProps {
  onOpenReceipt?: (reportId: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onOpenReceipt,
}) => {
  const {
    currentUser,
    reports,
    setSelectedReport,
    setActiveTrackingId,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');

  // Filter reports submitted by current citizen or matching citizen ID
  const myReports = reports.filter((r) => {
    if (!currentUser) return false;
    if (r.reporterId === currentUser.id) return true;
    if (r.reporterName && r.reporterName.includes(currentUser.name)) return true;
    return false;
  });

  // If none match specifically, fallback to showing reports or recent non-anonymous reports for demo continuity
  const displayReports = myReports.length > 0 ? myReports : reports.slice(0, 3);

  const filtered = displayReports.filter((r) => {
    if (activeTab === 'active') {
      return r.status !== 'Resolved' && r.status !== 'Dismissed';
    }
    if (activeTab === 'resolved') {
      return r.status === 'Resolved';
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'}
            alt="Citizen Profile"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg"
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Citizen Portal (dashboard.php)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {currentUser?.name || 'Sarah Jenkins'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Citizen ID: <code className="text-slate-300 font-mono">CIT-8921</code> • Secure Verified Reporter
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('report')}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>File a New Incident Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Filed Reports</div>
          <div className="text-2xl font-black text-white font-mono">{displayReports.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Total submitted</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-blue-400 font-medium mb-1">Active Inquiries</div>
          <div className="text-2xl font-black text-blue-300 font-mono">
            {displayReports.filter((r) => r.status !== 'Resolved' && r.status !== 'Dismissed').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">With CID detectives</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-emerald-400 font-medium mb-1">Resolved Cases</div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {displayReports.filter((r) => r.status === 'Resolved').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Completed & verified</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-amber-400 font-medium mb-1">Evidence Required</div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {displayReports.filter((r) => r.status === 'Evidence Required').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires your response</div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Reports ({displayReports.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Active Investigations
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Resolved
            </button>
          </div>

          <span className="text-xs text-slate-500">
            Click any case card to view real-time timeline & message officer
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No incident reports found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((rep) => {
              const latestLog = rep.logs[0];
              return (
                <div
                  key={rep.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-slate-950 text-blue-400 border border-slate-800">
                        {rep.trackingId}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          rep.status
                        )}`}
                      >
                        {rep.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Occurred: {rep.incidentDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenReceipt && onOpenReceipt(rep.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-400" />
                        <span>Print Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setActiveTrackingId(rep.trackingId);
                          setCurrentView('track');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>View Docket</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{rep.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {rep.description}
                    </p>
                  </div>

                  {/* Detective assignment & latest activity */}
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-slate-400">Assigned Investigator: </span>
                        <strong className="text-slate-200">
                          {rep.assignedOfficer || 'Triage Officer'}
                        </strong>{' '}
                        <span className="text-slate-500 font-mono">({rep.assignedBadge || 'CID'})</span>
                      </div>
                    </div>

                    {latestLog && (
                      <div className="text-[11px] text-slate-400 truncate max-w-sm">
                        <span className="text-blue-300 font-medium">Latest note: </span>
                        <span>{latestLog.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
