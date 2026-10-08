import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import StudentDashboard from '../pages/Student/StudentDashboard'
import FacultyDashboard from '../pages/Faculty/FacultyDashboard'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import CourseCatalog from '../pages/CourseCatalog'
import CourseDetails from '../pages/Course'
import CourseForm from '../components/CourseForm'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Contact from '../pages/Contact'
import DashboardLayout from '../components/layout/DashboardLayout'

// Lazy loaded Landing Page
const Landing = lazy(() => import('../pages/Landing'))

function LandingLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F6FA] dark:bg-slate-900 transition-colors">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading CourseHub…</span>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Internal pages with shared layout */}
      {isAuthenticated ? (
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LandingLoader />}>
                <Landing />
              </Suspense>
            }
          />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/faculty/courses/new" element={<CourseForm />} />
          <Route path="/faculty/courses/:id/edit" element={<CourseForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      ) : (
        <>
          <Route
            path="/"
            element={
              <Suspense fallback={<LandingLoader />}>
                <Landing />
              </Suspense>
            }
          />
          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/faculty/courses/new" element={<CourseForm />} />
            <Route path="/faculty/courses/:id/edit" element={<CourseForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </>
      )}
    </Routes>
  )
}

export default AppRoutes
