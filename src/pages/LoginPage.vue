<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const login = () => {
  console.log('Login dengan:', username.value, password.value)
  // Tambahkan logika autentikasi ke backend di sini
}
</script>

<template>
  <!-- Grid 2‑kolom: kiri gambar, kanan form -->
  <div class="grid md:grid-cols-2 w-screen h-screen">
    <!-- Kolom Kiri: background image -->
    <div
      class="hidden md:block bg-cover bg-center"
      :style="{ backgroundImage: `url('/assets/BG.png')` }"
    />

    <!-- Kolom Kanan: form -->
    <div class="flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 px-4">
      <div
        class="w-full max-w-sm rounded-3xl shadow-lg bg-white dark:bg-neutral-800 p-8 sm:p-10 space-y-6"
      >
        <h2 class="text-2xl font-bold text-lime-700 dark:text-lime-400 text-center">
          Masuk ke akun Anda
        </h2>

        <form @submit.prevent="login" class="space-y-4">
          <input
            v-model="username"
            type="text"
            placeholder="Nama Pengguna"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-300 focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-500/50"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Kata Sandi"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-300 focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-500/50"
          />

          <button
            type="submit"
            class="w-full py-3 font-semibold rounded-full bg-lime-500 text-white hover:bg-lime-600 active:bg-lime-700 transition-colors"
          >
            Masuk
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          Belum punya akun?
          <span class="text-lime-700 dark:text-lime-400 font-bold cursor-pointer hover:underline">Daftar akun</span>
        </p>
      </div>
    </div>
  </div>
</template>

<!-- Semua styling via Tailwind -->
