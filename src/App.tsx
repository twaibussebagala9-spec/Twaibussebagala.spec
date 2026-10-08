import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HomeView } from './components/HomeView';
import { ReportForm } from './components/ReportForm';
import { TrackReportView } from './components/TrackReportView';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AlertsView } from './components/AlertsView';
import { CrimeMapView } from './components/CrimeMapView';
import { PrintReportReceipt } from './components/PrintReportReceipt';
import { UpdateReportModal } from './components/UpdateReportModal';
import { ManageAlertsModal } from './components/ManageAlertsModal';
import { AuthModal } from './components/AuthModal';
import { CrimeCategory, CrimeReport } from './types';

const MainApp: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    reports,
    selectedReport,
    setSelectedReport,
    setActiveTrackingId,
    getReportByTrackingId,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [receiptReportId, setReceiptReportId] = useState<string | null>(null);
  const [officerUpdateReport, setOfficerUpdateReport] = useState<CrimeReport | null>(null);
  const [manageAlertsOpen, setManageAlertsOpen] = useState(false);
  const [initialReportCategory, setInitialReportCategory] = useState<CrimeCategory | undefined>(undefined);

  const reportForReceipt = receiptReportId ? reports.find((r) => r.id === receiptReportId) : null;

  const handleSelectCategoryFromHome = (cat: CrimeCategory) => {
    setInitialReportCategory(cat);
    setCurrentView('report');
  };

  const handleOpenReceipt = (reportId: string) => {
    setReceiptReportId(reportId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onSelectCategory={handleSelectCategoryFromHome}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'report' && (
          <ReportForm
            initialCategory={initialReportCategory}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {currentView === 'track' && (
          <TrackReportView
            onOpenReceipt={handleOpenReceipt}
            onOpenOfficerUpdate={(rep) => setOfficerUpdateReport(rep)}
          />
        )}

        {currentView === 'citizen-dashboard' && (
          <CitizenDashboard onOpenReceipt={handleOpenReceipt} />
        )}

        {currentView === 'officer-dashboard' && (
          <OfficerDashboard
            onOpenReceipt={handleOpenReceipt}
            onOpenManageAlerts={() => setManageAlertsOpen(true)}
          />
        )}

        {currentView === 'alerts' && <AlertsView />}

        {currentView === 'map' && <CrimeMapView />}
      </main>

      {/* Global Modals */}
      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}

      {reportForReceipt && (
        <PrintReportReceipt
          report={reportForReceipt}
          onClose={() => setReceiptReportId(null)}
        />
      )}

      {officerUpdateReport && (
        <UpdateReportModal
          report={officerUpdateReport}
          onClose={() => setOfficerUpdateReport(null)}
        />
      )}

      {manageAlertsOpen && (
        <ManageAlertsModal onClose={() => setManageAlertsOpen(false)} />
      )}

      {/* Toast notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
