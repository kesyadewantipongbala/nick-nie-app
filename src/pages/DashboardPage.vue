<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
// Impor service dashboard
import { getDashboardSummary } from '../services/dashboardService.js'; // Pastikan path ini benar
import LoadingCircle from '../components/atoms/LoadingCircle.vue'; // Jika Anda ingin menampilkan loading

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler
);

const pageTitle = ref('Dashboard Analitik'); // Judul halaman diubah
const selectedTimeframe = ref('Harian');
const currentFullYear = new Date().getFullYear();
const selectedYear = ref(currentFullYear);

const loadingDashboard = ref(false);

// --- State untuk data yang akan diisi dari API ---
const totalPenjualan = ref({ angka: 'Rp 0', trenLabel: 'Memuat...' });

const penjualanHarianData = ref({ labels: [], data: [], datasetLabel: 'Penjualan Harian' });
const penjualanMingguanData = ref({ labels: [], data: [], datasetLabel: `Penjualan Mingguan - ${selectedYear.value}` });
const penjualanBulananData = ref({ labels: [], data: [], datasetLabel: `Penjualan Bulanan - ${selectedYear.value}` });
const penjualanTahunanData = ref({ labels: [], data: [], datasetLabel: 'Penjualan Tahunan' });

const produkTerlarisKuantitas = ref([]);
const produkTerlarisRupiah = ref([]);
const produkKurangLaris = ref([]);
const stokTerbanyak = ref([]);
const stokRendah = ref([]);
const topPelangganNilai = ref([]);
const topPelangganTransaksi = ref([]);

// --- Fungsi Utilitas ---
const formatAngka = (value) => (typeof value === 'number' ? value.toLocaleString('id-ID') : value);
const parseRupiah = (rpString) => (typeof rpString === 'string' ? parseInt(rpString.replace(/[^0-9]/g, ''), 10) : 0);

const getMonthName = (monthIndex) => { // 0-11
    const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
    return monthNames[monthIndex];
};


const getCurrentDateInfo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11 (Januari-Desember)
  const day = now.getDate(); // Hari dalam bulan (1-31)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { year, month, day, daysInMonth };
};

// --- Computed property untuk Line Chart ---
const lineChartData = computed(() => {
  const { year: currentProcessingYearForOthers, month, daysInMonth } = getCurrentDateInfo();
  let labels = [];
  let data = [];
  let newTotalAngka = 0; // Ini hanya untuk placeholder, akan diisi dari API
  let baseDatasetLabel = 'Penjualan';
  let currentPeriodLabel = ""; // Untuk label dataset yang lebih spesifik

  let activeDataRef;
  switch (selectedTimeframe.value) {
    case 'Tahunan': activeDataRef = penjualanTahunanData.value; break;
    case 'Mingguan': activeDataRef = penjualanMingguanData.value; break;
    case 'Bulanan': activeDataRef = penjualanBulananData.value; break;
    case 'Harian':
    default: activeDataRef = penjualanHarianData.value; break;
  }

  // Jika data dari API belum ada, labels dan data akan kosong
  labels = activeDataRef.labels || [];
  data = activeDataRef.data || [];
  baseDatasetLabel = activeDataRef.datasetLabel || `Penjualan (${selectedTimeframe.value})`;


  // totalPenjualan.angka akan diupdate di fetchDashboardData
  // totalPenjualan.trenLabel juga akan diupdate di fetchDashboardData

  return {
    labels: labels,
    datasets: [{
      label: baseDatasetLabel,
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#059669',
      data: data,
      fill: true,
      tension: 0.3,
    }],
  };
});

