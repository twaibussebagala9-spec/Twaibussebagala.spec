import React from 'react';
import { CrimeReport } from '../types';
import { Printer, X, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface PrintReportReceiptProps {
  report: CrimeReport;
  onClose: () => void;
}

export const PrintReportReceipt: React.FC<PrintReportReceiptProps> = ({
  report,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl text-slate-100 my-8">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="print:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm text-white">
              Official Police Incident Report Dossier (download.php)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Document */}
        <div
          id="printable-report"
          className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl space-y-6 border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 font-sans"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center bg-slate-100 text-slate-900 shrink-0 font-serif font-black text-2xl">
                ★
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-wider text-slate-950 font-serif">
                  METROPOLITAN POLICE DEPARTMENT
                </h1>
                <p className="text-xs uppercase font-bold text-slate-600 tracking-widest">
                  CRIMINAL INVESTIGATION DIVISION • CENTRAL RECORDS DOCKET
                </p>
                <p className="text-[10px] text-slate-500">
                  OFFICIAL INCIDENT REPORT ACKNOWLEDGMENT & INSURANCE VERIFICATION
                </p>
              </div>
            </div>

            {/* Barcode & Reference */}
            <div className="text-right sm:text-right">
              <div className="font-mono text-lg font-black text-slate-950 tracking-wider">
                {report.trackingId}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                STATUS: {report.status.toUpperCase()}
              </div>
              {/* Simulated Barcode */}
              <div className="h-6 w-32 bg-slate-900 opacity-90 my-1 inline-block" />
              <div className="text-[9px] font-mono text-slate-400">STATE REG: #994-02-MPD</div>
            </div>
          </div>

          {/* Core Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Incident Date</span>
              <span className="font-bold text-slate-900">{report.incidentDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Time of Incident</span>
              <span className="font-bold text-slate-900">{report.incidentTime}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">District Command</span>
              <span className="font-bold text-slate-900">{report.district}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Intake Urgency</span>
              <span className="font-bold text-slate-900">{report.urgency}</span>
            </div>
          </div>

          {/* Location & Title */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Incident Classification</span>
            <div className="text-base font-black text-slate-950">{report.title}</div>
            <div className="text-xs text-slate-600 font-medium">
              Location: <strong>{report.location}</strong> ({report.category})
            </div>
          </div>

          {/* Complainant / Reporting Party */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Reporting Party / Victim</span>
              <span className="font-bold text-slate-900">
                {report.isAnonymous ? 'CONFIDENTIAL ANONYMOUS COMPLAINANT (SECTION 402)' : report.reporterName}
              </span>
            </div>
            {!report.isAnonymous && report.reporterContact && (
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Contact Info</span>
                <span className="text-slate-700">{report.reporterContact}</span>
              </div>
            )}
          </div>

          {/* Official Narrative */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              Official Incident Narrative / Sworn Statement
            </span>
            <p className="text-xs text-slate-800 leading-relaxed p-4 bg-slate-50/50 border border-slate-200 rounded-xl whitespace-pre-line font-serif">
              {report.description}
            </p>
          </div>

          {/* Suspect / Vehicle Description */}
          {report.suspectDetails && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Suspect Physical Profile & Vehicle Data
              </span>
              <p className="text-xs text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {report.suspectDetails}
              </p>
            </div>
          )}

          {/* Evidence Attachments Registry */}
          {report.evidenceFiles.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Chain of Custody Digital Evidence Registry ({report.evidenceFiles.length} Items)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {report.evidenceFiles.map((f, i) => (
                  <div key={f.id} className="p-2 border border-slate-200 rounded bg-slate-50 text-[11px]">
                    <span className="font-bold text-slate-900">Item #{i + 1}: </span>
                    <span className="text-slate-700">{f.name}</span>{' '}
                    <span className="text-slate-400">({f.size})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature and Verification Seal */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs">
            <div className="max-w-xs space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-500">Legal Certification:</div>
              <p className="text-[9px] text-slate-500 leading-tight">
                This report is an official public record of initial filing. Intentionally filing a
                false police report is a criminal felony punishable by law.
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic text-base text-slate-950 font-bold underline decoration-slate-400">
                {report.assignedOfficer || 'Desk Officer Vance'}
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-900">
                Sworn Investigating Detective ({report.assignedBadge || 'CID #4128'})
              </div>
              <div className="text-[9px] text-slate-500">
                Date Certified: {new Date().toLocaleDateString('en-US')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
