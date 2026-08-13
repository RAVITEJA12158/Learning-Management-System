import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import UITest from '../pages/UITest'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/ui-test" element={<UITest />} />
    </Routes>
  )
}

export default AppRoutes