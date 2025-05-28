<template>
  <form @submit.prevent="prepareAndShowConfirmation" class="space-y-6 bg-white rounded-md">
    <div class="relative">
      <label for="customer-search" class="block text-sm font-medium text-gray-700 mb-1">
        Pelanggan
      </label>
      <input
        id="customer-search"
        type="text"
        v-model="customerSearchTerm"
        @input="onCustomerSearch($event.target.value)"
        @focus="isCustomerDropdownOpen = true"
        @blur="handleCustomerSearchBlur"
        @keydown.down.prevent="highlightNextCustomer"
        @keydown.up.prevent="highlightPrevCustomer"
        @keydown.enter.prevent="selectHighlightedCustomer"
        placeholder="Cari atau pilih pelanggan..."
        autocomplete="off"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-10"
      />
      <button
        v-if="form.customer_id || customerSearchTerm"
        type="button"
        @click="clearCustomer"
        class="absolute right-3 top-[calc(1.5rem+0.5rem+2px)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl z-10"
      >
        &times;
      </button>
      <ul
        v-if="isCustomerDropdownOpen && customerOptions.length > 0"
        class="absolute z-30 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <li
          v-for="(customer, custIndex) in customerOptions"
          :key="customer.id"
          @mousedown.prevent="selectCustomer(customer)"
          :class="[
            'cursor-pointer select-none py-2 px-4',
            custIndex === highlightedCustomerIndex ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-blue-50',
          ]"
        >
          {{ customer.nama }} <span v-if="customer.category" class="text-xs text-gray-500">({{ customer.category }})</span>
        </li>
      </ul>
      <div
        v-if="isCustomerDropdownOpen && customerOptions.length === 0 && customerSearchTerm.trim() !== ''"
        class="absolute z-30 mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <p class="px-4 py-2 text-sm text-gray-500">
          Pelanggan tidak ditemukan.
        </p>
      </div>
       <input type="hidden" v-model="form.customer_id" />
    </div>

    <hr />

    <div v-for="(item, index) in form.items" :key="item.key" class="space-y-3 p-3 border rounded-md relative">
      <h4 class="text-md font-semibold text-gray-700">Produk #{{ index + 1 }}</h4>

      <div class="relative">
        <label :for="'product-search-' + index" class="block text-sm font-medium text-gray-700 mb-1"
          >Cari Produk</label
        >
        <input
          :id="'product-search-' + index"
          type="text"
          v-model="item.product_search_term"
          @input="onProductSearch(index, $event.target.value)"
          @focus="item.is_product_dropdown_open = true"
          @blur="handleProductSearchBlur(index)"
          @keydown.down.prevent="highlightNextProduct(index)"
          @keydown.up.prevent="highlightPrevProduct(index)"
          @keydown.enter.prevent="selectHighlightedProduct(index)"
          placeholder="Ketik nama atau kode produk..."
          autocomplete="off"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-10"
        />
        <button
          v-if="item.product_id || item.product_search_term"
          type="button"
          @click="clearProductSearch(index)"
          class="absolute right-3 top-[calc(1.5rem+0.5rem+2px)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl z-10"
        >
          &times;
        </button>
        <ul
          v-if="item.is_product_dropdown_open && item.product_options.length > 0"
          class="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <li
            v-for="(product, prodIndex) in item.product_options"
            :key="product.id"
            @mousedown.prevent="selectProduct(index, product)"
            :class="[
              'cursor-pointer select-none py-2 px-4',
              prodIndex === item.highlighted_product_index ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-blue-50',
            ]"
          >
            {{ product.nama }} ({{ product.kode_barang }}) - Stok: {{ product.jumlah }}
          </li>
        </ul>
        <div
          v-if="item.is_product_dropdown_open && item.product_options.length === 0 && item.product_search_term.trim() !== ''"
          class="absolute z-20 mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5"
        >
            <p class="px-4 py-2 text-sm text-gray-500">
            Produk tidak ditemukan.
            </p>
        </div>
      </div>

      <div>
        <label :for="'quantity-' + index" class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
        <input
          :id="'quantity-' + index"
          v-model.number="item.quantity"
          type="number" step="0.1"
          min="1"
          required
          :max="item.max_quantity"
          @input="validateQuantity(index)"
          placeholder="Jumlah"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <p v-if="item.product_id && typeof item.original_unit_price === 'number'" class="text-xs text-gray-500 mt-1">
            Harga Satuan Asli: Rp {{ item.original_unit_price.toLocaleString('id-ID') }} / {{ item.satuan }}
        </p>
      </div>

      <div v-if="item.product_id">
        <label :for="'custom-price-display-' + index" class="block text-sm font-medium text-gray-700 mb-1">
            Harga Satuan Kustom (Opsional)
        </label>
        <div
            :id="'custom-price-display-' + index"
            @click="focusCustomPriceInput(index)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm cursor-text bg-gray-50 h-[38px] flex items-center"
            :class="{ 'text-gray-400 italic': !item.custom_unit_price_display_value && !item.is_editing_custom_unit_price }"
        >
            {{ item.is_editing_custom_unit_price ? (item.custom_unit_price_input !== '' ? item.custom_unit_price_input : '') : (item.custom_unit_price_display_value || (typeof item.original_unit_price === 'number' ? `Rp ${item.original_unit_price.toLocaleString('id-ID')}` : 'Rp 0')) }}
            <span v-if="item.is_editing_custom_unit_price && (item.custom_unit_price_input === '' || item.custom_unit_price_input === null)" class="select-none">&nbsp;</span>
        </div>
        <input
            :ref="el => item.customPriceInputElement = el"
            type="number"
            min="0"
            v-model.number="item.custom_unit_price_input"
            @blur="formatCustomPriceDisplay(index)"
            @focus="onFocusCustomPrice(index)"
            @input="updateCustomPriceDisplayOnInput(index)"
            placeholder="Harga satuan kustom"
            class="opacity-0 w-0 h-0 absolute"
        />
        <p class="text-xs text-gray-500 mt-1">Klik untuk mengubah harga satuan. Kosongkan untuk harga standar.</p>
      </div>

      <div v-if="item.product_id && item.quantity > 0 && typeof item.final_unit_price === 'number'" class="text-right mt-2 border-t pt-2">
        <p class="text-sm font-semibold text-gray-700">
            Subtotal Item:
            <span class="text-blue-600">
                Rp {{ (item.quantity * item.final_unit_price).toLocaleString('id-ID') }}
            </span>
        </p>
      </div>

      <button @click="removeItem(index)" type="button" class="text-red-500 hover:text-red-700 text-sm font-medium absolute top-2 right-2">
        Hapus
      </button>
    </div>

    <hr class="my-4" v-if="form.items.length > 0 && form.items.some(i => i.product_id)"/>

    <div class="flex justify-between items-center mb-6">
        <button
        @click="addItem"
        type="button"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
        >
        + Tambah Produk
        </button>
        <div class="text-lg font-semibold text-gray-800">
            Total Keseluruhan:
            <span class="text-emerald-600">
                Rp {{ totalEstimatedPrice.toLocaleString('id-ID') }}
            </span>
        </div>
    </div>

    <div class="flex justify-end pt-4 border-t border-gray-200">
      <button
        type="button"
        @click="$emit('close')"
        class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition mr-3"
      >
        Batal
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 transition"
      >
        {{ isSubmitting ? 'Memproses...' : 'Simpan Transaksi' }}
      </button>
    </div>
  </form>

  <BaseModal :show="showConfirmationModal" title="Konfirmasi Transaksi" @close="closeConfirmationModal" width="max-w-lg">
    <div v-if="dataForConfirmation" class="space-y-4">
      <div>
        <h4 class="font-semibold text-gray-800">Pelanggan:</h4>
        <p>{{ dataForConfirmation.customerName || 'Tidak ada pelanggan dipilih' }}</p>
      </div>
      <div>
        <h4 class="font-semibold text-gray-800">Detail Item:</h4>
        <ul v-if="dataForConfirmation.items && dataForConfirmation.items.length > 0" class="list-disc list-inside pl-5 space-y-1 mt-1">
          <li v-for="(itemConf, idxConf) in dataForConfirmation.items" :key="idxConf">
            {{ itemConf.name }} ({{ itemConf.quantity }} x Rp {{ itemConf.unitPrice.toLocaleString('id-ID') }}) =
            <span class="font-semibold">Rp {{ itemConf.subtotal.toLocaleString('id-ID') }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-500">Tidak ada item produk.</p>
      </div>
      <hr />
      <div class="text-right">
        <p class="text-md font-bold text-gray-800">
          Total Keseluruhan:
          <span class="text-emerald-600">Rp {{ dataForConfirmation.grandTotal.toLocaleString('id-ID') }}</span>
        </p>
      </div>
    </div>
    <template #footer>
      <button @click="closeConfirmationModal" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition mr-2">
        Batal
      </button>
      <button @click="executeSubmit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm transition">
        Konfirmasi & Simpan
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import { getProdukList, getProdukDetail } from '../../services/produkService.js';
import { getPelangganList } from '../../services/pelangganService.js';
import BaseModal from '../atoms/BaseModal.vue';

// Props tidak lagi diperlukan karena form hanya untuk tambah baru
// defineProps({
//   transaction: Object,
// });

const emit = defineEmits(['submit', 'close']);

const isSubmitting = ref(false);
const productSearchTimeouts = ref({});
const customerSearchTimeout = ref(null);

const customerSearchTerm = ref('');
const customerOptions = ref([]);
const isCustomerDropdownOpen = ref(false);
const highlightedCustomerIndex = ref(-1);
const selectedCustomerName = ref('');

const showConfirmationModal = ref(false);
const dataForConfirmation = ref(null);

let itemKeyCounter = 0;
const createNewItem = (productData = null) => {
  const newItem = {
    key: itemKeyCounter++,
    product_id: productData ? productData.id : null,
    quantity: productData ? 1 : 1,
    original_unit_price: productData ? productData.harga_jual : 0,
    satuan: productData ? productData.satuan : '',
    max_quantity: productData ? productData.jumlah : Infinity,
    custom_unit_price_input: null,
    final_unit_price: productData ? productData.harga_jual : 0,
    product_search_term: productData ? productData.nama : '',
    product_options: [],
    is_product_dropdown_open: false,
    highlighted_product_index: -1,
    selected_product_name: productData ? productData.nama : '',
    custom_unit_price_display_value: '',
    is_editing_custom_unit_price: false,
    customPriceInputElement: null,
  };

  if (productData) {
    newItem.custom_unit_price_display_value = `Rp ${productData.harga_jual.toLocaleString('id-ID')}`;
  }
  // Logika untuk transactionItemData dihilangkan karena tidak ada mode edit
  return newItem;
};

const resetFormState = () => {
  form.value.customer_id = null;
  form.value.user_id = 2; // Atau ambil dari user yang login
  form.value.items = [createNewItem()];
  
  customerSearchTerm.value = '';
  selectedCustomerName.value = '';
  customerOptions.value = [];
  isCustomerDropdownOpen.value = false;
  highlightedCustomerIndex.value = -1;
};

const form = ref({
  customer_id: null,
  user_id: 2,
  items: [createNewItem()],
});

onMounted(() => {
  resetFormState();
});

// watch untuk props.transaction dihilangkan

// --- Customer Search Logic ---
const onCustomerSearch = async (searchTerm) => {
  customerSearchTerm.value = searchTerm;
  isCustomerDropdownOpen.value = true;
  highlightedCustomerIndex.value = -1;

  if (selectedCustomerName.value && searchTerm !== selectedCustomerName.value) {
    form.value.customer_id = null;
    selectedCustomerName.value = '';
  }

  if (customerSearchTimeout.value) clearTimeout(customerSearchTimeout.value);

  if (searchTerm.trim() === '') {
      customerOptions.value = [];
      return;
  }

  customerSearchTimeout.value = setTimeout(async () => {
    try {
      const response = await getPelangganList({ search: searchTerm.trim(), page: 1, limit: 10 });
      if (response.success && response.data && Array.isArray(response.data.data)) {
        customerOptions.value = response.data.data;
      } else {
        customerOptions.value = [];
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      customerOptions.value = [];
    }
  }, 300);
};

const selectCustomer = (customer) => {
  form.value.customer_id = customer.id;
  selectedCustomerName.value = customer.nama;
  customerSearchTerm.value = customer.nama;
  isCustomerDropdownOpen.value = false;
  customerOptions.value = [];
  highlightedCustomerIndex.value = -1;
};

const clearCustomer = () => {
  form.value.customer_id = null;
  selectedCustomerName.value = '';
  customerSearchTerm.value = '';
  customerOptions.value = [];
  isCustomerDropdownOpen.value = false;
  highlightedCustomerIndex.value = -1;
};

const handleCustomerSearchBlur = () => {
  setTimeout(() => {
    isCustomerDropdownOpen.value = false;
  }, 200);
};

const highlightNextCustomer = () => {
    if (customerOptions.value.length === 0) return;
    highlightedCustomerIndex.value = (highlightedCustomerIndex.value + 1) % customerOptions.value.length;
};
const highlightPrevCustomer = () => {
    if (customerOptions.value.length === 0) return;
    highlightedCustomerIndex.value = (highlightedCustomerIndex.value - 1 + customerOptions.value.length) % customerOptions.value.length;
};
const selectHighlightedCustomer = () => {
    if (highlightedCustomerIndex.value >= 0 && highlightedCustomerIndex.value < customerOptions.value.length) {
        selectCustomer(customerOptions.value[highlightedCustomerIndex.value]);
    } else if (customerSearchTerm.value.trim() !== '' && customerOptions.value.length === 0) {
        isCustomerDropdownOpen.value = false;
    }
};

// --- Product Item Logic ---
const addItem = () => { form.value.items.push(createNewItem()); };

const removeItem = (index) => {
  if (productSearchTimeouts.value[index]) {
    clearTimeout(productSearchTimeouts.value[index]);
    delete productSearchTimeouts.value[index];
  }
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1);
  } else {
    form.value.items[0] = createNewItem();
  }
};

