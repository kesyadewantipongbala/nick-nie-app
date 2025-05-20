<!-- src/components/produk/ProdukForm.vue -->
<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 max-w-md mx-auto p-4 bg-white rounded-md shadow"
  >
    <!-- Nama Produk -->
    <div>
      <label for="nama" class="block text-sm font-medium text-gray-700">Nama Produk</label>
      <input
        id="nama"
        v-model="form.nama"
        type="text"
        required
        placeholder="Masukkan nama produk"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Kode Barang -->
    <div>
      <label for="kode_barang" class="block text-sm font-medium text-gray-700">Kode Barang</label>
      <input
        id="kode_barang"
        v-model="form.kode_barang"
        type="text"
        required
        placeholder="Masukkan kode barang"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Kategori -->
    <div>
      <label for="kategori" class="block text-sm font-medium text-gray-700">Kategori</label>
      <input
        id="kategori"
        v-model="form.kategori"
        type="text"
        required
        placeholder="Masukkan kategori"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Jumlah -->
    <div>
      <label for="jumlah" class="block text-sm font-medium text-gray-700">Jumlah</label>
      <input
        id="jumlah"
        v-model.number="form.jumlah"
        type="number"
        min="0"
        required
        placeholder="Masukkan jumlah"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Satuan -->
    <div>
      <label for="satuan" class="block text-sm font-medium text-gray-700">Satuan</label>
      <input
        id="satuan"
        v-model="form.satuan"
        type="text"
        required
        placeholder="Masukkan satuan (contoh: pcs, kg, dll)"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Harga -->
    <div>
      <label for="harga_beli" class="block text-sm font-medium text-gray-700">Harga Beli</label>
      <input
        id="harga_beli"
        v-model.number="form.harga_beli"
        type="number"
        min="0"
        required
        placeholder="Masukkan harga beli"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Harga -->
    <div>
      <label for="harga_jual" class="block text-sm font-medium text-gray-700">Harga Jual</label>
      <input
        id="harga_jual"
        v-model.number="form.harga_jual"
        type="number"
        min="0"
        required
        placeholder="Masukkan harga jual"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Supplier (Option Box Search) -->
    <div class="relative">
      <label for="supplier-search" class="block text-sm font-medium text-gray-700 mb-1"
        >Supplier</label
      >
      <input
        id="supplier-search"
        type="text"
        v-model="supplierSearch"
        @input="onSupplierSearch"
        @focus="dropdownOpen = true"
        @keydown.down.prevent="highlightNext()"
        @keydown.up.prevent="highlightPrev()"
        @keydown.enter.prevent="selectHighlighted()"
        placeholder="Cari supplier..."
        autocomplete="off"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />

      <!-- Clear button -->
      <button
        v-if="selectedSupplier"
        type="button"
        @click="clearSupplier"
        class="absolute right-8 top-2.5 text-gray-400 hover:text-gray-600"
        aria-label="Clear selection"
      >
        &times;
      </button>

      <!-- Dropdown options -->
      <ul
        v-if="dropdownOpen && suppliers.length > 0"
        class="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <li
          v-for="(supplier, index) in suppliers"
          :key="supplier.id"
          @mousedown.prevent="selectSupplier(supplier)"
          :class="[
            'cursor-pointer select-none py-2 px-4',
            index === highlightedIndex ? 'bg-blue-600 text-white' : 'text-gray-900',
          ]"
        >
          {{ supplier.nama }}
        </li>
      </ul>

      <p v-if="dropdownOpen && suppliers.length === 0" class="mt-1 text-sm text-gray-500">
        Tidak ada supplier ditemukan.
      </p>
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
  import { ref, watch, onMounted, defineEmits } from 'vue';
  import { fetchSuppliers, getSupplierById } from '../../services/supplierService';

  const props = defineProps({
    produk: Object,
  });

  const emit = defineEmits(['submit']);

  const loading = ref(false);
  const suppliers = ref([]);
  const selectedSupplier = ref(null);
  const supplierSearch = ref('');
  const dropdownOpen = ref(false);
  const highlightedIndex = ref(-1);

  const form = ref({
    nama: '',
    kode_barang: '',
    kategori: '',
    jumlah: 0,
    harga_jual: 0,
    harga_beli: 0,
    satuan: '',
    supplier_id: null,
  });

  let searchTimeout = null;

  const loadSuppliers = async (search = '') => {
    try {
      suppliers.value = await fetchSuppliers(search, 1, 10);
    } catch (error) {
      console.error('Gagal memuat supplier:', error);
      suppliers.value = [];
    }
  };

  const onSupplierSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadSuppliers(supplierSearch.value);
      dropdownOpen.value = true;
      highlightedIndex.value = -1;
      // Reset selected if search text beda dengan selected supplier name
      if (selectedSupplier.value && supplierSearch.value !== selectedSupplier.value.nama) {
        selectedSupplier.value = null;
        form.value.supplier_id = null;
      }
    }, 300);
  };

  const selectSupplier = (supplier) => {
    selectedSupplier.value = supplier;
    form.value.supplier_id = supplier.id;
    supplierSearch.value = supplier.nama;
    dropdownOpen.value = false;
    highlightedIndex.value = -1;
  };

  const clearSupplier = () => {
    selectedSupplier.value = null;
    form.value.supplier_id = null;
    supplierSearch.value = '';
    dropdownOpen.value = false;
  };

  const highlightNext = () => {
    if (suppliers.value.length === 0) return;
    highlightedIndex.value = (highlightedIndex.value + 1) % suppliers.value.length;
  };

  const highlightPrev = () => {
    if (suppliers.value.length === 0) return;
    highlightedIndex.value =
      (highlightedIndex.value - 1 + suppliers.value.length) % suppliers.value.length;
  };

  const selectHighlighted = () => {
    if (highlightedIndex.value >= 0 && highlightedIndex.value < suppliers.value.length) {
      selectSupplier(suppliers.value[highlightedIndex.value]);
    }
  };

  onMounted(() => {
    loadSuppliers();
  });

  watch(
    () => props.produk,
    async (newVal) => {
      if (newVal) {
        form.value = {
          nama: newVal.nama || '',
          kode_barang: newVal.kode_barang || '',
          kategori: newVal.kategori || '',
          jumlah: newVal.jumlah || 0,
          harga_jual: newVal.harga_jual || 0,
          harga_beli: newVal.harga_beli || 0,
          satuan: newVal.satuan || '',
          supplier_id: newVal.supplier_id || null,
        };

        if (newVal.supplier_id) {
          try {
            const supplier = await getSupplierById(newVal.supplier_id);
            selectedSupplier.value = supplier;
            supplierSearch.value = supplier.nama;
          } catch (e) {
            console.error('Gagal memuat supplier:', e);
            selectedSupplier.value = null;
            supplierSearch.value = '';
          }
        } else {
          selectedSupplier.value = null;
          supplierSearch.value = '';
        }
      }
    },
    { immediate: true }
  );

  const onSubmit = async () => {
    loading.value = true;

    if (
      !form.value.nama ||
      !form.value.kode_barang ||
      !form.value.kategori ||
      form.value.jumlah < 0 ||
      form.value.harga < 0 ||
      !form.value.supplier_id
    ) {
      alert('Mohon lengkapi semua field dengan benar');
      loading.value = false;
      return;
    }

    emit('submit', { ...form.value }, () => {
      loading.value = false;
    });
  };
</script>
