<template>
  <div class="pelanggan-list p-4 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold">Data Pelanggan</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="showAddModal = true"
      >
        + Tambah Pelanggan
      </button>
    </div>

    <!-- Tabel Pelanggan -->
    <ProdukTable :rows="rows" :headers="headers" @edit="handleEdit" @delete="handleDelete" />

    <!-- Pagination -->
    <BasePagination
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Modal Tambah Pelanggan -->
    <BaseModal :show="showAddModal" title="Tambah Pelanggan Baru" @close="showAddModal = false">
      <div class="grid gap-4 text-sm">
        <div>
          <label for="nama" class="block mb-1 text-gray-600">Nama Pelanggan</label>
          <input
            id="nama"
            type="text"
            v-model="newItem.nama"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="category" class="block mb-1 text-gray-600">Kategori</label>
          <input
            id="category"
            type="text"
            v-model="newItem.category"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="description" class="block mb-1 text-gray-600">Deskripsi</label>
          <textarea
            id="description"
            v-model="newItem.description"
            rows="3"
            class="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button class="bg-gray-200 px-4 py-2 rounded mr-2" @click="showAddModal = false">
          Batal
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="addItem">
          Simpan
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import ProdukTable from '../../components/molecules/ProdukTable.vue'; // Bisa diganti jika ada komponen tabel khusus pelanggan
  import BaseModal from '../../components/atoms/BaseModal.vue';
  import BasePagination from '../../components/atoms/BasePagination.vue';

  const headers = ['Nama', 'Kategori', 'Deskripsi'];

  const rows = ref([]);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const itemsPerPage = 10;
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  const showAddModal = ref(false);

  const newItem = ref({
    nama: '',
    category: '',
    description: '',
  });

  // Fetch pelanggan
  const fetchPelanggan = async (page = 1) => {
    try {
      const response = await axios.get('/api/customer/list', {
        params: { page, limit: itemsPerPage },
      });

      if (response.data.success) {
        rows.value = response.data.data.data.map((item) => ({
          id: item.id,
          nama: item.nama,
          category: item.category,
          description: item.description,
        }));

        totalItems.value = response.data.data.total || response.data.data.data.length; // fallback jika total tidak ada
        currentPage.value = Number(response.data.data.page) || page;
      }
    } catch (error) {
      console.error('Gagal mengambil data pelanggan:', error);
    }
  };

  // Actions
  const handleEdit = (item) => {
    console.log('Edit pelanggan:', item);
    // Tambahkan implementasi edit jika perlu
  };

  const handleDelete = (item) => {
    console.log('Delete pelanggan:', item);
    // Tambahkan implementasi delete jika perlu
  };

  const handlePageChange = (page) => {
    fetchPelanggan(page);
  };

  const addItem = async () => {
    try {
      const response = await axios.post('/api/customer/create', newItem.value);
      if (response.data.success) {
        fetchPelanggan(currentPage.value);
        showAddModal.value = false;

        Object.assign(newItem.value, {
          nama: '',
          category: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Gagal menambah pelanggan:', error);
    }
  };

  onMounted(() => {
    fetchPelanggan(currentPage.value);
  });
</script>

<style scoped>
  /* Sesuaikan styling jika perlu */
</style>
