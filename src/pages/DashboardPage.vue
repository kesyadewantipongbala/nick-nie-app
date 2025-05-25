<script setup>
import { ref, onMounted } from 'vue';
// Komponen SummaryBox mungkin tidak lagi relevan untuk layout baru yang lebih kompleks,
// tapi bisa Anda gunakan kembali atau modifikasi jika ada bagian yang cocok.
// import SummaryBox from '../components/atoms/SummaryBox.vue';

const pageTitle = ref('Dashboard Analitik');
const selectedTimeframe = ref('Harian'); // Untuk filter Harian/Mingguan/Bulanan

// Placeholder Data (gantilah dengan data dari API Anda)
const totalPenjualan = ref({
  angka: 'Rp 1.250.000',
  trenLabel: '+15% vs kemarin',
});

const metodePembayaranData = ref([
  { metode: 'Transfer Bank', jumlah: 120 },
  { metode: 'E-Wallet', jumlah: 80 },
  { metode: 'COD', jumlah: 50 },
]);

const produkTerlarisKuantitas = ref([
  { id: 1, nama: 'Bayam Merah Super', kuantitas: 150, satuan: 'ikat' },
  { id: 2, nama: 'Kangkung Hidroponik', kuantitas: 120, satuan: 'ikat' },
  { id: 3, nama: 'Wortel Berastagi', kuantitas: 90, satuan: 'kg' },
  { id: 4, nama: 'Tomat Cherry Organik', kuantitas: 85, satuan: 'pack' },
  { id: 5, nama: 'Selada Romaine', kuantitas: 70, satuan: 'kepala' },
]);

const produkTerlarisRupiah = ref([
  { id: 1, nama: 'Wortel Berastagi', nilai: 'Rp 2.500.000' },
  { id: 2, nama: 'Bayam Merah Super', nilai: 'Rp 1.800.000' },
  { id: 3, nama: 'Kangkung Hidroponik', nilai: 'Rp 1.500.000' },
  { id: 4, nama: 'Brokoli Premium', nilai: 'Rp 1.200.000' },
  { id: 5, nama: 'Paprika Mix', nilai: 'Rp 950.000' },
]);

const produkKurangLaris = ref([
  { id: 10, nama: 'Lobak Putih', sisaStok: 50, terjualBulanIni: 5 },
  { id: 11, nama: 'Daun Bawang Prei', sisaStok: 30, terjualBulanIni: 8 },
  { id: 12, nama: 'Seledri Batang Besar', sisaStok: 25, terjualBulanIni: 10 },
]);

const stokTerbanyak = ref([
  { id: 1, nama: 'Kangkung Hidroponik', jumlah: 500, satuan: 'ikat' },
  { id: 2, nama: 'Bayam Merah Super', jumlah: 450, satuan: 'ikat' },
  { id: 3, nama: 'Wortel Berastagi', jumlah: 300, satuan: 'kg' },
]);

const stokRendah = ref([
  { id: 20, nama: 'Cabai Rawit Merah', jumlah: 10, satuan: 'kg', batasMin: 15 },
  { id: 21, nama: 'Bawang Putih Kupas', jumlah: 5, satuan: 'kg', batasMin: 10 },
  { id: 22, nama: 'Jahe Emprit', jumlah: 8, satuan: 'kg', batasMin: 5 },
]);

const topPelangganNilai = ref([
    { id: 1, nama: 'Restoran Enak Jaya', totalBeli: 'Rp 5.500.000' },
    { id: 2, nama: 'Catering Sehat Bunda', totalBeli: 'Rp 4.800.000' },
    { id: 3, nama: 'Hotel Bintang Lima', totalBeli: 'Rp 3.200.000' },
    { id: 4, nama: 'Kafe Senja Teduh', totalBeli: 'Rp 2.800.000' },
    { id: 5, nama: 'Pasar Swalayan Segar', totalBeli: 'Rp 1.500.000' },
]);

const topPelangganTransaksi = ref([
    { id: 1, nama: 'Restoran Enak Jaya', jumlahTransaksi: 25 },
    { id: 2, nama: 'Ibu Rumah Tangga Komplek A', jumlahTransaksi: 22 },
    { id: 3, nama: 'Kafe Senja Teduh', jumlahTransaksi: 18 },
    { id: 4, nama: 'Catering Sehat Bunda', jumlahTransaksi: 15 },
    { id: 5, nama: 'Warung Makan Sederhana', jumlahTransaksi: 12 },
]);

// Fungsi untuk memformat angka (opsional, sesuaikan dengan kebutuhan)
const formatAngka = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('id-ID');
  }
  return value;
};

// TODO: Buat fungsi untuk fetch data dinamis di onMounted atau saat timeframe berubah
// onMounted(() => {
//   fetchDashboardData(selectedTimeframe.value);
// });

// const fetchDashboardData = async (timeframe) => {
//   console.log(`Workspaceing data for: ${timeframe}`);
//   // Panggil API Anda di sini
// };

const setTimeframe = (timeframe) => {
    selectedTimeframe.value = timeframe;
    // fetchDashboardData(timeframe); // Panggil API dengan timeframe baru
}

