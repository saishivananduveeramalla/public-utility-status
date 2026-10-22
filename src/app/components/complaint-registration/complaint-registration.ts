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

  // Fetch API POST demonstration state
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
   * Main Standard Submission:
   * Saves to browser localStorage via ComplaintService
   */
  onSubmit(): void {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.complaintForm.value;

    setTimeout(() => {
      const newRecord = this.complaintService.registerComplaint(formValue);
      this.submittedSuccess.set(newRecord);
      this.isSubmitting.set(false);
      this.complaintForm.reset();
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 400);
  }

  /**
   * Asynchronous Fetch API POST Method Demonstration
   * Explicitly demonstrates syllabus requirement:
   * fetch() with method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(...)
   */
  async submitViaFetchPostDemo(): Promise<void> {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      alert('Please fill in all mandatory form fields before running the Fetch POST demonstration.');
      return;
    }

    this.isPostDemoLoading.set(true);
    const formValue = this.complaintForm.value;

    try {
      const result = await this.complaintService.simulateFetchPost(formValue);
      this.postDemoResponse.set(result);
      
      // Also register into localStorage so student can test tracking it
      const createdComplaint = this.complaintService.registerComplaint(formValue);
      this.submittedSuccess.set(createdComplaint);
    } catch (err: any) {
      alert('Fetch POST Simulation error: ' + err.message);
    } finally {
      this.isPostDemoLoading.set(false);
    }
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
