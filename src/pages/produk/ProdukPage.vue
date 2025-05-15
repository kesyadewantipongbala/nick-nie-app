<!-- src/pages/produk/ProdukPage.vue -->
<template>
  <div class="produk-list p-4 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold">Data Produk</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        @click="showAddModal = true"
      >
        + Add Produk
      </button>
    </div>

    <!-- Tabel Produk -->
    <ProdukTable :rows="rows" :headers="headers" @edit="handleEdit" @delete="handleDelete" />

    <!-- Pagination -->
    <BasePagination
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Modal Tambah Produk -->
    <BaseModal :show="showAddModal" title="Tambah Produk Baru" @close="showAddModal = false">
      <div class="grid gap-4 text-sm">
        <div>
          <label for="nama" class="block mb-1 text-gray-600">Nama</label>
          <input
            id="nama"
            type="text"
            v-model="newItem.nama"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="kode_barang" class="block mb-1 text-gray-600">Kode Barang</label>
          <input
            id="kode_barang"
            type="text"
            v-model="newItem.kode_barang"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="kategori" class="block mb-1 text-gray-600">Kategori</label>
          <input
            id="kategori"
            type="text"
            v-model="newItem.kategori"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="harga" class="block mb-1 text-gray-600">Harga</label>
          <input
            id="harga"
            type="number"
            v-model="newItem.harga"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="jumlah" class="block mb-1 text-gray-600">Jumlah</label>
          <input
            id="jumlah"
            type="number"
            v-model="newItem.jumlah"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label for="supplier" class="block mb-1 text-gray-600">Supplier</label>
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              @input="fetchSuppliers"
              placeholder="Search supplier..."
              class="w-full border px-3 py-2 rounded"
            />
            <div
              v-if="filteredSuppliers.length > 0"
              class="absolute z-10 w-full bg-white shadow-lg mt-1 rounded border"
            >
              <ul>
                <li
                  v-for="supplier in filteredSuppliers"
                  :key="supplier.id"
                  @click="selectSupplier(supplier)"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {{ supplier.nama }}
                </li>
              </ul>
            </div>
          </div>
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
  import ProdukTable from '../../components/molecules/ProdukTable.vue';
  import BaseModal from '../../components/atoms/BaseModal.vue';
  import BasePagination from '../../components/atoms/BasePagination.vue';

  const headers = ['Nama Barang', 'Kode Barang', 'Kategori', 'Jumlah', 'Harga'];

  const rows = ref([]);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const itemsPerPage = 10;
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  const showAddModal = ref(false);

  // Produk state
  const newItem = ref({
    nama: '',
    kode_barang: '',
    kategori: '',
    harga: '',
    jumlah: '',
    supplier_id: null,
  });

  // Supplier state
  const supplierOptions = ref([]);
  const filteredSuppliers = ref([]);
  const searchQuery = ref('');

  const selectSupplier = (supplier) => {
    newItem.value.supplier_id = supplier.id;
    filteredSuppliers.value = [];
    searchQuery.value = supplier.nama;
  };

  // Fetch products
  const fetchProduk = async (page = 1) => {
    try {
      const response = await axios.get('/api/produk/list', {
        params: { page, limit: itemsPerPage },
      });

      if (response.data.success) {
        rows.value = response.data.data.data.map((item) => ({
          id: item.id,
          nama: item.nama,
          kode_barang: item.kode_barang,
          kategori: item.kategori,
          jumlah: item.jumlah,
          harga: item.harga,
        }));

        totalItems.value = response.data.data.total;
        currentPage.value = Number(response.data.data.page);
      }
    } catch (error) {
      console.error('Gagal mengambil data produk:', error);
    }
  };

  // Fetch suppliers based on search query
  const fetchSuppliers = async () => {
    if (!searchQuery.value) {
      filteredSuppliers.value = [];
      return;
    }

    try {
      const response = await axios.get('/api/supplier/list', {
        params: { search: searchQuery.value, page: 1, limit: 10 },
      });

      if (response.data.success) {
        filteredSuppliers.value = response.data.data.data;
      }
    } catch (error) {
      console.error('Gagal mengambil supplier:', error);
    }
  };

  // Actions
  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    console.log('Delete item:', item);
  };

  const handlePageChange = (page) => {
    fetchProduk(page);
  };

  const addItem = async () => {
    try {
      const response = await axios.post('/api/produk/create', newItem.value);
      if (response.data.success) {
        fetchProduk(currentPage.value);
        showAddModal.value = false;

        // Reset form
        Object.assign(newItem.value, {
          nama: '',
          kode_barang: '',
          kategori: '',
          harga: '',
          jumlah: '',
          supplier_id: null,
        });
        searchQuery.value = '';
      }
    } catch (error) {
      console.error('Gagal menambah produk:', error);
    }
  };

  onMounted(() => {
    fetchProduk(currentPage.value);
  });
</script>

<style scoped>
  /* Customize modal and dropdown styles as needed */
</style>
