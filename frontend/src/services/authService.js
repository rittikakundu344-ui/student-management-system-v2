import api from './api.js'

export const authService = {
  register: (username, email, password, fullName) =>
    api.post('/auth/register', { username, email, password, fullName }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  changePassword: (oldPassword, newPassword) =>
    api.post('/auth/change-password', { oldPassword, newPassword }),
}

export const notesService = {
  getNotes: (params) =>
    api.get('/notes', { params }),

  createNote: (data) =>
    api.post('/notes', data),

  updateNote: (id, data) =>
    api.put(`/notes/${id}`, data),

  deleteNote: (id) =>
    api.delete(`/notes/${id}`),

  searchNotes: (query) =>
    api.get('/notes/search', { params: { q: query } }),

  togglePin: (id) =>
    api.patch(`/notes/${id}/pin`),

  toggleFavorite: (id) =>
    api.patch(`/notes/${id}/favorite`),
}

export const tasksService = {
  getTasks: (params) =>
    api.get('/tasks', { params }),

  createTask: (data) =>
    api.post('/tasks', data),

  updateTask: (id, data) =>
    api.put(`/tasks/${id}`, data),

  deleteTask: (id) =>
    api.delete(`/tasks/${id}`),

  toggleCompletion: (id) =>
    api.patch(`/tasks/${id}/toggle`),
}

export const subjectsService = {
  getSubjects: () =>
    api.get('/subjects'),

  createSubject: (data) =>
    api.post('/subjects', data),

  updateSubject: (id, data) =>
    api.put(`/subjects/${id}`, data),

  deleteSubject: (id) =>
    api.delete(`/subjects/${id}`),
}

export const resourcesService = {
  getResources: (params) =>
    api.get('/resources', { params }),

  addResource: (data) =>
    api.post('/resources', data),

  deleteResource: (id) =>
    api.delete(`/resources/${id}`),
}

export const dashboardService = {
  getStats: () =>
    api.get('/dashboard/stats'),
}

export const profileService = {
  getProfile: () =>
    api.get('/profile'),

  updateProfile: (data) =>
    api.put('/profile', data),
}
