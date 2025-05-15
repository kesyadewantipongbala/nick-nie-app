<template>
    <div class="flex flex-wrap justify-center items-center gap-2 mt-4">
        <button :disabled="currentPage === 1" @click="$emit('change', currentPage - 1)"
            class="flex items-center bg-[#007bff] hover:bg-lime-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
        </button>

        <button v-for="pageNum in pagesToShow" :key="pageNum" @click="$emit('change', pageNum)" :class="[
            'px-3 py-1 rounded-md text-sm border border-gray-300 transition',
            pageNum === currentPage ? 'bg-[#007bff] text-white border-transparent' : 'bg-white text-gray-700 hover:bg-gray-100'
        ]">
            {{ pageNum }}
        </button>

        <button :disabled="currentPage === totalPages" @click="$emit('change', currentPage + 1)"
            class="flex items-center bg-[#007bff] hover:bg-lime-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: Number,
    totalPages: Number
});
const emit = defineEmits(['change']);

// Untuk tampilkan maksimal 5 halaman, dan halaman aktif di tengah
const pagesToShow = computed(() => {
    const total = props.totalPages;
    const current = props.currentPage;
    const delta = 2; // berapa halaman sebelum dan sesudah halaman aktif

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    // Jika kita di dekat awal, geser window ke kanan
    if (current <= delta) {
        end = Math.min(total, 1 + delta * 2);
    }

    // Jika kita di dekat akhir, geser window ke kiri
    if (current + delta > total) {
        start = Math.max(1, total - delta * 2);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
</script>