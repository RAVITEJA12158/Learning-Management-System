import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import StudentDashboard from '../pages/Student/StudentDashboard';
import FacultyDashboard from '../pages/Faculty/FacultyDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import CourseCatalog from '../pages/CourseCatalog';
import Course from '../pages/Course';
import CourseForm from '../components/CourseForm';
import AssessmentsPage from '../pages/AssessmentsPage';
import GradesPage from '../pages/GradesPage';
import AttendancePage from '../pages/AttendancePage';
import NotificationsPage from '../pages/NotificationsPage';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Landing from '../pages/Landing';

function LandingLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F6FA] dark:bg-[#030712] transition-colors">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 dark:border-cyan-400/20 dark:border-t-cyan-400 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Loading CourseHub…</span>
      </div>
    </div>
  );
}

export function getRoleDashboardPath(user) {
  const role = (user?.role || 'student').toLowerCase();
  if (role === 'admin') return '/admin';
  if (role === 'faculty') return '/faculty';
  return '/student';
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const roleDashboard = getRoleDashboardPath(user);

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={roleDashboard} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={roleDashboard} replace /> : <Register />}
      />

      {/* Main Layout Routes */}
      <Route element={<DashboardLayout />}>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LandingLoader />}>
              <Landing />
            </Suspense>
          }
        />

        {/* Publicly Browseable Course Catalog */}
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<Course />} />

        {/* Role-Protected: Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Role-Protected: Faculty Dashboard & Course Management */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/courses/new"
          element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <CourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/courses/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <CourseForm />
            </ProtectedRoute>
          }
        />

        {/* Role-Protected: Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Authenticated Workspace Pages */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <AssessmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <ProtectedRoute>
              <GradesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
