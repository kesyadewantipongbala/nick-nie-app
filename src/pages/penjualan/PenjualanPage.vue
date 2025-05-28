<template>
  <div class="px-4 py-6 w-full mx-auto overflow-y-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Data Transaksi</h1>
      <button
        @click="openFormModal()"
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
        placeholder="Cari transaksi (ID Nota, Pelanggan)..."
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
            @click="openDetailModal(row.id)"
            class="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-md text-sm mr-2 transition"
          >
            Detail
          </button>
          <button
            @click="handlePrintTransaction(row.id)"
            class="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm mr-2 transition"
          >
            Print
          </button>
        </template>
        <template #items_summary="{ row }">
            <span v-if="row.product_list" class="text-xs">
                {{ row.product_list.split(',').length }} jenis produk
            </span>
            <span v-else-if="row.items && row.items.length > 0" class="text-xs">
                 {{ row.items.length }} jenis
            </span>
            <span v-else class="text-xs text-gray-500">-</span>
        </template>
      </BaseTable>
    </div>

    <div class="flex justify-end mt-6 space-x-4">
      <BasePagination :currentPage="page" :totalPages="totalPages" @change="changePage" />
    </div>

    <BaseModal :show="showFormModal" title="Tambah Transaksi" @close="closeFormModal" width="max-w-3xl">
      <TransactionForm
        @submit="handleSubmit"
        @close="closeFormModal"
      />
    </BaseModal>

    <BaseModal :show="showDetailModal" title="Detail Transaksi" @close="closeDetailModal" width="max-w-2xl">
        <div v-if="loadingDetail" class="flex justify-center items-center min-h-[200px]">
            <LoadingCircle />
        </div>
        <div v-else-if="selectedTransactionDetail" class="space-y-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Informasi Umum</h3>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><strong class="text-gray-600">ID Nota:</strong> {{ selectedTransactionDetail.transaction_code }}</p>
                    <p><strong class="text-gray-600">Tanggal:</strong> {{ formatDate(selectedTransactionDetail.created_at) }}</p>
                    <p><strong class="text-gray-600">Pelanggan:</strong> {{ selectedTransactionDetail.customer_name || `ID: ${selectedTransactionDetail.customer_id}` }} </p>
                    <p><strong class="text-gray-600">Kasir:</strong> {{ selectedTransactionDetail.user_name || `ID: ${selectedTransactionDetail.user_id}` }} </p>
                    <p class="col-span-2"><strong class="text-gray-600">Total Harga:</strong> <span class="font-bold text-emerald-600">Rp {{ (selectedTransactionDetail.total_harga || 0).toLocaleString('id-ID') }}</span></p>
                </div>
            </div>
            <hr/>
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Item Produk</h3>
                <div class="max-h-60 overflow-y-auto pr-2">
                    <table class="min-w-full divide-y divide-gray-200 text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-3 py-2 text-left font-medium text-gray-500 tracking-wider">Produk</th>
                                <th class="px-3 py-2 text-left font-medium text-gray-500 tracking-wider">Kode</th>
                                <th class="px-3 py-2 text-right font-medium text-gray-500 tracking-wider">Qty</th>
                                <th class="px-3 py-2 text-right font-medium text-gray-500 tracking-wider">Harga Satuan</th>
                                <th class="px-3 py-2 text-right font-medium text-gray-500 tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="!selectedTransactionDetail.items || selectedTransactionDetail.items.length === 0">
                                <td colspan="5" class="px-3 py-3 text-center text-gray-500">Tidak ada item.</td>
                            </tr>
                            <tr v-for="item in selectedTransactionDetail.items" :key="item.id">
                                <td class="px-3 py-2 whitespace-nowrap">{{ item.product_name }}</td>
                                <td class="px-3 py-2 whitespace-nowrap">{{ item.kode_barang }}</td>
                                <td class="px-3 py-2 text-right whitespace-nowrap">{{ item.quantity }}</td>
                                <td class="px-3 py-2 text-right whitespace-nowrap">Rp {{ (item.harga_satuan || 0).toLocaleString('id-ID') }}</td>
                                <td class="px-3 py-2 text-right whitespace-nowrap">Rp {{ (item.subtotal || 0).toLocaleString('id-ID') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center text-gray-500 py-10">Data detail transaksi tidak ditemukan atau gagal dimuat.</p>
        </div>
        <template #footer>
            <button @click="closeDetailModal" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm transition">
                Tutup
            </button>
        </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // 1. Impor useRouter
import BaseTable from '../../components/atoms/BaseTable.vue';
import BaseModal from '../../components/atoms/BaseModal.vue';
import BasePagination from '../../components/atoms/BasePagination.vue';
import TransactionForm from '../../components/transaction/TransactionForm.vue';
import {
  getTransactionList,
  createTransaction,
  getTransactionDetail,
} from '../../services/transactionService.js';
import LoadingCircle from '../../components/atoms/LoadingCircle.vue';

const router = useRouter(); // 2. Inisialisasi router

const columns = [
  { label: 'ID Nota', key: 'transaction_code', class: 'w-1/6 whitespace-nowrap' },
  { label: 'Pelanggan', key: 'customer_name', class: 'w-1/6' },
  { label: 'Kasir', key: 'user_name', class: 'w-1/12' },
  { label: 'Ringkasan Item', key: 'items_summary', slot: true, class: 'w-2/6' },
  { label: 'Total Harga', key: 'total_harga', type: 'currency', class: 'w-1/6 text-right whitespace-nowrap' },
  { label: 'Tanggal', key: 'created_at', type: 'date', class: 'whitespace-nowrap' },
];

const rows = ref([]);
const search = ref('');
const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const loading = ref(false);

const showFormModal = ref(false);

const showDetailModal = ref(false);
const selectedTransactionDetail = ref(null);
const loadingDetail = ref(false);
// const loadingPrint = ref(false); // Tidak lagi diperlukan jika print di halaman terpisah

const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const totalQuantity = (items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await getTransactionList({
      search: search.value,
      page: page.value,
      limit: limit.value,
    });
    if (response.success && response.data) {
      rows.value = response.data.data.map(tx => ({
        ...tx,
        customer_name: tx.customer_name || (tx.customer ? tx.customer.nama : `ID: ${tx.customer_id}`),
        user_name: tx.user_name || (tx.user ? tx.user.username : `ID: ${tx.user_id}`),
      }));
      const filteredCount = Number(response.data.filtered || response.data.total || rows.value.length);
      totalPages.value = Math.max(1, Math.ceil(filteredCount / limit.value));
    } else {
      rows.value = [];
      totalPages.value = 1;
    }
  } catch (error) {
    console.error("Error saat mengambil data transaksi:", error);
    rows.value = [];
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

const openFormModal = () => {
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
};

const handleSubmit = async (formDataFromForm, formIsSubmittingCallback) => {
  const payload = {
    user_id: formDataFromForm.user_id,
    customer_id: formDataFromForm.customer_id,
    items: formDataFromForm.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        harga_satuan: item.harga_satuan,
    })),
  };
  try {
    const response = await createTransaction(payload);
    if (!response.success) {
      throw new Error(response.message || 'Gagal membuat transaksi.');
    }
    closeFormModal();
    fetchData();
  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    alert(`Gagal membuat transaksi: ${error.message}`);
  } finally {
    if (typeof formIsSubmittingCallback === 'function') {
        formIsSubmittingCallback();
    }
  }
};

