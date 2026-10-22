/**
 * Complaint Interface and Type Definitions
 * Course: Essentials of Web Programming (EWP) Lab
 */

export type ComplaintStatus = 'Submitted' | 'In Progress' | 'Resolved';

export interface Complaint {
  complaintId: string;
  citizenName: string;
  mobile: string;
  email: string;
  utilityCategory: string;
  area: string;
  complaintType: string;
  description: string;
  status: ComplaintStatus;
  submittedAt: string;
  estimatedResolution?: string;
  assignedTeam?: string;
}

export interface ComplaintSubmissionRequest {
  citizenName: string;
  mobile: string;
  email: string;
  utilityCategory: string;
  area: string;
  complaintType: string;
  description: string;
}