const onProductSearch = (itemIndex, searchTerm) => {
  // console.log(`[onProductSearch INVOKED] Item Index: ${itemIndex}, Search Term: "${searchTerm}"`);
  const item = form.value.items[itemIndex];
  if (!item) {
    // console.error(`[onProductSearch] Item at index ${itemIndex} not found.`);
    return;
  }
  item.product_search_term = searchTerm;
  item.is_product_dropdown_open = true;
  item.highlighted_product_index = -1;

  if (item.selected_product_name && searchTerm !== item.selected_product_name) {
    // console.log(`[onProductSearch] Clearing selected product for item ${itemIndex} due to search term change.`);
    item.product_id = null; item.original_unit_price = 0; item.satuan = '';
    item.max_quantity = Infinity; item.custom_unit_price_input = null;
    if (item.customPriceInputElement) item.customPriceInputElement.value = '';
    item.custom_unit_price_display_value = ''; item.selected_product_name = '';
    item.final_unit_price = 0; item.quantity = 1;
  }

  if (productSearchTimeouts.value[itemIndex]) {
    clearTimeout(productSearchTimeouts.value[itemIndex]);
    // console.log(`[onProductSearch] Cleared existing product search timeout for item ${itemIndex}.`);
  }

  const currentSearchTerm = item.product_search_term.trim();
  if (currentSearchTerm === '') {
    // console.log(`[onProductSearch] Search term for item ${itemIndex} is empty. Clearing options and closing dropdown.`);
    item.product_options = [];
    item.is_product_dropdown_open = false;
    return;
  }

  // console.log(`[onProductSearch] Setting new product search timeout for item ${itemIndex} with term: "${currentSearchTerm}"`);
  productSearchTimeouts.value[itemIndex] = setTimeout(async () => {
    // console.log(`[onProductSearch TIMEOUT] API call for item ${itemIndex} with term: "${currentSearchTerm}"`);
    try {
      const response = await getProdukList({ search: currentSearchTerm, page: 1, limit: 10 });
      // console.log(`[onProductSearch TIMEOUT] API response for item ${itemIndex}:`, response);
      if (form.value.items[itemIndex]) {
         form.value.items[itemIndex].product_options = response.data && Array.isArray(response.data.data) ? response.data.data : [];
         // if (form.value.items[itemIndex].product_options.length === 0) {
         //    console.log(`[onProductSearch TIMEOUT] No products found from API for item ${itemIndex}.`);
         // }
      }
    } catch (error) {
      console.error(`[onProductSearch TIMEOUT] Error fetching products for item ${itemIndex}:`, error);
      if (form.value.items[itemIndex]) {
        form.value.items[itemIndex].product_options = [];
      }
    } finally {
      // console.log(`[onProductSearch TIMEOUT] Finished for item ${itemIndex}.`);
      delete productSearchTimeouts.value[itemIndex];
    }
  }, 300);
};

