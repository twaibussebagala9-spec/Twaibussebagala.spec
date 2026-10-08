import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CrimeReport,
  PublicAlert,
  User,
  ReportStatus,
  ReportUrgency,
  CaseMessage,
  ReportLog,
  EvidenceFile,
  CrimeCategory,
} from '../types';
import { INITIAL_REPORTS, INITIAL_ALERTS, DEMO_USERS } from '../data/mockData';

export type ActiveView =
  | 'home'
  | 'report'
  | 'track'
  | 'alerts'
  | 'map'
  | 'citizen-dashboard'
  | 'officer-dashboard';

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  savedUsers: User[];
  currentRole: 'citizen' | 'officer' | 'admin' | 'guest';
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  reports: CrimeReport[];
  alerts: PublicAlert[];
  activeTrackingId: string | null;
  setActiveTrackingId: (id: string | null) => void;
  selectedReport: CrimeReport | null;
  setSelectedReport: (report: CrimeReport | null) => void;
  toasts: NotificationToast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Actions
  switchUser: (role: 'citizen' | 'officer' | 'admin' | 'guest') => void;
  loginAs: (user: User) => void;
  logout: () => void;
  createReport: (data: {
    title: string;
    category: CrimeCategory;
    urgency: ReportUrgency;
    incidentDate: string;
    incidentTime: string;
    location: string;
    district: string;
    description: string;
    suspectDetails?: string;
    witnessDetails?: string;
    isAnonymous: boolean;
    reporterName?: string;
    reporterContact?: string;
    evidenceFiles?: EvidenceFile[];
  }) => CrimeReport;
  updateReportStatus: (
    reportId: string,
    newStatus: ReportStatus,
    officerNote: string,
    isInternalOnly?: boolean
  ) => void;
  assignReportOfficer: (
    reportId: string,
    officerName: string,
    badgeNumber: string
  ) => void;
  addCaseMessage: (reportId: string, text: string) => void;
  createAlert: (alertData: Omit<PublicAlert, 'id' | 'createdAt' | 'isActive'>) => PublicAlert;
  toggleAlertStatus: (alertId: string) => void;
  deleteAlert: (alertId: string) => void;
  getReportByTrackingId: (trackingId: string) => CrimeReport | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_REPORTS_KEY = 'sentinel_crime_reports_v1';
