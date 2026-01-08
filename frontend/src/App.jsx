import { Routes, Route, Link } from 'react-router-dom'
import { useContext } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/ProtectedRoute'
import Appointments from './pages/Appointments'
import Prescriptions from './pages/Prescriptions'
import Profile from './pages/Profile'
import Users from './pages/Users'
import Clinics from './pages/Clinics'
import ProfessionalDashboard from './components/ProfessionalDashboard'
import { AuthContext } from './context/AuthContext'

export default function App() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <div>
      <header className="py-3 border-bottom">
        <div className="container d-flex align-items-center justify-content-between">
          <h1 className="h4 m-0">MediCare</h1>
          <nav className="d-flex gap-3 align-items-center">
            <Link className="nav-link" to="/">Accueil</Link>
            <Link className="nav-link" to="/chat">Chat</Link>
            <Link className="nav-link" to="/appointments">Rendez-vous</Link>
            <Link className="nav-link" to="/prescriptions">Ordonnances</Link>
            {(user?.role || '').toLowerCase() === 'admin' && <Link className="nav-link" to="/users">Utilisateurs</Link>}
            {(user?.role || '').toLowerCase() === 'admin' && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
            <Link className="nav-link" to="/profile">Profil</Link>
            {(user?.role || '').toLowerCase() === 'admin' && <Link className="nav-link" to="/clinics">Cliniques</Link>}
            {!isAuthenticated ? (
              <Link className="nav-link" to="/login">Connexion</Link>
            ) : (
              <>
                <span className="text-muted small">{user?.email}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={logout}>Se déconnecter</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/clinics" element={<ProtectedRoute><Clinics /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  )
}
