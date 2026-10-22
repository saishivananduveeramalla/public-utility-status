import { Injectable, signal } from '@angular/core';
import { Complaint, ComplaintSubmissionRequest, ComplaintStatus } from '../models/complaint.model';

const STORAGE_KEY = 'ewp_public_utility_complaints';

const DEFAULT_COMPLAINTS: Complaint[] = [
  {
    complaintId: 'CMP-HYD-2026-1011',
    citizenName: 'K. Rajeshwar Rao',
    mobile: '9848012345',
    email: 'rajeshwar.rao@example.com',
    utilityCategory: 'Electricity',
    area: 'Jubilee Hills Road No. 10',
    complaintType: 'Low Voltage & Fluctuation',
    description: 'Frequent voltage drops between 7 PM and 10 PM causing trip of domestic refrigeration and AC units. Substation technician inspection requested.',
    status: 'Resolved',
    submittedAt: '2026-10-20 04:30 PM',
    estimatedResolution: 'Resolved on 2026-10-21 11:00 AM',
    assignedTeam: 'TSSPDCL Jubilee Hills Maintenance Squad'
  },
  {
    complaintId: 'CMP-HYD-2026-1012',
    citizenName: 'Sneha Reddy',
    mobile: '9988776655',
    email: 'sneha.reddy@example.com',
    utilityCategory: 'Water Supply',
    area: 'Secunderabad (West Marredpally)',
    complaintType: 'Pipeline Leakage',
    description: 'High pressure drinking water leaking from joint valve near St. Ann\'s School junction. Water pooling on main carriage way.',
    status: 'In Progress',
    submittedAt: '2026-10-21 09:15 AM',
    estimatedResolution: 'Expected today by 06:00 PM',
    assignedTeam: 'HMWSSB Sub-Division VII Emergency Repair Unit'
  },
  {
    complaintId: 'CMP-HYD-2026-1013',
    citizenName: 'Syed Mohammed Imran',
    mobile: '9440112233',
    email: 'm.imran@example.com',
    utilityCategory: 'Garbage Collection',
    area: 'Charminar (Near Gulzar Houz)',
    complaintType: 'Bin Overflow & Missed Collection',
    description: 'GHMC secondary community bin overflowing for the last 36 hours. Commercial packing waste scattering on footpath.',
    status: 'Submitted',
    submittedAt: '2026-10-22 08:20 AM',
    estimatedResolution: 'Action initiated - collection vehicle dispatched',
    assignedTeam: 'GHMC South Zone Circle 9 Sanitation Wing'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private complaintsSignal = signal<Complaint[]>([]);
  readonly complaints = this.complaintsSignal.asReadonly();

  constructor() {
    this.initComplaints();
  }

  /**
   * Initializes complaints from browser localStorage or loads default sample data
   */
  private initComplaints(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.complaintsSignal.set(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using in-memory defaults:', e);
    }
    this.complaintsSignal.set(DEFAULT_COMPLAINTS);
    this.saveToStorage(DEFAULT_COMPLAINTS);
  }

  private saveToStorage(list: Complaint[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save complaints to localStorage:', e);
    }
  }

  /**
   * Returns all complaints
   */
  getAllComplaints(): Complaint[] {
    return this.complaintsSignal();
  }

  /**
   * Search complaint by Complaint ID (e.g. 'CMP-HYD-2026-1011')
   */
  getComplaintById(id: string): Complaint | undefined {
    const cleanId = id.trim().toLowerCase();
    return this.complaintsSignal().find(c => c.complaintId.toLowerCase() === cleanId);
  }

  /**
   * Generates a unique compliant ID
   */
  private generateComplaintId(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CMP-HYD-2026-${randomSuffix}`;
  }

  /**
   * Formats current timestamp
   */
  private getFormattedTimestamp(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} ${timeStr}`;
  }

  /**
   * Register a new complaint and persist to localStorage
   */
  registerComplaint(data: ComplaintSubmissionRequest): Complaint {
    const newComplaint: Complaint = {
      complaintId: this.generateComplaintId(),
      citizenName: data.citizenName.trim(),
      mobile: data.mobile.trim(),
      email: data.email.trim(),
      utilityCategory: data.utilityCategory,
      area: data.area.trim(),
      complaintType: data.complaintType,
      description: data.description.trim(),
      status: 'Submitted',
      submittedAt: this.getFormattedTimestamp(),
      estimatedResolution: 'Estimated resolution within 24 to 48 hours',
      assignedTeam: `GHMC / ${data.utilityCategory} Emergency Cell`
    };

    const updated = [newComplaint, ...this.complaintsSignal()];
    this.complaintsSignal.set(updated);
    this.saveToStorage(updated);
    return newComplaint;
  }

  /**
   * Demonstrates asynchronous POST request using Fetch API with JSON serialization.
   * This complies with EWP syllabus requirements for AJAX/Fetch POST method.
   * Simulates a mock REST endpoint with realistic latency, request inspection, and response headers.
   */
  async simulateFetchPost(data: ComplaintSubmissionRequest): Promise<{
    status: number;
    statusText: string;
    requestBody: string;
    responseBody: any;
    headers: Record<string, string>;
  }> {
    const requestPayload = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      clientPlatform: 'Angular 22 EWP Lab Client'
    });

    // In a real environment with backend:
    // const response = await fetch('/api/complaints', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: requestPayload
    // });

    // For this lab demonstration without backend server, we simulate the exact
    // Fetch API Promise resolution and HTTP response structure:
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

    const generatedId = this.generateComplaintId();
    const mockResponse = {
      success: true,
      statusCode: 201,
      message: 'Complaint successfully accepted by Public Utility Grievance Gateway (Simulated POST)',
      referenceNumber: generatedId,
      receivedPayload: JSON.parse(requestPayload),
      serverTimestamp: new Date().toISOString()
    };

    return {
      status: 201,
      statusText: 'Created',
      requestBody: requestPayload,
      responseBody: mockResponse,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Powered-By': 'Essentials-of-Web-Programming-Lab-Demonstration',
        'Cache-Control': 'no-store'
      }
    };
  }

  /**
   * Resets complaints to default demonstration records
   */
  resetToDefaults(): void {
    this.complaintsSignal.set(DEFAULT_COMPLAINTS);
    this.saveToStorage(DEFAULT_COMPLAINTS);
  }
}
