import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint, ComplaintStatus } from '../../models/complaint.model';

@Component({
  selector: 'app-complaint-status',
  imports: [FormsModule],
  templateUrl: './complaint-status.html',
  styleUrl: './complaint-status.css'
})
export class ComplaintStatusComponent implements OnInit {
  private complaintService = inject(ComplaintService);
  private route = inject(ActivatedRoute);

  searchId = signal<string>('');
  searched = signal<boolean>(false);
  foundComplaint = signal<Complaint | null>(null);

  // All available complaints (from backend + localStorage)
  complaints = this.complaintService.complaints;
  isBackendConnected = this.complaintService.isBackendConnected;

  ngOnInit(): void {
    // Check if queryParam ?id=CMP-HYD-2026-XXXX is provided
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.searchId.set(params['id']);
        this.trackComplaint(params['id']);
      }
    });
  }

  async trackComplaint(idToSearch?: string): Promise<void> {
    const id = (idToSearch || this.searchId()).trim();
    if (!id) return;

    this.searchId.set(id);
    this.searched.set(true);
    const result = await this.complaintService.getComplaintById(id);
    this.foundComplaint.set(result || null);

    if (result) {
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  }

  quickTrack(complaint: Complaint): void {
    this.searchId.set(complaint.complaintId);
    this.trackComplaint(complaint.complaintId);
  }

  resetSearch(): void {
    this.searchId.set('');
    this.searched.set(false);
    this.foundComplaint.set(null);
  }

  resetDemoComplaints(): void {
    this.complaintService.initComplaints();
    this.resetSearch();
  }

  getStatusClass(status: ComplaintStatus): string {
    switch (status) {
      case 'Submitted': return 'operational';
      case 'In Progress': return 'maintenance';
      case 'Resolved': return 'operational';
      default: return 'operational';
    }
  }

  getStepIndex(status: ComplaintStatus): number {
    switch (status) {
      case 'Submitted': return 0;
      case 'In Progress': return 1;
      case 'Resolved': return 2;
      default: return 0;
    }
  }
}
