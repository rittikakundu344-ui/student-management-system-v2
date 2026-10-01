import { render, screen } from '@testing-library/react'
import DashboardCard from '../../src/components/DashboardCard'

describe('DashboardCard Component', () => {
  it('should render card with label and value', () => {
    render(
      <DashboardCard
        icon="📝"
        label="Total Notes"
        value={42}
        color="#007bff"
      />
    )

    expect(screen.getByText('Total Notes')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('📝')).toBeInTheDocument()
  })

  it('should apply custom color', () => {
    const { container } = render(
      <DashboardCard
        icon="📚"
        label="Subjects"
        value={5}
        color="#28a745"
      />
    )

    const card = container.querySelector('.dashboard-card')
    expect(card).toHaveStyle('border-left-color: #28a745')
  })

  it('should display zero value correctly', () => {
    render(
      <DashboardCard
        icon="✅"
        label="Completed Tasks"
        value={0}
        color="#ffc107"
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
