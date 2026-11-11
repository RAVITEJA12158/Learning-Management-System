# LMS Backend API Architecture

This directory contains the Express REST API and Prisma PostgreSQL database layer for the Learning Management System. The API listens on port `5000` by default; the Vite frontend connects to it at `/api`.

---

## 🚀 Setup & Execution

1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Environment Variables**:
   Copy `.env.example` to `.env` and configure:
   - `DATABASE_URL`: Application connection string (pooled PostgreSQL via Supabase/Neon).
   - `DIRECT_URL`: Direct PostgreSQL connection used for Prisma migrations.
   - `JWT_SECRET` & `JWT_EXPIRES_IN`: Secret key and expiry (e.g. `7d`).
   - `ADMIN_SECRET_CODE`: Required for admin account authentication.
   - `GOOGLE_CLIENT_ID`: Google OAuth Web Client ID used to verify Google ID tokens (set the same client ID in frontend `VITE_GOOGLE_CLIENT_ID`).
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Media attachments and photo uploads.
   - `FRONTEND_ORIGINS`: Allowed CORS origins (e.g. `http://localhost:5173,http://localhost:3000`).
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`: Twilio Verify credentials for registration phone OTPs and password reset SMS. Phone numbers must use E.164 format (for example, `+919876543210`). SMS verification cannot be used until these are configured.

3. **Prisma Setup**:
   ```sh
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start the API Server**:
   ```sh
   npm run dev      # Hot reload with nodemon
   npm start        # Production node startup
   ```

5. **Run Test Suites**:
   ```sh
   npm test -- --testPathIgnorePatterns=Integration
   ```

### Google Sign-In Setup

Create a Google OAuth Web Client ID, then use the same ID as `VITE_GOOGLE_CLIENT_ID` in Vercel/frontend `.env` and `GOOGLE_CLIENT_ID` in Render/backend `.env`. Add the local and deployed frontend origins to the OAuth client's authorized JavaScript origins. Apply the new database migration with `npm run prisma:deploy` against the intended database before enabling Google sign-in. New Google accounts are Students; existing account roles are retained, and Admin Google sign-in also requires the configured administrator access code.

---

## 📡 REST API Endpoint Reference

All endpoints are prefixed with `/api` and protected by rate-limiting and helmet security headers.

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Register student/faculty account. Returns JWT and user payload.
- `POST /api/auth/phone/send-registration-otp`: Send a registration verification code to a mobile number.
- Registration requires the 6-digit SMS code sent to the submitted mobile number.
- `POST /api/auth/forgot-password`: Sends the reset code to the account's registered mobile when Twilio Verify is configured; otherwise uses the existing email reset flow.
- `POST /api/auth/login`: Authenticate email/password. Enforces secret code for `ADMIN` role.
- `POST /api/auth/google`: Verify a Google ID token and issue the normal LMS JWT. New Google accounts receive the `STUDENT` role; existing accounts keep their LMS role and password. Admin accounts must also provide the existing administrator access code.

### 2. User & Profile Management (`/api/users`)
- `GET /api/users/profile`: Current authenticated user's profile details.
- `PUT /api/users/profile`: Update current user's profile details (`name`, `mobileNumber`).
- `POST /api/users/profile/photo`: Upload avatar to Cloudinary CDN (cleans up old picture).
- `DELETE /api/users/profile/photo`: Revert profile avatar to default.
- `GET /api/users` *(Admin)*: List all users with role and search filters.
- `POST /api/users` *(Admin)*: Provision new user account.
- `PUT /api/users/:id` *(Admin)*: Update user role, status, or details.
- `DELETE /api/users/:id` *(Admin)*: Delete user.
- `GET /api/users/stats` *(Admin)*: System metrics (total users, courses, enrollments, submissions).

### 3. Courses & Roster (`/api/courses`)
- `GET /api/courses`: List public courses (supports `?search=` filter).
- `GET /api/courses/:id`: Course details with ordered modules and contents.
- `POST /api/courses` *(Faculty/Admin)*: Create new course with semester code.
- `PUT /api/courses/:id` *(Faculty/Admin)*: Update course details.
- `DELETE /api/courses/:id` *(Faculty/Admin)*: Delete course.
- `POST /api/courses/:id/enroll` *(Student)*: Enroll into a course.
- `DELETE /api/courses/:id/enroll` *(Student)*: Drop course enrollment.
- `GET /api/courses/student/enrolled` *(Student)*: List currently enrolled courses.
- `GET /api/courses/faculty/created` *(Faculty)*: List courses created by instructor.
- `GET /api/courses/:id/roster` *(Faculty/Admin)*: Enrolled students roster.
- `POST /api/courses/:id/instructors` *(Faculty/Admin)*: Map co-instructor to course.
- `DELETE /api/courses/:id/instructors/:facultyId` *(Faculty/Admin)*: Remove co-instructor.

### 4. Curriculum & Modules (`/api/modules`)
- `POST /api/modules` *(Faculty/Admin)*: Create curriculum module.
- `PUT /api/modules/:id` *(Faculty/Admin)*: Update module title, position, publication status.
- `DELETE /api/modules/:id` *(Faculty/Admin)*: Delete module.
- `POST /api/modules/content` *(Faculty/Admin)*: Add learning material (PDF, VIDEO, LINK, FILE, TEXT).
- `PUT /api/modules/content/:id` *(Faculty/Admin)*: Update content details.
- `DELETE /api/modules/content/:id` *(Faculty/Admin)*: Delete content item.
- `POST /api/modules/content/upload` *(Faculty/Admin)*: Upload resource file to Cloudinary.