const STORAGE_ALERTS_KEY = 'sentinel_crime_alerts_v1';
const STORAGE_USERS_KEY = 'sentinel_users_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS.citizen);
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Persistent user list
  const [savedUsers, setSavedUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return Object.values(DEMO_USERS);
  });

  // Persistent reports
  const [reports, setReports] = useState<CrimeReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_REPORTS;
  });

  // Persistent alerts
  const [alerts, setAlerts] = useState<PublicAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALERTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ALERTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(savedUsers));
    } catch (e) {
      console.warn('Failed to save users to localStorage', e);
    }
  }, [savedUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to save reports to localStorage', e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed to save alerts to localStorage', e);
    }
  }, [alerts]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchUser = (role: 'citizen' | 'officer' | 'admin' | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
      showToast('Switched to Public / Anonymous Guest Mode', 'info');
    } else {
      const targetUser = DEMO_USERS[role];
      setCurrentUser(targetUser);
      showToast(`Switched account to ${targetUser.name} (${targetUser.role.toUpperCase()})`, 'success');
      if (role === 'officer' || role === 'admin') {
        setCurrentView('officer-dashboard');
      } else {
        setCurrentView('citizen-dashboard');
      }
    }
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
    setSavedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (exists) {
        return prev.map((u) => (u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase() ? user : u));
      }
      return [...prev, user];
    });
    showToast(`Welcome back, ${user.name}!`, 'success');
    if (user.role === 'officer' || user.role === 'admin') {
      setCurrentView('officer-dashboard');
    } else {
      setCurrentView('citizen-dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    showToast('Logged out successfully', 'info');
  };

  const createReport = (data: {
    title: string;
    category: CrimeCategory;
    urgency: ReportUrgency;
    incidentDate: string;
    incidentTime: string;
    location: string;
    district: string;
    description: string;
    suspectDetails?: string;
    witnessDetails?: string;
    isAnonymous: boolean;
    reporterName?: string;
    reporterContact?: string;
    evidenceFiles?: EvidenceFile[];
  }): CrimeReport => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `CR-2026-${randomSuffix}`;
    const anonymousKey = data.isAnonymous ? `SEC-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newReport: CrimeReport = {
      id: `rep-${Date.now()}`,
      trackingId,
      anonymousKey,
      title: data.title,
      category: data.category,
      urgency: data.urgency,
      status: 'Pending Review',
      incidentDate: data.incidentDate,
      incidentTime: data.incidentTime,
      location: data.location,
      district: data.district,
      coordinates: {
        x: Math.floor(20 + Math.random() * 60),
        y: Math.floor(20 + Math.random() * 60),
      },
      description: data.description,
      suspectDetails: data.suspectDetails,
      witnessDetails: data.witnessDetails,
      isAnonymous: data.isAnonymous,
      reporterId: data.isAnonymous ? undefined : currentUser?.id || 'guest',
      reporterName: data.isAnonymous
        ? 'Anonymous Citizen'
        : data.reporterName || currentUser?.name || 'Concerned Citizen',
      reporterContact: data.isAnonymous
        ? 'Confidential'
        : data.reporterContact || currentUser?.email || 'N/A',
      evidenceFiles: data.evidenceFiles || [],
      logs: [
        {
          id: `log-${Date.now()}`,
          officerName: 'Central Intake Dispatch',
          officerBadge: 'INTAKE-DESK',
          timestamp,
          status: 'Pending Review',
          note: `Incident report filed through Sentinel Public Portal. Tracking Reference generated: ${trackingId}.`,
        },
      ],
      messages: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setReports((prev) => [newReport, ...prev]);
    showToast(`Report filed successfully! Reference ID: ${trackingId}`, 'success');
    return newReport;
  };

  const updateReportStatus = (
    reportId: string,
    newStatus: ReportStatus,
    officerNote: string,
    isInternalOnly = false
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        const newLog: ReportLog = {
          id: `log-${Date.now()}`,
          officerName: currentUser?.name || 'Duty Supervisor',
          officerBadge: currentUser?.badgeNumber || 'BADGE #HQ',
          timestamp,
          status: newStatus,
          note: officerNote,
          isInternalOnly,
        };

        const updated: CrimeReport = {
          ...rep,
          status: newStatus,
          updatedAt: timestamp,
          logs: [newLog, ...rep.logs],
        };

        if (selectedReport?.id === reportId) {
          setSelectedReport(updated);
        }
        return updated;
      })
    );

    showToast(`Case status updated to "${newStatus}"`, 'success');
  };

  const assignReportOfficer = (
    reportId: string,
    officerName: string,
    badgeNumber: string
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        const log: ReportLog = {
          id: `log-${Date.now()}`,
          officerName: currentUser?.name || 'Precinct Command',
          officerBadge: currentUser?.badgeNumber || 'HQ',
          timestamp,
          status: rep.status,
          note: `Case formally assigned to ${officerName} (${badgeNumber}).`,
        };

        const updated: CrimeReport = {
          ...rep,
          assignedOfficer: officerName,
          assignedBadge: badgeNumber,
          updatedAt: timestamp,
          logs: [log, ...rep.logs],
        };

        if (selectedReport?.id === reportId) {
          setSelectedReport(updated);
        }
        return updated;
      })
    );

    showToast(`Case assigned to ${officerName}`, 'info');
  };

  const addCaseMessage = (reportId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const isOfficer = currentUser?.role === 'officer' || currentUser?.role === 'admin';
    const senderRole = isOfficer ? 'officer' : 'citizen';
    const senderName = currentUser?.name || (isOfficer ? 'Assigned Investigator' : 'Reporter');

    const newMessage: CaseMessage = {
      id: `msg-${Date.now()}`,
      senderName,
      senderRole,
      timestamp,
      text: text.trim(),
    };

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        const updated = {
          ...rep,
          messages: [...rep.messages, newMessage],
        };
        if (selectedReport?.id === reportId) {
          setSelectedReport(updated);
        }
        return updated;
      })
    );
  };

  const createAlert = (alertData: Omit<PublicAlert, 'id' | 'createdAt' | 'isActive'>): PublicAlert => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newAlert: PublicAlert = {
      ...alertData,
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: timestamp,
      isActive: true,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Public Safety Alert broadcasted: "${newAlert.title}"`, 'warning');
    return newAlert;
  };

  const toggleAlertStatus = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        const nextActive = !a.isActive;
        showToast(`Alert "${a.title}" marked as ${nextActive ? 'Active' : 'Archived'}`, 'info');
        return { ...a, isActive: nextActive };
      })
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Alert removed from bulletin', 'info');
  };

  const getReportByTrackingId = (trackingId: string): CrimeReport | undefined => {
    const clean = trackingId.trim().toUpperCase();
    return reports.find(
      (r) =>
        r.trackingId.toUpperCase() === clean ||
        r.id.toUpperCase() === clean ||
        (r.anonymousKey && r.anonymousKey.toUpperCase() === clean)
    );
  };

  const currentRole = currentUser ? currentUser.role : 'guest';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        savedUsers,
        currentRole,
        currentView,
        setCurrentView,
        reports,
        alerts,
        activeTrackingId,
        setActiveTrackingId,
        selectedReport,
        setSelectedReport,
        toasts,
        showToast,
        removeToast,
        switchUser,
        loginAs,
        logout,
        createReport,
        updateReportStatus,
        assignReportOfficer,
        addCaseMessage,
        createAlert,
        toggleAlertStatus,
        deleteAlert,
        getReportByTrackingId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
