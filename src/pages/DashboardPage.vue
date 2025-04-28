<script setup>
import { ref } from 'vue'

const username = ref('John Doe')
const pageTitle = ref('Dashboard')
const showDropdown = ref(false)

const logout = () => {
  console.log('Logging out...')
  // Tambahkan logika logout disini, misal hapus token, redirect ke login
}
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-neutral-900">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700">
      <div class="h-20 flex items-center justify-center border-b border-gray-200 dark:border-neutral-700">
        <h1 class="text-2xl font-bold text-lime-600 dark:text-lime-400">MyAdmin</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a href="#" class="block py-2 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-lime-100 dark:hover:bg-lime-900 transition">
          Dashboard
        </a>
        <a href="#" class="block py-2 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-lime-100 dark:hover:bg-lime-900 transition">
          Data Produk
        </a>
        <a href="#" class="block py-2 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-lime-100 dark:hover:bg-lime-900 transition">
          Pengaturan
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Navbar -->
      <header class="flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 relative">
        <!-- Breadcrumb -->
        <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <span>Home</span>
          <span>/</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</span>
        </div>

        <!-- Profile -->
        <div class="relative">
          <div class="flex items-center space-x-4 cursor-pointer" @click="showDropdown = !showDropdown">
            <span class="text-gray-700 dark:text-gray-200">{{ username }}</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover border-2 border-lime-400"
            />
          </div>

          <!-- Dropdown -->
          <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden z-50">
            <button
              @click="logout"
              class="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-lime-100 dark:hover:bg-lime-900 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {{ pageTitle }}
        </div>

        <!-- Isi konten dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-md">
            <div class="text-gray-600 dark:text-gray-400">Total Users</div>
            <div class="text-3xl font-bold text-lime-600 dark:text-lime-400">1,234</div>
          </div>

          <!-- Card 2 -->
          <div class="p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-md">
            <div class="text-gray-600 dark:text-gray-400">Total Orders</div>
            <div class="text-3xl font-bold text-lime-600 dark:text-lime-400">567</div>
          </div>

          <!-- Card 3 -->
          <div class="p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-md">
            <div class="text-gray-600 dark:text-gray-400">Revenue</div>
            <div class="text-3xl font-bold text-lime-600 dark:text-lime-400">$8,900</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
