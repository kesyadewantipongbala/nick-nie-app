<!-- src/components/atoms/BasePagination.vue -->
<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['page-change']);

  const pages = computed(() => {
    const visiblePages = [];
    for (let i = 1; i <= props.totalPages; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
      emit('page-change', page);
    }
  };
</script>

<template>
  <div class="flex justify-end mt-4 space-x-1 text-sm">
    <button
      class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      Sebelumnya
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="px-3 py-1 rounded"
      :class="{
        'bg-blue-500 text-white': currentPage === page,
        'bg-gray-200 hover:bg-gray-300': currentPage !== page,
      }"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Selanjutnya
    </button>
  </div>
</template>