const handleProductSearchBlur = (itemIndex) => {
    setTimeout(() => {
        if (form.value.items[itemIndex] && form.value.items[itemIndex].is_product_dropdown_open) {
             form.value.items[itemIndex].is_product_dropdown_open = false;
        }
    }, 200);
};

const selectProduct = (itemIndex, product) => {
  const item = form.value.items[itemIndex];
  item.product_id = product.id;
  item.selected_product_name = product.nama;
  item.product_search_term = product.nama;
  item.original_unit_price = product.harga_jual;
  item.satuan = product.satuan;
  item.max_quantity = product.jumlah;
  item.quantity = 1;
  item.custom_unit_price_input = null;
  if (item.customPriceInputElement) item.customPriceInputElement.value = '';
  item.custom_unit_price_display_value = `Rp ${product.harga_jual.toLocaleString('id-ID')}`;
  item.final_unit_price = product.harga_jual;
  item.is_product_dropdown_open = false;
  item.product_options = [];
  item.highlighted_product_index = -1;
};

const clearProductSearch = (itemIndex) => {
  const item = form.value.items[itemIndex];
  item.product_search_term = '';
  item.product_options = [];
  item.is_product_dropdown_open = false;
  item.highlighted_product_index = -1;
  if (item.product_id) {
    item.product_id = null; item.original_unit_price = 0; item.satuan = '';
    item.max_quantity = Infinity; item.custom_unit_price_input = null;
    if (item.customPriceInputElement) item.customPriceInputElement.value = '';
    item.custom_unit_price_display_value = ''; item.selected_product_name = '';
    item.final_unit_price = 0; item.quantity = 1;
  }
};

