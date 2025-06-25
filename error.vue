<script setup>
const props = defineProps({
  error: Object
})

useHead({ title: props.error.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' })

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
}

const refresh = () => {
  window.location.reload()
}

// Get error details
const getErrorIcon = () => {
  if (props.error.statusCode === 404) return '🔍'
  if (props.error.statusCode === 500) return '⚡'
  if (props.error.statusCode === 403) return '🔒'
  return '❌'
}

const getErrorTitle = () => {
  if (props.error.statusCode === 404) return 'Halaman Tidak Ditemukan'
  if (props.error.statusCode === 500) return 'Server Sedang Bermasalah'
  if (props.error.statusCode === 403) return 'Akses Ditolak'
  return 'Oops! Terjadi Kesalahan'
}

const getErrorDescription = () => {
  if (props.error.statusCode === 404) return 'Halaman yang Anda cari tidak dapat ditemukan. Mungkin telah dipindahkan atau dihapus.'
  if (props.error.statusCode === 500) return 'Kami sedang mengalami masalah teknis. Tim kami sudah bekerja untuk memperbaikinya.'
  if (props.error.statusCode === 403) return 'Anda tidak memiliki izin untuk mengakses halaman ini.'
  return props.error.message || 'Maaf, kami mengalami masalah saat memproses permintaan Anda.'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
      <div class="text-center">
        <!-- Icon Error -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ error.statusCode === 404 ? '404 - Halaman Tidak Ditemukan' : 'Oops! Terjadi Kesalahan' }}
        </h2>

        <p class="mt-4 text-gray-600">
          {{ error.message || 'Maaf, kami mengalami masalah saat memproses permintaan Anda.' }}
        </p>
      </div>

      <div class="mt-8">
        <button
          @click="goBack"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer"
        >
          Kembali ke Halaman Sebelumnya
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  50% {
    transform: translateY(-10px);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

/* Glass effect enhancement */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Button hover effects */
.group:hover .group-hover\:animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-8xl {
    font-size: 4rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
}

/* Enhanced glow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Gradient animation for buttons */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>
