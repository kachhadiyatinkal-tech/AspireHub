import { Component, OnInit } from '@angular/core';
import { StudentService, Job, AppliedJob } from '../../services/student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent implements OnInit {
  jobs: Job[] = [];
  statusByJobId: Record<string, string> = {};
  loading = true;
  error = '';
  applyingId: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.studentService.getApprovedJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loadApplications();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load jobs.';
      },
    });
  }

  loadApplications(): void {
    this.studentService.getAppliedJobs().subscribe({
      next: (applied: AppliedJob[]) => {
        this.statusByJobId = {};
        applied.forEach((a) => (this.statusByJobId[a.jobId] = a.status));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getStatus(jobId: string): string | null {
    return this.statusByJobId[jobId] ?? null;
  }

  apply(jobId: string): void {
    if (this.applyingId) return;
    this.applyingId = jobId;
    this.studentService.applyForJob(jobId).subscribe({
      next: () => {
        this.statusByJobId[jobId] = 'Applied';
        this.applyingId = null;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to apply.';
        this.applyingId = null;
      },
    });
  }

  companyName(job: Job): string {
    return job.company?.name ?? '—';
  }
}