// --- Computed properties untuk Bar Charts ---
const produkKuantitasData = computed(() => ({
  labels: produkTerlarisKuantitas.value.map(p => p.nama?.slice(0,15) + (p.nama?.length > 15 ? '...' : '') || 'N/A'),
  datasets: [{ label: 'Kuantitas Terjual', backgroundColor: '#3B82F6', data: produkTerlarisKuantitas.value.map(p => p.total_kuantitas || p.kuantitas || 0) }],
}));
const produkRupiahData = computed(() => ({
  labels: produkTerlarisRupiah.value.map(p => p.nama?.slice(0,15) + (p.nama?.length > 15 ? '...' : '') || 'N/A'),
  datasets: [{ label: 'Nilai Penjualan (Rp)', backgroundColor: '#14B8A6', data: produkTerlarisRupiah.value.map(p => p.total_revenue || parseRupiah(p.nilai) || 0) }],
}));
const stokTerbanyakData = computed(() => ({
  labels: stokTerbanyak.value.map(s => s.nama?.slice(0,15) + (s.nama?.length > 15 ? '...' : '') || 'N/A'),
  datasets: [{ label: 'Jumlah Stok', backgroundColor: ['#F59E0B', '#10B981', '#6366F1'], data: stokTerbanyak.value.map(s => s.jumlah_stok || s.jumlah || 0) }],
}));
const pelangganNilaiData = computed(() => ({
    labels: topPelangganNilai.value.map(c => c.nama_pelanggan?.slice(0,15) + (c.nama_pelanggan?.length > 15 ? '...' : '') || 'N/A'),
    datasets: [{ label: 'Total Pembelian (Rp)', backgroundColor: '#8B5CF6', data: topPelangganNilai.value.map(c => c.total_pembelian_rupiah || parseRupiah(c.totalBeli) || 0) }],
}));
const pelangganTransaksiData = computed(() => ({
    labels: topPelangganTransaksi.value.map(c => c.nama_pelanggan?.slice(0,15) + (c.nama_pelanggan?.length > 15 ? '...' : '') || 'N/A'),
    datasets: [{ label: 'Jumlah Transaksi', backgroundColor: '#EC4899', data: topPelangganTransaksi.value.map(c => c.jumlah_transaksi || 0) }],
}));

// --- Opsi Chart ---
const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

const barChartTitleText = computed(() => {
    let title = `Data ${selectedTimeframe.value}`;
    if (selectedTimeframe.value === 'Tahunan') title += ` (Detail ${selectedYear.value})`;
    return title;
});

// Opsi chart sekarang didefinisikan sebagai computed properties
const horizontalBarOptions = computed(() => ({
  ...chartOptions,
  indexAxis: 'y',
  scales: { x: { beginAtZero: true } },
  plugins: {
    legend: { display: false },
    tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.x !== null) {
                    if (context.dataset.label && context.dataset.label.includes('(Rp)')) {
                         label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.parsed.x);
                    } else {
                        label += context.parsed.x.toLocaleString('id-ID');
                    }
                }
                return label;
            }
        }
    },
    title: { display: true, text: barChartTitleText.value }
  }
}));

const verticalBarOptions = computed(() => ({
  ...chartOptions,
  scales: { y: { beginAtZero: true } },
    plugins: {
    legend: { display: false },
    tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                   label += context.parsed.y.toLocaleString('id-ID');
                }
                return label;
            }
        }
    },
    title: { display: true, text: barChartTitleText.value }
  }
}));

const lineChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top', labels: { font: { size: 10 }}},
    tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                    label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                }
                return label;
            }
        }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          if (value >= 1000000) return 'Rp ' + (value / 1000000).toFixed(1) + 'jt';
          if (value >= 1000) return 'Rp ' + (value / 1000).toFixed(0) + 'rb';
          return 'Rp ' + value;
        }
      }
    },
    x: {
        ticks: {
            autoSkip: true,
            maxTicksLimit: selectedTimeframe.value === 'Tahunan' ? 5 : (selectedTimeframe.value === 'Mingguan' ? 12 : 15),
            callback: function (value, index, ticks) {
              const label = this.getLabelForValue(value);
              return label;
            },
        }
    }
  }
}));


