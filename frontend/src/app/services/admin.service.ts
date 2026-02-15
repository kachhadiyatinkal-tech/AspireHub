import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API = 'http://localhost:5000/api/admin';

export interface AdminStudent {
  _id?: string;
  name: string;
  email: string;
  branch: string;
  placed: boolean;
}

export interface AdminCompany {
  _id: string;
  name: string;
  email: string;
  isApproved: boolean;
}

export interface PlacementReportEntry {
  name: string;
  email: string;
  branch: string;
  placed: boolean;
  companyName: string | null;
  jobTitle: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
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

  getStudents(): Observable<AdminStudent[]> {
    return this.http.get<AdminStudent[]>(`${API}/students`, { headers: this.headers() });
  }

  getCompanies(): Observable<AdminCompany[]> {
    return this.http.get<AdminCompany[]>(`${API}/companies`, { headers: this.headers() });
  }

  setCompanyApproval(companyId: string, isApproved: boolean): Observable<{ message: string; company: AdminCompany }> {
    return this.http.put<{ message: string; company: AdminCompany }>(
      `${API}/companies/${companyId}/approval`,
      { isApproved },
      { headers: this.headers() }
    );
  }

  getPlacementReport(): Observable<PlacementReportEntry[]> {
    return this.http.get<PlacementReportEntry[]>(`${API}/placement-report`, {
      headers: this.headers(),
    });
  }
}
