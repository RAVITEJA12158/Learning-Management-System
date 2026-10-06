# 🎓 Learning Management System (LMS)

A full-stack, enterprise-grade **Learning Management System (LMS)** designed to streamline course authoring, student learning journeys, assignment grading, and academic progress tracking. Built with the **PERN stack** (PostgreSQL, Express, React, Node.js) leveraging **Prisma ORM** with **Supabase**, **Vite**, and **Tailwind CSS**.

---

## 👥 Project Team

- **Raviteja**
- **Karthik**
- **Shreetheja**

---

## 🚀 Key Highlights & Features

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **Granular Roles**: Strict role demarcation between `STUDENT`, `FACULTY`, and `ADMIN`.
- **JWT & Password Security**: Salted hash storage with `bcryptjs`, signed JSON Web Tokens, and secure Authorization headers.
- **Rate-Limiting & Security**: Brute-force protection on authentication routes with `express-rate-limit` and HTTP header hardening via `helmet`.

### 📚 Course & Curriculum Management
- **Course Lifecycle**: Faculty and Admins can create, update, and manage semester courses with unique course codes.
- **Hierarchical Content Organization**: Courses contain ordered **Modules**, which host varied **Content Items** (PDFs, Videos, External Links, Files, Text).
- **Cloud File Storage**: Direct file attachments and media assets handled seamlessly via **Cloudinary**.
- **Co-Instructors & Rosters**: Assign and manage multiple faculty instructors and inspect student course rosters.

### 📝 Assignments & Evaluation Workflow
- **Assignment Creation**: Support for due dates, maximum marks, detailed rubrics, and optional late submissions.
- **Student Submissions**: Document and file uploads for student submissions with automatic status categorization (`SUBMITTED` vs. `LATE`).
- **Grading & Feedback**: Instructors can review, grade (custom marks), and deliver qualitative feedback to students.

### 📊 Progress & Completion Tracking
- **Granular Progress**: Students can mark individual learning modules and content items as completed.
- **Real-time Analytics**: Course-level completion percentage calculated dynamically on demand.

### 🎨 Modern, Interactive Frontend
- **Built with React 19 + Vite 8**: Ultra-fast HMR and seamless developer experience.
- **Tailwind CSS v4 Styling**: Clean typography, dark/light contrast, micro-interactions, responsive sidebars, and polished card designs.
- **Role-Specific Dashboards**:
  - **Student Dashboard**: Quick access to enrolled courses, completion metrics, and course catalog.
  - **Faculty Dashboard**: Overview of created courses, instructor tools, and quick assignment evaluation links.
  - **Admin Dashboard**: System oversight and management controls.
