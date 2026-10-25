import { Injectable, signal } from '@angular/core';
import { Complaint, ComplaintSubmissionRequest, ComplaintStatus } from '../models/complaint.model';

const BACKEND_URL = 'http://localhost:3000/api/complaints';
const STORAGE_KEY = 'ewp_public_utility_complaints';

const DEFAULT_COMPLAINTS: Complaint[] = [
  {
    complaintId: 'CMP-HYD-2026-1011',
    citizenName: 'K. Rajeshwar Rao',
    mobile: '9848012345',
    email: 'rajeshwar.rao@example.com',
    utilityCategory: 'Electricity',
    area: 'Jubilee Hills Road No. 10',
    description: 'Frequent voltage drops between 7 PM and 10 PM causing trip of domestic refrigeration and AC units.',
    status: 'Resolved',
    submittedAt: '2026-10-23 04:30 PM'
  },
  {
    complaintId: 'CMP-HYD-2026-1012',
    citizenName: 'Sneha Reddy',
    mobile: '9988776655',
    email: 'sneha.reddy@example.com',
    utilityCategory: 'Water Supply',
    area: 'Secunderabad (West Marredpally)',
    description: 'High pressure drinking water leaking from joint valve near St. Ann\'s School junction. Water pooling on main carriage way.',
    status: 'In Progress',
    submittedAt: '2026-10-24 09:15 AM'
  },
  {
    complaintId: 'CMP-HYD-2026-1013',
    citizenName: 'Syed Mohammed Imran',
    mobile: '9440112233',
    email: 'm.imran@example.com',
    utilityCategory: 'Garbage Collection',
    area: 'Charminar (Near Gulzar Houz)',
    description: 'GHMC secondary community bin overflowing for the last 36 hours. Commercial packing waste scattering on footpath.',
    status: 'Submitted',
    submittedAt: '2026-10-25 08:20 AM'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private complaintsSignal = signal<Complaint[]>([]);
  readonly complaints = this.complaintsSignal.asReadonly();
  private backendConnectedSignal = signal<boolean>(false);
  readonly isBackendConnected = this.backendConnectedSignal.asReadonly();

  constructor() {
    this.initComplaints();
  }

  /**
   * Initializes complaints by fetching from Express backend, falling back to localStorage
   */
  async initComplaints(): Promise<void> {
    try {
      const response = await fetch(BACKEND_URL);
      if (response.ok) {
        const data: Complaint[] = await response.json();
        this.complaintsSignal.set(data);
        this.backendConnectedSignal.set(true);
        return;
      }
    } catch (e) {
      console.warn('Express backend offline for complaints, using localStorage:', e);
      this.backendConnectedSignal.set(false);
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.complaintsSignal.set(parsed);
          return;
        }
      } catch (err) {}
    }

    this.complaintsSignal.set(DEFAULT_COMPLAINTS);
  }

  /**
   * Submit complaint to Express backend using Fetch API POST method
   */
  async submitComplaint(data: ComplaintSubmissionRequest): Promise<{
    success: boolean;
    complaint?: Complaint;
    error?: string;
    isBackend: boolean;
  }> {
    const payload = {
      citizenName: data.citizenName.trim(),
      mobile: data.mobile.trim(),
      email: data.email.trim(),
      utilityCategory: data.utilityCategory.trim(),
      area: data.area.trim(),
      description: data.description.trim()
    };

    try {
      // Send real POST request to Node.js/Express backend
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const createdComplaint: Complaint = result.complaint;

        // Prepend to signal and localStorage
        const updated = [createdComplaint, ...this.complaintsSignal()];
        this.complaintsSignal.set(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        this.backendConnectedSignal.set(true);

        return { success: true, complaint: createdComplaint, isBackend: true };
      } else {
        const errJson = await response.json();
        return { success: false, error: errJson.error || 'Server validation failed', isBackend: true };
      }
    } catch (networkErr: any) {
      console.warn('Backend unavailable, saving locally:', networkErr);
      this.backendConnectedSignal.set(false);

      // Local fallback ID generation
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const localComplaint: Complaint = {
        complaintId: `CMP-HYD-2026-${randomSuffix}`,
        citizenName: payload.citizenName,
        mobile: payload.mobile,
        email: payload.email,
        utilityCategory: payload.utilityCategory,
        area: payload.area,
        description: payload.description,
        status: 'Submitted',
        submittedAt: new Date().toLocaleString()
      };

      const updated = [localComplaint, ...this.complaintsSignal()];
      this.complaintsSignal.set(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return { success: true, complaint: localComplaint, isBackend: false };
    }
  }

  /**
   * Track complaint by ID - queries Express backend first, then local memory
   */
  async getComplaintById(id: string): Promise<Complaint | undefined> {
    const cleanId = id.trim().toUpperCase();

    try {
      const response = await fetch(`${BACKEND_URL}/${cleanId}`);
      if (response.ok) {
        const complaint = await response.json();
        return complaint;
      }
    } catch (e) {
      console.warn('Backend search error, falling back to local search:', e);
    }

    return this.complaintsSignal().find(c => c.complaintId.toUpperCase() === cleanId);
  }

  /**
   * Return all complaints
   */
  getAllComplaints(): Complaint[] {
    return this.complaintsSignal();
  }
}
