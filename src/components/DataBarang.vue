<script setup>
// Vue 3 composition API setup, no logic added yet
</script>

<template>
      <!-- Main Content -->
      <main class="flex-1 p-8 bg-gray-50 overflow-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Data Barang</h2>
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 rounded-full bg-gray-300"></div>
            <div class="text-right">
              <div class="font-medium">Amanda</div>
              <div class="text-sm text-gray-500">Admin</div>
            </div>
            <span class="text-green-600 text-xl">⚙️</span>
          </div>
        </div>
  
        <button class="mb-4 bg-green-200 text-green-800 font-semibold px-4 py-2 rounded hover:bg-green-300">➕ Tambah Barang Baru</button>
  
        <!-- Table -->
        <div class="bg-white p-4 rounded shadow">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
              <span class="mr-2">Tampilkan</span>
              <select class="border px-2 py-1 rounded">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span class="ml-2">item</span>
            </div>
            <input type="text" placeholder="Cari..." class="border px-3 py-1 rounded" />
          </div>
  
          <table class="w-full table-auto border-collapse text-sm">
            <thead class="bg-gray-100">
              <tr class="text-left">
                <th class="border px-3 py-2">Nama Barang</th>
                <th class="border px-3 py-2">Kode Barang</th>
                <th class="border px-3 py-2">Kategori</th>
                <th class="border px-3 py-2">Harga Beli</th>
                <th class="border px-3 py-2">Harga Jual</th>
                <th class="border px-3 py-2">Sisa Stok</th>
                <th class="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in 10" :key="n" class="hover:bg-gray-50">
                <td class="border px-3 py-2">Nama Barang</td>
                <td class="border px-3 py-2">Kode Barang</td>
                <td class="border px-3 py-2">Kategori</td>
                <td class="border px-3 py-2">Harga Beli</td>
                <td class="border px-3 py-2">Harga Jual</td>
                <td class="border px-3 py-2">Sisa Stok</td>
                <td class="border px-3 py-2">
                  <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2">✏️</button>
                  <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <!-- Pagination -->
          <div class="flex justify-end mt-4 space-x-1 text-sm">
            <button class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Sebelumnya</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">2</button>
            <button class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">3</button>
            <button class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">4</button>
            <button class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">5</button>
            <button class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Selanjutnya</button>
          </div>
        </div>
      </main>
  </template>
  

  
  <style scoped>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  </style>  