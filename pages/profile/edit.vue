<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <!-- Header with Back Button -->
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
          
          <div class="text-right">
            <h1 class="text-2xl font-bold text-gray-900">Update Profile</h1>
            <p class="text-gray-600">Manage your account information</p>
          </div>
          
          <div class="relative ml-4">
            <div class="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-2xl font-bold text-indigo-600">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ error }}
              </p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">
                {{ successMessage }}
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="submit">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">New Password (Optional)</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>

          <div class="flex space-x-4">
            <button
              type="button"
              @click="goBack"
              class="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Kembali
            </button>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="!isLoading">Update</span>
              <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </form>
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

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const successMessage = ref('')

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

// sinkronisasi setelah mount
onMounted(async () => {
  await checkAuth()
  form.name = user.value?.name || ''
  form.email = user.value?.email || ''
})
</script>
