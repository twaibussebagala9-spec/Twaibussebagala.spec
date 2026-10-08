import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CRIME_CATEGORIES, DISTRICTS } from '../data/mockData';
import { CrimeCategory, ReportUrgency, EvidenceFile } from '../types';
import {
  FileText,
  AlertTriangle,
  Upload,
  EyeOff,
  User,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Printer,
  Search,
  X,
  FileCheck,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react';

interface ReportFormProps {
  initialCategory?: CrimeCategory;
  onOpenReceipt?: (reportId: string) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  initialCategory,
  onOpenReceipt,
}) => {
  const {
    currentUser,
    createReport,
    setCurrentView,
    setActiveTrackingId,
    setSelectedReport,
    showToast,
  } = useApp();

  const [category, setCategory] = useState<CrimeCategory>(
    initialCategory || 'Burglary & Break-in'
  );
  const [urgency, setUrgency] = useState<ReportUrgency>('Medium');
  const [title, setTitle] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [incidentTime, setIncidentTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [suspectDetails, setSuspectDetails] = useState('');
  const [witnessDetails, setWitnessDetails] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState(currentUser?.name || '');
  const [reporterContact, setReporterContact] = useState(
    currentUser?.email || currentUser?.phone || ''
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Evidence files
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Modal State
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Quick Preset Sample Evidence buttons
  const addPresetEvidence = (preset: 'cctv' | 'damage' | 'document') => {
    const id = `ev-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const now = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US');
    if (preset === 'cctv') {
      setEvidenceFiles((prev) => [
        ...prev,
        {
          id,
          name: 'cctv_security_still.jpg',
          size: '1.6 MB',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
          uploadedAt: now,
        },
      ]);
      showToast('Sample CCTV snapshot attached', 'info');
    } else if (preset === 'damage') {
      setEvidenceFiles((prev) => [
        ...prev,
        {
          id,
          name: 'property_damage_photo.jpg',
          size: '2.4 MB',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=800',
          uploadedAt: now,
        },
      ]);
      showToast('Sample damage photo attached', 'info');
    } else {
      setEvidenceFiles((prev) => [
        ...prev,
        {
          id,
          name: 'receipt_stolen_inventory_list.pdf',
          size: '380 KB',
          type: 'document',
          url: '#',
          uploadedAt: now,
        },
      ]);
      showToast('Sample purchase receipt document attached', 'info');
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      reader.onload = (uploadEvent) => {
        const url = (uploadEvent.target?.result as string) || '';
        const newFile: EvidenceFile = {
          id: `ev-${Date.now()}-${i}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: isImg ? 'image' : 'document',
          url: isImg ? url : '#',
          uploadedAt: new Date().toLocaleTimeString('en-US'),
        };
        setEvidenceFiles((prev) => [...prev, newFile]);
      };
      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        const newFile: EvidenceFile = {
          id: `ev-${Date.now()}-${i}`,
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: 'document',
          url: '#',
          uploadedAt: new Date().toLocaleTimeString('en-US'),
        };
        setEvidenceFiles((prev) => [...prev, newFile]);
      }
    }
    showToast('File(s) uploaded successfully', 'success');
  };

  const removeEvidence = (id: string) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide a brief Incident Title', 'warning');
      return;
    }
    if (!location.trim()) {
      showToast('Please enter the street address or landmark location', 'warning');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      showToast('Please provide a detailed description (at least 20 characters)', 'warning');
      return;
    }
    if (!agreedToTerms) {
      showToast('Please verify and check the legal declaration box', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport = createReport({
        title: title.trim(),
        category,
        urgency,
        incidentDate,
        incidentTime,
        district,
        location: location.trim(),
        description: description.trim(),
        suspectDetails: suspectDetails.trim() || undefined,
        witnessDetails: witnessDetails.trim() || undefined,
        isAnonymous,
        reporterName: isAnonymous ? undefined : reporterName.trim(),
        reporterContact: isAnonymous ? undefined : reporterContact.trim(),
        evidenceFiles,
      });

      setSubmittedReport(newReport);
    } catch (err) {
      showToast('Error filing report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    showToast('Case Reference ID copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Submission Success Dialog */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-black text-white">
                Crime Report Filed Successfully
              </h2>
              <p className="text-xs text-slate-400">
                Your report has been queued for central triage and assigned to precinct CID.
              </p>
            </div>

            {/* Tracking ID Pill */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                Official Incident Reference Code
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-blue-400 tracking-wider flex items-center justify-center gap-3">
                <span>{submittedReport.trackingId}</span>
                <button
                  onClick={() => copyToClipboard(submittedReport.trackingId)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy Tracking ID"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {submittedReport.isAnonymous && submittedReport.anonymousKey && (
                <div className="mt-3 pt-3 border-t border-slate-900 text-xs text-amber-300">
                  <span className="font-bold">Secret Retrieval PIN: </span>
                  <code className="font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 font-bold">
                    {submittedReport.anonymousKey}
                  </code>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Save this PIN to view case updates without revealing your identity.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedReport(submittedReport);
                  setActiveTrackingId(submittedReport.trackingId);
                  setCurrentView('track');
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Track This Case Live</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (onOpenReceipt) {
                      onOpenReceipt(submittedReport.id);
                    } else {
                      setSelectedReport(submittedReport);
                      setActiveTrackingId(submittedReport.trackingId);
                      setCurrentView('track');
                    }
                  }}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Download / Print Receipt</span>
                </button>

                <button
                  onClick={() => {
                    setSubmittedReport(null);
                    setCurrentView('home');
                  }}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Official Law Enforcement Intake (report.php)</span>
        </div>
        <h1 className="text-3xl font-black text-white">File an Incident Report</h1>
        <p className="text-sm text-slate-400 mt-1">
          Complete the official form below. Sworn officers review all incoming submissions and
          assign investigators accordingly.
        </p>
      </div>

      {/* Emergency Notice Warning */}
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong className="font-bold text-amber-300">Is this an immediate emergency?</strong> If
          someone is in active physical danger, a crime is occurring right now, or immediate medical
          attention is needed, please call <strong className="underline text-white font-black">911</strong>{' '}
          immediately instead of submitting an online form.
        </div>
      </div>

      {/* Filing Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Classification & Severity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>Incident Categorization & Urgency</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Crime / Incident Type *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CrimeCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {CRIME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Urgency Level *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Critical / Emergency'] as ReportUrgency[]).map(
                  (lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        urgency === lvl
                          ? lvl === 'Critical / Emergency'
                            ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-900/40'
                            : lvl === 'High'
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {lvl.split(' ')[0]}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Incident Headline / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken store window and stolen inventory laptops"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Section 2: Time and Location */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>Date, Time & Exact Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Date of Occurrence *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Approximate Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Precinct District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Street Address / Cross Streets / Landmark *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 742 Elm Street, corner of 4th Avenue near Metro station"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Detailed Narrative and Suspect Info */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>Incident Narrative & Suspect Profile</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Detailed Description of What Happened *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State exactly what occurred in sequence. Include stolen item names, estimated dollar loss, signs of forced entry, weapon presence if any, and any verbal statements made..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">Minimum 20 characters required.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Suspect Description (If Seen)
              </label>
              <textarea
                rows={3}
                value={suspectDetails}
                onChange={(e) => setSuspectDetails(e.target.value)}
                placeholder="Height, build, clothing, scars/tattoos, vehicle make/model/license plate, direction fled..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Witness Details (If Any)
              </label>
              <textarea
                rows={3}
                value={witnessDetails}
                onChange={(e) => setWitnessDetails(e.target.value)}
                placeholder="Names, contact information, or locations of witnesses who saw or heard the incident..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Evidence & File Uploads (uploads/) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>Digital Evidence & Attachments</span>
            </h2>
            <span className="text-xs text-slate-400">Photos, CCTV stills, documents & receipts</span>
          </div>

          {/* Quick preset attachments for rapid testing */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Quick Test Attachments (Instant Demo Presets):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addPresetEvidence('cctv')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ Add Sample CCTV Still</span>
              </button>
              <button
                type="button"
                onClick={() => addPresetEvidence('damage')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ Add Sample Damage Photo</span>
              </button>
              <button
                type="button"
                onClick={() => addPresetEvidence('document')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Add Stolen Items Receipt</span>
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              id="fileUpload"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleCustomFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-white">
                Upload files from your device
              </div>
              <div className="text-xs text-slate-400">
                Supports JPG, PNG, PDF, DOC up to 25MB each
              </div>
            </label>
          </div>

          {/* Attached Files List */}
          {evidenceFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Attached Files ({evidenceFiles.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.type === 'image' && file.url !== '#' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{file.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEvidence(file.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Anonymous Mode & Reporter Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">
              5
            </span>
            <span>Reporter Identity & Privacy Options</span>
          </h2>

          {/* Anonymous Toggle Box */}
          <div
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3 ${
              isAnonymous
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <span>Submit 100% Anonymously (Identity Protected)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                When checked, your name, email, and IP will not be recorded in the police docket.
                You will receive a confidential secret PIN to check status updates without logging in.
              </p>
            </div>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Full Name / Title
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Contact Phone / Email
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="e.g. sarah.jenkins@example.com / (555) 249-1830"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Legal declaration checkbox */}
          <div className="pt-4 border-t border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I certify under penalty of perjury that the information provided in this report is
                accurate, truthful, and submitted in good faith. I understand that filing a false
                police report is a criminal violation.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancel & Return Home
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 disabled:opacity-50"
          >
            <FileCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Submitting to Dispatch...' : 'Submit Official Crime Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
