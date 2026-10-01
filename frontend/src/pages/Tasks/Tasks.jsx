import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { tasksService, subjectsService } from '../../services/authService'
import { useApi } from '../../hooks/useApi'
import './Tasks.css'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', subjectId: '', dueDate: '' })
  const [error, setError] = useState('')
  const { loading, execute } = useApi()

  useEffect(() => {
    fetchTasks()
    fetchSubjects()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filterSubject, filterStatus])

  const fetchTasks = async () => {
    try {
      const data = await execute(tasksService.getTasks({}))
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
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
      if (filterStatus) params.completed = filterStatus

      const data = await execute(tasksService.getTasks(params))
      setTasks(data)
    } catch (err) {
      setError('Failed to filter tasks')
    }
  }

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        description: task.description,
        subjectId: task.subjectId?._id || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      })
    } else {
      setEditingTask(null)
      setFormData({ title: '', description: '', subjectId: '', dueDate: '' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title) {
      setError('Title is required')
      return
    }

    try {
      if (editingTask) {
        await execute(tasksService.updateTask(editingTask._id, formData))
      } else {
        await execute(tasksService.createTask(formData))
      }
      setShowModal(false)
      fetchTasks()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await execute(tasksService.deleteTask(id))
        fetchTasks()
      } catch (err) {
        setError('Failed to delete task')
      }
    }
  }

  const handleToggleCompletion = async (id) => {
    try {
      await execute(tasksService.toggleCompletion(id))
      fetchTasks()
    } catch (err) {
      setError('Failed to update task')
    }
  }

  return (
    <>
      <Navbar />
      <div className="tasks-container">
        <div className="tasks-header">
          <h1>My Tasks</h1>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            + New Task
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

          <div className="filter-group">
            <label>Filter by Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task._id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                <div className="task-main">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleCompletion(task._id)}
                    className="task-checkbox"
                  />
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-meta">
                      {task.subjectId && (
                        <span className="subject-badge" style={{ backgroundColor: task.subjectId.color }}>
                          {task.subjectId.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="due-date">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="btn-sm btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No tasks found. Create your first task!</p>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Task title"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Task description"
                    rows="4"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    disabled={loading}
                  >
                    <option value="">No subject</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                    {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'} Task
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