const highlightNextProduct = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (item.product_options.length === 0) return;
    item.highlighted_product_index = (item.highlighted_product_index + 1) % item.product_options.length;
};
const highlightPrevProduct = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (item.product_options.length === 0) return;
    item.highlighted_product_index = (item.highlighted_product_index - 1 + item.product_options.length) % item.product_options.length;
};
const selectHighlightedProduct = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (item.highlighted_product_index >= 0 && item.highlighted_product_index < item.product_options.length) {
        selectProduct(itemIndex, item.product_options[item.highlighted_product_index]);
    } else if (item.product_search_term.trim() !== '' && item.product_options.length === 0) {
        item.is_product_dropdown_open = false;
    }
};

// --- Custom Price Logic ---
const onFocusCustomPrice = (itemIndex) => {
  const item = form.value.items[itemIndex];
  if (!item) return;
  item.is_editing_custom_unit_price = true;
  if (item.custom_unit_price_input === null || item.custom_unit_price_input === undefined) {
      item.custom_unit_price_input = '';
  }
};

const focusCustomPriceInput = async (itemIndex) => {
  const item = form.value.items[itemIndex];
  if (!item) return;
  onFocusCustomPrice(itemIndex);
  await nextTick();
  if (item.customPriceInputElement) {
    item.customPriceInputElement.focus();
    if (typeof item.customPriceInputElement.select === 'function' && item.customPriceInputElement.value && item.customPriceInputElement.value !== '') {
        item.customPriceInputElement.select();
    }
  }
};

