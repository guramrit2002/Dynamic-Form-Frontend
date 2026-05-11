import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Footer           from './components/Footer'
import LandingPage      from './pages/LandingPage'
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
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forms" element={
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
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