// --- Fungsi Fetch Data Utama ---
const fetchDashboardData = async (timeframe, yearParam = null, monthParam = null, dateParam = null) => {
  loadingDashboard.value = true;
  console.log(`Fetching dashboard data for timeframe: ${timeframe}, year: ${yearParam}, month: ${monthParam}, date: ${dateParam}`);
  try {
    const params = { timeframe };
    if (yearParam) params.year = yearParam;
    if (monthParam) params.month = monthParam;
    if (dateParam) params.date = dateParam;

    const response = await getDashboardSummary(params);
    if (response.success && response.data) {
      const dataFromApi = response.data;

      // 1. Sales Summary & Line Chart
      if (dataFromApi.salesSummary) {
        totalPenjualan.value.angka = `Rp ${Number(dataFromApi.salesSummary.totalSalesValue || 0).toLocaleString('id-ID')}`;
        totalPenjualan.value.trenLabel = dataFromApi.salesSummary.salesTrendLabel || '';
        
        const lineData = dataFromApi.salesSummary.lineChart;
        if (lineData) {
            const targetDataRef = timeframe === 'Harian' ? penjualanHarianData :
                                  timeframe === 'Mingguan' ? penjualanMingguanData :
                                  timeframe === 'Bulanan' ? penjualanBulananData :
                                  penjualanTahunanData;
            targetDataRef.value = {
                labels: lineData.labels || [],
                data: lineData.data || [],
                datasetLabel: lineData.datasetLabel || `Penjualan (${timeframe})`
            };
        } else { // Fallback jika lineData tidak ada di API response
            const fallbackRef = timeframe === 'Harian' ? penjualanHarianData :
                                timeframe === 'Mingguan' ? penjualanMingguanData :
                                timeframe === 'Bulanan' ? penjualanBulananData :
                                penjualanTahunanData;
            fallbackRef.value = { labels: [], data: [], datasetLabel: `Penjualan (${timeframe}) - Data Kosong`};
        }
      } else {
        totalPenjualan.value = { angka: 'Rp 0', trenLabel: 'Data tidak tersedia' };
        penjualanHarianData.value = { labels: [], data: [], datasetLabel: 'Penjualan Harian' };
        penjualanMingguanData.value = { labels: [], data: [], datasetLabel: `Penjualan Mingguan - ${selectedYear.value}` };
        penjualanBulananData.value = { labels: [], data: [], datasetLabel: `Penjualan Bulanan - ${selectedYear.value}` };
        penjualanTahunanData.value = { labels: [], data: [], datasetLabel: 'Penjualan Tahunan' };
      }

      // 2. Produk Terlaris
      produkTerlarisKuantitas.value = dataFromApi.topProductsByQuantity || [];
      produkTerlarisRupiah.value = dataFromApi.topProductsByRevenue || [];

      // 3. Sayuran Kurang Laris
      produkKurangLaris.value = dataFromApi.slowMovingProducts || [];

      // 4. Stok Terbanyak & Stok Rendah
      stokTerbanyak.value = dataFromApi.topStockProducts || [];
      stokRendah.value = dataFromApi.lowStockAlerts || [];

      // 5. Top Pelanggan
      topPelangganNilai.value = dataFromApi.topCustomersByValue || [];
      topPelangganTransaksi.value = dataFromApi.topCustomersByTransactions || [];

    } else {
      console.error('Gagal memuat data dashboard:', response.message);
      // Reset semua data ke default kosong jika gagal
      totalPenjualan.value = { angka: 'Rp 0', trenLabel: 'Gagal memuat' };
      produkTerlarisKuantitas.value = []; produkTerlarisRupiah.value = [];
      produkKurangLaris.value = []; stokTerbanyak.value = []; stokRendah.value = [];
      topPelangganNilai.value = []; topPelangganTransaksi.value = [];
      penjualanHarianData.value = { labels: [], data: [], datasetLabel: 'Penjualan Harian' };
      penjualanMingguanData.value = { labels: [], data: [], datasetLabel: `Penjualan Mingguan - ${selectedYear.value}` };
      penjualanBulananData.value = { labels: [], data: [], datasetLabel: `Penjualan Bulanan - ${selectedYear.value}` };
      penjualanTahunanData.value = { labels: [], data: [], datasetLabel: 'Penjualan Tahunan' };
    }
  } catch (error) {
    console.error('Error di fetchDashboardData:', error);
    totalPenjualan.value = { angka: 'Rp 0', trenLabel: 'Error koneksi' };
    // Reset semua data ke default kosong
    produkTerlarisKuantitas.value = []; produkTerlarisRupiah.value = [];
    produkKurangLaris.value = []; stokTerbanyak.value = []; stokRendah.value = [];
    topPelangganNilai.value = []; topPelangganTransaksi.value = [];
    penjualanHarianData.value = { labels: [], data: [], datasetLabel: 'Penjualan Harian' };
    penjualanMingguanData.value = { labels: [], data: [], datasetLabel: `Penjualan Mingguan - ${selectedYear.value}` };
    penjualanBulananData.value = { labels: [], data: [], datasetLabel: `Penjualan Bulanan - ${selectedYear.value}` };
    penjualanTahunanData.value = { labels: [], data: [], datasetLabel: 'Penjualan Tahunan' };
  } finally {
    loadingDashboard.value = false;
  }
};

