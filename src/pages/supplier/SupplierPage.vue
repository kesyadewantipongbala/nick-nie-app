<template>
  <div class="supplier-list p-4 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold">Data Supplier</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="showAddModal = true"
      >
        + Tambah Supplier
      </button>
    </div>

    <!-- Tabel Supplier -->
    <ProdukTable :rows="rows" :headers="headers" @edit="handleEdit" @delete="handleDelete" />

    <!-- Pagination -->
    <BasePagination
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Modal Tambah Supplier -->
    <BaseModal :show="showAddModal" title="Tambah Supplier Baru" @close="showAddModal = false">
      <div class="grid gap-4 text-sm">
        <div>
          <label for="nama" class="block mb-1 text-gray-600">Nama Supplier</label>
          <input
            id="nama"
            type="text"
            v-model="newItem.nama"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="alamat" class="block mb-1 text-gray-600">Alamat</label>
          <textarea
            id="alamat"
            v-model="newItem.alamat"
            rows="2"
            class="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        <div>
          <label for="kontak" class="block mb-1 text-gray-600">Kontak</label>
          <input
            id="kontak"
            type="text"
            v-model="newItem.kontak"
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
  import ProdukTable from '../../components/molecules/ProdukTable.vue'; // Bisa diganti sesuai nama komponen tabel supplier
  import BaseModal from '../../components/atoms/BaseModal.vue';
  import BasePagination from '../../components/atoms/BasePagination.vue';

  const headers = ['Nama', 'Alamat', 'Kontak', 'Deskripsi'];

  const rows = ref([]);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const itemsPerPage = 10;
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  const showAddModal = ref(false);

  const newItem = ref({
    nama: '',
    alamat: '',
    kontak: '',
    description: '',
  });

  const fetchSuppliers = async (page = 1) => {
    try {
      const response = await axios.get('/api/supplier/list', {
        params: { page, limit: itemsPerPage },
      });

      if (response.data.success) {
        rows.value = response.data.data.data.map((item) => ({
          id: item.id,
          nama: item.nama,
          alamat: item.alamat,
          kontak: item.kontak,
          description: item.description,
        }));

        totalItems.value = response.data.data.total || response.data.data.data.length;
        currentPage.value = Number(response.data.data.page) || page;
      }
    } catch (error) {
      console.error('Gagal mengambil data supplier:', error);
    }
  };

  const handleEdit = (item) => {
    console.log('Edit supplier:', item);
    // Tambahkan implementasi edit jika perlu
  };

  const handleDelete = (item) => {
    console.log('Delete supplier:', item);
    // Tambahkan implementasi delete jika perlu
  };

  const handlePageChange = (page) => {
    fetchSuppliers(page);
  };

  const addItem = async () => {
    try {
      const response = await axios.post('/api/supplier/create', newItem.value);
      if (response.data.success) {
        fetchSuppliers(currentPage.value);
        showAddModal.value = false;

        Object.assign(newItem.value, {
          nama: '',
          alamat: '',
          kontak: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Gagal menambah supplier:', error);
    }
  };

  onMounted(() => {
    fetchSuppliers(currentPage.value);
  });
</script>

<style scoped>
  /* Sesuaikan styling jika perlu */
</style>
