<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Cookies from 'js-cookie'; // ← tambahkan ini
  // import { useConfigStore } from '../store';
  // import { useStore } from 'vuex';

  const username = ref('');
  const password = ref('');
  const errorMsg = ref('');
  const loading = ref(false);

  const router = useRouter();

  // const store = useStore();
  // const baseURL = store.getters.getBaseURL;

  // const configStore = useConfigStore();
  // console.log(configStore.baseURL);

  // console.log(baseURL); // Akses variabel global baseURL

  const login = async () => {
    loading.value = true;
    errorMsg.value = '';

    try {
      const response = await fetch('http://13.239.133.55:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success === true) {
        // ✅ Simpan token ke cookies (berlaku 1 hari)
        console.log(data.data.data); // Log token untuk debugging
        localStorage.setItem('DATA_ROLE', data.data.user.role); // Simpan data user ke localStorage
        localStorage.setItem('DATA_USERNAME', data.data.user.username); // Simpan data user ke localStorage
        Cookies.set('token', data.data.token, { expires: 1 });

        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        errorMsg.value = data.message || 'Login gagal. Cek kembali username dan password.';
      }
    } catch (error) {
      errorMsg.value = 'Terjadi kesalahan saat menghubungi server.';
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="flex h-screen w-screen font-poppins">
    <!-- Kiri: Branding -->
    <div class="flex flex-1 flex-col items-center justify-center bg-lime-50 p-8">
      <h1 class="text-3xl text-lime-600 font-bold text-center mb-6 leading-tight">
        Nick Nie<br />Hidroponik
      </h1>
      <!-- <img src="/assets/BG.png" alt="Hidroponik" class="w-full max-w-sm" /> -->
    </div>

    <!-- Kanan: Form -->
    <div class="flex flex-1 items-center justify-center bg-white p-8">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-lime-800 mb-6 text-center">Masuk ke akun Anda</h2>

        <form @submit.prevent="login" class="space-y-4">
          <div v-if="errorMsg" class="text-red-600 text-sm text-center">{{ errorMsg }}</div>

          <div>
            <input
              v-model="username"
              type="text"
              placeholder="Nama Pengguna"
              class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              placeholder="Kata Sandi"
              class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <div class="text-sm text-lime-600 text-right mt-1 cursor-pointer hover:underline">
              Lupa kata sandi?
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-full transition disabled:opacity-50"
          >
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <p class="text-sm text-center mt-4 text-gray-700">
          Belum punya akun?
          <span
            @click="router.push('/register')"
            class="text-lime-700 font-bold cursor-pointer hover:underline"
          >
            Daftar akun
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
