<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const confirmPassword = ref('');

  const register = () => {
    if (password.value !== confirmPassword.value) {
      alert('Kata sandi tidak cocok!');
      return;
    }

    console.log('Registrasi dengan:', username.value, password.value);
    // Tambahkan logika registrasi ke backend di sini
  };
</script>

<template>
  <div class="flex h-screen w-screen font-sans">
    <!-- Kiri: Background Image -->
    <div
      class="w-1/2 hidden md:flex flex-col items-center justify-center bg-cover bg-center"
      style="background-image: url('/assets/BG.png')"
    >
      <div class="bg-white/80 p-6 rounded-xl text-center">
        <h1 class="text-3xl font-bold text-lime-600 mb-2">Nick Nie</h1>
        <h2 class="text-xl text-gray-700">Hidroponik</h2>
      </div>
    </div>

    <!-- Kanan: Form Registrasi -->
    <div class="w-full md:w-1/2 flex items-center justify-center px-6">
      <div class="w-full max-w-sm bg-white p-8 rounded-3xl shadow-lg space-y-6">
        <h2 class="text-2xl font-bold text-lime-700 text-center">Buat Akun Baru</h2>

        <form @submit.prevent="register" class="space-y-4">
          <input
            v-model="username"
            type="text"
            placeholder="Nama Pengguna"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Kata Sandi"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
          />

          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Konfirmasi Kata Sandi"
            class="w-full px-5 py-3 border border-lime-400 rounded-full text-lime-700 placeholder-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
          />

          <button
            type="submit"
            class="w-full py-3 font-semibold rounded-full bg-lime-500 text-white hover:bg-lime-600 active:bg-lime-700 transition-colors"
          >
            Daftar
          </button>
        </form>

        <p class="text-center text-sm text-gray-500">
          Sudah punya akun?
          <span
            @click="router.push('/login')"
            class="text-lime-700 font-bold cursor-pointer hover:underline"
          >
            Masuk di sini
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
