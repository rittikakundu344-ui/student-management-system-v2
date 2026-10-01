import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { authService } from '../services/authService'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 Knowledge Hub
        </Link>

        <div className="navbar-middle">
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/dashboard/notes" className="nav-link">Notes</Link>
              <Link to="/dashboard/tasks" className="nav-link">Tasks</Link>
              <Link to="/dashboard/subjects" className="nav-link">Subjects</Link>
              <Link to="/dashboard/resources" className="nav-link">Resources</Link>
            </>
          )}
        </div>

        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <Link to="/profile" className="nav-link user-profile">
                👤 Profile
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
