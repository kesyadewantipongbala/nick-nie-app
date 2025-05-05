<script setup>
  import BarangTable from '../components/BarangTable.vue';
  import Pagination from '../components/Pagination.vue';

  const handleEdit = (id) => {
    console.log('Edit item:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete item:', id);
  };
</script>

<template>
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

    <button
      class="mb-4 bg-green-200 text-green-800 font-semibold px-4 py-2 rounded hover:bg-green-300"
    >
      ➕ Tambah Barang Baru
    </button>

    <BarangTable @edit="handleEdit" @delete="handleDelete">
      <template #pagination>
        <Pagination />
      </template>
    </BarangTable>
  </main>
</template>
