import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import UITest from '../pages/UITest'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ui-test" element={<UITest />} />
    </Routes>
  )
}

export default AppRoutes