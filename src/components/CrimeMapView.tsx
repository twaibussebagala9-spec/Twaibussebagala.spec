import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DISTRICTS, CRIME_CATEGORIES } from '../data/mockData';
import { CrimeReport, CrimeCategory } from '../types';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Filter,
  Eye,
  Search,
  Building2,
  Compass,
  Layers,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const CrimeMapView: React.FC = () => {
  const {
    reports,
    setSelectedReport,
    setActiveTrackingId,
    setCurrentView,
  } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePin, setActivePin] = useState<CrimeReport | null>(null);

  // Filtered reports for map markers
  const filteredMarkers = reports.filter((r) => {
    if (selectedDistrict !== 'all' && r.district !== selectedDistrict) return false;
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  // Calculate incident density per district
  const districtCounts = DISTRICTS.map((d) => {
    const count = reports.filter((r) => r.district === d).length;
    return { name: d, count };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Precinct Geospatial Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Interactive City Crime & Incident Map
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time geospatial tracking across all 6 precinct sectors. Explore active dockets,
            surveillance alerts, and high-activity zones.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-400" />
            <span>Critical / High</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-400" />
            <span>Investigation</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-400" />
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters + Map + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Controls & Sector Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Map Layer Filters</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Filter by Sector / District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="all">All City Sectors ({reports.length} Incidents)</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Filter by Incident Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="all">All Crime Types</option>
                {CRIME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Density List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sector Activity Matrix</span>
            </h3>

            <div className="space-y-2">
              {districtCounts.map((dc) => (
                <div
                  key={dc.name}
                  onClick={() => setSelectedDistrict(dc.name === selectedDistrict ? 'all' : dc.name)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedDistrict === dc.name
                      ? 'bg-blue-950/60 border-blue-500/80 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold leading-tight">{dc.name}</div>
                    <div className="text-[10px] text-slate-400">Sector Patrol Active</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800">
                      {dc.count} Incidents
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Interactive Vector Map Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 overflow-hidden shadow-2xl h-[560px] flex flex-col justify-between">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#1e293b 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0, 16px 16px',
              }}
            />

            {/* Map District Borders & River simulation */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              {/* Simulated River */}
              <path
                d="M 0,40 Q 30,55 50,45 T 100,60"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="4"
              />
              {/* Sector Dividers */}
              <line x1="45" y1="0" x2="45" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
            </svg>

            {/* Sector Labels in background */}
            <div className="absolute top-8 left-10 text-[10px] uppercase font-mono font-bold text-slate-600 pointer-events-none tracking-widest">
              NORTH HILLS SECTOR
            </div>
            <div className="absolute top-8 right-12 text-[10px] uppercase font-mono font-bold text-slate-600 pointer-events-none tracking-widest">
              UNIVERSITY DISTRICT
            </div>
            <div className="absolute bottom-10 left-10 text-[10px] uppercase font-mono font-bold text-slate-600 pointer-events-none tracking-widest">
              WEST SUBURBS
            </div>
            <div className="absolute bottom-10 right-12 text-[10px] uppercase font-mono font-bold text-slate-600 pointer-events-none tracking-widest">
              EASTSIDE INDUSTRIAL
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] uppercase font-mono font-black text-blue-900/60 pointer-events-none tracking-widest border border-blue-900/30 px-3 py-1 rounded">
              DOWNTOWN METRO CORE
            </div>

            {/* Interactive Incident Pins */}
            {filteredMarkers.map((report) => {
              const coords = report.coordinates || { x: 50, y: 50 };
              const isSelected = activePin?.id === report.id;

              const pinColor =
                report.status === 'Resolved'
                  ? 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-900/80'
                  : report.urgency === 'Critical / Emergency' || report.urgency === 'High'
                  ? 'bg-rose-500 border-rose-300 text-white shadow-rose-900/80 animate-bounce'
                  : 'bg-blue-500 border-blue-300 text-white shadow-blue-900/80';

              return (
                <div
                  key={report.id}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                  }}
                  onClick={() => setActivePin(report)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${pinColor} ${
                      isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-125' : ''
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    {report.trackingId}: {report.title}
                  </div>
                </div>
              );
            })}

            {/* Active Pin Info Popover */}
            {activePin && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-2xl z-30 space-y-3 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {activePin.trackingId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {activePin.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePin(null)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                    {activePin.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {activePin.description}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{activePin.location}</span>
                  <span>{activePin.incidentDate}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Lead: {activePin.assignedOfficer || 'Triage'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedReport(activePin);
                      setActiveTrackingId(activePin.trackingId);
                      setCurrentView('track');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>View Case File</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Map bottom stats watermark */}
            <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500 z-10 pointer-events-none">
              <span>Sentinel Geographic Incident Matrix</span>
              <span>Showing {filteredMarkers.length} of {reports.length} Dockets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
