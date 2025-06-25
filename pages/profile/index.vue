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
              <span class="text-2xl font-bold text-indigo-600">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="$route.query.updated" class="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
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
            <p class="text-lg font-medium text-gray-900">{{ user?.name || 'N/A' }}</p>
          </div>

          <div>
            <h2 class="text-sm font-medium text-gray-500 mb-1">Email Address</h2>
            <p class="text-lg font-medium text-gray-900">{{ user?.email || 'N/A' }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-10 pt-6 border-t border-gray-200 flex flex-col space-y-4">
          <NuxtLink to="/profile/edit"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit Profile
          </NuxtLink>

          <button @click="logout"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="isLoading">
            <span v-if="!isLoading">Sign out</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { user, logout, isLoading, checkAuth } = useAuth()

watch(() => useRoute().query, (query) => {
  if (query.updated) {
    checkAuth()
  }
})

// Tambahan: fetch ulang profil saat user kosong
onMounted(() => {
  if (!user.value?.name || !user.value?.email) {
    checkAuth()
  }
})

useHead({
  title: 'Profile'
})
</script>
