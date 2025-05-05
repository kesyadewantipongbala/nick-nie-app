<script setup>
  defineProps({
    headers: {
      type: Array,
      required: true,
      // Contoh: ['Nama Barang', 'Kode Barang', 'Kategori']
    },
    rows: {
      type: Array,
      required: true,
      // Contoh: [{ nama: 'A', kode: '123', kategori: 'Sayur' }, ...]
    },
  });
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-md">
    <!-- Header Tabel -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center text-sm">
        <span class="mr-2">Tampilkan</span>
        <select
          class="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring focus:ring-lime-300"
        >
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <span class="ml-2">item</span>
      </div>
      <input
        type="text"
        placeholder="Cari..."
        class="border border-gray-300 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring focus:ring-lime-300"
      />
    </div>

    <!-- Tabel -->
    <table class="w-full table-auto border-collapse text-sm">
      <thead class="bg-gray-100 text-gray-600">
        <tr class="text-left">
          <th v-for="(header, index) in headers" :key="index" class="border px-4 py-2">
            {{ header }}
          </th>
          <th class="border px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index" class="hover:bg-gray-50 transition">
          <td v-for="key in Object.keys(row)" :key="key" class="border px-4 py-2">
            {{ row[key] }}
          </td>
          <td class="border px-4 py-2">
            <slot name="actions" :row="row" :index="index" />
          </td>
        </tr>
      </tbody>
    </table>

    <slot name="pagination" />
  </div>
</template>