### 5. Assignments & Submissions (`/api/assignments`)
- `GET /api/assignments/course/:courseId`: List assignments for a course with submission status.
- `GET /api/assignments/:id`: Single assignment details with submissions.
- `POST /api/assignments` *(Faculty/Admin)*: Author assignment (due date, max marks, late policy).
- `PUT /api/assignments/:id` *(Faculty/Admin)*: Update assignment.
- `DELETE /api/assignments/:id` *(Faculty/Admin)*: Delete assignment.
- `POST /api/assignments/:id/submit` *(Student)*: Submit assignment file (with Cloudinary upload).
- `GET /api/assignments/:id/submissions` *(Faculty/Admin)*: List all submissions for grading.
- `PUT /api/assignments/submissions/:submissionId/grade` *(Faculty/Admin)*: Award marks & feedback.

### 6. Timed Quizzes & Auto-Grading (`/api/quizzes`)
- `GET /api/quizzes/course/:courseId`: List quizzes for a course (formatted with attempt status).
- `GET /api/quizzes/:id`: Quiz details with questions and options (answers hidden for students).
- `POST /api/quizzes` *(Faculty/Admin)*: Author quiz with MCQ and True/False questions.
- `PUT /api/quizzes/:id` *(Faculty/Admin)*: Update quiz metadata and duration.
- `DELETE /api/quizzes/:id` *(Faculty/Admin)*: Delete quiz.
- `POST /api/quizzes/:id/attempt` *(Student)*: Submit attempt: auto-grades MCQs, stores score.
- `GET /api/quizzes/:id/attempts`: List student attempts or all course attempts.
- `GET /api/quizzes/attempts/:attemptId`: Detailed review of completed attempt.

### 7. Announcements (`/api/announcements`)
- `GET /api/announcements/course/:courseId`: List course announcements.
- `POST /api/announcements` *(Faculty/Admin)*: Publish announcement and dispatch student notifications.
- `PUT /api/announcements/:id` *(Author/Admin)*: Update announcement.
- `DELETE /api/announcements/:id` *(Author/Admin)*: Delete announcement.

### 8. Class Discussions Forum (`/api/discussions`)
- `GET /api/discussions/course/:courseId`: List discussion threads with nested replies.
- `GET /api/discussions/:id`: Single thread details.
- `POST /api/discussions`: Start new discussion thread in enrolled course.
- `POST /api/discussions/:id/replies`: Post reply to thread (notifies thread author).
- `DELETE /api/discussions/:id` *(Author/Admin)*: Delete discussion thread.
- `DELETE /api/discussions/replies/:replyId` *(Author/Admin)*: Delete reply.

### 9. Attendance Tracking (`/api/attendance`)
- `GET /api/attendance/course/:courseId` *(Faculty/Admin)*: List sessions and roll calls.
- `POST /api/attendance/session` *(Faculty/Admin)*: Create session (auto-populates enrolled students).
- `PUT /api/attendance/session/:sessionId/record` *(Faculty/Admin)*: Update student status (`PRESENT`, `ABSENT`, `LATE`).
- `POST /api/attendance/session/:sessionId/mark-all` *(Faculty/Admin)*: Mark all students present.
- `GET /api/attendance/student/course/:courseId` *(Student)*: Student's personal attendance % and session logs.

### 10. Grades & Weighted Rubrics (`/api/grades`)
- `GET /api/grades/course/:courseId/components`: Course grade weight breakdown (defaults to standard rubric).
- `POST /api/grades/course/:courseId/components` *(Faculty/Admin)*: Update course grade rubric.
- `GET /api/grades/course/:courseId/roster` *(Faculty/Admin)*: Aggregated gradebook across assignments, quizzes, and attendance.
- `GET /api/grades/student/overview` *(Student)*: Student cumulative GPA, credits, and course-by-course grades.

### 11. Notifications Center (`/api/notifications`)
- `GET /api/notifications`: Logged-in user's notifications feed.
- `PUT /api/notifications/:id/read`: Mark notification as read.
- `PUT /api/notifications/read-all`: Mark all notifications as read.
- `DELETE /api/notifications/:id`: Dismiss notification.
- `POST /api/notifications/broadcast` *(Admin)*: Publish campus-wide alert.

### 12. Learning Progress (`/api/progress`)
- `PUT /api/progress/content/:contentId` *(Student)*: Mark content item completed/incomplete.
- `GET /api/progress/course/:courseId` *(Student)*: Course-level completion percentage and module status.

---

## 🔒 Security & Middleware
- **Authentication**: JWT verification middleware extracting `userId` and `role`.
- **RBAC**: `requireRole(['STUDENT', 'FACULTY', 'ADMIN'])` restricting privileged routes.
- **Uploads**: Multer memory buffer piped to Cloudinary with secure URL generation.
- **Rate-Limiting**: Express rate limiter preventing brute force and DDoS on API endpoints.
- **Error Handling**: Centralized error middleware masking internal stack traces in production.
