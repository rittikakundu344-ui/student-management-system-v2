import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { ThemeProvider } from '../../context/ThemeContext'

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

describe('Navbar Component', () => {
  it('should render navbar with brand name', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText('📚 Knowledge Hub')).toBeInTheDocument()
  })

  it('should render theme toggle button', () => {
    renderWithProviders(<Navbar />)
    const themeToggle = screen.getByRole('button', { name: /☀️|🌙/ })
    expect(themeToggle).toBeInTheDocument()
  })

  it('should render login and register links when not authenticated', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('should toggle theme when button is clicked', () => {
    renderWithProviders(<Navbar />)
    const themeToggle = screen.getByRole('button', { name: /☀️|🌙/ })
    
    fireEvent.click(themeToggle)
    
    // Check if theme class was toggled (body should have dark-mode class)
    expect(document.body.classList.contains('dark-mode')).toBe(true)
  })
})
