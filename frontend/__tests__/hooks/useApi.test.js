import { renderHook, act } from '@testing-library/react'
import { useApi } from '../../src/hooks/useApi'

describe('useApi Hook', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useApi())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.execute).toBe('function')
  })

  it('should handle successful API call', async () => {
    const { result } = renderHook(() => useApi())

    const mockApiCall = Promise.resolve({ data: { id: 1, name: 'Test' } })

    let response
    await act(async () => {
      response = await result.current.execute(mockApiCall)
    })

    expect(response).toEqual({ id: 1, name: 'Test' })
    expect(result.current.error).toBeNull()
  })

  it('should handle API error', async () => {
    const { result } = renderHook(() => useApi())

    const mockError = new Error('API Error')
    mockError.response = { data: { error: 'Request failed' } }
    const mockApiCall = Promise.reject(mockError)

    let error
    await act(async () => {
      try {
        await result.current.execute(mockApiCall)
      } catch (e) {
        error = e
      }
    })

    expect(error).toBeDefined()
    expect(result.current.error).toBe('Request failed')
  })
})
