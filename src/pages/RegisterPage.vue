<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const loading = ref(false);

  const register = async () => {
    error.value = '';

    if (!username.value || !password.value || !confirmPassword.value) {
      error.value = 'Semua kolom harus diisi.';
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Kata sandi tidak cocok!';
      return;
    }

    try {
      loading.value = true;

      const response = await fetch(`{{ import.meta.env.VITE_API_URL }}/api/user/create}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          role: 'Owner',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal.');
      }

      // Jika berhasil, redirect ke login
      router.push('/login');
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="flex h-screen w-screen font-poppins">
    <!-- Kiri: Gambar & Branding -->
    <div class="flex-1 hidden md:flex flex-col items-center justify-center bg-lime-50 p-8">
      <h1 class="text-3xl text-lime-600 font-bold text-center mb-6 leading-tight">
        Nick Nie<br />Hidroponik
      </h1>
      <!-- <img src="/assets/BG.png" alt="Hidroponik" class="w-full max-w-sm" /> -->
    </div>

    <!-- Kanan: Form -->
    <div class="flex flex-1 items-center justify-center bg-white p-8">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-lime-800 mb-6 text-center">Buat Akun Baru</h2>

        <form @submit.prevent="register" class="space-y-4">
          <div v-if="error" class="text-sm text-red-600 text-center">{{ error }}</div>

          <input
            v-model="username"
            type="text"
            placeholder="Nama Pengguna"
            class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 text-gray-700"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Kata Sandi"
            class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 text-gray-700"
          />

          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Konfirmasi Kata Sandi"
            class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 text-gray-700"
          />

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-full transition disabled:opacity-50"
          >
            {{ loading ? 'Mendaftarkan...' : 'Daftar' }}
          </button>
        </form>

        <p class="text-sm text-center mt-4 text-gray-700">
          Sudah punya akun?
          <span
            @click="router.push('/login')"
            class="font-semibold text-lime-600 cursor-pointer hover:underline"
          >
            Masuk di sini
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
