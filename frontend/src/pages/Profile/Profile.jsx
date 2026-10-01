import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { profileService, authService } from '../../services/authService'
import { useApi } from '../../hooks/useApi'
import './Profile.css'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({ fullName: '', bio: '' })
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const { loading, execute } = useApi()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await execute(profileService.getProfile())
      setProfile(data)
      setFormData({ fullName: data.fullName, bio: data.bio })
    } catch (err) {
      setError('Failed to load profile')
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const data = await execute(profileService.updateProfile(formData))
      setProfile(data.user)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All password fields are required')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    try {
      await execute(authService.changePassword(passwordForm.oldPassword, passwordForm.newPassword))
      setSuccess('Password changed successfully!')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password')
    }
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1>Profile Settings</h1>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {activeTab === 'profile' && profile && (
          <div className="profile-card">
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={profile.username} disabled className="input-disabled" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profile.email} disabled className="input-disabled" />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows="4"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="profile-card">
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