const formatCustomPriceDisplay = (itemIndex) => {
  const item = form.value.items[itemIndex];
  if (!item) return;
  item.is_editing_custom_unit_price = false;
  if (item.custom_unit_price_input !== null && item.custom_unit_price_input !== '' && !isNaN(Number(item.custom_unit_price_input)) && Number(item.custom_unit_price_input) >= 0) {
    item.custom_unit_price_display_value = `Rp ${Number(item.custom_unit_price_input).toLocaleString('id-ID')}`;
    item.final_unit_price = Number(item.custom_unit_price_input);
  } else {
    item.custom_unit_price_display_value = typeof item.original_unit_price === 'number' ? `Rp ${item.original_unit_price.toLocaleString('id-ID')}` : 'Rp 0';
    item.final_unit_price = item.original_unit_price || 0;
    item.custom_unit_price_input = null;
    if (item.customPriceInputElement) item.customPriceInputElement.value = '';
  }
};

const updateCustomPriceDisplayOnInput = () => { /* v-model handles */ };

const validateQuantity = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (!item.product_id) return;
    if (item.quantity > item.max_quantity) {
        item.quantity = item.max_quantity;
        alert(`Stok produk ${item.selected_product_name || 'yang dipilih'} hanya tersisa ${item.max_quantity}.`);
    }
    if (item.quantity < 1 && item.product_id) {
        item.quantity = 1;
    }
};


