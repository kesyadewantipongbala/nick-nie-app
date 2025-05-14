<script setup>
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Cookies from 'js-cookie';

  const props = defineProps({
    pageTitle: String,
    username: String,
  });

  const showDropdown = ref(false);
  const toggleDropdown = () => (showDropdown.value = !showDropdown.value);

  const route = useRoute();
  const router = useRouter();

  const username = ref(localStorage.getItem('DATA_USERNAME') || ''); // Ambil username dari localStorage

  const breadcrumb = computed(() => {
    return route.meta.title || 'Tidak Diketahui';
  });

  // ✅ Fungsi Logout: hapus token dan redirect
  const logout = () => {
    Cookies.remove('token'); // Hapus token dari cookies
    router.push('/login'); // Redirect ke login
  };
</script>

<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 relative min-h-[80px]"
  >
    <div class="flex items-center space-x-2 text-gray-600">
      <span>Home</span>
      <span>/</span>
      <span class="font-semibold text-gray-900">{{ breadcrumb }}</span>
    </div>

    <div class="relative">
      <div class="flex items-center space-x-4 cursor-pointer" @click="toggleDropdown">
        <span class="text-gray-700">{{ username }}</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="Avatar"
          class="w-10 h-10 rounded-full object-cover border-2 border-lime-400"
        />
      </div>

      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50"
      >
        <button
          @click="logout"
          class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-lime-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
