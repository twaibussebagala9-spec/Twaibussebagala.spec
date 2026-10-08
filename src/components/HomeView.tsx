import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CRIME_CATEGORIES } from '../data/mockData';
import { CrimeCategory } from '../types';
import {
  ShieldAlert,
  FileText,
  Search,
  Bell,
  MapPin,
  Lock,
  EyeOff,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Building2,
  PhoneCall,
  Flame,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  UserCheck,
} from 'lucide-react';

export const HomeView: React.FC<{
  onSelectCategory?: (category: CrimeCategory) => void;
  onOpenAuth?: () => void;
}> = ({ onSelectCategory, onOpenAuth }) => {
  const {
    currentUser,
    setCurrentView,
    alerts,
    reports,
    setActiveTrackingId,
    getReportByTrackingId,
    setSelectedReport,
    showToast,
  } = useApp();

  const [trackInput, setTrackInput] = useState('');

  const activeAlerts = alerts.filter((a) => a.isActive);
  const criticalAlert = activeAlerts.find((a) => a.severity === 'critical');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) {
      showToast('Please enter a valid Case Reference ID', 'warning');
      return;
    }
    const found = getReportByTrackingId(trackInput.trim());
    if (found) {
      setSelectedReport(found);
      setActiveTrackingId(found.trackingId);
      setCurrentView('track');
    } else {
      setActiveTrackingId(trackInput.trim());
      setCurrentView('track');
    }
  };

  const handleCategoryClick = (category: CrimeCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    setCurrentView('report');
  };

  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const underInvestigationCount = reports.filter((r) => r.status === 'Under Investigation').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Top Urgent Alert Banner if critical alert exists */}
      {criticalAlert && (
        <div className="bg-rose-950/80 border-y border-rose-800/80 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-rose-600 text-white shrink-0 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400">
                    CRITICAL SAFETY ALERT
                  </span>
                  <span className="text-xs text-rose-300 font-medium hidden md:inline">
                    • {criticalAlert.district}
                  </span>
                </div>
                <p className="text-sm font-semibold text-rose-100">{criticalAlert.title}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('alerts')}
              className="text-xs font-bold text-rose-200 hover:text-white bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors self-end sm:self-center"
            >
              <span>View Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Metro Police Official Citizen Incident Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Report Crime Safely.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                  Protect Your Neighborhood.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Sentinel empowers citizens to report non-violent crimes, property theft, fraud, and
                suspicious incidents directly to precinct detectives. Track investigation progress in
                real-time or submit completely anonymously.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('report')}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:translate-y-[-1px] transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>File a Crime Report</span>
                </button>

                <button
                  onClick={() => setCurrentView('alerts')}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Active Alerts ({activeAlerts.length})</span>
                </button>

                <button
                  onClick={() => setCurrentView('map')}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>District Map</span>
                </button>

                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-blue-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:border-blue-500/60"
                  >
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span>{currentUser ? `Signed in: ${currentUser.name}` : 'Login (Name + Phone/Email)'}</span>
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                  <span>Optional 100% Anonymous Mode</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Encrypted Intake Pipeline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Fast Detective Triage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Instant Case Tracker Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Card Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        Instant Case Status Check
                      </h3>
                      <p className="text-xs text-slate-400">Track an existing investigation</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    PUBLIC LOOKUP
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Enter your assigned Sentinel Reference ID (e.g.{' '}
                  <code className="text-blue-300 font-mono bg-blue-950/60 px-1 py-0.5 rounded">
                    CR-2026-8492
                  </code>{' '}
                  or{' '}
                  <code className="text-blue-300 font-mono bg-blue-950/60 px-1 py-0.5 rounded">
                    CR-2026-7914
                  </code>
                  ) to see assigned detective notes and real-time case updates.
                </p>

                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      placeholder="e.g. CR-2026-8492"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Investigation Progress</span>
                  </button>
                </form>

                {/* Quick Sample Links */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400 mb-2 font-medium">
                    Try active sample case references:
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {reports.slice(0, 3).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedReport(r);
                          setActiveTrackingId(r.trackingId);
                          setCurrentView('track');
                        }}
                        className="font-mono text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded border border-slate-700 hover:border-blue-500/50 transition-colors"
                      >
                        {r.trackingId}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Precinct Statistics Banner */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Citywide Crime Intake Operations</h3>
                <p className="text-xs text-slate-400">
                  Live data feed from Central Metropolitan Precinct Headquarters
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Precinct Dispatch Desk Online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium mb-1">Total Cases Processed</div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {reports.length + 4820}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 rotate-180" />
                  <span>+14 this week</span>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium mb-1">Under Investigation</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {underInvestigationCount + 42}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Assigned to CID Detectives</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium mb-1">Case Solved Rate</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">79.4%</div>
                <div className="text-[11px] text-emerald-400 mt-1">Verified resolutions</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400 font-medium mb-1">Avg Detective Triage</div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
                  48 mins
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Priority queue response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Select Report Category Quick Grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                Incident Categorization
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                What Type of Incident Are You Reporting?
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Select a category below to launch the streamlined filing wizard with category-specific
              evidence checklists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {CRIME_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat)}
                className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-300 transition-colors mb-1 leading-snug">
                    {cat}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-blue-400">
                  <span>File incident</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Public Safety Alerts Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Live Public Safety Bulletins</h2>
                <p className="text-xs text-slate-400">
                  Active alerts published by Municipal Law Enforcement
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('alerts')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View all ({alerts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeAlerts.slice(0, 3).map((alert) => {
              const borderColors = {
                critical: 'border-rose-500/40 bg-rose-950/20',
                warning: 'border-amber-500/40 bg-amber-950/20',
                advisory: 'border-blue-500/40 bg-blue-950/20',
              };

              const badgeColors = {
                critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                warning: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                advisory: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
              };

              return (
                <div
                  key={alert.id}
                  className={`border rounded-2xl p-5 flex flex-col justify-between ${borderColors[alert.severity]} transition-all hover:border-slate-600`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColors[alert.severity]}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[11px] text-slate-400">{alert.district}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">By: {alert.broadcastBy}</span>
                    <button
                      onClick={() => setCurrentView('alerts')}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>Read info</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Sentinel Works Step Guide */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                Standard Investigation Lifecycle
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                How Your Crime Report Is Processed
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Every submission enters an audited chain-of-custody workflow reviewed by sworn
                supervising officers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-white mb-2">1. Secure Submission</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provide incident timeline, location, suspect details, and digital evidence. Choose
                  to file registered or 100% anonymous.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-black flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-white mb-2">2. Central Triage</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The desk officer reviews the incident, validates jurisdiction, issues an official
                  tracking ID, and assigns a CID detective.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 font-black flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-white mb-2">3. Active Investigation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Detectives examine camera footage, interview witnesses, enter stolen items into
                  national databases, and post progress notes.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-black flex items-center justify-center mb-4">
                  4
                </div>
                <h3 className="text-base font-bold text-white mb-2">4. Resolution & Proof</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Receive verified case resolution notices, recovered property alerts, and official
                  downloadable police incident receipts for insurance.
                </p>
              </div>
            </div>

            {/* Bottom CTA in guide */}
            <div className="mt-10 text-center">
              <button
                onClick={() => setCurrentView('report')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-colors inline-flex items-center gap-2"
              >
                <span>Ready to File a Report?</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
