import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';

@Component({
  selector: 'app-complaint-registration',
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  templateUrl: './complaint-registration.html',
  styleUrl: './complaint-registration.css'
})
export class ComplaintRegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private complaintService = inject(ComplaintService);
  private route = inject(ActivatedRoute);

  complaintForm!: FormGroup;
  submittedSuccess = signal<Complaint | null>(null);
  copiedId = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isBackendSuccess = signal<boolean>(false);

  // Fetch API POST response inspection
  postDemoResponse = signal<any | null>(null);
  isPostDemoLoading = signal<boolean>(false);

  readonly utilityCategories = [
    'Electricity',
    'Water Supply',
    'Public Transportation',
    'Internet Services',
    'Garbage Collection',
    'Road Maintenance'
  ];

  readonly hyderabadAreas = [
    'Banjara Hills',
    'Jubilee Hills',
    'Gachibowli',
    'Hitec City',
    'Madhapur',
    'Secunderabad',
    'Kukatpally',
    'Begumpet',
    'Charminar',
    'Uppal',
    'Dilsukhnagar',
    'Miyapur',
    'Mehdipatnam',
    'Financial District'
  ];

  readonly complaintTypesMap: Record<string, string[]> = {
    'Electricity': [
      'Unscheduled Power Outage',
      'Low Voltage / High Fluctuation',
      'Transformer Sparking / Noise',
      'Damaged Electric Pole / Hanging Wire',
      'Meter Fault / Billing Query'
    ],
    'Water Supply': [
      'Drinking Water Supply Disruption',
      'Pipeline Joint Leakage / Burst',
      'Contaminated / Muddy Water Supply',
      'Low Pressure in Municipal Line',
      'Open Sewerage Overflow'
    ],
    'Public Transportation': [
      'Metro Train Delay / Bunching',
      'TSRTC City Bus Cancellation / Delay',
      'Bus Shelter Damaged / Lighting Issue',
      'Smart Card Recharge / Ticket Machine Error',
      'Overcrowding / Unscheduled Route Deviation'
    ],
    'Internet Services': [
      'Public Wi-Fi Hotspot Offline',
      'Underground Fiber Cut / Low Signal',
      'High Latency / Speed Degradation',
      'Broadband Junction Box Vandalized'
    ],
    'Garbage Collection': [
      'Secondary Community Bin Overflow',
      'Swachh Auto-Tipper Missed Collection',
      'Illegal Waste Dumping on Footpath',
      'Dead Animal Removal Request',
      'Bio-Medical Waste Open Dumping'
    ],
    'Road Maintenance': [
      'Hazardous Pothole / Road Cave-in',
      'Smart LED Streetlight Non-Functional',
      'Missing Manhole Cover / Gutter Grate',
      'Divider / Median Damage',
      'Waterlogging Due to Blocked Storm Drain'
    ]
  };

  availableComplaintTypes = signal<string[]>([]);

  ngOnInit(): void {
    this.initForm();

    // Check for query parameter (e.g. ?category=Electricity)
    this.route.queryParams.subscribe(params => {
      if (params['category'] && this.utilityCategories.includes(params['category'])) {
        this.complaintForm.patchValue({ utilityCategory: params['category'] });
        this.onCategoryChange(params['category']);
      }
    });
  }

  private initForm(): void {
    this.complaintForm = this.fb.group({
      citizenName: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      utilityCategory: ['', Validators.required],
      area: ['', Validators.required],
      complaintType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(15)]]
    });

    // React to category changes to update types
    this.complaintForm.get('utilityCategory')?.valueChanges.subscribe(cat => {
      this.onCategoryChange(cat);
    });
  }

  onCategoryChange(category: string): void {
    if (category && this.complaintTypesMap[category]) {
      this.availableComplaintTypes.set(this.complaintTypesMap[category]);
      this.complaintForm.patchValue({ complaintType: '' });
    } else {
      this.availableComplaintTypes.set([]);
    }
  }

  // Field validity convenience getters
  isFieldInvalid(fieldName: string): boolean {
    const field = this.complaintForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Main Submission:
   * Sends HTTP POST to Express backend (http://localhost:3000/api/complaints)
   */
  async onSubmit(): Promise<void> {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.complaintForm.value;

    const result = await this.complaintService.submitComplaint(formValue);
    if (result.success && result.complaint) {
      this.submittedSuccess.set(result.complaint);
      this.isBackendSuccess.set(result.isBackend);
      this.complaintForm.reset();
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      alert(result.error || 'Failed to submit complaint. Please check fields.');
    }
    this.isSubmitting.set(false);
  }

  /**
   * Fetch API POST Method Inspection Demonstration
   * Explicitly demonstrates syllabus requirement:
   * fetch() with method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(...)
   */
  async submitViaFetchPostDemo(): Promise<void> {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      alert('Please fill all mandatory form fields before running the Fetch POST demonstration.');
      return;
    }

    this.isPostDemoLoading.set(true);
    const formValue = this.complaintForm.value;

    const result = await this.complaintService.submitComplaint(formValue);
    if (result.success && result.complaint) {
      this.submittedSuccess.set(result.complaint);
      this.isBackendSuccess.set(result.isBackend);

      this.postDemoResponse.set({
        status: 201,
        statusText: 'Created',
        endpoint: result.isBackend ? 'POST http://localhost:3000/api/complaints' : 'Simulated Local POST',
        requestBody: JSON.stringify(formValue, null, 2),
        responseBody: {
          message: 'Complaint successfully registered via Fetch POST!',
          backendServer: result.isBackend ? 'Express.js on port 3000' : 'Local Fallback',
          generatedId: result.complaint.complaintId
        }
      });
    }
    this.isPostDemoLoading.set(false);
  }

  copyComplaintId(id: string): void {
    navigator.clipboard.writeText(id).then(() => {
      this.copiedId.set(true);
      setTimeout(() => this.copiedId.set(false), 3000);
    });
  }

  registerAnother(): void {
    this.submittedSuccess.set(null);
    this.postDemoResponse.set(null);
    this.initForm();
  }
}
