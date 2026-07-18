export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  timeline: string; // maps to 'date' in firestore
  status: string; // 'In Progress' | 'Completed'
  imageUrl: string; // maps to 'image' in firestore
  techStack: string[];
  links: {
    live: string;
    github: string;
  };
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Consultation {
  id: string;
  contactName: string;
  contactEmail: string;
  companyName: string;
  industry: string;
  websiteUrl?: string;
  projectTitle: string;
  serviceType: 'web_service' | 'mobile_service';
  projectTier: 'basic' | 'intermediate' | 'industrial';
  coreObjective: string;
  keyFeatures: string[];
  targetTimeline: string;
  infrastructureAck: boolean;
  termsAck: boolean;
  status: string; // 'pending' | 'consulted' | 'in_progress' | 'review' | 'completed' | 'rejected' | 'archived'
  createdAt?: string | null;
  updatedAt?: string | null;
  adminNotes?: string;
  startDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  paymentStatus?: string;
  priority?: string;
  archiveReason?: string;
  archiveDate?: string;
  consultationDate?: string;
  googleMeetLink?: string;
  meetingId?: string;
  proposalUrl?: string;
  quotedPrice?: number;
  downPaymentRequirement?: string;
  repoLink?: string;
  stagingUrl?: string;
  managementBoardUrl?: string;
  feedbackTrackerUrl?: string;
  milestoneFrontendComplete?: boolean;
  milestoneDbSynced?: boolean;
  milestonePaymentVerified?: boolean;
  productionUrl?: string;
  codebaseTransferUrl?: string;
  warrantyEndDate?: string;
}

export interface Meeting {
  id: string;
  consultationId: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  meetLink: string;
  meetDate: string;
  meetTime: string;
  createdAt: string;
}

export interface IDatabaseService {
  getPendingConsultationsCount(): Promise<number>;
  getPendingConsultations(): Promise<Consultation[]>;
  getConsultation(id: string): Promise<Consultation | null>;
  createConsultation(data: Omit<Consultation, 'id'>): Promise<string>;
  updateConsultation(id: string, data: Partial<Consultation>): Promise<void>;
  
  getProjects(): Promise<Project[]>;
  createProject(data: Omit<Project, 'id'>): Promise<string>;
  updateProject(id: string, data: Partial<Project>): Promise<void>;
  deleteProject(id: string): Promise<void>;
  
  createMeeting(data: Omit<Meeting, 'id'>): Promise<string>;
}
