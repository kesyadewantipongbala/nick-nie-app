<script setup>
  import { ref, computed } from 'vue';
  import BarangTable from '../components/molecules/BarangTable.vue';
  import BaseModal from '../components/atoms/BaseModal.vue';
  import BasePagination from '../components/atoms/BasePagination.vue';

  const rows = ref([
    {
      nama: 'Selada Air',
      kode: 'BRG001',
      kategori: 'Sayuran',
      beli: '2000',
      jual: '3500',
      stok: 35,
    },
    {
      nama: 'Bayam Hijau',
      kode: 'BRG002',
      kategori: 'Sayuran',
      beli: '1800',
      jual: '3000',
      stok: 12,
    },
    {
      nama: 'Wortel Lokal',
      kode: 'BRG003',
      kategori: 'Sayuran',
      beli: '2500',
      jual: '4000',
      stok: 25,
    },
    {
      nama: 'Tomat Merah',
      kode: 'BRG004',
      kategori: 'Sayuran',
      beli: '2200',
      jual: '3800',
      stok: 40,
    },
    {
      nama: 'Bawang Merah',
      kode: 'BRG005',
      kategori: 'Bumbu',
      beli: '3000',
      jual: '4500',
      stok: 18,
    },
    {
      nama: 'Bawang Putih',
      kode: 'BRG006',
      kategori: 'Bumbu',
      beli: '3200',
      jual: '5000',
      stok: 20,
    },
    { nama: 'Cabe Rawit', kode: 'BRG007', kategori: 'Bumbu', beli: '4000', jual: '6000', stok: 15 },
    { nama: 'Kentang', kode: 'BRG008', kategori: 'Umbi', beli: '3500', jual: '5500', stok: 28 },
    {
      nama: 'Terong Ungu',
      kode: 'BRG009',
      kategori: 'Sayuran',
      beli: '2000',
      jual: '3200',
      stok: 22,
    },
    {
      nama: 'Kacang Panjang',
      kode: 'BRG010',
      kategori: 'Sayuran',
      beli: '1900',
      jual: '3100',
      stok: 30,
    },
    {
      nama: 'Jagung Manis',
      kode: 'BRG011',
      kategori: 'Sayuran',
      beli: '2800',
      jual: '4500',
      stok: 26,
    },
    {
      nama: 'Timun Lokal',
      kode: 'BRG012',
      kategori: 'Sayuran',
      beli: '1700',
      jual: '2700',
      stok: 16,
    },
    {
      nama: 'Sawi Hijau',
      kode: 'BRG013',
      kategori: 'Sayuran',
      beli: '1800',
      jual: '3000',
      stok: 12,
    },
    {
      nama: 'Kol Putih',
      kode: 'BRG014',
      kategori: 'Sayuran',
      beli: '2600',
      jual: '4200',
      stok: 19,
    },
    { nama: 'Kangkung', kode: 'BRG015', kategori: 'Sayuran', beli: '1600', jual: '2800', stok: 14 },
    {
      nama: 'Daun Bawang',
      kode: 'BRG016',
      kategori: 'Sayuran',
      beli: '2000',
      jual: '3300',
      stok: 17,
    },
    { nama: 'Brokoli', kode: 'BRG017', kategori: 'Sayuran', beli: '3000', jual: '4800', stok: 10 },
    {
      nama: 'Paprika Merah',
      kode: 'BRG018',
      kategori: 'Sayuran',
      beli: '3500',
      jual: '5800',
      stok: 9,
    },
    {
      nama: 'Cabai Besar',
      kode: 'BRG019',
      kategori: 'Bumbu',
      beli: '3700',
      jual: '5900',
      stok: 11,
    },
    {
      nama: 'Labu Siam',
      kode: 'BRG020',
      kategori: 'Sayuran',
      beli: '2100',
      jual: '3400',
      stok: 13,
    },
  ]);

  const currentPage = ref(1);
  const itemsPerPage = 10;

  const showAddModal = ref(false);
  const newItem = ref({
    nama: '',
    kode: '',
    kategori: '',
    beli: '',
    jual: '',
    stok: '',
  });

  // Komputasi data yang ditampilkan per halaman
  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return rows.value.slice(start, start + itemsPerPage);
  });
  const totalPages = computed(() => Math.ceil(rows.value.length / itemsPerPage));

  // Event handler
  const handlePageChange = (page) => (currentPage.value = page);

  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    rows.value = rows.value.filter((r) => r.kode !== item.kode);
  };

  const handleAdd = () => {
    rows.value.push({ ...newItem.value });
    Object.keys(newItem.value).forEach((key) => (newItem.value[key] = ''));
    showAddModal.value = false;
  };
</script>

<template>
  <main class="flex-1 p-8 bg-gray-50 overflow-auto">
    <!-- Header -->
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

    <!-- Tombol Tambah -->
    <button
      class="mb-4 bg-green-200 text-green-800 font-semibold px-4 py-2 rounded hover:bg-green-300"
      @click="showAddModal = true"
    >
      ➕ Tambah Barang Baru
    </button>

    <!-- Tabel Barang -->
    <BarangTable
      :rows="paginatedRows"
      :headers="['Nama Barang', 'Kode Barang', 'Kategori', 'Harga Beli', 'Harga Jual', 'Sisa Stok']"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Pagination -->
    <BasePagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Modal Tambah -->
    <BaseModal :show="showAddModal" title="Tambah Barang" @close="showAddModal = false">
      <div class="grid gap-4 text-sm">
        <div
          v-for="(label, key) in {
            nama: 'Nama Barang',
            kode: 'Kode Barang',
            kategori: 'Kategori',
            beli: 'Harga Beli',
            jual: 'Harga Jual',
            stok: 'Stok',
          }"
          :key="key"
        >
          <label class="block mb-1 text-gray-600">{{ label }}</label>
          <input
            v-model="newItem[key]"
            :type="key === 'stok' ? 'number' : 'text'"
            class="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <template #footer>
        <button class="bg-gray-200 px-4 py-2 rounded mr-2" @click="showAddModal = false">
          Batal
        </button>
        <button class="bg-lime-500 text-white px-4 py-2 rounded" @click="handleAdd">Tambah</button>
      </template>
    </BaseModal>
  </main>
</template>
