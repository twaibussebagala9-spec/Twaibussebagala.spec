import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockData';
import { UserRole, User } from '../types';
import {
  ShieldAlert,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  BadgeAlert,
  X,
  LogIn,
  UserPlus,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = 'name-contact' | 'email-password' | 'register';
type ContactMethod = 'phone' | 'email';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { loginAs, savedUsers, showToast } = useApp();

  const [mode, setMode] = useState<AuthMode>('name-contact');

  // Option 1: Name + Phone or Email Login fields
  const [nameInput, setNameInput] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailOrPhoneInput, setEmailOrPhoneInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');

  // Option 2: Email & Password fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [emailLoginRole, setEmailLoginRole] = useState<UserRole>('citizen');

  // Option 3: Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Quick Demo fill helpers
  const handleQuickDemoFill = (role: 'citizen' | 'officer') => {
    const demo = DEMO_USERS[role];
    setNameInput(demo.name);
    setSelectedRole(demo.role);
    setPasscodeInput('123456');

    if (role === 'citizen') {
      setContactMethod('phone');
      setPhoneInput(demo.phone || '+1 (555) 249-1830');
      setEmailOrPhoneInput(demo.email);
    } else {
      setContactMethod('email');
      setEmailOrPhoneInput(demo.email);
      setPhoneInput(demo.phone || '+1 (555) 911-4128');
    }
  };

  const handleInstantDemoLogin = (role: 'citizen' | 'officer' | 'admin') => {
    loginAs(DEMO_USERS[role]);
    onClose();
  };

  // Submission handler for Name + Phone / Email login
  const handleNameContactLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = nameInput.trim();
    const contactValue = contactMethod === 'phone' ? phoneInput.trim() : emailOrPhoneInput.trim();

    if (!cleanName) {
      showToast('Please enter your Full Name', 'warning');
      return;
    }

    if (!contactValue) {
      showToast(
        `Please provide your ${contactMethod === 'phone' ? 'Phone Number' : 'Email Address'}`,
        'warning'
      );
      return;
    }

    // Search existing users (demo or previously saved)
    const normalizedName = cleanName.toLowerCase();
    const cleanPhoneDigits = contactValue.replace(/\D/g, '');

    const matchedUser = savedUsers.find((u) => {
      const uNameMatch = u.name.toLowerCase() === normalizedName;
      const uEmailMatch = u.email.toLowerCase() === contactValue.toLowerCase();
      const uPhoneDigits = (u.phone || '').replace(/\D/g, '');
      const uPhoneMatch = cleanPhoneDigits && uPhoneDigits.includes(cleanPhoneDigits);

      return (uNameMatch && (uEmailMatch || uPhoneMatch)) || uEmailMatch || (cleanPhoneDigits.length >= 7 && uPhoneMatch);
    });

    if (matchedUser) {
      loginAs(matchedUser);
      showToast(`Welcome back, ${matchedUser.name}! Signed in via ${contactMethod.toUpperCase()}.`, 'success');
      onClose();
      return;
    }

    // If new user credentials, construct fresh profile
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email:
        contactMethod === 'email'
          ? contactValue
          : `${cleanName.toLowerCase().replace(/\s+/g, '.')}@citizen-sentinel.org`,
      phone: contactMethod === 'phone' ? contactValue : undefined,
      role: selectedRole,
      badgeNumber:
        selectedRole === 'officer'
          ? `BADGE #${Math.floor(2000 + Math.random() * 8000)}`
          : undefined,
      department:
        selectedRole === 'officer' ? 'Metropolitan Police Department' : undefined,
      avatar:
        selectedRole === 'officer'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    loginAs(newUser);
    showToast(`Welcome, ${newUser.name}! Profile authenticated via ${contactMethod.toUpperCase()}.`, 'success');
    onClose();
  };

  // Submission handler for Standard Email & Password
  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    const matched = savedUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (matched) {
      loginAs(matched);
    } else {
      loginAs({
        id: `user-${Date.now()}`,
        name: loginEmail.split('@')[0],
        email: loginEmail.trim(),
        role: emailLoginRole,
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      });
    }
    onClose();
  };

  // Submission handler for Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      showToast('Please provide your name, email, and password to register', 'warning');
      return;
    }

    loginAs({
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || undefined,
      role: 'citizen',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-200 animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Sentinel Security Gateway
              </h2>
              <p className="text-[11px] text-slate-400">
                Citizen & Law Enforcement Authentication Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Presets */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              1-Click Instant Demo Login:
            </span>
            <span className="text-[10px] text-blue-400 font-semibold">Test Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('citizen')}
              className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-300 font-bold text-left transition-colors flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="leading-tight text-white">Sarah Jenkins</div>
                <div className="text-[10px] font-normal text-slate-400">Citizen • (555) 249-1830</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('officer')}
              className="p-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 font-bold text-left transition-colors flex items-center gap-2"
            >
              <BadgeAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="leading-tight text-white">Det. Marcus Vance</div>
                <div className="text-[10px] font-normal text-slate-400">Officer • BADGE #4128</div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs for Login Options */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setMode('name-contact')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              mode === 'name-contact'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Name + Phone/Email</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('email-password')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              mode === 'email-password'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* OPTION 1: Name + Phone or Email Login */}
        {mode === 'name-contact' && (
          <form onSubmit={handleNameContactLogin} className="space-y-4">
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 text-[11px] text-blue-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong>Name + Contact Login Option:</strong> Enter your full name along with your
                registered phone number or email address to authenticate directly.
              </div>
            </div>

            {/* Field 1: Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name / Legal Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Sarah Jenkins or Detective Marcus Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Field 2: Contact Type Toggle + Input (Phone Number or Email Address) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Contact Identifier *
                </label>
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setContactMethod('phone')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ${
                      contactMethod === 'phone'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Phone Number</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ${
                      contactMethod === 'email'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email Address</span>
                  </button>
                </div>
              </div>

              {contactMethod === 'phone' ? (
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. +1 (555) 249-1830 or (555) 911-4128"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={emailOrPhoneInput}
                    onChange={(e) => setEmailOrPhoneInput(e.target.value)}
                    placeholder="e.g. sarah.jenkins@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* Field 3: Password / Security PIN */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password / Security Access PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode or security PIN (optional for demo)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Field 4: Role selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Account Scope / Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="citizen">Citizen Account (File & Track Reports)</option>
                <option value="officer">Sworn Police Officer / Detective (Case Management)</option>
                <option value="admin">Command Staff (Chief / Precinct Admin)</option>
              </select>
            </div>

            {/* Quick Demo Pre-fill helpers */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick fill fields:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('citizen')}
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Sarah (Phone)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('officer')}
                  className="text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Det. Vance (Email)
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Name & {contactMethod === 'phone' ? 'Phone Number' : 'Email Address'}</span>
            </button>
          </form>
        )}

        {/* OPTION 2: Email & Password Form */}
        {mode === 'email-password' && (
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Login Scope / Role
              </label>
              <select
                value={emailLoginRole}
                onChange={(e) => setEmailLoginRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="citizen">Citizen Account</option>
                <option value="officer">Sworn Police Officer / Investigator</option>
                <option value="admin">Precinct Command Staff (Admin)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all mt-4"
            >
              <LogIn className="w-4 h-4" />
              <span>Authenticate & Sign In</span>
            </button>
          </form>
        )}

        {/* OPTION 3: Citizen Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. jane.doe@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Phone Number (Mobile for SMS alerts)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Create Secure Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all mt-4"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Verified Citizen Profile</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
