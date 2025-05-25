<template>
  <div class="px-4 py-6 w-full mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Data Pembelian</h1>
      <button
        @click="openFormModal()"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm transition"
      >
        + Tambah Pembelian
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input
        v-model="search"
        @input="onSearchInput"
        type="text"
        placeholder="Cari pembelian (Kode, Supplier)..."
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
            class="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-md text-sm transition"
          >
            Detail
          </button>
          </template>
        <template #items_summary="{ row }">
            <span v-if="row.total_items && row.total_quantity" class="text-xs">
                {{ row.total_items }} jenis, {{ row.total_quantity }} qty
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

    <BaseModal :show="showFormModal" title="Form Tambah Pembelian" @close="closeFormModal" width="max-w-3xl">
      <PurchaseForm @submit="handleSubmit" @close="closeFormModal" />
      </BaseModal>

    <BaseModal :show="showDetailModal" title="Detail Pembelian" @close="closeDetailModal" width="max-w-2xl">
        <div v-if="loadingDetail" class="flex justify-center items-center min-h-[200px]">
            <LoadingCircle />
        </div>
        <div v-else-if="selectedPurchaseDetail" class="space-y-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Informasi Umum</h3>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p><strong class="text-gray-600">Kode Pembelian:</strong> {{ selectedPurchaseDetail.purchase_code }}</p>
                    <p><strong class="text-gray-600">Tanggal:</strong> {{ formatDate(selectedPurchaseDetail.created_at) }}</p>
                    <p><strong class="text-gray-600">Supplier:</strong> {{ selectedPurchaseDetail.supplier_name || `ID: ${selectedPurchaseDetail.supplier_id}` }}</p>
                    <p><strong class="text-gray-600">User:</strong> {{ selectedPurchaseDetail.user_name || `ID: ${selectedPurchaseDetail.user_id}` }}</p>
                    <p class="col-span-2"><strong class="text-gray-600">Catatan:</strong> {{ selectedPurchaseDetail.catatan || '-' }}</p>
                    <p class="col-span-2"><strong class="text-gray-600">Total Biaya:</strong> <span class="font-bold text-emerald-600">Rp {{ (selectedPurchaseDetail.total_biaya || 0).toLocaleString('id-ID') }}</span></p>
                </div>
            </div>
            <hr/>
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Item Produk yang Dibeli</h3>
                <div class="max-h-60 overflow-y-auto pr-2"> <table class="min-w-full divide-y divide-gray-200 text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-3 py-2 text-left font-medium text-gray-500 tracking-wider">Produk</th>
                                <th class="px-3 py-2 text-left font-medium text-gray-500 tracking-wider">Kode</th>
                                <th class="px-3 py-2 text-right font-medium text-gray-500 tracking-wider">Qty</th>
                                <th class="px-3 py-2 text-right font-medium text-gray-500 tracking-wider">Harga Beli</th>
                                <th class="px-3 py-2 text-right font-medium text-gray-500 tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="!selectedPurchaseDetail.items || selectedPurchaseDetail.items.length === 0">
                                <td colspan="5" class="px-3 py-3 text-center text-gray-500">Tidak ada item.</td>
                            </tr>
                            <tr v-for="item in selectedPurchaseDetail.items" :key="item.id || item.product_id">
                                <td class="px-3 py-2 whitespace-nowrap">{{ item.product_name }}</td>
                                <td class="px-3 py-2 whitespace-nowrap">{{ item.kode_barang }}</td>
                                <td class="px-3 py-2 text-right whitespace-nowrap">{{ item.quantity }}</td>
                                <td class="px-3 py-2 text-right whitespace-nowrap">Rp {{ (item.harga_beli || 0).toLocaleString('id-ID') }}</td>
                                <td class="px-3 py-2 text-right whitespace-nowrap">Rp {{ (item.subtotal || 0).toLocaleString('id-ID') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center text-gray-500 py-10">Data detail pembelian tidak ditemukan atau gagal dimuat.</p>
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
import BaseTable from '../../components/atoms/BaseTable.vue';
import BaseModal from '../../components/atoms/BaseModal.vue';
import BasePagination from '../../components/atoms/BasePagination.vue';
import PurchaseForm from '../../components/purchase/PurchaseForm.vue'; // Pastikan path dan nama komponen benar
import {
  getPurchaseList,
  createPurchase,
  // updatePurchase, // Dihilangkan
  // deletePurchaseData, // Dihilangkan
  getPurchaseDetailWithItems, // Diasumsikan ada fungsi ini di service Anda
} from '../../services/purchaseService.js'; // Pastikan path dan nama service benar
import LoadingCircle from '../../components/atoms/LoadingCircle.vue';

const columns = [
  { label: 'Kode Pembelian', key: 'purchase_code', class: 'whitespace-nowrap' },
  { label: 'Supplier', key: 'supplier_name', class: 'whitespace-nowrap' },
  { label: 'Total Biaya', key: 'total_biaya', type: 'currency', class: 'text-right whitespace-nowrap' },
  { label: 'Ringkasan Item', key: 'items_summary', slot: true },
  { label: 'Catatan', key: 'catatan' },
  { label: 'Tanggal Dibuat', key: 'created_at', type: 'date', class: 'whitespace-nowrap' },
];

const rows = ref([]);
const search = ref('');
const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);
const loading = ref(false);

// State untuk modal form (hanya untuk tambah)
const showFormModal = ref(false);

// State untuk modal detail
const showDetailModal = ref(false);
const selectedPurchaseDetail = ref(null);
const loadingDetail = ref(false);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Helper untuk ringkasan item di tabel utama (jika API list tidak menyediakannya)
const totalQuantity = (items) => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
};


