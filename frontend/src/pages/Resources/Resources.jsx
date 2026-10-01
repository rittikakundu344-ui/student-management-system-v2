import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { resourcesService, subjectsService } from '../../services/authService'
import { useApi } from '../../hooks/useApi'
import './Resources.css'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filterSubject, setFilterSubject] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', url: '', subjectId: '', resourceType: 'link' })
  const [error, setError] = useState('')
  const { loading, execute } = useApi()

  useEffect(() => {
    fetchResources()
    fetchSubjects()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [filterSubject])

  const fetchResources = async () => {
    try {
      const data = await execute(resourcesService.getResources({}))
      setResources(data)
    } catch (err) {
      setError('Failed to load resources')
    }
  }

  const fetchSubjects = async () => {
    try {
      const data = await execute(subjectsService.getSubjects())
      setSubjects(data)
    } catch (err) {
      console.error('Failed to load subjects')
    }
  }

  const applyFilter = async () => {
    try {
      const params = filterSubject ? { subjectId: filterSubject } : {}
      const data = await execute(resourcesService.getResources(params))
      setResources(data)
    } catch (err) {
      setError('Failed to filter resources')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.url || !formData.subjectId) {
      setError('Title, URL, and subject are required')
      return
    }

    try {
      await execute(resourcesService.addResource(formData))
      setShowModal(false)
      setFormData({ title: '', url: '', subjectId: '', resourceType: 'link' })
      fetchResources()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add resource')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await execute(resourcesService.deleteResource(id))
        fetchResources()
      } catch (err) {
        setError('Failed to delete resource')
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="resources-container">
        <div className="resources-header">
          <h1>Study Resources</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Add Resource
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="filters">
          <div className="filter-group">
            <label>Filter by Subject</label>
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading resources...</p>
        ) : resources.length > 0 ? (
          <div className="resources-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(resource => (
                  <tr key={resource._id}>
                    <td>{resource.title}</td>
                    <td>
                      <span
                        className="subject-badge"
                        style={{ backgroundColor: resource.subjectId?.color }}
                      >
                        {resource.subjectId?.name}
                      </span>
                    </td>
                    <td>{resource.resourceType}</td>
                    <td>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        Open Link 🔗
                      </a>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        className="btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No resources yet. Add your first resource!</p>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Resource</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Resource title"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    disabled={loading}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                    disabled={loading}
                  >
                    <option value="link">Link</option>
                    <option value="pdf">PDF</option>
                  </select>
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
                    {loading ? 'Adding...' : 'Add Resource'}
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
