<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <!-- Profile Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p class="text-gray-600">Manage your account information</p>
          </div>
          <div class="relative">
            <div class="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-2xl font-bold text-indigo-600">{{ user?.name?.charAt(0) }}</span>
            </div>
            <span class="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></span>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="$route.query.updated" class="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">
                Profile updated successfully!
              </p>
            </div>
          </div>
        </div>

        <!-- Profile Information -->
        <div class="space-y-6">
          <div>
            <h2 class="text-sm font-medium text-gray-500 mb-1">Full Name</h2>
            <p class="text-lg font-medium text-gray-900">{{ user?.name }}</p>
          </div>

          <div>
            <h2 class="text-sm font-medium text-gray-500 mb-1">Email Address</h2>
            <p class="text-lg font-medium text-gray-900">{{ user?.email }}</p>
          </div>

          <div>
            <h2 class="text-sm font-medium text-gray-500 mb-1">Account Status</h2>
            <p class="text-lg font-medium text-gray-900">Verified</p>
          </div>

          <div>
            <h2 class="text-sm font-medium text-gray-500 mb-1">Member Since</h2>
            <p class="text-lg font-medium text-gray-900">{{ new Date(user?.iat * 1000).toLocaleDateString() }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-10 pt-6 border-t border-gray-200 flex flex-col space-y-4">
          <NuxtLink
            to="/profile/edit"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </NuxtLink>
          
          <button
            @click="logoutAndRedirect"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
})

const router = useRouter()
const { user, logout } = useAuth()

const logoutAndRedirect = () => {
  logout()
  router.push('/login')
}

// Watch for profile update success
watch(() => router.currentRoute.value.query, (newQuery) => {
  if (newQuery.updated) {
    // Force refresh user data
    user.value = { ...user.value }
  }
})

useHead({
  title: 'Profile'
})
</script>