const totalEstimatedPrice = computed(() => {
    return form.value.items.reduce((total, item) => {
        const price = item.final_unit_price || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
    },0);
});

// --- Submission Logic with Confirmation Modal ---
const prepareAndShowConfirmation = () => {
  if (!form.value.customer_id) {
    alert('Mohon pilih pelanggan.');
    return;
  }
  const validItems = form.value.items.filter(
    (item) => item.product_id && Number(item.quantity) > 0
  );
  if (validItems.length === 0) {
    alert('Mohon tambahkan setidaknya satu produk yang valid dengan jumlah lebih dari 0.');
    return;
  }
  for (const item of validItems) {
      if (item.quantity > item.max_quantity) {
          alert(`Jumlah produk "${item.selected_product_name || 'ID ' + item.product_id}" (${item.quantity}) melebihi stok (${item.max_quantity}).`);
          return;
      }
  }

  dataForConfirmation.value = {
    customerName: selectedCustomerName.value || `ID Pelanggan: ${form.value.customer_id}`,
    items: validItems.map(item => ({
      name: item.selected_product_name,
      quantity: item.quantity,
      unitPrice: item.final_unit_price,
      subtotal: item.quantity * item.final_unit_price,
    })),
    grandTotal: totalEstimatedPrice.value,
  };
  showConfirmationModal.value = true;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  dataForConfirmation.value = null;
};

const executeSubmit = () => {
  isSubmitting.value = true;
  closeConfirmationModal();

  const validItems = form.value.items.filter(
    (item) => item.product_id && Number(item.quantity) > 0
  );

  const payloadItems = validItems.map(item => ({
    product_id: item.product_id,
    quantity: Number(item.quantity),
    harga_satuan: item.final_unit_price,
  }));

  const payload = {
    customer_id: Number(form.value.customer_id),
    user_id: form.value.user_id,
    items: payloadItems,
  };

  emit('submit', payload, () => {
    isSubmitting.value = false;
  });
};

const onSubmit = prepareAndShowConfirmation;

</script>

<style scoped>
.opacity-0 { opacity: 0; }
.w-0 { width: 0; }
.h-0 { height: 0; }
.select-none { user-select: none; }
</style>