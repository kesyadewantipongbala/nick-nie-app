<template>
  <form
    @submit.prevent="showConfirmationModal"
    class="space-y-4 max-w-md mx-auto p-4 bg-white rounded-md shadow"
  >
    <div class="relative">
      <label for="supplier" class="block text-sm font-medium text-gray-700">Nama Supplier</label>
      <input
        id="supplier"
        type="text"
        v-model="supplierSearch"
        @input="onSupplierInput"
        @focus="supplierDropdownOpen = true"
        @keydown.down.prevent="highlightNextSupplier"
        @keydown.up.prevent="highlightPrevSupplier"
        @keydown.enter.prevent="selectHighlightedSupplier"
        placeholder="Pilih supplier..."
        autocomplete="off"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />

      <ul
        v-if="supplierDropdownOpen && filteredSuppliers.length > 0"
        class="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <li
          v-for="(supplier, index) in filteredSuppliers"
          :key="supplier.id"
          @mousedown.prevent="selectSupplier(supplier)"
          :class="[
            'cursor-pointer select-none py-2 px-4',
            index === highlightedSupplierIndex ? 'bg-blue-600 text-white' : 'text-gray-900',
          ]"
        >
          {{ supplier.nama }}
        </li>
      </ul>
      <p
        v-if="supplierDropdownOpen && filteredSuppliers.length === 0"
        class="mt-1 text-sm text-gray-500"
      >
        Tidak ada supplier ditemukan.
      </p>
    </div>

    <div>
      <h2 class="text-lg font-medium text-gray-800 mb-2">Daftar Produk</h2>
      <div
        v-for="(item, index) in form.items"
        :key="index"
        class="border p-3 mb-3 rounded-md bg-gray-50"
      >
        <div class="flex justify-end">
          <button
            type="button"
            @click="removeItem(index)"
            class="text-red-500 hover:text-red-700 text-sm"
          >
            Hapus
          </button>
        </div>
        <div class="space-y-2">
          <div class="relative">
            <label :for="`product-${index}`" class="block text-sm font-medium text-gray-700"
              >Produk</label
            >
            <input
              :id="`product-${index}`"
              type="text"
              v-model="item.productSearch"
              @input="onProductInput(index)"
              @focus="item.productDropdownOpen = true"
              @keydown.down.prevent="highlightNextProduct(index)"
              @keydown.up.prevent="highlightPrevProduct(index)"
              @keydown.enter.prevent="selectHighlightedProduct(index)"
              placeholder="Cari produk..."
              autocomplete="off"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <ul
              v-if="
                item.productDropdownOpen &&
                item.filteredProducts &&
                item.filteredProducts.length > 0
              "
              class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <li
                v-for="(product, prodIndex) in item.filteredProducts"
                :key="product.id"
                @mousedown.prevent="selectProduct(index, product)"
                :class="[
                  'cursor-pointer select-none py-2 px-4',
                  prodIndex === item.highlightedProductIndex
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-900',
                ]"
              >
                {{ product.nama }} ({{ product.kode_barang }}) - Stok: {{ product.jumlah }}
              </li>
            </ul>
            <p
              v-if="
                item.productDropdownOpen &&
                item.filteredProducts &&
                item.filteredProducts.length === 0
              "
              class="mt-1 text-sm text-gray-500"
            >
              Tidak ada produk ditemukan.
            </p>
          </div>

          <div>
            <label :for="`quantity-${index}`" class="block text-sm font-medium text-gray-700"
              >Jumlah</label
            >
            <input
              :id="`quantity-${index}`"
              v-model.number="item.quantity"
              type="number" step="0.1"
              min="1"
              required
              placeholder="Masukkan jumlah"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label :for="`harga-beli-${index}`" class="block text-sm font-medium text-gray-700"
              >Harga Beli</label
            >
            <input
              :id="`harga-beli-${index}`"
              v-model.number="item.harga_beli"
              type="number"
              min="0"
              placeholder="Masukkan harga beli"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label :for="`harga-jual-${index}`" class="block text-sm font-medium text-gray-700"
              >Harga Jual (Opsional)</label
            >
            <input
              :id="`harga-jual-${index}`"
              v-model.number="item.harga_jual"
              type="number"
              min="0"
              placeholder="Masukkan harga jual (jika berubah)"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="addItem"
        class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition mt-2"
      >
        + Tambah Produk
      </button>
    </div>

    <div class="border-t pt-4 mt-4 space-y-2">
      <div class="flex justify-between text-sm font-medium text-gray-700">
        <span>Total Unit Produk:</span>
        <span class="font-semibold">{{ totalProductUnits }}</span>
      </div>
      <div class="flex justify-between text-base font-semibold text-gray-800">
        <span>Total Keseluruhan Pembelian:</span>
        <span class="text-blue-600">{{ formatRupiah(grandTotalPurchase) }}</span>
      </div>
    </div>

    <div>
      <label for="note" class="block text-sm font-medium text-gray-700">Catatan</label>
      <textarea
        id="note"
        v-model="form.catatan"
        rows="3"
        placeholder="Masukkan catatan pembelian"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      ></textarea>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="loading"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
      >
        {{ loading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>

    <BaseModal :show="showConfirmModal" title="Konfirmasi Pembelian" @close="closeConfirmModal">
      <div class="space-y-3">
        <p>Mohon periksa kembali data pembelian Anda:</p>
        <div class="border-t pt-2">
          <p class="font-semibold text-gray-800">Supplier:</p>
          <p>{{ supplierSearch }}</p>
        </div>
        <div class="border-t pt-2">
          <p class="font-semibold text-gray-800">Catatan:</p>
          <p>{{ form.catatan || '-' }}</p>
        </div>
        <div class="border-t pt-2">
          <p class="font-semibold text-gray-800">Produk Dibeli:</p>
          <ul class="list-disc pl-5">
            <li v-for="(item, index) in form.items" :key="index" class="text-sm">
              {{ item.productSearch }} ({{ item.quantity }} unit) @
              {{ formatRupiah(item.harga_beli) }}
              <span
                v-if="
                  item.harga_jual !== null &&
                  item.harga_jual !== undefined &&
                  !isNaN(item.harga_jual)
                "
              >
                (Jual: {{ formatRupiah(item.harga_jual) }})</span
              >
            </li>
          </ul>
        </div>
        <div class="border-t pt-2">
          <p class="font-semibold text-gray-800">Total Unit Produk: {{ totalProductUnits }}</p>
          <p class="font-semibold text-blue-600">
            Total Keseluruhan Pembelian: {{ formatRupiah(grandTotalPurchase) }}
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="closeConfirmModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Batal
          </button>
          <button
            type="button"
            @click="submitConfirmed"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{ loading ? 'Mengirim...' : 'Konfirmasi & Simpan' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </form>
</template>

<script setup>
  import { ref, watch, onMounted, computed } from 'vue';
  import { getSupplierList } from '../../services/supplierService';
  import { getProdukList } from '../../services/produkService';
  import BaseModal from '../atoms/BaseModal.vue'; // Make sure to import BaseModal

  const props = defineProps({
    purchase: Object,
  });

  const emit = defineEmits(['submit']);

  const loading = ref(false);
  const showConfirmModal = ref(false); // New state for confirmation modal

  // Supplier related state
  const suppliers = ref([]);
  const supplierSearch = ref('');
  const supplierDropdownOpen = ref(false);
  const highlightedSupplierIndex = ref(-1);
  const filteredSuppliers = ref([]);

  // Form structure with items
  const form = ref({
    supplier_id: null,
    catatan: '',
    items: [], // Array to hold multiple product items
  });

  // Initial item structure for adding new items
  const defaultItem = () => ({
    product_id: null,
    quantity: 1,
    harga_beli: 0,
    harga_jual: null, // Null to allow backend to use default if not provided
    productSearch: '',
    productDropdownOpen: false,
    filteredProducts: [],
    highlightedProductIndex: -1,
  });

  // --- Computed Properties for Totals ---
  const totalProductUnits = computed(() => {
    return form.value.items.reduce((sum, item) => {
      return sum + (item.quantity && !isNaN(item.quantity) ? item.quantity : 0);
    }, 0);
  });

  const grandTotalPurchase = computed(() => {
    return form.value.items.reduce((sum, item) => {
      const quantity = item.quantity && !isNaN(item.quantity) ? item.quantity : 0;
      const hargaBeli = item.harga_beli && !isNaN(item.harga_beli) ? item.harga_beli : 0;
      return sum + quantity * hargaBeli;
    }, 0);
  });

  // --- Utility for Rupiah Formatting ---
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // --- Supplier Logic ---
  const fetchSuppliers = async () => {
    try {
      const response = await getSupplierList({ limit: 9999 });
      suppliers.value = response.data.data;
      filterSuppliers(supplierSearch.value);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const filterSuppliers = (search) => {
    if (!search) {
      filteredSuppliers.value = [...suppliers.value];
    } else {
      const lower = search.toLowerCase();
      filteredSuppliers.value = suppliers.value.filter((s) => s.nama.toLowerCase().includes(lower));
    }
  };

  const onSupplierInput = () => {
    supplierDropdownOpen.value = true;
    highlightedSupplierIndex.value = -1;
    filterSuppliers(supplierSearch.value);
    form.value.supplier_id = null;
  };

  const selectSupplier = (supplier) => {
    form.value.supplier_id = supplier.id;
    supplierSearch.value = supplier.nama;
    supplierDropdownOpen.value = false;
    highlightedSupplierIndex.value = -1;
  };

  const highlightNextSupplier = () => {
    if (filteredSuppliers.value.length === 0) return;
    highlightedSupplierIndex.value =
      (highlightedSupplierIndex.value + 1) % filteredSuppliers.value.length;
  };

  const highlightPrevSupplier = () => {
    if (filteredSuppliers.value.length === 0) return;
    highlightedSupplierIndex.value =
      (highlightedSupplierIndex.value - 1 + filteredSuppliers.value.length) %
      filteredSuppliers.value.length;
  };

  const selectHighlightedSupplier = () => {
    if (
      highlightedSupplierIndex.value >= 0 &&
      highlightedSupplierIndex.value < filteredSuppliers.value.length
    ) {
      selectSupplier(filteredSuppliers.value[highlightedSupplierIndex.value]);
    }
  };

  // --- Product Item Logic ---
  const allProducts = ref([]);

  const fetchProducts = async () => {
    try {
      const response = await getProdukList({ limit: 9999 });
      allProducts.value = response.data.data;
      form.value.items.forEach((item) => {
        item.filteredProducts = [...allProducts.value];
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = (itemIndex, search) => {
    const item = form.value.items[itemIndex];
    if (!item) return;

    if (!search) {
      item.filteredProducts = [...allProducts.value];
    } else {
      const lower = search.toLowerCase();
      item.filteredProducts = allProducts.value.filter(
        (p) => p.nama.toLowerCase().includes(lower) || p.kode_barang.toLowerCase().includes(lower)
      );
    }
  };

  const onProductInput = (itemIndex) => {
    const item = form.value.items[itemIndex];
    item.productDropdownOpen = true;
    item.highlightedProductIndex = -1;
    filterProducts(itemIndex, item.productSearch);
    item.product_id = null;
    item.harga_beli = 0;
    item.harga_jual = null;
  };

  const selectProduct = (itemIndex, product) => {
    const item = form.value.items[itemIndex];
    item.product_id = product.id;
    item.productSearch = `${product.nama} (${product.kode_barang})`;
    item.harga_beli = product.harga_beli || 0;
    item.harga_jual = product.harga_jual || null;
    item.productDropdownOpen = false;
    item.highlightedProductIndex = -1;
  };

  const highlightNextProduct = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (item.filteredProducts.length === 0) return;
    item.highlightedProductIndex =
      (item.highlightedProductIndex + 1) % item.filteredProducts.length;
  };

  const highlightPrevProduct = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (item.filteredProducts.length === 0) return;
    item.highlightedProductIndex =
      (item.highlightedProductIndex - 1 + item.filteredProducts.length) %
      item.filteredProducts.length;
  };

  const selectHighlightedProduct = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (
      item.highlightedProductIndex >= 0 &&
      item.highlightedProductIndex < item.filteredProducts.length
    ) {
      selectProduct(itemIndex, item.filteredProducts[item.highlightedProductIndex]);
    }
  };

  const addItem = () => {
    form.value.items.push(defaultItem());
  };

  const removeItem = (index) => {
    if (form.value.items.length > 1) {
      // Ensure at least one item remains
      form.value.items.splice(index, 1);
    } else {
      // Optionally, clear the last item instead of removing it
      form.value.items = [defaultItem()];
    }
  };

  // --- Watchers and Initialization ---
  watch(
    () => props.purchase,
    async (newVal) => {
      if (newVal) {
        form.value.supplier_id = newVal.supplier_id || null;
        form.value.catatan = newVal.catatan || '';
        supplierSearch.value = newVal.supplier_name || '';

        if (newVal.items && newVal.items.length > 0) {
          form.value.items = newVal.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            harga_beli: item.harga_beli,
            harga_jual:
              item.harga_jual !== undefined && item.harga_jual !== null ? item.harga_jual : null,
            productSearch: `${item.product_name || ''} (${item.kode_barang || ''})`,
            productDropdownOpen: false,
            filteredProducts: [...allProducts.value],
            highlightedProductIndex: -1,
          }));
        } else {
          form.value.items = [defaultItem()];
        }
      } else {
        form.value = {
          supplier_id: null,
          catatan: '',
          items: [defaultItem()],
        };
        supplierSearch.value = '';
      }
    },
    { immediate: true, deep: true }
  );

  // --- Confirmation Modal Logic ---
  const showConfirmationModal = () => {
    // Perform initial form validation before showing modal
    if (!form.value.supplier_id) {
      alert('Mohon pilih supplier.');
      return;
    }
    if (form.value.items.length === 0) {
      alert('Mohon tambahkan setidaknya satu produk pembelian.');
      return;
    }
    for (const item of form.value.items) {
      if (!item.product_id || item.quantity <= 0 || item.harga_beli <= 0) {
        alert(
          'Setiap produk pembelian harus memiliki produk, jumlah yang valid, dan harga beli yang valid (lebih dari 0).'
        );
        return;
      }
    }

    showConfirmModal.value = true;
  };

  const closeConfirmModal = () => {
    showConfirmModal.value = false;
  };

  const submitConfirmed = () => {
    // This is the actual submission logic, called after user confirms
    loading.value = true; // Set loading here, not when showing modal

    const payload = {
      supplier_id: form.value.supplier_id,
      catatan: form.value.catatan || null,
      items: form.value.items.map(({ product_id, quantity, harga_beli, harga_jual }) => {
        const itemPayload = {
          product_id,
          quantity,
          harga_beli,
        };
        if (harga_jual !== null && harga_jual !== undefined && !isNaN(harga_jual)) {
          itemPayload.harga_jual = harga_jual;
        }
        return itemPayload;
      }),
    };

    emit('submit', payload, () => {
      loading.value = false;
      closeConfirmModal(); // Close confirmation modal after submission
    });
  };

  onMounted(() => {
    fetchSuppliers();
    fetchProducts();
  });
</script>
