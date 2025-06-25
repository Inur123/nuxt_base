export default defineNuxtRouteMiddleware((to) => {
  // Skip on server side
  if (process.server) return
  
  const { user, checkAuth } = useAuth()
  
  // Perform fresh auth check
  const isAuthenticated = checkAuth()
  
  if (!isAuthenticated) {
    // Add redirect path for after login
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})