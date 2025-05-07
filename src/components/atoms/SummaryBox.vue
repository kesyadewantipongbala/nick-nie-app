<script setup>
  const props = defineProps({
    title: String,
    items: Array, // [{ label: 'Penjualan (IDR)', value: '700,000' }]
  });
</script>

<template>
  <div class="w-full border rounded-xl bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-black mb-4">{{ title }}</h2>
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="rounded-xl bg-lime-100 p-4 text-center"
      >
        <div class="text-sm font-medium text-gray-800">{{ item.label }}</div>
        <div class="text-2xl font-bold text-black">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
