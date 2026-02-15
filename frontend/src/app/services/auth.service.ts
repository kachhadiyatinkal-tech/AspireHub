import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API = 'http://localhost:5000/api/auth';
const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const USER_KEY = 'user';

export interface LoginResponse {
  message: string;
  token: string;
  user: { id: string; name: string; email: string; role: string };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  loginStudent(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API}/student/login`, { email, password })
      .pipe(tap((res) => this.storeAuth(res)));
  }

  loginCompany(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API}/company/login`, { email, password })
      .pipe(tap((res) => this.storeAuth(res)));
  }

  loginAdmin(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API}/admin/login`, { email, password })
      .pipe(tap((res) => this.storeAuth(res)));
  }

  registerStudent(body: {
    name: string;
    email: string;
    password: string;
    branch?: string;
    skills?: string[];
    resume?: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API}/student/register`, body)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  registerCompany(body: {
    name: string;
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API}/company/register`, body)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  private storeAuth(res: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(ROLE_KEY, res.user.role);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(ROLE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
