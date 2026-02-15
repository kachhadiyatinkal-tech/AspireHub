import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API = 'http://localhost:5000/api/companies';

export interface CompanyJob {
  _id: string;
  title: string;
  description?: string;
  eligibility?: string;
  company?: { name: string };
  createdAt?: string;
}

export interface Applicant {
  studentId: string;
  name: string;
  email: string;
  status: string;
}

export interface ApplicantsResponse {
  jobTitle: string;
  applicants: Applicant[];
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
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

  postJob(body: { title: string; description?: string; eligibility?: string }): Observable<{ message: string; job: CompanyJob }> {
    return this.http.post<{ message: string; job: CompanyJob }>(`${API}/jobs`, body, {
      headers: this.headers(),
    });
  }

  getMyJobs(): Observable<CompanyJob[]> {
    return this.http.get<CompanyJob[]>(`${API}/jobs`, { headers: this.headers() });
  }

  getApplicantsForJob(jobId: string): Observable<ApplicantsResponse> {
    return this.http.get<ApplicantsResponse>(`${API}/jobs/${jobId}/applicants`, {
      headers: this.headers(),
    });
  }

  updateApplicationStatus(
    jobId: string,
    studentId: string,
    status: 'Selected' | 'Rejected'
  ): Observable<{ message: string; status: string }> {
    return this.http.put<{ message: string; status: string }>(
      `${API}/jobs/${jobId}/applicants/${studentId}/status`,
      { status },
      { headers: this.headers() }
    );
  }
}
