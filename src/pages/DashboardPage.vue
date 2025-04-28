<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const username = ref('John Doe')
const pageTitle = ref('Dashboard')
const showDropdown = ref(false)

const logout = () => {
  console.log('Logging out...')
  router.push('/login')
  // Tambahkan logika logout disini
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div class="h-20 flex items-center justify-center border-b border-gray-200">
        <h1 class="text-2xl font-bold text-lime-600">Nick Nie Apps</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a href="#" class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition">
          Dashboard
        </a>
        <a href="#" class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition">
          Data Produk
        </a>
        <a href="#" class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition">
          Pengaturan
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Navbar -->
      <header class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 relative">
        <div class="flex items-center space-x-2 text-gray-600">
          <span>Home</span>
          <span>/</span>
          <span class="font-semibold text-gray-900">{{ pageTitle }}</span>
        </div>

        <div class="relative">
          <div class="flex items-center space-x-4 cursor-pointer" @click="showDropdown = !showDropdown">
            <span class="text-gray-700">{{ username }}</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover border-2 border-lime-400"
            />
          </div>

          <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
            <button
              @click="logout"
              class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-lime-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="text-2xl font-bold text-gray-800 mb-6">
          {{ pageTitle }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <div class="text-gray-600">Total Users</div>
            <div class="text-3xl font-bold text-lime-600">1,234</div>
          </div>

          <div class="p-6 rounded-2xl bg-white shadow-md">
            <div class="text-gray-600">Total Orders</div>
            <div class="text-3xl font-bold text-lime-600">567</div>
          </div>

          <div class="p-6 rounded-2xl bg-white shadow-md">
            <div class="text-gray-600">Revenue</div>
            <div class="text-3xl font-bold text-lime-600">$8,900</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
