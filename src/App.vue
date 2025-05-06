<script setup>
  import { useRoute } from 'vue-router';
  import { ref, computed } from 'vue';
  import AppSidebar from './components/atoms/AppSidebar.vue';
  import AppHeader from './components/atoms/AppHeader.vue';

  const route = useRoute();
  const username = ref('John Doe');
  const pageTitle = ref('Dashboard');

  // Tentukan halaman tanpa layout
  const hideLayout = computed(() => {
    return ['/login', '/register', '/'].includes(route.path);
  });

  const logout = () => {
    console.log('Logging out...');
    // Tambahkan logic clear auth jika perlu
  };
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar hanya tampil jika bukan halaman login/register -->
    <AppSidebar v-if="!hideLayout" />

    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Header juga tampil jika bukan halaman login/register -->
      <AppHeader v-if="!hideLayout" :username="username" :pageTitle="pageTitle" @logout="logout" />

      <!-- Konten halaman -->
      <router-view />
    </div>
  </div>
</template>

<style>
  @import 'tailwindcss';
</style>
