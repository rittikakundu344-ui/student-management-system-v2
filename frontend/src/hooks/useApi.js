// Custom hook for API calls
import { useState } from 'react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (apiCall) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, execute }
}

// Custom hook for form handling
export const useForm = (initialState, onSubmit) => {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (err) {
      // Error handling is done in the calling component
    }
  }

  const reset = () => {
    setFormData(initialState)
    setErrors({})
  }

  return {
    formData,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    reset,
    setFormData,
  }
}
