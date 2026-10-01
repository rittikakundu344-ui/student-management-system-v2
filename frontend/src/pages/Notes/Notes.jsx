import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import NoteCard from '../../components/NoteCard'
import { notesService, subjectsService } from '../../services/authService'
import { useApi } from '../../hooks/useApi'
import './Notes.css'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filterSubject, setFilterSubject] = useState('')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', subjectId: '' })
  const [error, setError] = useState('')
  const { loading, execute } = useApi()

  useEffect(() => {
    fetchNotes()
    fetchSubjects()
  }, [])

  const fetchNotes = async () => {
    try {
      const data = await execute(notesService.getNotes({}))
      setNotes(data)
    } catch (err) {
      setError('Failed to load notes')
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

  const applyFilters = async () => {
    try {
      const params = {}
      if (filterSubject) params.subjectId = filterSubject
      if (showPinnedOnly) params.pinned = 'true'
      if (showFavoritesOnly) params.favorite = 'true'

      const data = await execute(notesService.getNotes(params))
      setNotes(data)
    } catch (err) {
      setError('Failed to filter notes')
    }
  }

  useEffect(() => {
    applyFilters()
  }, [filterSubject, showPinnedOnly, showFavoritesOnly])

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingNote(note)
      setFormData({
        title: note.title,
        content: note.content,
        subjectId: note.subjectId._id,
      })
    } else {
      setEditingNote(null)
      setFormData({ title: '', content: '', subjectId: '' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.subjectId) {
      setError('Title and subject are required')
      return
    }

    try {
      if (editingNote) {
        await execute(notesService.updateNote(editingNote._id, formData))
      } else {
        await execute(notesService.createNote(formData))
      }
      setShowModal(false)
      fetchNotes()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save note')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await execute(notesService.deleteNote(id))
        fetchNotes()
      } catch (err) {
        setError('Failed to delete note')
      }
    }
  }

  const handlePin = async (id) => {
    try {
      await execute(notesService.togglePin(id))
      fetchNotes()
    } catch (err) {
      setError('Failed to toggle pin')
    }
  }

  const handleFavorite = async (id) => {
    try {
      await execute(notesService.toggleFavorite(id))
      fetchNotes()
    } catch (err) {
      setError('Failed to toggle favorite')
    }
  }

  return (
    <>
      <Navbar />
      <div className="notes-container">
        <div className="notes-header">
          <h1>My Notes</h1>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            + New Note
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="filters">
          <div className="filter-group">
            <label>Filter by Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={showPinnedOnly}
                onChange={(e) => setShowPinnedOnly(e.target.checked)}
              />
              Pinned Only
            </label>
          </div>

          <div className="filter-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              Favorites Only
            </label>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading notes...</p>
        ) : notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onPin={handlePin}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="no-data">No notes found. Create your first note!</p>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Note title"
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
                  <label>Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your note here..."
                    rows="6"
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
                    {loading ? 'Saving...' : editingNote ? 'Update' : 'Create'} Note
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
