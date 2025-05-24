<!-- src\pages\penjualan\PenjualanPage.vue -->
<template>
  <div class="px-4 py-6 w-full mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Data Transaksi</h1>
      <button
        @click="openModal()"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm transition"
      >
        + Tambah Transaksi
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input
        v-model="search"
        @input="onSearchInput"
        type="text"
        placeholder="Cari transaksi..."
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
      <LoadingCircle v-if="loading" />

      <BaseTable :columns="columns" :rows="rows" class="overflow-x-auto">
        <template #actions="{ row }">
          <button
            @click="openModal(row)"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm mr-3 transition"
          >
            Edit
          </button>
          <button
            @click="deleteTransaction(row.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
          >
            Hapus
          </button>
        </template>
      </BaseTable>
    </div>

    <div class="flex justify-end mt-6 space-x-4">
      <BasePagination :currentPage="page" :totalPages="totalPages" @change="changePage" />
    </div>

    <BaseModal :show="showModal" title="Form Transaksi" @close="closeModal">
      <TransactionForm :transaction="selectedTransaction" @submit="handleSubmit" />
    </BaseModal>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import BaseTable from '../../components/atoms/BaseTable.vue';
  import BaseModal from '../../components/atoms/BaseModal.vue';
  import BasePagination from '../../components/atoms/BasePagination.vue';
  import TransactionForm from '../../components/transaction/TransactionForm.vue'; // Ensure this component exists
  import {
    getTransactionList,
    createTransaction,
    updateTransaction,
    deleteTransactionData,
  } from '../../services/transactionService.js'; // Ensure service is correct
  import LoadingCircle from '../../components/atoms/LoadingCircle.vue';

  const columns = [
    { label: 'Pelanggan', key: 'customer_id' },
    { label: 'User', key: 'user_id' },
    { label: 'ID Nota', key: 'transaction_code' },
    { label: 'Total Harga', key: 'total_harga' },
    { label: 'Tanggal Dibuat', key: 'created_at' },
    { label: 'Terakhir Update', key: 'updated_at' },
  ];

  const rows = ref([]);
  const search = ref('');
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(1);
  const showModal = ref(false);
  const selectedTransaction = ref(null);
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await getTransactionList({
        search: search.value,
        page: page.value,
        limit: limit.value,
      });
      rows.value = response.data.data;

      const filteredCount = Number(
        response.data.filtered || response.data.total || rows.value.length
      );
      totalPages.value = Math.max(1, Math.ceil(filteredCount / limit.value));
    } finally {
      loading.value = false;
    }
  };

  const openModal = (transaction = null) => {
    selectedTransaction.value = transaction;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    selectedTransaction.value = null;
  };

  const handleSubmit = async (formData) => {
    if (selectedTransaction.value) {
      await updateTransaction(selectedTransaction.value.id, formData);
    } else {
      await createTransaction(formData);
    }
    closeModal();
    fetchData();
  };

  const deleteTransaction = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data transaksi ini?')) {
      loading.value = true;
      await deleteTransactionData(id);
      fetchData();
    }
  };

  const changePage = (newPage) => {
    page.value = newPage;
    fetchData();
  };

  const onLimitChange = () => {
    page.value = 1;
    fetchData();
  };

  const onSearchInput = () => {
    page.value = 1;
    fetchData();
  };

  onMounted(fetchData);
</script>