const fetchData = async () => {
  loading.value = true;
  try {
    const response = await getPurchaseList({
      search: search.value,
      page: page.value,
      limit: limit.value,
    });
    if (response.success && response.data) {
      // Jika API list tidak mengembalikan total_items dan total_quantity,
      // Anda bisa menghitungnya di sini jika items ada di response.data.data[i].items
      // atau biarkan items_summary menampilkan jumlah jenis saja.
      rows.value = response.data.data.map(p => ({
          ...p,
          // Contoh jika API list mengembalikan items:
          // total_items: p.items ? p.items.length : 0,
          // total_quantity: p.items ? totalQuantity(p.items) : 0,
      }));
      const filteredCount = Number(response.data.filtered || response.data.total || rows.value.length);
      totalPages.value = Math.max(1, Math.ceil(filteredCount / limit.value));
    } else {
      rows.value = [];
      totalPages.value = 1;
    }
  } catch (error) {
    console.error("Error saat mengambil data pembelian:", error);
    rows.value = [];
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// Fungsi untuk modal form (hanya tambah)
const openFormModal = () => {
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
};

const handleSubmit = async (formDataFromForm, formIsSubmittingCallback) => {
  // Payload untuk createPurchase sudah sesuai dengan apa yang diharapkan backend (supplier_id, items, catatan)
  // Asumsi PurchaseForm sudah menyiapkan payload yang benar
  try {
    const response = await createPurchase(formDataFromForm); // Hanya create
    if (!response.success) {
      throw new Error(response.message || 'Gagal membuat pembelian.');
    }
    console.log('Pembelian berhasil dibuat:', response);
    closeFormModal();
    fetchData();
  } catch (error) {
    console.error("Error saat membuat pembelian:", error);
    alert(`Gagal membuat pembelian: ${error.message}`);
  } finally {
      if (typeof formIsSubmittingCallback === 'function') {
          formIsSubmittingCallback();
      }
  }
};

// Fungsi untuk modal detail
const openDetailModal = async (purchaseId) => {
    loadingDetail.value = true;
    showDetailModal.value = true;
    selectedPurchaseDetail.value = null;
    try {
        const response = await getPurchaseDetailWithItems(purchaseId); // Panggil service yang benar
        if (response.success && response.data) {
            selectedPurchaseDetail.value = response.data;
        } else {
            console.error("Gagal mengambil detail pembelian:", response.message);
            selectedPurchaseDetail.value = { error: response.message || "Data tidak ditemukan." };
        }
    } catch (error) {
        console.error("Error fetching purchase detail:", error);
        selectedPurchaseDetail.value = { error: error.message || "Terjadi kesalahan saat mengambil data." };
    } finally {
        loadingDetail.value = false;
    }
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedPurchaseDetail.value = null;
};

// Fungsi deletePurchase dan terkait konfirmasi hapus dihilangkan

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