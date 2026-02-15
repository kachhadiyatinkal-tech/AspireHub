# Student Placement Management System

A web application for managing college placements. Students can view and apply for jobs, companies can post jobs and manage applicants, and admins can approve companies and view placement reports.

---

## Problem Statement

Colleges need a simple way to:
- Let students see approved job openings and apply online
- Let companies register, get approved, post jobs, and see who applied
- Let admins manage students, approve or block companies, and see who got placed

Doing this with paper or separate tools is messy. This project brings everything into one system with clear roles and a simple flow.

---

## Objectives

1. **Student module:** Register, login, view approved jobs, apply for jobs, and see application status (Applied / Selected / Rejected).
2. **Company module:** Register, login, post jobs (if approved), view posted jobs, see applicants, and update application status (Selected / Rejected).
3. **Admin module:** View all students and companies, approve or reject companies, and view a placement report (placed students with company and job).
4. **Security:** Role-based access so each user sees only what they are allowed to do.
5. **Usability:** Simple, clear UI so that students, companies, and admins can use the system without training.

---

## Technologies Used

| Layer      | Technology        | Purpose                          |
|-----------|-------------------|----------------------------------|
| Frontend  | Angular           | Single-page app, routing, forms  |
| Styling   | Tailwind CSS      | Layout and styling               |
| Backend   | Node.js + Express | REST API, auth, business logic   |
| Database  | MongoDB           | Store users, jobs, applications  |
| Auth      | JWT + bcrypt      | Login and role-based access      |

---

## System Modules

### 1. Student Module
- **Register / Login** as student (email, password).
- **Dashboard:** List of approved jobs; apply for a job (once per job); see status (Applied / Selected / Rejected).
- **Profile:** Update skills and resume (API exists; UI can be added later).
- **Access:** Only students can open the student dashboard.

### 2. Company Module
- **Register / Login** as company (email, password).
- **Dashboard:** Post a job (title, description, eligibility); view your posted jobs; view applicants per job; mark applicants as Selected or Rejected.
- **Restriction:** Only approved companies can post jobs (admin approves from admin panel).
- **Access:** Only companies can open the company dashboard.

### 3. Admin Module
- **Login** as admin (separate admin login; admin is created via a seed script).
- **Dashboard:**  
  - **Manage students:** View list (name, email, branch, placed status).  
  - **Manage companies:** View list (name, email, approval status); Approve or Reject.  
  - **Placement report:** List of placed students with company name and job title (where available).
- **Access:** Only admins can open the admin dashboard.

---

## Folder Structure

```
student_placement_project/
│
├── backend/
│   ├── server.js                 # Entry point
│   ├── package.json
│   ├── .env                      # PORT, MONGODB_URI, JWT_SECRET (copy from .env.example)
│   ├── .env.example
│   ├── scripts/
│   │   └── seedAdmin.js          # One-time script to create first admin
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB connection
│       ├── models/
│       │   ├── Student.js
│       │   ├── Company.js
│       │   ├── Job.js
│       │   ├── Admin.js
│       │   └── Placement.js      # (optional / legacy)
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── studentRoutes.js
│       │   ├── companyRoutes.js
│       │   ├── adminRoutes.js
│       │   └── placementRoutes.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── studentController.js
│       │   ├── companyController.js
│       │   └── adminController.js
│       └── middleware/
│           ├── authMiddleware.js   # JWT verify + requireStudent / requireCompany / requireAdmin
│           ├── errorHandler.js
│           └── notFound.js
│
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── styles.css             # Tailwind directives
│   │   └── app/
│   │       ├── app.ts
│   │       ├── app.routes.ts
│   │       ├── layout/            # Navbar + main content
│   │       ├── auth/              # Login, Register
│   │       ├── student/           # Student page, StudentDashboardComponent
│   │       ├── company/           # Company page, CompanyDashboardComponent
│   │       ├── admin/             # Admin page, AdminDashboardComponent
│   │       ├── services/          # AuthService, StudentService, CompanyService, AdminService
│   │       └── guards/            # authGuard, roleGuard
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
└── viva.md                        # Viva preparation notes
```

---

## How to Run the Project

### Prerequisites
- **Node.js** (v18 or later)
- **MongoDB** (running locally or a cloud URI)
- **npm** (comes with Node.js)

### Step 1: Clone or open the project
Open the project folder in your editor or terminal.

### Step 2: Backend setup
1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Copy the environment file and set your MongoDB URL (and optional JWT secret):
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and set:
   - `MONGODB_URI=mongodb://localhost:27017/student_placement_db` (or your MongoDB URI)
   - `JWT_SECRET=your_secret_key` (use a strong secret in production)
3. Install dependencies and start the server:
   ```bash
   npm install
   npm start
   ```
   You should see: `Server running on port 5000` and `MongoDB connected`.

### Step 3: Create the first admin (one time)
In a **new** terminal, from the project root:
```bash
cd backend
node scripts/seedAdmin.js
```
This creates an admin user (see Sample credentials below).

### Step 4: Frontend setup
1. Open another terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the app:
   ```bash
   npm install
   npm start
   ```
3. Open the URL shown (usually `http://localhost:4200`) in your browser.

### Step 5: Use the application
- **Students / Companies:** Use Register to create an account, then Login. After login, use “Dashboard” in the navbar to go to your role-specific dashboard.
- **Admin:** Use the admin login (see Sample credentials). Then open “Dashboard” to manage students, companies, and view the placement report.

---

## Sample Credentials

| Role    | Email              | Password  | Notes                                      |
|---------|--------------------|-----------|--------------------------------------------|
| Admin   | admin@example.com  | admin123  | Create once using `node backend/scripts/seedAdmin.js` |
| Student | (any)              | (any)     | Register from the app as Student           |
| Company | (any)              | (any)     | Register from the app as Company           |

After registering a company, an admin must **Approve** it from the admin dashboard before that company can post jobs.

---

## Future Enhancements

1. **Admin login on the same login page** – Add “Login as Admin” (or role dropdown including Admin) and call the admin login API so admins can sign in from the main login screen.
2. **Student profile page** – Form to update skills and resume using the existing profile API.
3. **Email notifications** – Send email when a student applies, when status changes to Selected/Rejected, or when a company is approved.
4. **Placement statistics** – Charts (e.g. placements per company, branch-wise stats) on the admin dashboard.
5. **Search and filters** – Filter jobs by company, eligibility, or keyword; filter students by branch or placement status.
6. **Resume upload** – Store resume file (e.g. in cloud storage) and link it in the student profile and application view.
7. **Forgot password** – Reset password via email link or OTP.

---

## API Overview

- **Auth:** `POST /api/auth/student/register`, `POST /api/auth/student/login`, same for company; `POST /api/auth/admin/login`.
- **Students (with JWT):** `GET /api/students/jobs`, `POST /api/students/jobs/:jobId/apply`, `GET /api/students/applications`, `PUT /api/students/profile`.
- **Companies (with JWT):** `POST /api/companies/jobs`, `GET /api/companies/jobs`, `GET /api/companies/jobs/:jobId/applicants`, `PUT /api/companies/jobs/:jobId/applicants/:studentId/status`.
- **Admin (with JWT):** `GET /api/admin/students`, `GET /api/admin/companies`, `PUT /api/admin/companies/:companyId/approval`, `GET /api/admin/placement-report`.

All protected routes expect the header: `Authorization: Bearer <token>`.
