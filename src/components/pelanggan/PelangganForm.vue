<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 max-w-md mx-auto p-4 bg-white rounded-md shadow"
  >
    <!-- Nama Pelanggan -->
    <div>
      <label for="nama" class="block text-sm font-medium text-gray-700">Nama Pelanggan</label>
      <input
        id="nama"
        v-model="form.nama"
        type="text"
        required
        placeholder="Masukkan nama pelanggan"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Kategori (Dropdown Search) -->
    <div class="relative">
      <label for="category" class="block text-sm font-medium text-gray-700">Kategori</label>
      <input
        id="category"
        type="text"
        v-model="categorySearch"
        @input="onCategoryInput"
        @focus="dropdownOpen = true"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        placeholder="Pilih kategori..."
        autocomplete="off"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />

      <!-- Dropdown List -->
      <ul
        v-if="dropdownOpen && filteredCategories.length > 0"
        class="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <li
          v-for="(category, index) in filteredCategories"
          :key="category"
          @mousedown.prevent="selectCategory(category)"
          :class="[
            'cursor-pointer select-none py-2 px-4',
            index === highlightedIndex ? 'bg-blue-600 text-white' : 'text-gray-900',
          ]"
        >
          {{ category }}
        </li>
      </ul>

      <p v-if="dropdownOpen && filteredCategories.length === 0" class="mt-1 text-sm text-gray-500">
        Tidak ada kategori ditemukan.
      </p>
    </div>

    <!-- Deskripsi -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        placeholder="Masukkan deskripsi"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="loading"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
      >
        {{ loading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>
  </form>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    pelanggan: Object,
  });

  const emit = defineEmits(['submit']);

  const loading = ref(false);

  const categories = [
    'Restoran & kafe',
    'Hotel & katering (HoReCa)',
    'Pasar modern/minimarket',
    'Pedagang pasar tradisional',
    'Jasa boga/catering',
    'Distributor/reseller',
    'Industri makanan',
    'Komunitas konsumen langsung (CSA)',
    'Toko organik/spesialis',
  ];

  const form = ref({
    nama: '',
    category: '',
    description: '',
  });

  const categorySearch = ref('');
  const dropdownOpen = ref(false);
  const highlightedIndex = ref(-1);

  const filteredCategories = ref([...categories]);

  const filterCategories = (search) => {
    if (!search) {
      filteredCategories.value = [...categories];
    } else {
      const lower = search.toLowerCase();
      filteredCategories.value = categories.filter((c) => c.toLowerCase().includes(lower));
    }
  };

  const onCategoryInput = () => {
    dropdownOpen.value = true;
    highlightedIndex.value = -1;
    filterCategories(categorySearch.value);
    // Reset selection if input doesn't match selected category exactly
    if (form.value.category !== categorySearch.value) {
      form.value.category = '';
    }
  };

  const selectCategory = (category) => {
    form.value.category = category;
    categorySearch.value = category;
    dropdownOpen.value = false;
    highlightedIndex.value = -1;
  };

  const highlightNext = () => {
    if (filteredCategories.value.length === 0) return;
    highlightedIndex.value = (highlightedIndex.value + 1) % filteredCategories.value.length;
  };

  const highlightPrev = () => {
    if (filteredCategories.value.length === 0) return;
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredCategories.value.length) %
      filteredCategories.value.length;
  };

  const selectHighlighted = () => {
    if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredCategories.value.length) {
      selectCategory(filteredCategories.value[highlightedIndex.value]);
    }
  };

  watch(
    () => props.pelanggan,
    (newVal) => {
      if (newVal) {
        form.value = {
          nama: newVal.nama || '',
          category: newVal.category || '',
          description: newVal.description || '',
        };
        categorySearch.value = form.value.category;
      } else {
        form.value = {
          nama: '',
          category: '',
          description: '',
        };
        categorySearch.value = '';
      }
    },
    { immediate: true }
  );

  const onSubmit = () => {
    loading.value = true;

    if (!form.value.nama || !form.value.category) {
      alert('Mohon lengkapi nama dan kategori pelanggan.');
      loading.value = false;
      return;
    }

    emit('submit', { ...form.value }, () => {
      loading.value = false;
    });
  };
</script>
