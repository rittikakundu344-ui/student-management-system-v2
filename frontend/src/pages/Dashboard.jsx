import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import DashboardCard from '../components/DashboardCard'
import { dashboardService } from '../services/authService'
import { useApi } from '../hooks/useApi'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const { loading, execute } = useApi()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await execute(dashboardService.getStats())
      setStats(data)
    } catch (err) {
      setError('Failed to load dashboard stats')
      console.error(err)
    }
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Dashboard</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading">Loading statistics...</p>
        ) : stats ? (
          <div className="stats-grid">
            <DashboardCard
              icon="📝"
              label="Total Notes"
              value={stats.totalNotes}
              color="#007bff"
            />
            <DashboardCard
              icon="📚"
              label="Subjects"
              value={stats.totalSubjects}
              color="#28a745"
            />
            <DashboardCard
              icon="⏳"
              label="Pending Tasks"
              value={stats.pendingTasks}
              color="#ffc107"
            />
            <DashboardCard
              icon="✅"
              label="Completed Tasks"
              value={stats.completedTasks}
              color="#28a745"
            />
          </div>
        ) : null}

        <div className="dashboard-info">
          <h2>Welcome to Knowledge Hub!</h2>
          <p>
            Start by creating subjects, adding notes, and organizing your study materials.
            Use the navigation menu above to get started.
          </p>
        </div>
      </div>
    </>
  )
}
