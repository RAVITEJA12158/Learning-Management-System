# LMS Software Testing Documentation

## 1. Introduction

This document describes the repeatable unit, API integration, and browser UI tests for CourseHub LMS. Automated tests use isolated mocks for Prisma in Jest/Supertest, so they do not connect to or modify a configured database. Selenium tests exercise a running local frontend and API; workflows that write records are disabled unless the operator explicitly confirms a disposable test database.

## 2. Tools and project layout

- **Jest** runs Node.js unit and API-level tests.
- **Supertest** sends HTTP requests to the exported Express application without opening a listening port.
- **Python Selenium WebDriver** drives Google Chrome through the frontend.
- **pytest / pytest-html** provide browser test selection and an HTML report.
- **Prisma Client** is mocked in backend test files; no integration test needs a live database.

```text
backend/tests/                  Jest controller, middleware, and HTTP tests
backend/coverage/               Jest text, HTML, LCOV, and JSON coverage reports
frontend-tests/                 Python Selenium test project
frontend-tests/tests/           Browser workflows and shared fixtures
frontend-tests/reports/         pytest HTML report and failure screenshots
```

## 3. Backend unit tests

Controller tests call the relevant controller with mocked Prisma methods and Express request/response objects. Middleware tests cover registration/login/reset validation, JWT verification, role access, and negative authorization cases. The test database is not used. JWT secrets in tests are short-lived test-only values set inside test processes, never application secrets.

Run all backend suites:

```powershell
cd backend
npm test
```

Run controller and middleware tests only:

```powershell
npm run test:unit
```

## 4. Backend HTTP integration tests

Supertest sends requests through the real Express routing, middleware, body parsing, and error handling. Prisma remains mocked, making these endpoint tests deterministic and safe to run against a developer machine with production `.env` settings. These are application integration tests with a mocked persistence boundary; they are not end-to-end tests against PostgreSQL.

```powershell
cd backend
npm run test:integration
```

Coverage can be generated for controllers, middleware, routes, and server wiring:

```powershell
npm run test:coverage
```

Open `backend/coverage/lcov-report/index.html` for the HTML report. A text summary is printed in the terminal.

## 5. Selenium frontend tests

The tests in `frontend-tests/tests/test_lms_workflows.py` use Chrome and explicit Selenium waits. Screenshots are captured under `frontend-tests/reports/screenshots/` when a browser test fails. `pytest-html` writes `frontend-tests/reports/selenium-report.html`.

Install Python packages and Chrome:

