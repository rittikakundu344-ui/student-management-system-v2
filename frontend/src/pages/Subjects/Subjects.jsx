import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { subjectsService } from '../../services/authService'
import { useApi } from '../../hooks/useApi'
import './Subjects.css'

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({ name: '', color: '#007bff', description: '' })
  const [error, setError] = useState('')
  const { loading, execute } = useApi()

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const data = await execute(subjectsService.getSubjects())
      setSubjects(data)
    } catch (err) {
      setError('Failed to load subjects')
    }
  }

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject)
      setFormData({ name: subject.name, color: subject.color, description: subject.description })
    } else {
      setEditingSubject(null)
      setFormData({ name: '', color: '#007bff', description: '' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name) {
      setError('Subject name is required')
      return
    }

    try {
      if (editingSubject) {
        await execute(subjectsService.updateSubject(editingSubject._id, formData))
      } else {
        await execute(subjectsService.createSubject(formData))
      }
      setShowModal(false)
      fetchSubjects()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save subject')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will delete all related notes and tasks!')) {
      try {
        await execute(subjectsService.deleteSubject(id))
        fetchSubjects()
      } catch (err) {
        setError('Failed to delete subject')
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="subjects-container">
        <div className="subjects-header">
          <h1>My Subjects</h1>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            + New Subject
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading">Loading subjects...</p>
        ) : subjects.length > 0 ? (
          <div className="subjects-grid">
            {subjects.map(subject => (
              <div key={subject._id} className="subject-card" style={{ borderLeftColor: subject.color }}>
                <div className="subject-header">
                  <h3 style={{ color: subject.color }}>{subject.name}</h3>
                  <div style={{ width: '30px', height: '30px', backgroundColor: subject.color, borderRadius: '4px' }} />
                </div>
                {subject.description && <p>{subject.description}</p>}
                <div className="subject-actions">
                  <button onClick={() => handleOpenModal(subject)} className="btn-sm btn-primary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(subject._id)} className="btn-sm btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No subjects yet. Create your first subject!</p>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Subject Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mathematics"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Subject description"
                    rows="4"
                    disabled={loading}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingSubject ? 'Update' : 'Create'} Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
