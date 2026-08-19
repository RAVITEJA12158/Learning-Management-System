import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import UITest from '../pages/UITest'
import StudentDashboard from '../pages/Student/StudentDashboard'
import SupabaseTest from '../pages/SupabaseTest'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ui-test" element={<UITest />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
    </Routes>
  )
}

export default AppRoutes