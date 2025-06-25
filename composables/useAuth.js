import { jwtDecode } from 'jwt-decode'

export const useAuth = () => {
  const user = useState('user', () => null)
  const error = ref(null)
  const config = useRuntimeConfig()

  const login = async (email, password) => {
    try {
      error.value = null

      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { email, password },
      })

      if (!res.token) {
        throw new Error('Invalid response from server')
      }

      const token = res.token
      localStorage.setItem('token', token)

      const decoded = jwtDecode(token)
      user.value = decoded

      return true
    } catch (e) {
      console.error('Login error:', e)

      if (e.response?.status === 401) {
        error.value = 'Invalid email or password'
      } else if (e.response?.status === 400) {
        error.value = 'Validation error: ' + (e.response._data?.message || 'Invalid input')
      } else if (e.message.includes('Network Error')) {
        error.value = 'Network error - please check your connection'
      } else {
        error.value = 'Login failed. Please try again later.'
      }

      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      error.value = null

      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { name, email, password },
      })

      if (!res || res.error) {
        throw new Error(res?.message || 'Invalid response from server')
      }

      return true
    } catch (e) {
      console.error('Register error:', e)

      if (e.response?.status === 409) {
        error.value = 'Email already exists'
      } else if (e.response?.status === 400) {
        error.value = 'Validation error: ' + (e.response._data?.message || 'Invalid input')
      } else if (e.response?.status === 422) {
        const messages = e.response._data?.errors
        if (messages && typeof messages === 'object') {
          error.value = Object.values(messages).flat().join(', ')
        } else {
          error.value = 'Validation error: Invalid input'
        }
      } else if (e.message.includes('Network Error')) {
        error.value = 'Network error - please check your connection'
      } else {
        error.value = 'Registration failed. Please try again later.'
      }

      return false
    }
  }

  const updateProfile = async (updatedData) => {
    try {
      error.value = null

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Unauthorized')
      }

      const res = await $fetch('/api/auth/update', {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updatedData,
      })

      // Update local user value
      const decoded = jwtDecode(token)
      user.value = {
        ...decoded,
        ...updatedData,
      }

      return true
    } catch (e) {
      console.error('Update error:', e)

      if (e.response?.status === 401) {
        error.value = 'Unauthorized: please login again'
        logout()
      } else if (e.response?.status === 404) {
        error.value = 'User not found'
      } else if (e.response?.status === 400) {
        error.value = e.response._data?.message || 'Invalid input'
      } else {
        error.value = 'Update failed. Please try again later.'
      }

      return false
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const decoded = jwtDecode(token)
      user.value = decoded
    } catch (e) {
      logout()
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  }
}
