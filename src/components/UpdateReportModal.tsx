import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CrimeReport, ReportStatus } from '../types';
import {
  BadgeAlert,
  ShieldCheck,
  CheckCircle,
  X,
  FileText,
  UserCheck,
  Clock,
} from 'lucide-react';

interface UpdateReportModalProps {
  report: CrimeReport;
  onClose: () => void;
}

export const UpdateReportModal: React.FC<UpdateReportModalProps> = ({
  report,
  onClose,
}) => {
  const { updateReportStatus, assignReportOfficer, showToast } = useApp();

  const [newStatus, setNewStatus] = useState<ReportStatus>(report.status);
  const [officerNote, setOfficerNote] = useState('');
  const [isInternalOnly, setIsInternalOnly] = useState(false);
  const [selectedInvestigator, setSelectedInvestigator] = useState(
    report.assignedOfficer || 'Detective Marcus Vance'
  );
  const [badgeNum, setBadgeNum] = useState(
    report.assignedBadge || 'BADGE #4128'
  );

  const statusOptions: ReportStatus[] = [
    'Pending Review',
    'Under Investigation',
    'In Progress',
    'Evidence Required',
    'Resolved',
    'Dismissed',
  ];

  const investigatorOptions = [
    { name: 'Detective Marcus Vance', badge: 'BADGE #4128', dept: 'CID Property Crimes' },
    { name: 'Detective Liam Chen', badge: 'BADGE #3884', dept: 'CID Cyber & Financial Crimes' },
    { name: 'Officer Rachel Scott', badge: 'BADGE #5219', dept: 'Traffic & Collision Recon' },
    { name: 'Commander Elena Rostova', badge: 'BADGE #1001', dept: 'Command Staff' },
  ];

  const handleInvestigatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosen = investigatorOptions.find((inv) => inv.name === e.target.value);
    if (chosen) {
      setSelectedInvestigator(chosen.name);
      setBadgeNum(chosen.badge);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!officerNote.trim()) {
      showToast('Please enter an official case log entry or explanation', 'warning');
      return;
    }

    // 1. If assigned officer changed
    if (
      selectedInvestigator !== report.assignedOfficer ||
      badgeNum !== report.assignedBadge
    ) {
      assignReportOfficer(report.id, selectedInvestigator, badgeNum);
    }

    // 2. Update status & add case note
    updateReportStatus(report.id, newStatus, officerNote.trim(), isInternalOnly);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BadgeAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Officer Action: Update Case Docket
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-blue-400 font-bold">{report.trackingId}</span>
                <span>•</span>
                <span>{report.title}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Update Investigation Status *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setNewStatus(st)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                    newStatus === st
                      ? 'bg-amber-600 border-amber-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{st}</span>
                    {newStatus === st && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Assigned Investigator */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Assigned Detective / Unit
            </label>
            <select
              value={selectedInvestigator}
              onChange={handleInvestigatorChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              {investigatorOptions.map((inv) => (
                <option key={inv.name} value={inv.name}>
                  {inv.name} ({inv.badge}) - {inv.dept}
                </option>
              ))}
            </select>
          </div>

          {/* Official Officer Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Official Police Log Entry / Investigation Note *
            </label>
            <textarea
              rows={4}
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="e.g. Conducted interview with store owner. CCTV tape secured and sent to digital forensics. Stolen laptops entered into NCIC/pawn stolen registry..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="internalOnly"
              checked={isInternalOnly}
              onChange={(e) => setIsInternalOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="internalOnly" className="text-xs text-slate-300 cursor-pointer">
              <span className="font-bold text-white">Internal Precinct Only (Police Docket Note)</span>
              <span className="block text-[11px] text-slate-400">
                If unchecked, note is visible to the reporting citizen on their timeline.
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Official Case Docket Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
