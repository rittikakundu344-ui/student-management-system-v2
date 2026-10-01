import './DashboardCard.css'

export default function DashboardCard({ icon, label, value, color = '#007bff' }) {
  return (
    <div className="dashboard-card" style={{ borderLeftColor: color }}>
      <div className="card-icon" style={{ backgroundColor: `${color}20` }}>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
      <div className="card-content">
        <p className="card-label">{label}</p>
        <p className="card-value">{value}</p>
      </div>
    </div>
  )
}
