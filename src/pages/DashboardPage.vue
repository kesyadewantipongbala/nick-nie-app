<!-- src\pages\DashboardPage.vue -->
<script setup>
  import { ref, computed, onMounted } from 'vue';
  // 1. Impor komponen chart dari vue-chartjs
  import { Bar, Line } from 'vue-chartjs';
  // 2. Impor elemen-elemen yang diperlukan dari chart.js
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

  // 3. Daftarkan elemen-elemen Chart.js
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
  );

  const pageTitle = ref('Dashboard');
  const selectedTimeframe = ref('Harian'); // Default Harian
  const currentYear = new Date().getFullYear(); // Ini akan menjadi 2025
  const selectedYear = ref(currentYear);

  const totalPenjualan = ref({
    angka: 'Rp 0',
    trenLabel: '',
  });

  const getCurrentDateInfo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, day, daysInMonth };
  };

  const generateRandomData = (length, min = 100000, max = 2000000) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const getMonthName = (monthIndex) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Ags',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return monthNames[monthIndex];
  };

  const lineChartData = computed(() => {
    const { year: currentProcessingYearForOthers, month, daysInMonth } = getCurrentDateInfo();
    let labels = [];
    let data = [];
    let newTotalAngka = 0;
    let baseDatasetLabel = 'Penjualan'; // Label dasar untuk dataset

    switch (selectedTimeframe.value) {
      case 'Tahunan':
        // Menampilkan ringkasan untuk 3 tahun: currentYear-2, currentYear-1, currentYear
        const yearsToDisplay = [currentYear - 2, currentYear - 1, currentYear]; // Hasilnya: [2023, 2024, 2025]
        labels = yearsToDisplay.map(String); // Label X-axis: ['2023', '2024', '2025']
        // Data penjualan tahunan (total per tahun)
        data = generateRandomData(yearsToDisplay.length, 100000000, 500000000); // Min/max untuk total tahunan
        newTotalAngka = data.reduce((sum, val) => sum + val, 0); // Total dari 3 tahun untuk kartu
        totalPenjualan.value.trenLabel = `Ringkasan penjualan ${yearsToDisplay.join(', ')}`;
        baseDatasetLabel = 'Penjualan Tahunan';
        // currentPeriodLabel tidak digunakan secara eksplisit di dataset label untuk kasus ini
        break;
      case 'Mingguan':
        labels = Array.from({ length: 52 }, (_, i) => `M${i + 1}`);
        data = generateRandomData(52, 2000000, 7000000);
        newTotalAngka = data.reduce((sum, val) => sum + val, 0);
        totalPenjualan.value.trenLabel = `vs. tahun lalu (placeholder)`;
        baseDatasetLabel = `Penjualan Mingguan - ${currentProcessingYearForOthers}`;
        break;
      case 'Bulanan':
        labels = Array.from({ length: 12 }, (_, i) => getMonthName(i));
        data = generateRandomData(12, 10000000, 30000000);
        newTotalAngka = data.reduce((sum, val) => sum + val, 0);
        totalPenjualan.value.trenLabel = `vs. tahun lalu (placeholder)`;
        baseDatasetLabel = `Penjualan Bulanan - ${currentProcessingYearForOthers}`;
        break;
      case 'Harian':
      default:
        labels = Array.from({ length: daysInMonth }, (_, i) => {
          const dayOfMonth = i + 1;
          const currentMonth = month + 1;
          return `${dayOfMonth}/${currentMonth}`;
        });
        data = generateRandomData(daysInMonth, 500000, 1500000);
        newTotalAngka = data.reduce((sum, val) => sum + val, 0);
        totalPenjualan.value.trenLabel = `vs. kemarin (placeholder)`;
        baseDatasetLabel = `Penjualan Harian - ${getMonthName(month)} ${currentProcessingYearForOthers}`;
        break;
    }

    totalPenjualan.value.angka = `Rp ${newTotalAngka.toLocaleString('id-ID')}`;

    return {
      labels: labels,
      datasets: [
        {
          label: baseDatasetLabel,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#059669',
          data: data,
          fill: true,
          tension: 0.3, // Mungkin ingin diatur ke 0 untuk bar-like appearance jika ini line chart tahunan
        },
      ],
    };
  });

  // --- Data Placeholder Lainnya (tetap statis untuk saat ini) ---
  const produkTerlarisKuantitas = ref([
    { id: 1, nama: 'Bayam Merah Super', kuantitas: 150, satuan: 'ikat' },
    { id: 2, nama: 'Kangkung Hidroponik', kuantitas: 120, satuan: 'ikat' },
    { id: 3, nama: 'Wortel Berastagi', kuantitas: 90, satuan: 'kg' },
  ]);

  const produkTerlarisRupiah = ref([
    { id: 1, nama: 'Wortel Berastagi', nilai: 'Rp 2.500.000' },
    { id: 2, nama: 'Bayam Merah Super', nilai: 'Rp 1.800.000' },
    { id: 3, nama: 'Kangkung Hidroponik', nilai: 'Rp 1.500.000' },
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
  ]);

  const topPelangganTransaksi = ref([
    { id: 1, nama: 'Restoran Enak Jaya', jumlahTransaksi: 25 },
    { id: 2, nama: 'Ibu Rumah Tangga Komplek A', jumlahTransaksi: 22 },
    { id: 3, nama: 'Kafe Senja Teduh', jumlahTransaksi: 18 },
  ]);

  const formatAngka = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString('id-ID');
    }
    return value;
  };

  const parseRupiah = (rpString) => {
    if (typeof rpString !== 'string') return 0;
    return parseInt(rpString.replace(/[^0-9]/g, ''), 10);
  };

  const produkKuantitasData = computed(() => ({
    labels: produkTerlarisKuantitas.value.map(
      (p) => p.nama.slice(0, 15) + (p.nama.length > 15 ? '...' : '')
    ),
    datasets: [
      {
        label: 'Kuantitas Terjual',
        backgroundColor: '#3B82F6',
        data: produkTerlarisKuantitas.value.map((p) => p.kuantitas),
      },
    ],
  }));

  const produkRupiahData = computed(() => ({
    labels: produkTerlarisRupiah.value.map(
      (p) => p.nama.slice(0, 15) + (p.nama.length > 15 ? '...' : '')
    ),
    datasets: [
      {
        label: 'Nilai Penjualan (Rp)',
        backgroundColor: '#14B8A6',
        data: produkTerlarisRupiah.value.map((p) => parseRupiah(p.nilai)),
      },
    ],
  }));

  const stokTerbanyakData = computed(() => ({
    labels: stokTerbanyak.value.map((s) => s.nama.slice(0, 15) + (s.nama.length > 15 ? '...' : '')),
    datasets: [
      {
        label: 'Jumlah Stok',
        backgroundColor: ['#F59E0B', '#10B981', '#6366F1', '#F43F5E', '#D946EF'],
        data: stokTerbanyak.value.map((s) => s.jumlah),
      },
    ],
  }));

  const pelangganNilaiData = computed(() => ({
    labels: topPelangganNilai.value.map(
      (c) => c.nama.slice(0, 15) + (c.nama.length > 15 ? '...' : '')
    ),
    datasets: [
      {
        label: 'Total Pembelian (Rp)',
        backgroundColor: '#8B5CF6',
        data: topPelangganNilai.value.map((c) => parseRupiah(c.totalBeli)),
      },
    ],
  }));

  const pelangganTransaksiData = computed(() => ({
    labels: topPelangganTransaksi.value.map(
      (c) => c.nama.slice(0, 15) + (c.nama.length > 15 ? '...' : '')
    ),
    datasets: [
      {
        label: 'Jumlah Transaksi',
        backgroundColor: '#EC4899',
        data: topPelangganTransaksi.value.map((c) => c.jumlahTransaksi),
      },
    ],
  }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Umumnya legenda utama disembunyikan untuk bar chart individual
    },
  };

  const barChartTitleText = computed(() => {
    let title = `Data ${selectedTimeframe.value}`;
    // Untuk 'Tahunan', selectedYear (yaitu currentYear) masih relevan jika kartu lain menunjukkan detail tahun terakhir
    if (selectedTimeframe.value === 'Tahunan') {
      title += ` (Detail ${selectedYear.value})`; // Mengklarifikasi bahwa detail bar chart mungkin untuk tahun terakhir
    }
    return title;
  });

  const horizontalBarOptions = computed(() => ({
    ...chartOptions,
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.x !== null) {
              if (context.dataset.label && context.dataset.label.includes('(Rp)')) {
                label += new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(context.parsed.x);
              } else {
                label += context.parsed.x.toLocaleString('id-ID');
              }
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: barChartTitleText.value,
      },
    },
  }));

  const verticalBarOptions = computed(() => ({
    ...chartOptions,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('id-ID');
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: barChartTitleText.value,
      },
    },
  }));

  const lineChartOptions = computed(() => ({
    // Ubah menjadi computed property
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 10 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (value >= 1000000) return 'Rp ' + value / 1000000 + 'jt';
            if (value >= 1000) return 'Rp ' + value / 1000 + 'rb';
            return 'Rp ' + value;
          },
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          // maxTicksLimit: disesuaikan berdasarkan timeframe di bawah
          maxTicksLimit: selectedTimeframe.value === 'Tahunan' ? 5 : 15, // Lebih sedikit tick untuk tahunan
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(value);
            return label;
          },
        },
      },
    },
  }));

  const fetchDashboardData = async (timeframe, year = null) => {
    let logMessage = `TODO: Memuat data untuk: ${timeframe}`;
    if (timeframe === 'Tahunan') {
      // Untuk 'Tahunan', kita tidak lagi menggunakan 'year' tunggal untuk fetch utama data line chart,
      // karena line chart akan menampilkan beberapa tahun sekaligus.
      // 'year' (yaitu selectedYear.value / currentYear) mungkin masih relevan untuk data pendukung/detail.
      logMessage += ` (Ringkasan ${currentYear - 2}-${currentYear}, detail mungkin untuk ${selectedYear.value})`;
    } else if (year) {
      logMessage += ` - Tahun: ${year}`;
    }
    console.log(logMessage);
    // Implementasi API call
  };

  const setTimeframe = (timeframe) => {
    selectedTimeframe.value = timeframe;
    if (timeframe === 'Tahunan') {
      selectedYear.value = currentYear; // Tetap set selectedYear untuk konsistensi judul kartu lain
      // Fetch data untuk ringkasan tahunan (misal 2023, 2024, 2025)
      // Parameter 'year' di sini mungkin tidak lagi digunakan untuk menentukan data utama line chart tahunan,
      // tapi bisa untuk data pendukung lainnya.
      fetchDashboardData(timeframe, selectedYear.value);
    } else {
      fetchDashboardData(timeframe);
    }
  };

  onMounted(() => {
    if (selectedTimeframe.value === 'Tahunan') {
      selectedYear.value = currentYear;
      fetchDashboardData(selectedTimeframe.value, selectedYear.value);
    } else {
      fetchDashboardData(selectedTimeframe.value);
    }
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
            <button
              @click="setTimeframe('Harian')"
              :class="[
                'px-3 py-1 text-sm rounded-md transition',
                selectedTimeframe === 'Harian'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border',
              ]"
            >
              Harian
            </button>
            <button
              @click="setTimeframe('Mingguan')"
              :class="[
                'px-3 py-1 text-sm rounded-md transition',
                selectedTimeframe === 'Mingguan'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border',
              ]"
            >
              Mingguan
            </button>
            <button
              @click="setTimeframe('Bulanan')"
              :class="[
                'px-3 py-1 text-sm rounded-md transition',
                selectedTimeframe === 'Bulanan'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border',
              ]"
            >
              Bulanan
            </button>
            <button
              @click="setTimeframe('Tahunan')"
              :class="[
                'px-3 py-1 text-sm rounded-md transition',
                selectedTimeframe === 'Tahunan'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border',
              ]"
            >
              Tahunan
            </button>
          </div>
        </div>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Ringkasan Penjualan</h2>
          <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 class="text-lg font-semibold text-gray-600 mb-1">
              <span v-if="selectedTimeframe === 'Tahunan'"
                >Total Penjualan (Ringkasan Tahunan)</span
              >
              <span v-else>Total Penjualan ({{ selectedTimeframe }})</span>
            </h3>
            <p class="text-4xl font-bold text-emerald-500 mb-1">{{ totalPenjualan.angka }}</p>
            <p class="text-xs text-gray-500">{{ totalPenjualan.trenLabel }}</p>
            <div class="mt-4 h-72 md:h-80">
              <Line :data="lineChartData" :options="lineChartOptions" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">
                Produk Terlaris (Kuantitas - {{ selectedTimeframe
                }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span
                >)
              </h3>
              <div class="h-60 md:h-72 mb-3">
                <Bar :data="produkKuantitasData" :options="horizontalBarOptions" />
              </div>
              <table class="w-full text-sm text-left text-gray-500 mt-2">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="py-2 px-3">Nama Produk</th>
                    <th class="py-2 px-3 text-right">Kuantitas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="prod in produkTerlarisKuantitas.slice(0, 3)"
                    :key="prod.id"
                    class="bg-white border-b"
                  >
                    <td class="py-2 px-3 truncate" :title="prod.nama">{{ prod.nama }}</td>
                    <td class="py-2 px-3 text-right">
                      {{ formatAngka(prod.kuantitas) }} {{ prod.satuan }}
                    </td>
                  </tr>
                  <tr v-if="produkTerlarisKuantitas.length === 0">
                    <td colspan="2" class="text-center py-3">Tidak ada data.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">
                Produk Terlaris (Rupiah - {{ selectedTimeframe
                }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span
                >)
              </h3>
              <div class="h-60 md:h-72 mb-3">
                <Bar :data="produkRupiahData" :options="horizontalBarOptions" />
              </div>
              <table class="w-full text-sm text-left text-gray-500 mt-2">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="py-2 px-3">Nama Produk</th>
                    <th class="py-2 px-3 text-right">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="prod in produkTerlarisRupiah.slice(0, 3)"
                    :key="prod.id"
                    class="bg-white border-b"
                  >
                    <td class="py-2 px-3 truncate" :title="prod.nama">{{ prod.nama }}</td>
                    <td class="py-2 px-3 text-right">{{ prod.nilai }}</td>
                  </tr>
                  <tr v-if="produkTerlarisRupiah.length === 0">
                    <td colspan="2" class="text-center py-3">Tidak ada data.</td>
                  </tr>
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
                      {{
                        selectedTimeframe === 'Tahunan'
                          ? selectedYear
                          : selectedTimeframe === 'Bulanan'
                            ? 'Bulan Ini'
                            : ''
                      }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prod in produkKurangLaris" :key="prod.id" class="bg-white border-b">
                    <td class="py-2 px-3">{{ prod.nama }}</td>
                    <td class="py-2 px-3 text-right">{{ formatAngka(prod.sisaStok) }}</td>
                    <td class="py-2 px-3 text-right">{{ formatAngka(prod.terjualBulanIni) }}</td>
                  </tr>
                  <tr v-if="produkKurangLaris.length === 0">
                    <td colspan="3" class="text-center py-3">Tidak ada data.</td>
                  </tr>
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
                  <tr>
                    <th class="py-2 px-3">Nama Produk</th>
                    <th class="py-2 px-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stok in stokTerbanyak" :key="stok.id" class="bg-white border-b">
                    <td class="py-2 px-3 truncate" :title="stok.nama">{{ stok.nama }}</td>
                    <td class="py-2 px-3 text-right">
                      {{ formatAngka(stok.jumlah) }} {{ stok.satuan }}
                    </td>
                  </tr>
                  <tr v-if="stokTerbanyak.length === 0">
                    <td colspan="2" class="text-center py-3">Tidak ada data.</td>
                  </tr>
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
                    <tr
                      v-for="stok in stokRendah"
                      :key="stok.id"
                      class="bg-white border-b hover:bg-red-50"
                    >
                      <td class="py-2 px-3 text-red-700 font-medium">{{ stok.nama }}</td>
                      <td class="py-2 px-3 text-right text-red-700 font-medium">
                        {{ formatAngka(stok.jumlah) }} {{ stok.satuan }}
                      </td>
                      <td class="py-2 px-3 text-right">{{ formatAngka(stok.batasMin) }}</td>
                    </tr>
                    <tr v-if="stokRendah.length === 0">
                      <td colspan="3" class="text-center py-3 text-gray-500">
                        Tidak ada peringatan stok rendah.
                      </td>
                    </tr>
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
                Top 5 Pelanggan (Nilai Pembelian - {{ selectedTimeframe
                }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span
                >)
              </h3>
              <div class="h-60 md:h-72 mb-3">
                <Bar :data="pelangganNilaiData" :options="horizontalBarOptions" />
              </div>
              <table class="w-full text-sm text-left text-gray-500 mt-2">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="py-2 px-3">Nama Pelanggan</th>
                    <th class="py-2 px-3 text-right">Total Pembelian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cust in topPelangganNilai" :key="cust.id" class="bg-white border-b">
                    <td class="py-2 px-3 truncate" :title="cust.nama">{{ cust.nama }}</td>
                    <td class="py-2 px-3 text-right">{{ cust.totalBeli }}</td>
                  </tr>
                  <tr v-if="topPelangganNilai.length === 0">
                    <td colspan="2" class="text-center py-3">Tidak ada data.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-3">
                Top 5 Pelanggan (Jumlah Transaksi - {{ selectedTimeframe
                }}<span v-if="selectedTimeframe === 'Tahunan'"> - Detail {{ selectedYear }}</span
                >)
              </h3>
              <div class="h-60 md:h-72 mb-3">
                <Bar :data="pelangganTransaksiData" :options="horizontalBarOptions" />
              </div>
              <table class="w-full text-sm text-left text-gray-500 mt-2">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th class="py-2 px-3">Nama Pelanggan</th>
                    <th class="py-2 px-3 text-right">Jumlah Transaksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="cust in topPelangganTransaksi"
                    :key="cust.id"
                    class="bg-white border-b"
                  >
                    <td class="py-2 px-3 truncate" :title="cust.nama">{{ cust.nama }}</td>
                    <td class="py-2 px-3 text-right">{{ formatAngka(cust.jumlahTransaksi) }}</td>
                  </tr>
                  <tr v-if="topPelangganTransaksi.length === 0">
                    <td colspan="2" class="text-center py-3">Tidak ada data.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
  /* Style tetap sama */
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  @media (max-width: 768px) {
    .h-60 {
      height: 16rem;
    }
    .h-72 {
      height: 18rem;
    }
    .truncate {
      max-width: 100px;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
  }
</style>
