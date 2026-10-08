import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CrimeReport, ReportStatus } from '../types';
import {
  Search,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  BadgeAlert,
  FileText,
  Printer,
  Send,
  MessageSquare,
  CheckCircle,
  Copy,
  ChevronRight,
  Eye,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface TrackReportViewProps {
  onOpenReceipt?: (reportId: string) => void;
  onOpenOfficerUpdate?: (report: CrimeReport) => void;
}

export const TrackReportView: React.FC<TrackReportViewProps> = ({
  onOpenReceipt,
  onOpenOfficerUpdate,
}) => {
  const {
    reports,
    activeTrackingId,
    setActiveTrackingId,
    getReportByTrackingId,
    selectedReport,
    setSelectedReport,
    addCaseMessage,
    currentUser,
    currentRole,
    setCurrentView,
    showToast,
  } = useApp();

  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'logs' | 'messages' | 'evidence'>('details');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Active report being viewed
  const report: CrimeReport | undefined =
    selectedReport || (activeTrackingId ? getReportByTrackingId(activeTrackingId) : undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      showToast('Please enter a Reference ID or Secret Key', 'warning');
      return;
    }
    const found = getReportByTrackingId(searchInput.trim());
    if (found) {
      setSelectedReport(found);
      setActiveTrackingId(found.trackingId);
      showToast(`Case ${found.trackingId} loaded`, 'success');
    } else {
      showToast(`No record found matching "${searchInput}". Please check your Reference ID.`, 'error');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !report) return;

    addCaseMessage(report.id, messageText.trim());
    setMessageText('');
    showToast('Message sent to case log', 'success');
  };

  const copyTrackingId = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.trackingId);
    showToast('Case Reference ID copied to clipboard', 'info');
  };

  // Status progression mapping
  const statusSteps: ReportStatus[] = [
    'Pending Review',
    'Under Investigation',
    'In Progress',
    'Resolved',
  ];

  const getStepState = (step: ReportStatus, currentStatus: ReportStatus) => {
    const order: Record<ReportStatus, number> = {
      'Pending Review': 1,
      'Under Investigation': 2,
      'In Progress': 3,
      'Evidence Required': 2,
      'Resolved': 4,
      'Dismissed': 0,
    };
    const currentNum = order[currentStatus] || 1;
    const stepNum = order[step] || 1;
    if (currentStatus === 'Dismissed') return 'dismissed';
    if (stepNum < currentNum) return 'completed';
    if (stepNum === currentNum) return 'active';
    return 'upcoming';
  };

  const statusBadgeColor = (status: ReportStatus) => {
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
      {/* Search Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Search className="w-4 h-4" />
            <span>Incident Dossier Lookup (view_report.php)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Track Case Investigation</h1>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Search by Reference Number (e.g. CR-2026-8492) or Anonymous Secret Key.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. CR-2026-8492"
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </button>
          </form>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-slate-500 text-[11px]">Quick Samples:</span>
            {reports.slice(0, 4).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchInput(r.trackingId);
                  setSelectedReport(r);
                  setActiveTrackingId(r.trackingId);
                }}
                className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                  report?.id === r.id
                    ? 'bg-blue-600 border-blue-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {r.trackingId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Details Card */}
      {report ? (
        <div className="space-y-6">
          {/* Top Case Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    onClick={copyTrackingId}
                    className="font-mono text-base font-black px-3 py-1 rounded-lg bg-slate-950 text-blue-400 border border-slate-800 hover:border-blue-500/50 cursor-pointer flex items-center gap-1.5 transition-colors"
                    title="Click to copy Reference ID"
                  >
                    <span>{report.trackingId}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${statusBadgeColor(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Urgency: {report.urgency}
                  </span>

                  {report.isAnonymous && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Anonymous Filing</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black text-white">{report.title}</h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Occurred: {report.incidentDate} at {report.incidentTime}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{report.location} ({report.district})</span>
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenReceipt && onOpenReceipt(report.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Download / Print Receipt</span>
                </button>

                {(currentRole === 'officer' || currentRole === 'admin') && (
                  <button
                    onClick={() => onOpenOfficerUpdate && onOpenOfficerUpdate(report)}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-amber-600/20"
                  >
                    <BadgeAlert className="w-4 h-4" />
                    <span>Officer Action / Update</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Investigation Progress Tracker
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statusSteps.map((step, idx) => {
                  const state = getStepState(step, report.status);
                  return (
                    <div
                      key={step}
                      className={`p-3 rounded-xl border relative transition-all ${
                        state === 'active'
                          ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-950/50'
                          : state === 'completed'
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Phase 0{idx + 1}
                        </span>
                        {state === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        )}
                        {state === 'active' && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                        )}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          state === 'active'
                            ? 'text-white'
                            : state === 'completed'
                            ? 'text-emerald-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Detective Bar */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">
                    Lead Assigned Investigator:{' '}
                    <span className="text-blue-400 font-extrabold">
                      {report.assignedOfficer || 'Pending Triage Assignment'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {report.assignedBadge || 'Central CID Intake Desk'} • Criminal Investigation Division
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                Last Docket Update: {report.updatedAt}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Incident Details</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Officer Case Logs ({report.logs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Case Inquiries / Chat ({report.messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'evidence'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Evidence Files ({report.evidenceFiles.length})</span>
            </button>
          </div>

          {/* Tab 1: Incident Details */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Official Incident Narrative
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
                    {report.description}
                  </p>
                </div>

                {report.suspectDetails && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Suspect & Vehicle Description
                    </h3>
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {report.suspectDetails}
                    </div>
                  </div>
                )}

                {report.witnessDetails && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Witness Statements / Leads
                    </h3>
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {report.witnessDetails}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                    Filing Meta
                  </h3>

                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Reporter:</span>
                      <span className="text-slate-200 font-semibold">{report.reporterName}</span>
                    </div>

                    {!report.isAnonymous && report.reporterContact && (
                      <div>
                        <span className="text-slate-500 block text-[11px]">Contact Channel:</span>
                        <span className="text-slate-200">{report.reporterContact}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-500 block text-[11px]">Submitted On:</span>
                      <span className="text-slate-200">{report.createdAt}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">District Command:</span>
                      <span className="text-slate-200 font-semibold">{report.district}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Quick Previews */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Attached Evidence ({report.evidenceFiles.length})
                    </h3>
                    <button
                      onClick={() => setActiveTab('evidence')}
                      className="text-[11px] text-blue-400 hover:underline"
                    >
                      View all
                    </button>
                  </div>

                  {report.evidenceFiles.length === 0 ? (
                    <p className="text-xs text-slate-500">No media attached to this docket.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {report.evidenceFiles.slice(0, 4).map((file) => (
                        <div
                          key={file.id}
                          onClick={() => file.type === 'image' && setLightboxImg(file.url)}
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 cursor-pointer hover:border-slate-700 transition-colors"
                        >
                          {file.type === 'image' && file.url !== '#' ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-16 object-cover rounded mb-1"
                            />
                          ) : (
                            <div className="w-full h-16 bg-slate-850 rounded flex items-center justify-center text-slate-400 mb-1">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="text-[10px] text-slate-300 truncate">{file.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Official Case Logs */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sworn Officer Chronological Case Notes
                </h3>
                <span className="text-xs text-slate-400">{report.logs.length} Log Entries</span>
              </div>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {report.logs.map((log) => (
                  <div key={log.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center" />

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-400">{log.officerName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                            {log.officerBadge}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                      </div>

                      <div className="text-xs font-semibold text-slate-300">
                        Status at entry:{' '}
                        <span className="text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                          {log.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {log.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Two-Way Case Inquiry / Messages */}
          {activeTab === 'messages' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Secure Communication Channel
                </h3>
                <p className="text-xs text-slate-400">
                  Direct message link between the reporting citizen and assigned detective.
                </p>
              </div>

              {/* Messages Feed */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {report.messages.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No inquiries recorded yet. You can submit questions or extra clues below.
                  </div>
                ) : (
                  report.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.senderRole === 'officer' ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div
                        className={`max-w-lg rounded-2xl p-4 text-xs leading-relaxed ${
                          msg.senderRole === 'officer'
                            ? 'bg-blue-950/60 border border-blue-800/60 text-slate-200'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1 border-b border-white/10 pb-1">
                          <span className="font-bold text-blue-300">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Provide an additional lead, clarification, or question for the detective..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 4: Evidence Files */}
          {activeTab === 'evidence' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Digital Forensics & Evidence Files
              </h3>

              {report.evidenceFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No photographic or document evidence attached to this case.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {report.evidenceFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        {file.type === 'image' && file.url !== '#' ? (
                          <div
                            onClick={() => setLightboxImg(file.url)}
                            className="relative group cursor-pointer overflow-hidden rounded-lg mb-3"
                          >
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                              <Eye className="w-4 h-4" />
                              <span>Enlarge Photo</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-40 bg-slate-850 rounded-lg flex flex-col items-center justify-center text-slate-400 mb-3 p-4 text-center">
                            <FileText className="w-10 h-10 text-slate-500 mb-2" />
                            <span className="text-xs font-semibold">{file.name}</span>
                          </div>
                        )}

                        <div className="text-xs font-bold text-slate-200 truncate">{file.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Size: {file.size} • Uploaded: {file.uploadedAt}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-800">
                        {file.url !== '#' ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                          >
                            Open Raw File
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">Secure Law Enforcement File</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty lookup state */
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">No Case Reference Selected</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please enter your Case Reference ID (e.g.{' '}
            <code className="text-blue-400">CR-2026-8492</code>) in the search field above, or click
            one of the quick samples to inspect an active investigation file.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('report')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Need to file a new report?
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700">
            <img src={lightboxImg} alt="Enlarged evidence" className="w-full h-auto object-contain" />
            <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-xs text-white">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