- **Modular Course Views**: Tabbed navigation inside courses covering **Overview**, **Modules**, **Assignments**, **Quizzes**, **Announcements**, and **Discussions**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express.js (REST API), Prisma ORM v6 |
| **Database** | PostgreSQL hosted on Supabase (with Supavisor pooling + Direct URL) |
| **Media / Storage** | Cloudinary (Multer memory storage + stream upload) |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit`, `cors` |
| **Testing & Quality** | Jest, Supertest, Postman Collections, Oxlint |

---

## 📂 Project Architecture

```
Learning-Management-System/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Complete database schema & relationships
│   │   └── migrations/            # Version-controlled DB migrations
│   ├── src/
│   │   ├── config/                # Cloudinary, CORS & environment configuration
│   │   ├── Controllers/           # auth, course, module, assignment, progress, user
│   │   ├── lib/                   # Prisma client singleton
│   │   ├── Middleware/            # JWT authentication, role guards, multer upload, rate-limiters
│   │   ├── routes/                # Express API routes
│   │   └── server.js              # Server entry point & graceful shutdown
│   ├── tests/                     # Unit and integration tests (Jest + Supertest)
│   ├── Dockerfile                 # Containerization definition
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Shared UI components (Layout, Navbar, Sidebar, CourseForm)
│   │   ├── context/               # React Context providers (AuthContext)
│   │   ├── pages/                 # Landing, Auth, Student, Faculty, Admin, CourseCatalog
│   │   │   └── Course/            # Course view tabs (Modules, Assignments, Quizzes, etc.)
│   │   ├── routes/                # React Router v7 AppRoutes
│   │   ├── services/              # API abstraction layer (api.js, courseService, userService)
│   │   ├── styles/ & index.css    # Tailwind CSS v4 design system
│   │   └── App.jsx
│   ├── vite.config.js             # Vite config with /api proxy to localhost:5000
│   └── package.json
│
├── postman/                       # Regression test suites & environment exports
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) project (or any PostgreSQL instance)
- A [Cloudinary](https://cloudinary.com/) account (for file/image storage)

---

### 1. Clone the Repository

```bash
git clone https://github.com/RAVITEJA12158/Learning-Management-System.git
cd Learning-Management-System
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in `backend/` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration:
   ```env
   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"

   # Application
   PORT=5000
   NODE_ENV=development

   # Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   ADMIN_SECRET_CODE="your-admin-registration-secret"

   # Cloudinary (Media Uploads)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Generate Prisma Client & Run Migrations**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start the backend development server**:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:5000`.

---

### 3. Frontend Setup

1. **Navigate to the frontend directory** (in a separate terminal):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   The frontend will be live at `http://localhost:3000`.
   *(All requests to `/api` are automatically proxied to `http://localhost:5000` via Vite)*.

---

## 📡 REST API Reference

The backend exposes the following RESTful API endpoints under `/api`:

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`STUDENT`, `FACULTY`, `ADMIN`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |

### 👤 User Profile (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Authenticated | Retrieve current user profile details |
| `POST` | `/api/users/profile/photo` | Authenticated | Upload new user avatar (Cloudinary) |
| `DELETE` | `/api/users/profile/photo` | Authenticated | Remove profile photo |

### 📖 Courses (`/api/courses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Authenticated | List all available courses |
| `GET` | `/api/courses/:id` | Authenticated | Fetch course details by ID |
| `POST` | `/api/courses` | Faculty, Admin | Create a new course |
| `PUT` | `/api/courses/:id` | Faculty, Admin | Update course metadata |
| `DELETE` | `/api/courses/:id` | Faculty, Admin | Delete a course |
| `GET` | `/api/courses/student/enrolled` | Student | List courses the student is enrolled in |
| `GET` | `/api/courses/faculty/created` | Faculty | List courses created by instructor |
| `POST` | `/api/courses/:id/enroll` | Student | Enroll in a course |
| `DELETE` | `/api/courses/:id/enroll` | Student | Drop/unenroll from a course |
| `GET` | `/api/courses/:id/roster` | Faculty, Admin | View enrolled student roster |
| `POST` | `/api/courses/:id/instructors` | Faculty, Admin | Assign co-instructor to course |
| `DELETE` | `/api/courses/:id/instructors/:facultyId` | Faculty, Admin | Remove co-instructor |

### 📑 Modules & Content (`/api/modules`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/modules` | Faculty, Admin | Create course module |
| `PUT` | `/api/modules/:id` | Faculty, Admin | Update module title/position/publish status |
| `DELETE` | `/api/modules/:id` | Faculty, Admin | Delete module |
| `POST` | `/api/modules/content` | Faculty, Admin | Create content item within a module |
| `PUT` | `/api/modules/content/:id` | Faculty, Admin | Update content item |
| `DELETE` | `/api/modules/content/:id` | Faculty, Admin | Delete content item |
| `POST` | `/api/modules/content/upload` | Faculty, Admin | Upload file asset to Cloudinary |

### 📝 Assignments & Submissions (`/api/assignments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/assignments/course/:courseId` | Authenticated | Get all assignments for a course |
| `GET` | `/api/assignments/:id` | Authenticated | Get assignment details by ID |
| `POST` | `/api/assignments` | Faculty, Admin | Create a new assignment |
| `PUT` | `/api/assignments/:id` | Faculty, Admin | Update assignment details |
| `DELETE` | `/api/assignments/:id` | Faculty, Admin | Delete assignment |
| `POST` | `/api/assignments/:id/submit` | Student | Submit assignment file |
| `GET` | `/api/assignments/:id/submissions` | Faculty, Admin | View all student submissions |
| `PUT` | `/api/assignments/submissions/:submissionId/grade` | Faculty, Admin | Assign marks and feedback |

### 📈 Progress Tracking (`/api/progress`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `PUT` | `/api/progress/content/:contentId` | Student | Toggle completion of a content item |
| `GET` | `/api/progress/course/:courseId` | Student | Get user's completion status & percentage |

### 🩺 Health Check
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Check server health and PostgreSQL connection |

---

## 🧪 Testing

### Backend Unit & Integration Tests

The backend includes test suites using **Jest** and **Supertest**:

```bash
cd backend
npm test
```

### Postman API Collections

Postman test suites are located in the [`postman/`](./postman) folder:
- `Assignment_and_Submission_API.postman_collection.json`
- `Course_and_Enrollment_API.postman_collection.json`
- `Module_and_Content_API.postman_collection.json`
- Automated regression collection runs under `postman/collections/`

Import these files into your Postman client to test and validate the endpoints against a running local or staging server.

---

## 🗄️ Database Management with Prisma

Useful Prisma commands inside the `backend/` directory:

```bash
# Generate the Prisma Client
npm run prisma:generate

# Apply migrations locally (development)
npm run prisma:migrate

# Apply migrations in production / CI
npm run prisma:deploy

# Launch Prisma Studio GUI database visualizer
npm run prisma:studio
```

---

## 🔒 Security Best Practices

- **Never commit `.env` files** containing production credentials, database passwords, or JWT secrets.
- In production, set strong, cryptographically secure values for `JWT_SECRET` and `ADMIN_SECRET_CODE`.
- Database access uses Supabase connection pooling for query load distribution, while migrations use the direct connection port.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).