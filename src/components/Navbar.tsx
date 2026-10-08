import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  FileText,
  Search,
  Bell,
  MapPin,
  User as UserIcon,
  BadgeAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    currentRole,
    currentView,
    setCurrentView,
    alerts,
    switchUser,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.isActive).length;

  const handleQuickExit = () => {
    // Quick exit to a neutral site for victim safety
    window.location.replace('https://www.google.com');
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: ShieldCheck },
    { id: 'report', label: 'File Report', icon: FileText, highlight: true },
    { id: 'track', label: 'Track Case', icon: Search },
    {
      id: 'alerts',
      label: 'Public Alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
    },
    { id: 'map', label: 'Crime Map', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Emergency Notice & Quick Exit Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-semibold text-rose-400 uppercase tracking-wider text-[11px]">
              Emergency Warning:
            </span>
            <span className="hidden sm:inline text-slate-300">
              For crimes in progress or imminent danger to life, dial{' '}
              <strong className="text-white underline font-bold">911</strong> immediately.
            </span>
            <span className="sm:hidden text-slate-300">
              Emergency: Call <strong className="text-white">911</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-slate-400 text-[11px]">
              Confidential & 256-Bit SSL Encrypted
            </span>
            <button
              onClick={handleQuickExit}
              title="Immediately leaves this page and opens a safe neutral search page"
              className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 hover:border-rose-700 text-[11px] px-2.5 py-0.5 rounded font-medium flex items-center gap-1 transition-colors"
            >
              <span>Quick Exit (Safe Escape)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white font-mono">
                    SENTINEL
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                    POLICE PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none">
                  Crime Reporting & Community Safety System
                </p>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setCurrentView(link.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                        : link.highlight
                        ? 'bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20 hover:scale-102'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Role-Specific Dashboard Link */}
              {currentUser && (
                <button
                  onClick={() =>
                    setCurrentView(
                      currentUser.role === 'citizen' ? 'citizen-dashboard' : 'officer-dashboard'
                    )
                  }
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'citizen-dashboard' || currentView === 'officer-dashboard'
                      ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30'
                      : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40'
                  }`}
                >
                  {currentUser.role === 'citizen' ? (
                    <>
                      <UserIcon className="w-4 h-4" />
                      <span>My Reports</span>
                    </>
                  ) : (
                    <>
                      <BadgeAlert className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 font-semibold">Officer Terminal</span>
                    </>
                  )}
                </button>
              )}
            </nav>

            {/* Right: Switch Role & Account */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Persona / Demo Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
                >
                  <span className="text-slate-400">Role:</span>
                  <span
                    className={`font-semibold capitalize ${
                      currentRole === 'officer' || currentRole === 'admin'
                        ? 'text-amber-400'
                        : currentRole === 'citizen'
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {currentRole === 'officer'
                      ? 'Officer Vance'
                      : currentRole === 'admin'
                      ? 'Chief Rostova'
                      : currentRole === 'citizen'
                      ? 'Citizen (Sarah)'
                      : 'Public Guest'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs"
                    onClick={() => setRoleDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Switch Role Mode (Interactive Demo)
                    </div>
                    <button
                      onClick={() => switchUser('citizen')}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div>
                        <div className="font-semibold text-blue-400">Citizen: Sarah Jenkins</div>
                        <div className="text-[11px] text-slate-400">File reports, view timeline & updates</div>
                      </div>
                      {currentRole === 'citizen' && <span className="text-blue-400 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => switchUser('officer')}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div>
                        <div className="font-semibold text-amber-400">Detective: Marcus Vance</div>
                        <div className="text-[11px] text-slate-400">CID Badge #4128, triage & investigations</div>
                      </div>
                      {currentRole === 'officer' && <span className="text-amber-400 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => switchUser('admin')}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div>
                        <div className="font-semibold text-purple-400">Commander: Elena Rostova</div>
                        <div className="text-[11px] text-slate-400">Precinct Commander, full admin control</div>
                      </div>
                      {currentRole === 'admin' && <span className="text-purple-400 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => switchUser('guest')}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-center justify-between text-slate-200 border-t border-slate-800"
                    >
                      <div>
                        <div className="font-semibold text-slate-300">Anonymous Public Guest</div>
                        <div className="text-[11px] text-slate-400">Unauthenticated citizen reporting</div>
                      </div>
                      {currentRole === 'guest' && <span className="text-slate-400 font-bold">✓</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* User Account Button */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div
                    onClick={() =>
                      setCurrentView(
                        currentUser.role === 'citizen' ? 'citizen-dashboard' : 'officer-dashboard'
                      )
                    }
                    className="flex items-center gap-2.5 cursor-pointer bg-slate-900 hover:bg-slate-850 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div className="hidden xl:block text-left">
                      <div className="text-xs font-semibold text-white leading-tight">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {currentUser.badgeNumber || currentUser.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Citizen / Officer Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentView(link.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : link.highlight
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-600 text-white">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {currentUser && (
                <button
                  onClick={() => {
                    setCurrentView(
                      currentUser.role === 'citizen' ? 'citizen-dashboard' : 'officer-dashboard'
                    );
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-300 bg-indigo-950/40 border border-indigo-800/40"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>
                    {currentUser.role === 'citizen' ? 'My Citizen Reports' : 'Officer Terminal'}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Role Switcher */}
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Select Persona (Demo Mode)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    switchUser('citizen');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded border text-left ${
                    currentRole === 'citizen'
                      ? 'border-blue-500 bg-blue-950/50 text-blue-300 font-semibold'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  Citizen: Sarah
                </button>
                <button
                  onClick={() => {
                    switchUser('officer');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded border text-left ${
                    currentRole === 'officer'
                      ? 'border-amber-500 bg-amber-950/50 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  Officer: Det. Vance
                </button>
              </div>
            </div>

            <div className="pt-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center rounded-lg bg-rose-950/50 border border-rose-900 text-rose-300 text-xs font-semibold"
                >
                  Sign Out ({currentUser.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Citizen / Officer Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
