import { Routes, Route } from 'react-router-dom'

import Login from '../pages/Auth/Login'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import FacultyDashboard from '../pages/Faculty/FacultyDashboard'
import StudentDashboard from '../pages/Student/StudentDashboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/faculty"
        element={<FacultyDashboard />}
      />

      <Route
        path="/student"
        element={<StudentDashboard />}
      />
    </Routes>
  )
}

export default AppRoutes