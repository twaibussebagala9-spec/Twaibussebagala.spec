export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  badgeNumber?: string;
  department?: string;
  avatar?: string;
}

export type CrimeCategory =
  | 'Theft & Larceny'
  | 'Burglary & Break-in'
  | 'Cybercrime & Fraud'
  | 'Vandalism & Property Damage'
  | 'Assault & Battery'
  | 'Vehicle Theft / Hit & Run'
  | 'Harassment & Stalking'
  | 'Narcotics / Suspicious Activity'
  | 'Missing Person'
  | 'Other';

export type ReportUrgency = 'Low' | 'Medium' | 'High' | 'Critical / Emergency';

export type ReportStatus =
  | 'Pending Review'
  | 'Under Investigation'
  | 'In Progress'
  | 'Evidence Required'
  | 'Resolved'
  | 'Dismissed';

export interface EvidenceFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document' | 'video';
  url: string;
  uploadedAt: string;
}

export interface ReportLog {
  id: string;
  officerName: string;
  officerBadge: string;
  timestamp: string;
  status: ReportStatus;
  note: string;
  isInternalOnly?: boolean;
}

export interface CaseMessage {
  id: string;
  senderName: string;
  senderRole: 'citizen' | 'officer';
  timestamp: string;
  text: string;
}

export interface CrimeReport {
  id: string;
  trackingId: string; // e.g. CR-2026-8492
  anonymousKey?: string; // Secret key for anonymous access
  title: string;
  category: CrimeCategory;
  urgency: ReportUrgency;
  status: ReportStatus;
  incidentDate: string; // YYYY-MM-DD
  incidentTime: string; // HH:mm
  location: string;
  district: string; // Downtown, North Hills, Waterfront, University District, Eastside, West Suburbs
  coordinates?: { x: number; y: number }; // Relative coordinates for map (0-100%)
  description: string;
  suspectDetails?: string;
  witnessDetails?: string;
  isAnonymous: boolean;
  reporterId?: string;
  reporterName?: string;
  reporterContact?: string;
  assignedOfficer?: string;
  assignedBadge?: string;
  evidenceFiles: EvidenceFile[];
  logs: ReportLog[];
  messages: CaseMessage[];
  createdAt: string;
  updatedAt: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'advisory';

export interface PublicAlert {
  id: string;
  title: string;
  category: string;
  severity: AlertSeverity;
  location: string;
  district: string;
  description: string;
  actionGuidance: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  broadcastBy: string;
}

export interface EmergencyContact {
  title: string;
  number: string;
  description: string;
  available: string;
  icon: string;
}
