# Viva Preparation Notes – Student Placement Management System

Simple notes to help you explain the project in your own words during a viva or presentation.

---

## 1. Why This Project Was Chosen

- **Real need:** Colleges actually run placement drives. Students apply, companies come to campus, and the placement cell tracks who got which job. Doing this on paper or in Excel is slow and error-prone.
- **Clear roles:** The problem has three natural roles—student, company, admin—so it fits well with role-based authentication and separate dashboards.
- **Scope for a minor project:** We can build register/login, job listing, apply, approve companies, and a placement report without going into heavy features like payment or complex reporting.
- **Learning value:** We get to practice full-stack development: Angular for UI, Node.js for API, MongoDB for data, and JWT for security—all in one project.

---

## 2. Why Angular + Node.js + MongoDB

**Angular (frontend)**  
- Gives a single-page application: no full page reloads when we move between login, dashboard, and lists.  
- Has built-in support for forms (we used reactive forms for login, register, and post job), routing (e.g. `/student/dashboard`, `/company/dashboard`), and HTTP calls to the backend.  
- We used Tailwind CSS with Angular for quick, consistent styling without writing a lot of custom CSS.

**Node.js + Express (backend)**  
- JavaScript on both frontend and backend, so one language for the whole project.  
- Express makes it easy to define routes (e.g. `/api/students/jobs`) and connect them to controller functions.  
- Huge number of packages (e.g. mongoose, bcrypt, jsonwebtoken) for database, password hashing, and JWT.

**MongoDB**  
- Stores data as JSON-like documents, which match well with our API (we send and receive JSON).  
- Flexible schema: we can add fields later (e.g. resume URL, application date) without changing the database structure too much.  
- Mongoose (ODM) gives us models (Student, Company, Job, Admin), validation, and simple queries.

---

## 3. Role-Based Authentication – Explanation

**What we mean by “role-based”**  
Each user has a **role**: student, company, or admin. What they can see and do depends on this role.

**How it works in our project**

1. **Registration / Login**  
   - Student and company register with name, email, password. We hash the password with bcrypt and store it.  
   - On login, we check email and password. If correct, we create a **JWT (JSON Web Token)** that contains the user’s id and **role** (e.g. `{ id: "...", role: "student" }`). We send this token to the frontend.  
   - Admin does not register from the app; we create one admin using a script and admin logs in via a separate API.

2. **Storing the token**  
   - The frontend stores the JWT (and role) in **localStorage** after login.  
   - For every request to a protected API (e.g. get jobs, post job), the frontend sends the token in the header: `Authorization: Bearer <token>`.

3. **Backend checks**  
   - **Auth middleware:** Verifies the JWT. If invalid or missing, it returns 401 Unauthorized.  
   - **Role middleware:** After auth, we check the role from the token (e.g. `requireStudent`, `requireCompany`, `requireAdmin`). If the user is not in the required role, we return 403 Forbidden.  
   - So only a logged-in student can call student APIs, only a company can call company APIs, and only admin can call admin APIs.

4. **Frontend guards**  
   - We have **AuthGuard**: allows access only if a token exists (user is logged in).  
   - We have **RoleGuard**: allows access only if the stored role matches the route (e.g. student dashboard requires role `student`).  
   - If the user is not logged in or wrong role, we redirect to login or home.

So “role-based authentication” here means: **login gives you a token that carries your role, and both backend and frontend use that role to allow or deny access to specific pages and APIs.**

---

## 4. How the Placement Flow Works

**Step-by-step (in simple terms):**

1. **Admin creates account**  
   - We run a script once to create the first admin in the database (e.g. admin@example.com / admin123).

2. **Company registers**  
   - Company signs up with name, email, password. They can log in but **cannot post jobs yet** because they are not approved.

3. **Admin approves company**  
   - Admin logs in, goes to “Manage Companies,” sees the new company as “Pending,” and clicks **Approve**.  
   - From now on, that company can post jobs.

