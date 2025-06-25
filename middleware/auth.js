export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')

  if (!token.value) {
    if (process.client) {
      // Simpan path asal ke localStorage
      localStorage.setItem('redirectPath', to.fullPath)
    }

    // Redirect ke /login tanpa query string
    return navigateTo('/login')
  }
})
