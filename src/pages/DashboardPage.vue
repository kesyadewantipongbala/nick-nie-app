<!-- src\pages\DashboardPage.vue -->
<script setup>
  import { ref } from 'vue';
  import SummaryBox from '../components/atoms/SummaryBox.vue';

  const todaySummary = [
    { label: 'Penjualan (IDR)', value: '700,000' },
    { label: 'Pesanan', value: '150' },
  ];

  const totalSummary = [
    { label: 'Penjualan (IDR)', value: '1,700,000' },
    { label: 'Pesanan', value: '1,150' },
  ];

  const pageTitle = ref('Dashboard');
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <div class="flex flex-col flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="text-2xl font-bold text-gray-800 mb-6">{{ pageTitle }}</div>

        <!-- Flex container horizontal -->
        <div class="flex flex-row gap-6">
          <SummaryBox title="Ringkasan Hari Ini" :items="todaySummary" />
          <SummaryBox title="Total Ringkasan" :items="totalSummary" />
        </div>
      </main>
    </div>
  </div>
</template>
