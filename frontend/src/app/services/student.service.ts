import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API = 'http://localhost:5000/api/students';

export interface Job {
  _id: string;
  title: string;
  description?: string;
  eligibility?: string;
  company?: { name: string; email?: string };
  applicants?: { student: string; status: string }[];
  createdAt?: string;
}

export interface AppliedJob {
  jobId: string;
  title: string;
  companyName: string | null;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private headers(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  getApprovedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${API}/jobs`, { headers: this.headers() });
  }

  applyForJob(jobId: string): Observable<{ message: string; job: { _id: string; title: string; company: string } }> {
    return this.http.post<{ message: string; job: { _id: string; title: string; company: string } }>(
      `${API}/jobs/${jobId}/apply`,
      {},
      { headers: this.headers() }
    );
  }

  getAppliedJobs(): Observable<AppliedJob[]> {
    return this.http.get<AppliedJob[]>(`${API}/applications`, { headers: this.headers() });
  }
}
