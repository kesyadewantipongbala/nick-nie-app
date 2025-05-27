<template>
  <div class="print-area">
    <div class="print-container p-4 md:p-6 mx-auto" v-if="!loadingDetail && transactionDetail && !transactionDetail.error">
      <div class="header-print text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Nota Transaksi</h1>
        <p class="text-lg font-semibold text-gray-700">Nick Nie Buah dan Sayur</p>
        </div>

      <div class="transaction-details space-y-4">
        <div class="info-section border-b border-dashed pb-3 mb-3">
          <h3 class="text-md font-semibold text-gray-700 mb-2 sr-only">Informasi Umum</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p><strong class="text-gray-600 w-32 inline-block">No. Nota:</strong> {{ transactionDetail.transaction_code }}</p>
            <p><strong class="text-gray-600 w-32 inline-block">Tanggal:</strong> {{ formatDate(transactionDetail.created_at, true) }}</p>
            <p><strong class="text-gray-600 w-32 inline-block">Pelanggan:</strong> {{ transactionDetail.customer_name || `ID: ${transactionDetail.customer_id}` }}</p>
            <p><strong class="text-gray-600 w-32 inline-block">Kasir:</strong> {{ transactionDetail.pegawai || `ID: ${transactionDetail.user_id}` }}</p>
          </div>
        </div>

        <div class="items-section">
          <h3 class="text-md font-semibold text-gray-700 mb-1 sr-only">Item Produk Dibeli</h3>
          <table class="min-w-full text-sm">
            <thead class="border-b-2 border-dashed border-gray-400">
              <tr>
                <th class="pb-1 pt-1 text-left font-semibold text-gray-600">No.</th>
                <th class="pb-1 pt-1 text-left font-semibold text-gray-600">Produk</th>
                <th class="pb-1 pt-1 text-left font-semibold text-gray-600">Kode</th>
                <th class="pb-1 pt-1 text-right font-semibold text-gray-600">Qty</th>
                <th class="pb-1 pt-1 text-right font-semibold text-gray-600">Harga Satuan</th>
                <th class="pb-1 pt-1 text-right font-semibold text-gray-600">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dashed divide-gray-300">
              <tr v-if="!transactionDetail.items || transactionDetail.items.length === 0">
                <td colspan="6" class="py-2 text-center text-gray-500">Tidak ada item.</td>
              </tr>
              <tr v-for="(item, index) in transactionDetail.items" :key="item.id || item.product_id">
                <td class="py-1 pr-2">{{ index + 1 }}.</td>
                <td class="py-1 pr-2 whitespace-nowrap">{{ item.product_name }}</td>
                <td class="py-1 pr-2 whitespace-nowrap">{{ item.kode_barang }}</td>
                <td class="py-1 text-right whitespace-nowrap">{{ item.quantity }}</td>
                <td class="py-1 text-right whitespace-nowrap">Rp{{ (item.harga_satuan || 0).toLocaleString('id-ID') }}</td>
                <td class="py-1 text-right whitespace-nowrap">Rp{{ (item.subtotal || 0).toLocaleString('id-ID') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="total-section mt-4 pt-3 border-t-2 border-dashed border-gray-400 text-right">
          <p class="text-md font-bold text-gray-800 mt-2">
            Total Harga:
            <span class="text-lg ml-2">Rp {{ (transactionDetail.total_harga || 0).toLocaleString('id-ID') }}</span>
          </p>
        </div>

        <div class="footer-print mt-6 text-center text-xs text-gray-500">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Simpan struk ini sebagai bukti pembayaran yang sah.</p>
        </div>
      </div>

      <div v-if="!autoPrintTriggered && !loadingDetail && transactionDetail && !transactionDetail.error" class="mt-8 text-center no-print">
          <button @click="triggerPrint" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Cetak Ulang Nota
          </button>
           <button @click="window.close()" class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Tutup
          </button>
      </div>
    </div>

    <div v-else-if="loadingDetail" class="flex justify-center items-center h-screen no-print">
      <LoadingCircle text="Memuat data nota transaksi..." />
    </div>

    <div v-else class="text-center text-gray-500 p-10 no-print">
      <p>Gagal memuat detail transaksi: {{ transactionDetail && transactionDetail.error ? transactionDetail.error : "ID Transaksi tidak valid atau data tidak ditemukan." }}</p>
       <button @click="window.close()" class="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Tutup
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
// Menggunakan getTransactionDetail dari transactionService.js
import { getTransactionDetail } from '../../services/transactionService.js'; // Sesuaikan path jika perlu
import LoadingCircle from '../atoms/LoadingCircle.vue'; // Sesuaikan path jika perlu

const route = useRoute();
const transactionDetail = ref(null); // Mengganti nama variabel
const loadingDetail = ref(true);
const autoPrintTriggered = ref(false);

const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.timeZone = 'Asia/Jakarta'; // Pastikan timezone sesuai
  }
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const triggerPrint = () => { // Menghapus async karena setTimeout tidak perlu di-await di sini
  // Kondisi ini memastikan kita hanya print jika data valid dan sudah tidak loading
  if (!loadingDetail.value && transactionDetail.value && !transactionDetail.value.error) {
    console.log("Data valid dan DOM siap. Memicu window.print().");
    window.print();
    autoPrintTriggered.value = true;
  } else {
    console.warn("Coba print, tapi data belum siap atau ada error.");
  }
};

onMounted(async () => {
  const transactionId = route.params.id; // Menggunakan nama yang lebih generik
  let pageTitle = `Nota Transaksi - Loading...`;
  if (document) document.title = pageTitle;
  loadingDetail.value = true;

  if (transactionId) {
    try {
      const response = await getTransactionDetail(transactionId); // Menggunakan service transaksi
      if (response.success && response.data) {
        transactionDetail.value = response.data;
        pageTitle = `Nota Transaksi - ${response.data.transaction_code || transactionId}`; // Menggunakan transaction_code
        if (document) document.title = pageTitle;
        
        loadingDetail.value = false; // Data berhasil dimuat, set loading false

        // Tunggu DOM update setelah loadingDetail false dan transactionDetail terisi
        await nextTick(); 
        
        if (!autoPrintTriggered.value) {
          // Tambahkan jeda singkat untuk memastikan browser selesai render sebelum print
          setTimeout(() => {
            triggerPrint();
          }, 100); // Jeda 100ms, bisa disesuaikan
        }
      } else {
        transactionDetail.value = { error: response.message || "Data transaksi tidak ditemukan." };
        pageTitle = `Nota Transaksi - Error`;
        if (document) document.title = pageTitle;
        loadingDetail.value = false;
      }
    } catch (error) {
      console.error("Error fetching transaction detail for print:", error);
      let errorMessage = "Terjadi kesalahan saat mengambil data.";
      if (error.response && error.response.status === 404) {
        errorMessage = "Data transaksi dengan ID ini tidak ditemukan di server (404).";
      } else if (error.message) {
        errorMessage = error.message;
      }
      transactionDetail.value = { error: errorMessage };
      pageTitle = `Nota Transaksi - Error`;
      if (document) document.title = pageTitle;
      loadingDetail.value = false;
    }
  } else {
    transactionDetail.value = { error: "ID Transaksi tidak valid atau tidak ada." };
    pageTitle = `Nota Transaksi - Invalid ID`;
    if (document) document.title = pageTitle;
    loadingDetail.value = false;
  }
});
</script>

<style scoped>
.print-area {
  background-color: #fff; /* Pastikan background putih untuk print */
}
.print-container {
  font-family: 'Arial', sans-serif;
  color: #333;
  max-width: 80mm; /* Lebar umum kertas struk thermal, atau sesuaikan. Misal A4: 200mm */
  margin-left: auto;
  margin-right: auto;
  padding: 10px; /* Padding dasar untuk konten */
}

.header-print h1 { font-size: 1.3em; margin-bottom: 0.2em; }
.header-print p { font-size: 0.9em; margin-bottom: 0.5em; }
.info-section strong { display: inline-block; min-width: 70px; font-weight: 600; }
table { width: 100%; border-collapse: collapse; margin-top: 5px; }
th, td { padding: 4px 2px; text-align: left; vertical-align: top; font-size: 0.85em; }
th { font-weight: 600; border-bottom: 1px solid #555; }
tbody tr td { border-bottom: 1px dashed #eee; }
tbody tr:last-child td { border-bottom: none; }
.text-right { text-align: right; }
.total-section { margin-top: 10px; padding-top: 5px; border-top: 1px dashed #555; }
.total-section p { margin-bottom: 3px; }
.total-section strong { font-size: 1em; }
.total-section span { font-size: 1.1em; }
.footer-print { margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; }

@media print {
  body { margin: 0; padding: 0; background-color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-area {
      /* Tidak perlu style khusus jika ini adalah root komponen untuk rute print dan App.vue sudah benar */
  }
  .print-container {
    margin: 0 auto !important;
    padding: 5mm !important; /* Margin dalam kertas */
    width: 100% !important;
    max-width: 100% !important; /* Override max-width untuk print */
    box-shadow: none !important;
    border: none !important;
    font-size: 9pt; /* Ukuran font dasar untuk print */
  }
  .no-print { display: none !important; }
  @page { size: auto; margin: 8mm; } /* Margin kertas cetak, sesuaikan */
  
  .header-print h1 { font-size: 14pt; }
  .header-print p { font-size: 8pt; }
  .info-section p, .items-section td, .items-section th { font-size: 8pt; }
  .total-section p { font-size: 9pt; }
  .total-section span { font-size: 10pt; }
  .footer-print p { font-size: 7pt; }

  table { page-break-inside: auto; }
  tr    { page-break-inside: avoid; page-break-after: auto; }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  .info-section, .items-section, .total-section, .footer-print { page-break-inside: avoid; }
}
</style>