```powershell
cd frontend-tests
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start the backend and frontend in separate terminals from the repository root:

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

Copy `.env.example` to `frontend-tests/.env` and set `LMS_RUN_SELENIUM=1`, the local `LMS_BASE_URL`, and test-only role credentials. Dashboard tests require the corresponding `LMS_TEST_STUDENT_*`, `LMS_TEST_FACULTY_*`, and `LMS_TEST_ADMIN_*` values. The course workflows also require `LMS_TEST_COURSE_ID` to identify a seeded course accessible to those accounts.

By default, tests that create accounts, enrollments, assignments, quizzes, announcements, discussions, submissions, or progress are skipped. To enable them, first configure the backend to use a disposable test database and set both `LMS_TEST_DB_CONFIRMED=true` and `LMS_TEST_ALLOW_MUTATIONS=true` in `frontend-tests/.env`. Mutation tests additionally reject non-localhost frontend targets. Never use production credentials or production database configuration for Selenium runs.

Run browser tests and generate the HTML report:

```powershell
cd frontend-tests
python -m pytest
```

Set `LMS_HEADLESS=false` to show Chrome. The driver uses Selenium Manager to locate or provision ChromeDriver when needed.

## 6. Test cases and observed results

| ID | Scenario | Input / precondition | Expected result | Actual result |
|---|---|---|---|---|
| BE-01 | Register user | Valid registration fields | `201`, hashed password stored, JWT returned | Passed in Jest run |
| BE-02 | Reject invalid registration | Missing field or unsupported role | `400`, no user created | Passed in Jest run |
| BE-03 | Login / password check | Valid and invalid passwords | Valid returns JWT; invalid returns `401` | Passed in Jest run |
| BE-04 | JWT authentication | Missing, invalid, expired, and valid tokens | Valid identity attached; invalid requests rejected | Passed in Jest run |
| BE-05 | Role authorization | Student requests faculty-only route | `403` without controller/database access | Passed in Jest run |
| BE-06 | Course and enrollment APIs | Faculty/student JWTs and mocked Prisma | Correct course creation, browse, enroll/drop, RBAC | Passed in Jest run |
| BE-07 | Content and progress APIs | Faculty/student JWTs and mocked Prisma | Content CRUD and progress summaries work | Passed in Jest run |
| BE-08 | Assignments and submissions | Faculty/student request flow | Create, submit, grade operations return expected statuses | Passed in Jest run |
| BE-09 | Quiz evaluation | Authenticated users and mocked quiz data | Quiz APIs enforce access and score responses | Passed in Jest run |
| BE-10 | Attendance, grades, discussions, announcements, notifications | Controller inputs and mocked Prisma | Expected listing, updates, notification dispatch, and validation | Passed in Jest run |
| BE-11 | Invalid JSON / missing route | Malformed payload and unknown URL | JSON `400` / `404` error response | Passed in Jest run |
| UI-01 | Public course browsing | Running local frontend | Catalog page renders | Passed in headless Chrome against local Vite; API was not running, so course data was not verified |
| UI-02 | Registration and login/logout | Test credentials and disposable DB | New student registers; roles reach role dashboard and can sign out | Skipped: browser run is opt-in |
| UI-03 | Anonymous route protection | No session | Restricted dashboard redirects to login | Passed in headless Chrome against local Vite |
| UI-04 | Failed login | Incorrect credentials and running backend | Error displayed and user remains on login page | Passed: latest shared run, 1 test in 5.60s; backend returned “User not found.” |
| UI-05 | Learning material, quiz, attendance, progress | Seeded test course and student | Video opens, quiz and attendance tabs render | Not run: test account and course were not configured |
| UI-06 | Assignment, submission, announcement, discussion flows | Faculty/student test accounts and disposable DB | Records can be created and submitted through the UI | Not run: mutation workflow requires explicit opt-in |

“Automated” means the backend test files execute under Jest. UI case results are recorded in the generated pytest HTML report; skipped cases indicate missing local app, test account, course, or explicit mutation opt-in.

Latest backend execution in this workspace: **Jest: 18 suites and 94 tests passed**; **unit group: 13 suites / 77 passed**; **HTTP integration group: 5 suites / 17 passed**. Coverage was **56.89% statements, 42.79% branches, 62.01% functions, and 59.94% lines**. Python syntax compilation passed. A default pytest run skipped all 10 browser cases because `LMS_RUN_SELENIUM` was not enabled. Headless Chrome passed the public catalog and anonymous protected-route checks against loopback Vite. The latest shared Selenium run passed the invalid-login check (1 test in 5.60s); the backend returned “User not found,” which the updated assertion accepts. Seven broader cases remain skipped due to missing role credentials and mutation opt-in. The remaining UI workflows need test accounts and a disposable test database. The frontend production build passed after fixing a broken CourseDetails re-export; Vite reports a bundle size advisory for the 649 kB JavaScript chunk.

## 7. Reports

- Backend coverage: `backend/coverage/lcov-report/index.html`
- Backend machine-readable coverage: `backend/coverage/coverage-final.json` and `backend/coverage/coverage-summary.json`
- Selenium run report: `frontend-tests/reports/selenium-report.html`
- Selenium failure screenshots: `frontend-tests/reports/screenshots/`

## 8. Conclusion and limitations

The repository now has repeatable tests for backend controllers, authentication middleware, role checks, and Express endpoints. Backend persistence is mocked to prevent production data access. Two read-only frontend routes passed in Chrome. The full Selenium workflow suite needs local test accounts and a disposable database before its mutation cases can be run. Full database-backed integration testing is intentionally not enabled until a dedicated disposable PostgreSQL test database is configured; the current suite does not claim to validate production database connectivity or schema migrations.