4. **Company posts a job**  
   - Company logs in, goes to dashboard, fills title, description, eligibility, and clicks “Post Job.”  
   - The job is saved in the database and linked to that company. Only jobs from **approved** companies are shown to students.

5. **Student registers and logs in**  
   - Student signs up (e.g. name, email, password, branch). After login, they open the **Student Dashboard**.

6. **Student sees jobs and applies**  
   - Dashboard calls the API “get approved jobs.” Backend returns only jobs whose company is approved.  
   - Student clicks **Apply** on a job. Backend adds that student to the job’s applicants with status “Applied.” A student can apply only once per job.

7. **Company sees applicants**  
   - Company opens “My Posted Jobs,” clicks “View applicants” on a job.  
   - They see a list: student name, email, status (Applied / Selected / Rejected).  
   - They can click **Select** or **Reject** to update the status.

8. **Student sees status**  
   - On the student dashboard, each job shows the student’s status: Applied, Selected, or Rejected.

9. **Admin sees placement report**  
   - Admin opens “Placement Report.” Backend finds all students marked as placed and (where possible) the company and job title from “Selected” applications.  
   - Admin sees a list of placed students with company name and job title.

So the **flow** is: Company registers → Admin approves → Company posts job → Student applies → Company selects/rejects → Admin (and report) see who is placed.

---

## 5. Challenges Faced and Solutions

**Challenge 1: Only approved companies should post jobs.**  
- **Solution:** In the “post job” API we first fetch the company by id (from the JWT) and check `isApproved`. If false, we return 403 with a message like “Only approved companies can post jobs.”

**Challenge 2: Student should apply only once per job.**  
- **Solution:** Before adding an applicant, we check if that student’s id is already in the job’s `applicants` array. If yes, we return 400 “You have already applied for this job.”

**Challenge 3: Company should update status only for their own jobs.**  
- **Solution:** When the company calls “update application status,” we load the job and check that `job.company` equals the logged-in company’s id. If not, we return 403.

**Challenge 4: Frontend should show different menus for different roles.**  
- **Solution:** We check in the layout (navbar) if the user is logged in and read the role from the auth service. If logged in, we show “Dashboard” (link depends on role) and “Logout.” If not, we show Student, Company, Admin, Login links.

**Challenge 5: Protecting routes so only the right role can open a dashboard.**  
- **Solution:** We use two guards: AuthGuard (must be logged in) and RoleGuard (must have the role required by the route, e.g. `data: { role: 'student' }`). If either fails, we redirect to login or home.

---

## 6. What You Learned From This Project

- **Full-stack flow:** How the browser (Angular) sends requests to the server (Express), how the server reads/writes the database (MongoDB via Mongoose), and how the same data is shown in the UI.
- **REST API design:** Clear URLs and methods (GET for list/detail, POST for create, PUT for update) and sending the right status codes (200, 201, 400, 401, 403, 404).
- **Authentication:** Why we hash passwords (bcrypt), why we use JWT (stateless, can carry role), and how to send the token in headers and validate it on the server.
- **Authorization:** Difference between “who are you?” (auth) and “are you allowed to do this?” (role check). We implemented both in middleware and in Angular guards.
- **Reactive forms in Angular:** Building forms with validation (required, email, min length) and showing validation errors next to fields.
- **Services and HTTP:** Centralizing API calls in services (AuthService, StudentService, CompanyService, AdminService) and using the same token from the auth service for protected calls.
- **UI consistency:** Using one set of Tailwind classes for buttons, error messages, and loading states so the app looks and behaves in a consistent way.

You can say in the viva: “I learned how to build a complete flow from registration and login to role-based dashboards, and how the frontend and backend work together with a database and JWT for security.”

---

*Keep this document in your own words when you speak in the viva. Add examples from your code (e.g. name of a guard, an API route, or a model) to make it concrete.*
