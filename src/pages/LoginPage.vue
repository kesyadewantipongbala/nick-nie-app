<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const username = ref('')
const password = ref('')

const login = () => {
  console.log('Login dengan:', username.value, password.value)
  router.push('/dashboard')
}
</script>

<template>
  <div class="relative w-screen h-screen bg-cover bg-center" style="background-image: url('/assets/BG.png')">
    <div class="absolute inset-0 flex items-center justify-end p-6">
      <div class="w-full max-w-sm rounded-3xl shadow-lg bg-white p-8 sm:p-10 space-y-6">
        <h2 class="text-2xl font-bold text-lime-700 text-center">
          Masuk ke akun Anda
        </h2>

        <form @submit.prevent="login" class="space-y-4">
          <input
            v-model="username"
            type="text"
            placeholder="Nama Pengguna"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-400 focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-400/50"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Kata Sandi"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-400 focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-400/50"
          />

          <button
            type="submit"
            class="w-full py-3 font-semibold rounded-full bg-lime-500 text-white hover:bg-lime-600 active:bg-lime-700 transition-colors"
          >
            Masuk
          </button>
        </form>

        <p class="text-center text-sm text-gray-500">
          Belum punya akun?
          <span class="text-lime-700 font-bold cursor-pointer hover:underline">Daftar akun</span>
        </p>
      </div>
    </div>
  </div>
</template>