const openDetailModal = async (transactionId) => {
    loadingDetail.value = true;
    showDetailModal.value = true;
    selectedTransactionDetail.value = null;
    try {
        const response = await getTransactionDetail(transactionId);
        if (response.success && response.data) {
            selectedTransactionDetail.value = response.data;
        } else {
            selectedTransactionDetail.value = { error: response.message || "Data tidak ditemukan." };
        }
    } catch (error) {
        selectedTransactionDetail.value = { error: error.message || "Terjadi kesalahan." };
    } finally {
        loadingDetail.value = false;
    }
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedTransactionDetail.value = null;
};

// 3. Modifikasi handlePrintTransaction
const handlePrintTransaction = (transactionId) => {
  if (!transactionId) {
    console.error("Tidak ada ID transaksi untuk dicetak.");
    alert("Tidak bisa mencetak, ID transaksi tidak ditemukan.");
    return;
  }
  // Ganti 'PrintableTransactionNote' dengan nama rute yang Anda definisikan
  // untuk komponen cetak transaksi
  const routeData = router.resolve({ 
    name: 'PrintableTransactionNote', // Pastikan nama rute ini ada di router.js
    params: { id: transactionId } 
  });
  // Buka di tab baru
  window.open(routeData.href, '_blank', 'height=700,width=800,scrollbars=yes,resizable=yes');
};


const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
    fetchData();
  }
};

const onLimitChange = () => {
  page.value = 1;
  fetchData();
};

let searchTimeout = null;
const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchData();
  }, 500);
};

onMounted(fetchData);
</script>
