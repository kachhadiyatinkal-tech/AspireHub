import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, CompanyJob, Applicant } from '../../services/company.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css',
})
export class CompanyDashboardComponent implements OnInit {
  jobForm: FormGroup;
  jobs: CompanyJob[] = [];
  loading = true;
  error = '';
  posting = false;
  expandedJobId: string | null = null;
  applicants: Applicant[] = [];
  applicantsLoading = false;
  updatingStatus: string | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.jobForm = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: [''],
      eligibility: [''],
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';
    this.companyService.getMyJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load jobs.';
      },
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    this.posting = true;
    this.error = '';
    this.companyService.postJob(this.jobForm.getRawValue()).subscribe({
      next: () => {
        this.posting = false;
        this.jobForm.reset();
        this.loadJobs();
      },
      error: (err) => {
        this.posting = false;
        this.error = err.error?.message || 'Failed to post job.';
      },
    });
  }

  toggleApplicants(jobId: string): void {
    if (this.expandedJobId === jobId) {
      this.expandedJobId = null;
      this.applicants = [];
      return;
    }
    this.expandedJobId = jobId;
    this.applicantsLoading = true;
    this.companyService.getApplicantsForJob(jobId).subscribe({
      next: (res) => {
        this.applicants = res.applicants;
        this.applicantsLoading = false;
      },
      error: () => {
        this.applicantsLoading = false;
      },
    });
  }

  setStatus(jobId: string, studentId: string, status: 'Selected' | 'Rejected'): void {
    const key = `${jobId}-${studentId}`;
    if (this.updatingStatus === key) return;
    this.updatingStatus = key;
    this.companyService.updateApplicationStatus(jobId, studentId, status).subscribe({
      next: () => {
        this.updatingStatus = null;
        const a = this.applicants.find((x) => x.studentId === studentId);
        if (a) a.status = status;
      },
      error: () => {
        this.updatingStatus = null;
      },
    });
  }

  statusClass(status: string): string {
    if (status === 'Selected') return 'bg-green-100 text-green-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  }
}
