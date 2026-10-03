import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import StudentDashboard from '../pages/Student/StudentDashboard'
import FacultyDashboard from '../pages/Faculty/FacultyDashboard'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import CourseCatalog from '../pages/CourseCatalog'
import CourseDetails from '../pages/CourseDetails'
import CourseForm from '../components/CourseForm'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Contact from '../pages/Contact'
import DashboardLayout from '../components/layout/DashboardLayout'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Internal pages with shared layout */}
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
    </Routes>
  )
}

export default AppRoutes
