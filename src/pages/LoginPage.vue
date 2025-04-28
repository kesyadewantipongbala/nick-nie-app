<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter();

const username = ref('')
const password = ref('')

const login = () => {
  console.log('Login dengan:', username.value, password.value)
  // Tambahkan logika autentikasi ke backend di sini
  router.push('/dashboard')

}
</script>

<template>
  <!-- Fullscreen dengan background image -->
  <div
    class="w-screen h-screen bg-cover bg-center"
    style="background-image: url('/assets/BG.png')"
  >
    <!-- Lapisan transparan di atas background agar lebih soft -->
    <div class="w-full h-full bg-white/70 dark:bg-neutral-900/70">
      <!-- Layout grid 2 kolom -->
      <div class="grid grid-cols-1 md:grid-cols-2 h-full">
        <!-- Kolom kiri kosong, hanya gambar -->
        <div class="hidden md:block"></div>

        <!-- Kolom kanan: Form -->
        <div class="flex items-center justify-center px-6">
          <div
            class="w-full max-w-md rounded-3xl shadow-2xl bg-white/90 dark:bg-neutral-800/90 p-10 space-y-6 backdrop-blur-md"
          >
            <h2 class="text-3xl font-extrabold text-lime-700 dark:text-lime-400 text-center">
              Selamat Datang
            </h2>
            <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>

            <form @submit.prevent="login" class="space-y-4">
              <input
                v-model="username"
                type="text"
                placeholder="Nama Pengguna"
                class="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-300 transition"
              />

              <input
                v-model="password"
                type="password"
                placeholder="Kata Sandi"
                class="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-300 transition"
              />

              <button
                type="submit"
                class="w-full py-3 font-semibold rounded-xl bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white transition-colors"
              >
                Masuk
              </button>
            </form>

            <p class="text-center text-sm text-gray-500 dark:text-gray-400">
              Belum punya akun?
              <span class="text-lime-600 hover:underline font-bold cursor-pointer">
                Daftar akun
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
