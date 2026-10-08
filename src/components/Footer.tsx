import React from 'react';
import { useApp } from '../context/AppContext';
import { EMERGENCY_CONTACTS } from '../data/mockData';
import {
  ShieldAlert,
  Phone,
  ShieldCheck,
  Lock,
  FileCheck,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Emergency Quick Hotlines Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-slate-200">
            <Phone className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              Official Police & Emergency Helplines
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_CONTACTS.map((contact, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-400">{contact.available}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 leading-snug mb-1">
                    {contact.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    {contact.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-black text-rose-400 font-mono tracking-wide">
                    {contact.number}
                  </span>
                  <a
                    href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
                  >
                    Direct Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white font-mono tracking-tight">
                SENTINEL
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Municipal Crime Reporting & Community Safety Network. Enabling secure, transparent, and
              accountable law enforcement cooperation.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5 text-blue-400" />
                Anonymous Ready
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Portal Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('report')}
                  className="hover:text-white transition-colors"
                >
                  File Incident Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-white transition-colors"
                >
                  Track Incident Reference
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('alerts')}
                  className="hover:text-white transition-colors"
                >
                  Public Safety Bulletins
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('map')}
                  className="hover:text-white transition-colors"
                >
                  Crime Hotspot Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('citizen-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Citizen Incident Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Reportable Incidents
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Commercial & Residential Burglary</li>
              <li>• Theft, Robbery & Larceny</li>
              <li>• Cyber Crime & Identity Fraud</li>
              <li>• Vehicle Theft & Hit-and-Run</li>
              <li>• Vandalism & Public Property Damage</li>
              <li>• Narcotics & Suspicious Activity</li>
            </ul>
          </div>

          {/* Legal / Protection Notice */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Filing Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Filing a false police report is a criminal offense punishable under state and federal
              penal law. Reports submitted here are officially triaged by assigned sworn officers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Municipal Police Department Jurisdiction</span>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Sentinel Police Community Safety System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Citizen Bill of Rights</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility</span>
            <span className="hover:text-slate-400 cursor-pointer">FOIA Requests</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
