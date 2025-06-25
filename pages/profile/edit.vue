<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <!-- === Skeleton Mode === -->
        <template v-if="loadingUser">
          <!-- Header Skeleton -->
          <div class="flex items-start justify-between mb-8 animate-pulse">
            <div class="flex-1 space-y-2">
              <div class="h-6 bg-gray-300 rounded w-2/3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div class="ml-4">
              <div class="h-16 w-16 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          <!-- Form Skeleton -->
          <div class="space-y-6 animate-pulse">
            <div>
              <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div class="h-10 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div class="h-10 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div class="h-10 bg-gray-300 rounded"></div>
            </div>
            <div class="flex space-x-4">
              <div class="h-10 w-1/2 bg-gray-300 rounded"></div>
              <div class="h-10 w-1/2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </template>

        <!-- === Normal Mode === -->
        <template v-else>
          <!-- Header -->
          <div class="flex items-start justify-between mb-8">
            <button 
              @click="goBack"
              class="flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back
            </button>

            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-900">Update Profile</h1>
              <p class="text-gray-600">Manage your account information</p>
            </div>

            <div class="relative ml-4">
              <div class="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-2xl font-bold text-indigo-600">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <!-- Success -->
          <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>

          <!-- Form -->
          <form class="space-y-6" @submit.prevent="submit">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">New Password (Optional)</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Leave blank to keep current password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div class="flex space-x-4">
              <button
                type="button"
                @click="goBack"
                class="w-1/2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Kembali
              </button>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-1/2 py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <span v-if="!isLoading">Update</span>
                <svg v-else class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const { user, updateProfile, error, isLoading, checkAuth } = useAuth()

const loadingUser = ref(true)
const successMessage = ref('')
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const goBack = () => {
  router.push('/profile')
}

const submit = async () => {
  error.value = null
  successMessage.value = ''

  const updatedData = {
    name: form.name,
    email: form.email,
    ...(form.password ? { password: form.password } : {})
  }

  const success = await updateProfile(updatedData)
  if (success) {
    successMessage.value = 'Profile updated successfully!'
    form.password = ''
  }
}

onMounted(async () => {
  loadingUser.value = true
  await checkAuth()
  form.name = user.value?.name || ''
  form.email = user.value?.email || ''
  loadingUser.value = false
})
</script>
