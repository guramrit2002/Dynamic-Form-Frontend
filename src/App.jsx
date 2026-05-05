import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage        from './pages/LoginPage'
import FormsListPage    from './pages/FormsListPage'
import FormPage         from './pages/FormPage'
import SuccessPage      from './pages/SuccessPage'
import FormBuilderPage  from './pages/FormBuilderPage'
import PublicFormPage   from './pages/PublicFormPage'
import DashboardPage    from './pages/DashboardPage'
import ProfilePage      from './pages/ProfilePage'

function ProtectedRoute({ children }) {
  const { authenticated } = useAuth()
  return authenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute><FormsListPage /></ProtectedRoute>
          } />
          <Route path="/forms/:id" element={
            <ProtectedRoute><FormPage /></ProtectedRoute>
          } />
          <Route path="/forms/:id/success" element={
            <ProtectedRoute><SuccessPage /></ProtectedRoute>
          } />
          <Route path="/builder/new" element={
            <ProtectedRoute><FormBuilderPage /></ProtectedRoute>
          } />
          <Route path="/builder/:id" element={
            <ProtectedRoute><FormBuilderPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          {/* Public — no auth required */}
          <Route path="/share/:id"         element={<PublicFormPage />} />
          <Route path="/share/:id/success" element={<SuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
