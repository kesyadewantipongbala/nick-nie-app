<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

import { login as loginService } from '../services/akunService.js'; // Pastikan path ini benar

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const router = useRouter();

const login = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    const responseData = await loginService({
      username: username.value,
      password: password.value,
    });

    if (responseData.success && responseData.data) {
  
      if (responseData.data.token && responseData.data.user) {
        console.log('Login successful, token:', responseData.data.token); // Log token untuk debugging
        localStorage.setItem('DATA_ROLE', responseData.data.user.role);
        localStorage.setItem('DATA_USERNAME', responseData.data.user.username);
        Cookies.set('token', responseData.data.token, { expires: 1 });
        Cookies.set('role', responseData.data.user.role, { expires: 1 });
        Cookies.set('username', responseData.data.user.username, { expires: 1 });

        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        // Jika struktur data tidak sesuai setelah login sukses
        console.error('Struktur data respons login tidak sesuai:', responseData);
        errorMsg.value = 'Login berhasil, tetapi terjadi masalah data. Hubungi administrator.';
      }
    } else {
      // Jika responseData.success adalah false atau tidak ada data
      errorMsg.value = responseData.message || 'Login gagal. Cek kembali username dan password.';
    }
  } catch (error) {
    console.error('Login error:', error);
    // Tangani error dari Axios (misalnya, error.response.data.message)
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = 'Terjadi kesalahan saat menghubungi server.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen w-screen font-poppins">
    <div class="flex flex-1 flex-col items-center justify-center bg-lime-50 p-8">
      <h1 class="text-3xl text-lime-600 font-bold text-center mb-6 leading-tight">
        Nick Nie<br />Hidroponik
      </h1>
      </div>

    <div class="flex flex-1 items-center justify-center bg-white p-8">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-lime-800 mb-6 text-center">Masuk ke akun Anda</h2>

        <form @submit.prevent="login" class="space-y-4">
          <div v-if="errorMsg" class="text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">{{ errorMsg }}</div>

          <div>
            <input
              v-model="username"
              type="text"
              placeholder="Nama Pengguna"
              required
              class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              placeholder="Kata Sandi"
              required
              class="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-full transition disabled:opacity-50"
          >
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>
