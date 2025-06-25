import { jwtDecode } from 'jwt-decode'

export const useAuth = () => {
  const token = useCookie('token') // Gunakan cookie, bukan localStorage
  const user = useState('user', () => {
    if (process.client && token.value) {
      try {
        return jwtDecode(token.value)
      } catch (e) {
        console.error('Invalid token:', e)
        token.value = null
      }
    }
    return null
  })

  const error = ref(null)
  const isLoading = ref(false)
  const config = useRuntimeConfig()

  const login = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null

      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { email, password },
      })

      if (!res?.token) {
        throw new Error('Invalid response from server')
      }

      token.value = res.token
      user.value = jwtDecode(res.token)
      return true
    } catch (e) {
      handleAuthError(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name, email, password) => {
    try {
      isLoading.value = true
      error.value = null

      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: { name, email, password },
      })

      if (!res || res.error) {
        throw new Error(res?.message || 'Registration failed')
      }

      return true
    } catch (e) {
      handleAuthError(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updatedData) => {
    try {
      isLoading.value = true
      error.value = null

      if (!token.value) throw new Error('Unauthorized')

      const res = await $fetch('/api/auth/update', {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: { Authorization: `Bearer ${token.value}` },
        body: updatedData,
      })

      const newToken = res?.token || token.value
      if (res?.token) {
        token.value = newToken
      }

      user.value = {
        ...user.value,
        ...updatedData,
        ...(res?.token ? jwtDecode(newToken) : {})
      }

      return true
    } catch (e) {
      handleAuthError(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          baseURL: config.public.apiBaseUrl,
          headers: { Authorization: `Bearer ${token.value}` },
        })
      }
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      user.value = null
      token.value = null
      navigateTo('/login')
    }
  }

  const checkAuth = async () => {
    if (!token.value) {
      user.value = null
      return false
    }

    try {
      await fetchProfile()
      return true
    } catch {
      logout()
      return false
    }
  }

  const fetchProfile = async () => {
    try {
      if (!token.value) {
        user.value = null
        return
      }

      const res = await $fetch('/api/auth/profile', {
        method: 'GET',
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      user.value = res.user // Ambil user dari response
    } catch (e) {
      console.error('Failed to fetch profile:', e)
      user.value = null
    }
  }

  const handleAuthError = (e) => {
    if (e.response?.status === 401) {
      error.value = 'Invalid email or password'
    } else if (e.response?.status === 400) {
      error.value = e.response._data?.message || 'Invalid input'
    } else if (e.message.includes('Network Error')) {
      error.value = 'Network error - please check your connection'
    } else {
      error.value = e.message || 'Operation failed. Please try again later.'
    }
  }

  if (process.client) {
    checkAuth()
  }

  return {
    user,
    error,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  }
}
