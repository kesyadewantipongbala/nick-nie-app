<template>
  <form
    @submit.prevent="onSubmit"
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
              type="number"
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
  </form>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { getSupplierList } from '../../services/supplierService'; // Assuming you have this service
  import { getProdukList } from '../../services/produkService'; // Assuming you have this service

  const props = defineProps({
    purchase: Object,
  });

  const emit = defineEmits(['submit']);

  const loading = ref(false);

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

  // --- Supplier Logic ---
  const fetchSuppliers = async () => {
    try {
      const response = await getSupplierList({ limit: 9999 }); // Fetch all suppliers
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
    form.value.supplier_id = null; // Clear selected supplier ID if input changes
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
      const response = await getProdukList({ limit: 9999 }); // Fetch all products
      allProducts.value = response.data.data;
      // Initialize filteredProducts for existing items if editing
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
    item.product_id = null; // Clear selected product ID if input changes
    item.harga_beli = 0; // Reset price as it might be from the old product
    item.harga_jual = null;
  };

  const selectProduct = (itemIndex, product) => {
    const item = form.value.items[itemIndex];
    item.product_id = product.id;
    item.productSearch = `${product.nama} (${product.kode_barang})`; // Display name and code
    item.harga_beli = product.harga_beli || 0; // Pre-fill purchase price from product
    item.harga_jual = product.harga_jual || null; // Pre-fill selling price from product
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
    form.value.items.splice(index, 1);
  };

  // --- Watchers and Initialization ---
  watch(
    () => props.purchase,
    async (newVal) => {
      if (newVal) {
        // For editing existing purchase
        form.value.supplier_id = newVal.supplier_id || null;
        form.value.catatan = newVal.catatan || '';
        supplierSearch.value = newVal.supplier_name || ''; // Assuming supplier_name comes with the purchase object

        // Fetch existing items if available
        if (newVal.items && newVal.items.length > 0) {
          form.value.items = newVal.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            harga_beli: item.harga_beli,
            // Only include harga_jual if it's explicitly set and not null/undefined
            harga_jual:
              item.harga_jual !== undefined && item.harga_jual !== null ? item.harga_jual : null,
            productSearch: `${item.product_name || ''} (${item.kode_barang || ''})`,
            productDropdownOpen: false,
            filteredProducts: [...allProducts.value], // Initialize with all products for filtering
            highlightedProductIndex: -1,
          }));
        } else {
          form.value.items = [defaultItem()]; // Start with one empty item if no items exist
        }
      } else {
        // For new purchase
        form.value = {
          supplier_id: null,
          catatan: '',
          items: [defaultItem()], // Start with one empty item
        };
        supplierSearch.value = '';
      }
    },
    { immediate: true, deep: true }
  );

  // --- Form Submission ---
  const onSubmit = () => {
    loading.value = true;

    if (!form.value.supplier_id) {
      alert('Mohon pilih supplier.');
      loading.value = false;
      return;
    }
    if (form.value.items.length === 0) {
      alert('Mohon tambahkan setidaknya satu produk pembelian.');
      loading.value = false;
      return;
    }
    for (const item of form.value.items) {
      if (!item.product_id || item.quantity <= 0 || item.harga_beli < 0) {
        alert(
          'Setiap produk pembelian harus memiliki produk, jumlah yang valid, dan harga beli yang valid.'
        );
        loading.value = false;
        return;
      }
    }

    // Construct the desired output format
    const payload = {
      supplier_id: form.value.supplier_id,
      catatan: form.value.catatan || null, // Ensure catatan is null if empty string
      items: form.value.items.map(({ product_id, quantity, harga_beli, harga_jual }) => {
        const itemPayload = {
          product_id,
          quantity,
          harga_beli,
        };
        // Only add harga_jual if it's a valid number
        if (harga_jual !== null && harga_jual !== undefined && !isNaN(harga_jual)) {
          itemPayload.harga_jual = harga_jual;
        }
        return itemPayload;
      }),
    };

    emit('submit', payload, () => {
      loading.value = false;
    });
  };

  onMounted(() => {
    fetchSuppliers();
    fetchProducts();
  });
</script>
