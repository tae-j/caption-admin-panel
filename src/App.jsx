import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import UsersPage from './pages/UsersPage'
import ImagesPage from './pages/ImagesPage'
import CaptionsPage from './pages/CaptionsPage'
import AuthCallback from './pages/AuthCallback'

function ProtectedRoute({ children }) {
  const { session, profile } = useAuth()
  if (session === undefined) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )
  if (!session || !profile) return <Navigate to="/" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const { session, profile } = useAuth()
  return (
    <Routes>
      <Route path="/" element={session && profile ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/images" element={<ProtectedRoute><ImagesPage /></ProtectedRoute>} />
      <Route path="/captions" element={<ProtectedRoute><CaptionsPage /></ProtectedRoute>} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}