</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <div class="flex flex-col flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
            <div class="text-2xl font-bold text-gray-800">{{ pageTitle }}</div>
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Periode:</span>
                <button @click="setTimeframe('Harian')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Harian' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Harian</button>
                <button @click="setTimeframe('Mingguan')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Mingguan' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Mingguan</button>
                <button @click="setTimeframe('Bulanan')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Bulanan' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Bulanan</button>
            </div>
        </div>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Ringkasan Penjualan dan Keuangan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-1">Total Penjualan ({{ selectedTimeframe }})</h3>
              <p class="text-4xl font-bold text-emerald-500 mb-1">{{ totalPenjualan.angka }}</p>
              <p class="text-xs text-gray-500">{{ totalPenjualan.trenLabel }}</p>
              <div class="mt-4 h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                Placeholder: Line Chart Tren Penjualan
              </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md md:col-span-1 lg:col-span-2">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">Metode Pembayaran ({{ selectedTimeframe }})</h3>
              <div class="h-48 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                Placeholder: Pie Chart / Bar Chart Metode Pembayaran
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">Produk Terlaris (Kuantitas - {{ selectedTimeframe }})</h3>
              <div class="h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500 mb-3">
                Placeholder: Horizontal Bar Chart
              </div>
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr><th class="py-2 px-3">Nama Produk</th><th class="py-2 px-3 text-right">Kuantitas</th></tr>
                </thead>
                <tbody>
                  <tr v-for="prod in produkTerlarisKuantitas.slice(0,3)" :key="prod.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ prod.nama }}</td><td class="py-2 px-3 text-right">{{ formatAngka(prod.kuantitas) }} {{ prod.satuan }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">Produk Terlaris (Rupiah - {{ selectedTimeframe }})</h3>
              <div class="h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500 mb-3">
                Placeholder: Horizontal Bar Chart
              </div>
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr><th class="py-2 px-3">Nama Produk</th><th class="py-2 px-3 text-right">Nilai</th></tr>
                </thead>
                <tbody>
                  <tr v-for="prod in produkTerlarisRupiah.slice(0,3)" :key="prod.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ prod.nama }}</td><td class="py-2 px-3 text-right">{{ prod.nilai }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-600 mb-3">Sayuran Kurang Laris (Slow-Moving)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="py-2 px-3">Nama Produk</th>
                    <th class="py-2 px-3 text-right">Sisa Stok</th>
                    <th class="py-2 px-3 text-right">Terjual Bulan Ini</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prod in produkKurangLaris" :key="prod.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ prod.nama }}</td>
                    <td class="py-2 px-3 text-right">{{ formatAngka(prod.sisaStok) }}</td>
                    <td class="py-2 px-3 text-right">{{ formatAngka(prod.terjualBulanIni) }}</td>
                  </tr>
                   <tr v-if="produkKurangLaris.length === 0"><td colspan="3" class="text-center py-3">Tidak ada data.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Manajemen Stok dan Inventaris</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">Stok Sayuran Terbanyak Saat Ini</h3>
               <div class="h-48 bg-gray-200 flex items-center justify-center rounded text-gray-500 mb-3">
                Placeholder: Bar Chart Stok
              </div>
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr><th class="py-2 px-3">Nama Produk</th><th class="py-2 px-3 text-right">Jumlah</th></tr>
                </thead>
                <tbody>
                  <tr v-for="stok in stokTerbanyak" :key="stok.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ stok.nama }}</td><td class="py-2 px-3 text-right">{{ formatAngka(stok.jumlah) }} {{ stok.satuan }}</td>
                  </tr>
                  <tr v-if="stokTerbanyak.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                </tbody>
              </table>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-red-600 mb-3">Peringatan Stok Rendah!</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th class="py-2 px-3">Nama Produk</th>
                      <th class="py-2 px-3 text-right">Sisa Stok</th>
                      <th class="py-2 px-3 text-right">Batas Min.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stok in stokRendah" :key="stok.id" class="bg-white border-b hover:bg-red-50">
                      <td class="py-2 px-3 text-red-700 font-medium">{{ stok.nama }}</td>
                      <td class="py-2 px-3 text-right text-red-700 font-medium">{{ formatAngka(stok.jumlah) }} {{ stok.satuan }}</td>
                      <td class="py-2 px-3 text-right">{{ formatAngka(stok.batasMin) }}</td>
                    </tr>
                    <tr v-if="stokRendah.length === 0"><td colspan="3" class="text-center py-3 text-gray-500">Tidak ada peringatan stok rendah.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Analisis Pesanan dan Pelanggan</h2>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">Top 5 Pelanggan (Nilai Pembelian - {{selectedTimeframe}})</h3>
               <div class="h-48 bg-gray-200 flex items-center justify-center rounded text-gray-500 mb-3">
                Placeholder: Horizontal Bar Chart
              </div>
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr><th class="py-2 px-3">Nama Pelanggan</th><th class="py-2 px-3 text-right">Total Pembelian</th></tr>
                </thead>
                <tbody>
                  <tr v-for="cust in topPelangganNilai" :key="cust.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ cust.nama }}</td><td class="py-2 px-3 text-right">{{ cust.totalBeli }}</td>
                  </tr>
                  <tr v-if="topPelangganNilai.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                </tbody>
              </table>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">Top 5 Pelanggan (Jumlah Transaksi - {{selectedTimeframe}})</h3>
              <div class="h-48 bg-gray-200 flex items-center justify-center rounded text-gray-500 mb-3">
                Placeholder: Horizontal Bar Chart
              </div>
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr><th class="py-2 px-3">Nama Pelanggan</th><th class="py-2 px-3 text-right">Jumlah Transaksi</th></tr>
                </thead>
                <tbody>
                  <tr v-for="cust in topPelangganTransaksi" :key="cust.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ cust.nama }}</td><td class="py-2 px-3 text-right">{{ formatAngka(cust.jumlahTransaksi) }}</td>
                  </tr>
                  <tr v-if="topPelangganTransaksi.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>