const setTimeframe = (timeframe) => {
  selectedTimeframe.value = timeframe;
  const now = new Date();
  const currentDateInfo = getCurrentDateInfo(); // Panggil fungsi yang sudah didefinisikan
  
  let yearToFetch = selectedYear.value;
  let monthToFetch = null; // 1-12
  let dateToFetch = null; // YYYY-MM-DD

  if (timeframe === 'Harian') {
    yearToFetch = currentDateInfo.year;
    monthToFetch = currentDateInfo.month + 1; 
 
  } else if (timeframe === 'Bulanan') {
    yearToFetch = selectedYear.value;
    // Backend akan mengembalikan data untuk semua bulan di yearToFetch
  } else if (timeframe === 'Mingguan') {
    yearToFetch = selectedYear.value;
    // Backend akan mengembalikan data untuk semua minggu di yearToFetch
  } else if (timeframe === 'Tahunan') {
    yearToFetch = selectedYear.value; 
  }
  
  fetchDashboardData(timeframe, yearToFetch, monthToFetch, dateToFetch);
};

onMounted(() => {
  setTimeframe(selectedTimeframe.value);
});


</script>

<template>
  <div class="flex h-screen bg-gray-100 pb-5">
    <div class="flex flex-col flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6 pb-20">
        <div class="flex justify-between items-center mb-6">
            <div class="text-2xl font-bold text-gray-800">{{ pageTitle }}</div>
            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600">Periode:</span>
                <button @click="setTimeframe('Harian')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Harian' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Harian</button>
                <button @click="setTimeframe('Mingguan')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Mingguan' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Mingguan</button>
                <button @click="setTimeframe('Bulanan')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Bulanan' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Bulanan</button>
                <button @click="setTimeframe('Tahunan')" :class="['px-3 py-1 text-sm rounded-md transition', selectedTimeframe === 'Tahunan' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border']">Tahunan</button>
            </div>
        </div>
        
        <div v-if="loadingDashboard" class="flex justify-center items-center h-64">
            <LoadingCircle text="Memuat data dashboard..." />
        </div>

        <div v-else>
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Ringkasan Penjualan dan Keuangan</h2>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                  <h3 class="text-lg font-semibold text-gray-600 mb-1">
                    <span v-if="selectedTimeframe === 'Tahunan'">Total Penjualan (Ringkasan Tahunan)</span>
                    <span v-else>Total Penjualan ({{ selectedTimeframe }})</span>
                  </h3>
                  <p class="text-4xl font-bold text-emerald-500 mb-1">{{ totalPenjualan.angka }}</p>
                  <p class="text-xs text-gray-500">{{ totalPenjualan.trenLabel }}</p>
                  <div class="mt-4 h-72 md:h-80">
                    <Line :data="lineChartData" :options="lineChartOptions" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <h3 class="text-lg font-semibold text-gray-600 mb-3">
                    Produk Terlaris (Kuantitas - {{ selectedTimeframe }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span>)
                  </h3>
                  <div class="h-60 md:h-72 mb-3">
                    <Bar :data="produkKuantitasData" :options="horizontalBarOptions" />
                  </div>
                  <table class="w-full text-sm text-left text-gray-500 mt-2">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr><th class="py-2 px-3">Nama Produk</th><th class="py-2 px-3 text-right">Kuantitas</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="prod in produkTerlarisKuantitas.slice(0,3)" :key="prod.id" class="bg-white border-b">
                        <td class="py-2 px-3 truncate" :title="prod.nama">{{ prod.nama }}</td><td class="py-2 px-3 text-right">{{ formatAngka(prod.total_kuantitas || prod.kuantitas) }} {{ prod.satuan }}</td>
                      </tr>
                      <tr v-if="produkTerlarisKuantitas.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                    </tbody>
                  </table>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <h3 class="text-lg font-semibold text-gray-600 mb-3">
                    Produk Terlaris (Rupiah - {{ selectedTimeframe }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span>)
                  </h3>
                  <div class="h-60 md:h-72 mb-3">
                    <Bar :data="produkRupiahData" :options="horizontalBarOptions" />
                  </div>
                  <table class="w-full text-sm text-left text-gray-500 mt-2">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr><th class="py-2 px-3">Nama Produk</th><th class="py-2 px-3 text-right">Nilai</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="prod in produkTerlarisRupiah.slice(0,3)" :key="prod.id" class="bg-white border-b">
                        <td class="py-2 px-3 truncate" :title="prod.nama">{{ prod.nama }}</td><td class="py-2 px-3 text-right">Rp {{ formatAngka(prod.total_revenue || parseRupiah(prod.nilai)) }}</td>
                      </tr>
                      <tr v-if="produkTerlarisRupiah.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-gray-600 mb-3">
                  Sayuran Kurang Laris (Slow-Moving
                  <span v-if="selectedTimeframe === 'Bulanan'"> - Bulan Ini</span>
                  <span v-else-if="selectedTimeframe === 'Tahunan'"> - {{ selectedYear }}</span>
                  )
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th class="py-2 px-3">Nama Produk</th>
                        <th class="py-2 px-3 text-right">Sisa Stok</th>
                        <th class="py-2 px-3 text-right">
                          Terjual
                          {{ selectedTimeframe === 'Tahunan' ? selectedYear : selectedTimeframe === 'Bulanan' ? 'Bulan Ini' : selectedTimeframe }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="prod in produkKurangLaris" :key="prod.id" class="bg-white border-b">
                        <td class="py-2 px-3">{{ prod.nama }}</td>
                        <td class="py-2 px-3 text-right">{{ formatAngka(prod.sisa_stok) }} {{ prod.satuan }}</td>
                        <td class="py-2 px-3 text-right">{{ formatAngka(prod.terjual_periode_ini) }}</td>
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
                  <h3 class="text-lg font-semibold text-gray-600 mb-3">
                    Stok Sayuran Terbanyak Saat Ini
                  </h3>
                  <div class="h-60 md:h-72 mb-3">
                    <Bar :data="stokTerbanyakData" :options="verticalBarOptions" />
                  </div>
                  <table class="w-full text-sm text-left text-gray-500 mt-2">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr><th class="py-2 px-3">Nama Produk</th><th class="py-2 px-3 text-right">Jumlah</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="stok in stokTerbanyak" :key="stok.id" class="bg-white border-b">
                        <td class="py-2 px-3 truncate" :title="stok.nama">{{ stok.nama }}</td><td class="py-2 px-3 text-right">{{ formatAngka(stok.jumlah_stok || stok.jumlah) }} {{ stok.satuan }}</td>
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
                          <td class="py-2 px-3 text-right text-red-700 font-medium">{{ formatAngka(stok.jumlah_stok || stok.jumlah) }} {{ stok.satuan }}</td>
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
                  <h3 class="text-lg font-semibold text-gray-600 mb-3">
                    Top 5 Pelanggan (Nilai Pembelian - {{ selectedTimeframe }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span>)
                  </h3>
                  <div class="h-60 md:h-72 mb-3">
                    <Bar :data="pelangganNilaiData" :options="horizontalBarOptions" />
                  </div>
                  <table class="w-full text-sm text-left text-gray-500 mt-2">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr><th class="py-2 px-3">Nama Pelanggan</th><th class="py-2 px-3 text-right">Total Pembelian</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="cust in topPelangganNilai" :key="cust.id" class="bg-white border-b">
                        <td class="py-2 px-3 truncate" :title="cust.nama_pelanggan">{{ cust.nama_pelanggan }}</td><td class="py-2 px-3 text-right">Rp {{ formatAngka(cust.total_pembelian_rupiah || parseRupiah(cust.totalBeli)) }}</td>
                      </tr>
                      <tr v-if="topPelangganNilai.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                    </tbody>
                  </table>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <h3 class="text-lg font-semibold text-gray-600 mb-3">
                    Top 5 Pelanggan (Jumlah Transaksi - {{ selectedTimeframe }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span>)
                  </h3>
                  <div class="h-60 md:h-72 mb-3">
                    <Bar :data="pelangganTransaksiData" :options="horizontalBarOptions" />
                  </div>
                  <table class="w-full text-sm text-left text-gray-500 mt-2">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr><th class="py-2 px-3">Nama Pelanggan</th><th class="py-2 px-3 text-right">Jumlah Transaksi</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="cust in topPelangganTransaksi" :key="cust.id" class="bg-white border-b">
                        <td class="py-2 px-3 truncate" :title="cust.nama_pelanggan">{{ cust.nama_pelanggan }}</td><td class="py-2 px-3 text-right">{{ formatAngka(cust.jumlah_transaksi) }}</td>
                      </tr>
                      <tr v-if="topPelangganTransaksi.length === 0"><td colspan="2" class="text-center py-3">Tidak ada data.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
        </div> </main>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Default max-width */
}

@media (max-width: 768px) {
  .h-60 { height: 16rem; }
  .h-72 { height: 18rem; }
  .h-80 { height: 20rem; } /* Penyesuaian untuk line chart di mobile */
  .truncate { max-width: 100px; } /* Max-width lebih kecil untuk mobile */
}
</style>
