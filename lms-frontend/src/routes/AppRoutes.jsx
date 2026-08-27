import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import UITest from '../pages/UITest'
import StudentDashboard from '../pages/Student/StudentDashboard'
import FacultyDashboard from '../pages/Faculty/FacultyDashboard'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import SupabaseTest from '../pages/SupabaseTest'
import AuthStateTest from '../pages/AuthStateTest'
import ProtectedRoute from '../components/layout/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ui-test" element={<UITest />} />
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      <Route path="/auth-state-test" element={<AuthStateTest />} />
    </Routes>
  )
}

export default AppRoutes
