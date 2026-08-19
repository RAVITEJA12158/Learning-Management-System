import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import UITest from '../pages/UITest'
import StudentDashboard from '../pages/Student/StudentDashboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ui-test" element={<UITest />} />
      <Route path="/student" element={<StudentDashboard />} />
    </Routes>
  )
}

export default AppRoutes