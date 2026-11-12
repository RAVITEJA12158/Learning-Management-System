import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import './styles/global.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const application = (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{application}</GoogleOAuthProvider>
    ) : (
      application
    )}
  </StrictMode>,
)
