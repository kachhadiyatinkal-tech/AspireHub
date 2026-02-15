import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { StudentPage } from './student/student-page';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard.component';
import { CompanyPage } from './company/company-page';
import { CompanyDashboardComponent } from './company/dashboard/company-dashboard.component';
import { AdminPage } from './admin/admin-page';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { HomeComponent } from './home/home';
import { About } from './about/about';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'student', component: StudentPage },
      { path: 'about', component: About },
      {
        path: 'student/dashboard',
        component: StudentDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'student' },
      },
      { path: 'company', component: CompanyPage },
      {
        path: 'company/dashboard',
        component: CompanyDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'company' },
      },
      { path: 'admin', component: AdminPage },
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
