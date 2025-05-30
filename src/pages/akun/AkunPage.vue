<template>
  <div class="px-4 py-6 w-full mx-auto overflow-y-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Data Akun Pegawai</h1>
      <button
        @click="openModal()"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm transition"
      >
        + Tambah Akun
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input
        v-model="search"
        @input="onSearchInput"
        type="text"
        placeholder="Cari username atau role..."
        class="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        style="height: 38px"
      />

      <div class="flex items-center space-x-2">
        <label for="limit" class="text-sm text-gray-700 select-none">Tampilkan</label>
        <select
          id="limit"
          v-model.number="limit"
          @change="onLimitChange"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          style="height: 38px"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <div class="relative min-h-[200px]">
      <LoadingCircle v-if="loading && !showPasswordChangeModal" />
      <BaseTable :columns="columns" :rows="rows" class="overflow-x-auto">
        <template #actions="{ row }">
          <button
            @click="resetPasswordAkun(row)"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm mr-3 transition"
          >
            Ubah Password
          </button>
          <button
            @click="deleteAkun(row.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
          >
            Hapus
          </button>
        </template>
      </BaseTable>
      <div v-if="!loading && rows.length === 0" class="text-center py-8 text-gray-500">
        Tidak ada data akun yang ditemukan.
      </div>
    </div>

    <div class="flex justify-end mt-6 space-x-4">
      <BasePagination
        v-if="!loading && rows.length > 0"
        :currentPage="page"
        :totalPages="totalPages"
        @change="changePage"
      />
    </div>

    <BaseModal
      :show="showModal"
      :title="selectedAkun ? 'Edit Akun' : 'Tambah Akun Pegawai'"
      @close="closeModal"
      widthClass="max-w-lg"
    >
      <AkunForm :akun="selectedAkun" @submit="handleSubmit" @close="closeModal" />
    </BaseModal>

    <BaseModal
      :show="showPasswordChangeModal"
      :title="`Ubah Password untuk: ${akunForPasswordChange?.username || ''}`"
      @close="closePasswordChangeModal"
      widthClass="max-w-md"
    >
      <form @submit.prevent="handlePasswordChangeSubmit" class="space-y-4">
        <div>
          <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1"
            >Password Baru</label
          >
          <input
            type="password"
            id="new-password"
            v-model="newPasswordData.password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Masukkan password baru"
          />
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1"
            >Konfirmasi Password Baru</label
          >
          <input
            type="password"
            id="confirm-password"
            v-model="newPasswordData.confirmPassword"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Konfirmasi password baru"
          />
          <p
            v-if="
              newPasswordData.password &&
              newPasswordData.confirmPassword &&
              newPasswordData.password !== newPasswordData.confirmPassword
            "
            class="text-xs text-red-500 mt-1"
          >
            Password tidak cocok.
          </p>
        </div>
        <div class="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            @click="closePasswordChangeModal"
            class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition disabled:opacity-50"
          >
            <span v-if="loading">Menyimpan...</span>
            <span v-else>Simpan Password</span>
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import BaseTable from '../../components/atoms/BaseTable.vue';
  import BaseModal from '../../components/atoms/BaseModal.vue';
  import BasePagination from '../../components/atoms/BasePagination.vue';
  import AkunForm from '../../components/akun/AkunForm.vue';
  import {
    getAkunList,
    createAkun,
    resetPassword, // Nama fungsi tetap, asumsi implementasi di service & backend diubah
    deleteAkunData,
  } from '../../services/akunService.js';
  import LoadingCircle from '../../components/atoms/LoadingCircle.vue';

  const columns = [
    { label: 'Username', key: 'username' },
    { label: 'Role', key: 'role' },
    { label: 'Tanggal Dibuat', key: 'created_at' },
    { label: 'Terakhir Update', key: 'updated_at' },
  ];

  const rows = ref([]);
  const search = ref('');
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(1);
  const loading = ref(false);

  // State untuk modal Tambah/Edit Akun
  const showModal = ref(false);
  const selectedAkun = ref(null);

  // --- State BARU untuk Modal Ubah Password ---
  const showPasswordChangeModal = ref(false);
  const akunForPasswordChange = ref(null); // Menyimpan data akun yang akan diubah passwordnya
  const newPasswordData = ref({
    password: '',
    confirmPassword: '',
  });
  // --- Akhir State BARU ---

  let searchTimeout = null;

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await getAkunList({
        search: search.value,
        page: page.value,
        limit: limit.value,
      });
      rows.value = response.data.data;
      const filteredCount = Number(
        response.data.filtered || response.data.total || rows.value.length
      );
      totalPages.value = Math.max(1, Math.ceil(filteredCount / limit.value));
    } catch (error) {
      console.error('Error fetching account list:', error);
      alert('Gagal memuat data akun.');
      rows.value = [];
      totalPages.value = 1;
    } finally {
      loading.value = false;
    }
  };

  const openModal = (akun = null) => {
    selectedAkun.value = akun ? { ...akun } : null;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    selectedAkun.value = null;
  };

  const handleSubmit = async (formData) => {
    loading.value = true;
    try {
      if (selectedAkun.value && selectedAkun.value.id) {
        // await updateAkun(selectedAkun.value.id, formData);
        // alert('Akun berhasil diperbarui!');
      } else {
        await createAkun(formData);
        alert('Akun berhasil ditambahkan!');
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error submitting akun form:', error);
      const action = selectedAkun.value && selectedAkun.value.id ? 'memperbarui' : 'menambahkan';
      alert(`Gagal ${action} akun. ${error.response?.data?.message || 'Silakan coba lagi.'}`);
    } finally {
      loading.value = false;
    }
  };

  // --- Modifikasi fungsi resetPasswordAkun untuk membuka modal baru ---
  const resetPasswordAkun = (akun) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin mengubah password untuk akun "${akun.username}"? Password lama akan diganti.`
      )
    ) {
      akunForPasswordChange.value = { ...akun }; // Simpan data akun
      newPasswordData.value = { password: '', confirmPassword: '' }; // Reset field password
      showPasswordChangeModal.value = true; // Tampilkan modal ubah password
    }
  };

  // --- Fungsi BARU untuk menutup modal ubah password ---
  const closePasswordChangeModal = () => {
    showPasswordChangeModal.value = false;
    akunForPasswordChange.value = null;
    newPasswordData.value = { password: '', confirmPassword: '' };
  };

  // --- Fungsi BARU untuk menangani submit dari modal ubah password ---
  const handlePasswordChangeSubmit = async () => {
    if (!newPasswordData.value.password || newPasswordData.value.password.trim() === '') {
      alert('Password baru tidak boleh kosong.');
      return;
    }
    if (newPasswordData.value.password !== newPasswordData.value.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    // Validasi tambahan untuk panjang password jika perlu
    if (newPasswordData.value.password.length < 6) {
      // Contoh validasi panjang minimal
      alert('Password baru minimal harus 6 karakter.');
      return;
    }

    loading.value = true;
    try {
      await resetPassword(akunForPasswordChange.value.id, {
        password: newPasswordData.value.password,
      });
      alert('Password berhasil diubah!');
      closePasswordChangeModal();
      // fetchData(); // Panggil jika ingin refresh data tabel, misal untuk kolom 'updated_at'
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage =
        error.response?.data?.message || 'Gagal mengubah password. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const deleteAkun = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      loading.value = true;
      try {
        await deleteAkunData(id);
        alert('Akun berhasil dihapus.');
        fetchData();
      } catch (error) {
        console.error('Error deleting akun:', error);
        alert(`Gagal menghapus akun. ${error.response?.data?.message || 'Silakan coba lagi.'}`);
      } finally {
        loading.value = false;
      }
    }
  };

  const changePage = (newPage) => {
    if (page.value !== newPage) {
      page.value = newPage;
      fetchData();
    }
  };

  const onLimitChange = () => {
    page.value = 1;
    fetchData();
  };

  const onSearchInput = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      page.value = 1;
      fetchData();
    }, 500);
  };

  onMounted(fetchData);
</script>
