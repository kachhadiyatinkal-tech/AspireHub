import { Component, OnInit } from '@angular/core';
import {
  AdminService,
  AdminStudent,
  AdminCompany,
  PlacementReportEntry,
} from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  students: AdminStudent[] = [];
  companies: AdminCompany[] = [];
  placementReport: PlacementReportEntry[] = [];
  loading = true;
  error = '';
  updatingCompanyId: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.adminService.getCompanies().subscribe({
          next: (companies) => {
            this.companies = companies;
            this.adminService.getPlacementReport().subscribe({
              next: (report) => {
                this.placementReport = report;
                this.loading = false;
              },
              error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Failed to load placement report.';
              },
            });
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error?.message || 'Failed to load companies.';
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load students.';
      },
    });
  }

  setApproval(company: AdminCompany, isApproved: boolean): void {
    if (this.updatingCompanyId) return;
    this.updatingCompanyId = company._id;
    this.adminService.setCompanyApproval(company._id, isApproved).subscribe({
      next: (res) => {
        company.isApproved = res.company.isApproved;
        this.updatingCompanyId = null;
      },
      error: () => {
        this.updatingCompanyId = null;
      },
    });
  }
}
