<!-- src\App.vue -->
<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue'; // Tambahkan watch jika perlu update title dari AppHeader
import AppSidebar from './components/atoms/AppSidebar.vue'; // Pastikan path benar
import AppHeader from './components/atoms/AppHeader.vue';   // Pastikan path benar
import Cookies from 'js-cookie'; // Untuk mengambil username jika disimpan di cookies

const route = useRoute();

// Mengambil username dari cookies jika ada, atau default
const username = ref(Cookies.get('username') || 'Pengguna'); 
// pageTitle akan diupdate oleh AppHeader atau halaman itu sendiri jika AppHeader tidak tampil
const pageTitle = ref('Dashboard'); 

// Tentukan halaman yang tidak menggunakan layout utama (sidebar & header)
const hideMainLayout = computed(() => {
  // Sembunyikan layout untuk path spesifik ATAU jika route.meta.isPrintPage adalah true
  return ['/login', '/register', '/'].includes(route.path) || route.meta.isPrintPage === true;
});

// Jika Anda ingin AppHeader mengupdate pageTitle di App.vue, Anda bisa menggunakan watch atau event
// Contoh sederhana:
watch(() => route.meta.title, (newTitle) => {
  if (newTitle && !hideMainLayout.value) { // Hanya update jika header tampil
    pageTitle.value = newTitle;
  } else if (!hideMainLayout.value) {
    pageTitle.value = 'Dashboard'; // Default jika tidak ada title di meta
  }
});

const logout = () => {
  console.log('Logging out...');
  // Hapus cookies dan localStorage
  Cookies.remove('token');
  Cookies.remove('role');
  Cookies.remove('username');
  localStorage.removeItem('DATA_ROLE');
  localStorage.removeItem('DATA_USERNAME');
  
  // Redirect ke halaman login
  // Pastikan 'useRouter' sudah diimpor jika Anda ingin menggunakan router.push di sini
  // atau emit event ke parent/gunakan store untuk navigasi global.
  // Untuk contoh ini, kita asumsikan navigasi akan ditangani oleh AppHeader atau guard.
  // Jika App.vue adalah root, Anda bisa import useRouter dan gunakan di sini.
  // import { useRouter } from 'vue-router';
  // const router = useRouter();
  // router.push('/login');
  window.location.href = '/login'; // Cara sederhana untuk redirect, akan reload halaman
};
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-poppins">
    <AppSidebar v-if="!hideMainLayout" />

    <div class="flex flex-col flex-1 overflow-hidden">
      <AppHeader 
        v-if="!hideMainLayout" 
        :username="username" 
        :pageTitle="$route.meta.title || pageTitle" 
        @logout="logout" 
      />

      <router-view />
    </div>
  </div>
</template>
<style>
  @import 'tailwindcss';
</style>
