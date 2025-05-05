<script setup>
  import ReusableTable from './atoms/ReusableTable.vue';
  import BaseModal from './atoms/BaseModal.vue';
  import { ref } from 'vue';

  const headers = [
    'Nama Barang',
    'Kode Barang',
    'Kategori',
    'Harga Beli',
    'Harga Jual',
    'Sisa Stok',
  ];

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
  ]);

  const showDeleteModal = ref(false);
  const showEditModal = ref(false);
  const showConfirmEditModal = ref(false);
  const selectedItem = ref(null);
  const editingItem = ref({});

  const openDeleteModal = (item) => {
    selectedItem.value = item;
    showDeleteModal.value = true;
  };

  const openEditModal = (item) => {
    selectedItem.value = item;
    editingItem.value = { ...item }; // salin untuk diedit tanpa langsung ubah data asli
    showEditModal.value = true;
  };

  const saveEdit = () => {
    showConfirmEditModal.value = true;
  };

  const confirmEdit = () => {
    const index = rows.value.findIndex((r) => r.kode === selectedItem.value.kode);
    if (index !== -1) {
      rows.value[index] = { ...editingItem.value };
    }
    showConfirmEditModal.value = false;
    showEditModal.value = false;
  };

  const confirmDelete = () => {
    rows.value = rows.value.filter((r) => r.kode !== selectedItem.value.kode);
    showDeleteModal.value = false;
  };
</script>

<template>
  <ReusableTable :headers="headers" :rows="rows">
    <template #actions="{ row }">
      <div class="flex gap-2">
        <button
          class="bg-lime-500 hover:bg-lime-600 text-white px-3 py-1 rounded-md text-sm"
          @click="openEditModal(row)"
        >
          Edit
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
          @click="openDeleteModal(row)"
        >
          Hapus
        </button>
      </div>
    </template>
  </ReusableTable>

  <!-- Modal Hapus -->
  <BaseModal :show="showDeleteModal" title="Konfirmasi Hapus" @close="showDeleteModal = false">
    <p>
      Yakin ingin menghapus <b>{{ selectedItem?.nama }}</b
      >?
    </p>
    <template #footer>
      <button class="bg-gray-200 px-4 py-2 rounded mr-2" @click="showDeleteModal = false">
        Batal
      </button>
      <button class="bg-red-500 text-white px-4 py-2 rounded" @click="confirmDelete">Hapus</button>
    </template>
  </BaseModal>

  <!-- Modal Edit -->
  <BaseModal :show="showEditModal" title="Edit Data Barang" @close="showEditModal = false">
    <div class="grid gap-4 text-sm">
      <div>
        <label class="block mb-1 text-gray-600">Nama Barang</label>
        <input v-model="editingItem.nama" class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block mb-1 text-gray-600">Kategori</label>
        <input v-model="editingItem.kategori" class="w-full border px-3 py-2 rounded" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 text-gray-600">Harga Beli</label>
          <input v-model="editingItem.beli" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block mb-1 text-gray-600">Harga Jual</label>
          <input v-model="editingItem.jual" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <div>
        <label class="block mb-1 text-gray-600">Stok</label>
        <input v-model="editingItem.stok" type="number" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <template #footer>
      <button class="bg-gray-200 px-4 py-2 rounded mr-2" @click="showEditModal = false">
        Batal
      </button>
      <button class="bg-lime-500 text-white px-4 py-2 rounded" @click="saveEdit">Simpan</button>
    </template>
  </BaseModal>

  <!-- Modal Konfirmasi Simpan Edit -->
  <BaseModal
    :show="showConfirmEditModal"
    title="Simpan Perubahan?"
    @close="showConfirmEditModal = false"
  >
    <p>
      Yakin ingin menyimpan perubahan untuk <b>{{ editingItem.nama }}</b
      >?
    </p>
    <template #footer>
      <button class="bg-gray-200 px-4 py-2 rounded mr-2" @click="showConfirmEditModal = false">
        Batal
      </button>
      <button class="bg-lime-600 text-white px-4 py-2 rounded" @click="confirmEdit">Simpan</button>
    </template>
  </BaseModal>
</template>
