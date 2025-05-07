<script setup>
  import { ref } from 'vue';
  import ReusableTable from '../atoms/ReusableTable.vue';
  import BaseModal from '../atoms/BaseModal.vue';

  const props = defineProps({
    rows: Array,
    headers: Array,
  });

  const emit = defineEmits(['edit', 'delete']);

  // Modal state
  const showEditModal = ref(false);
  const showDeleteModal = ref(false);
  const editingItem = ref({});
  const selectedItem = ref(null);

  // Aksi
  const openEditModal = (item) => {
    editingItem.value = { ...item };
    showEditModal.value = true;
  };

  const openDeleteModal = (item) => {
    selectedItem.value = item;
    showDeleteModal.value = true;
  };

  const confirmEdit = () => {
    emit('edit', editingItem.value);
    showEditModal.value = false;
  };

  const confirmDelete = () => {
    emit('delete', selectedItem.value);
    showDeleteModal.value = false;
  };
</script>

<template>
  <div>
    <ReusableTable :headers="headers" :rows="rows">
      <template #actions="{ row }">
        <div class="flex gap-2">
          <button
            class="bg-[#007bff] hover:bg-lime-600 text-white px-3 py-1 rounded-md text-sm"
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

    <!-- Modal Edit -->
    <BaseModal :show="showEditModal" title="Edit Data Barang" @close="showEditModal = false">
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
            v-model="editingItem[key]"
            :type="key === 'stok' ? 'number' : 'text'"
            class="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <template #footer>
        <button class="bg-gray-200 px-4 py-2 rounded mr-2" @click="showEditModal = false">
          Batal
        </button>
        <button class="bg-lime-600 text-white px-4 py-2 rounded" @click="confirmEdit">
          Simpan
        </button>
      </template>
    </BaseModal>

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
        <button class="bg-red-500 text-white px-4 py-2 rounded" @click="confirmDelete">
          Hapus
        </button>
      </template>
    </BaseModal>
  </div>
</template>
