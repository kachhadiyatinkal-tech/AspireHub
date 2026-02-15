import { Component, OnInit } from '@angular/core';
import { StudentService, Job, AppliedJob } from '../services/student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'], // optional if using Tailwind
})
export class HomeComponent implements OnInit {
  // Student Section
  jobs: Job[] = [];                        // List of approved jobs
  statusByJobId: Record<string, string> = {}; // Status for each job
  loading = true;
  error = '';
  applyingId: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudentJobs();
  }

  /**
   * Load approved jobs for students
   */
  loadStudentJobs(): void {
    this.loading = true;
    this.error = '';

    this.studentService.getApprovedJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loadAppliedJobs();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load jobs.';
      },
    });
  }

  /**
   * Load jobs that the student already applied for
   */
  loadAppliedJobs(): void {
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

  /**
   * Get the application status for a specific job
   */
  getStatus(jobId: string): string | null {
    return this.statusByJobId[jobId] ?? null;
  }

  /**
   * Apply for a job
   */
  apply(jobId: string): void {
    if (this.applyingId) return; // prevent multiple clicks

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

  /**
   * Get company name safely
   */
  companyName(job: Job): string {
    return job.company?.name ?? '—';
  }
}