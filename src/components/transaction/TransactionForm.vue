<template>
  <form @submit.prevent="onSubmit" class="space-y-6 bg-white rounded-md">
    <div>
      <label for="customer" class="block text-sm font-medium text-gray-700 mb-1"
        >Nama Customer (ID)</label
      >
      <input
        id="customer"
        v-model="form.customer_id"
        type="number"
        required
        placeholder="Masukkan ID customer"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
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
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-16"
        />
        <LoadingCircle
          v-if="loadingProducts[index]"
          size="sm"
          class="absolute right-10 top-[calc(1.5rem+0.5rem+2px)] transform -translate-y-1/2 z-10"
        />
        <button
          v-if="item.product_id"
          type="button"
          @click="clearProduct(index)"
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
        <p v-if="item.is_product_dropdown_open && !item.product_options.length && item.product_search_term && !loadingProducts[index]" class="mt-1 text-xs text-gray-500">
          Produk tidak ditemukan.
        </p>
      </div>

      <div>
        <label :for="'quantity-' + index" class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
        <input
          :id="'quantity-' + index"
          v-model.number="item.quantity"
          type="number"
          min="1"
          required
          :max="item.max_quantity"
          @input="validateQuantity(index)"
          placeholder="Jumlah"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <p v-if="item.product_id && typeof item.original_price === 'number'" class="text-xs text-gray-500 mt-1">
            Harga Asli: Rp {{ item.original_price.toLocaleString('id-ID') }} / {{ item.satuan }}
        </p>
      </div>

      <div v-if="item.product_id">
        <label :for="'custom-price-display-' + index" class="block text-sm font-medium text-gray-700 mb-1">
            Harga Jual Satuan (Opsional)
        </label>
        <div
            :id="'custom-price-display-' + index"
            @click="focusCustomPriceInput(index)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm cursor-text bg-gray-50"
            :class="{ 'text-gray-400 italic': !item.custom_price_display_value && !item.is_editing_custom_price }"
        >
            {{ item.is_editing_custom_price ? item.custom_price_input : (item.custom_price_display_value || (typeof item.original_price === 'number' ? `Rp ${item.original_price.toLocaleString('id-ID')}` : 'Rp 0')) }}
        </div>
        <input
            :ref="el => {
              if (!itemRefs.value[index]) {
                itemRefs.value[index] = {}; // Inisialisasi objek jika belum ada
              }
              itemRefs.value[index].customPriceInput = el;
            }"
            type="number"
            min="0"
            v-model.number="item.custom_price_input"
            @blur="formatCustomPriceDisplay(index)"
            @focus="onFocusCustomPrice(index)"
            @input="updateCustomPriceDisplayOnInput(index)"
            placeholder="Harga kustom"
            class="opacity-0 w-0 h-0 absolute"
        />
        <p class="text-xs text-gray-500 mt-1">Klik untuk mengubah harga jual. Kosongkan untuk harga standar.</p>
      </div>


      <button @click="removeItem(index)" type="button" class="text-red-500 hover:text-red-700 text-sm font-medium absolute top-2 right-2">
        Hapus
      </button>
    </div>

    <div class="flex justify-between items-center">
        <button
        @click="addItem"
        type="button"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
        >
        + Tambah Produk
        </button>
        <div class="text-lg font-semibold">
            Total Estimasi: Rp {{ totalEstimatedPrice.toLocaleString('id-ID') }}
        </div>
    </div>


    <div class="flex justify-end pt-4">
      <button
        type="button"
        @click="$emit('close')"
        class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition mr-2"
      >
        Batal
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50 transition"
      >
        {{ isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, nextTick, computed, onBeforeUpdate } from 'vue';
import { getProdukList, getProdukDetail } from '../../services/produkService.js';
import LoadingCircle from '../atoms/LoadingCircle.vue';

const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(['submit', 'close']);

const isSubmitting = ref(false);
const loadingProducts = ref({});

let itemKeyCounter = 0;
const createNewItem = (productData = null, transactionItemData = null) => {
  const newItem = {
    key: itemKeyCounter++,
    product_id: productData ? productData.id : null,
    quantity: transactionItemData ? transactionItemData.quantity : (productData ? 1 : 1),
    original_price: productData ? productData.harga_jual : 0,
    satuan: productData ? productData.satuan : '',
    max_quantity: productData ? productData.jumlah : Infinity,
    custom_price_input: null,
    final_price: productData ? productData.harga_jual : 0,
    product_search_term: productData ? productData.nama : '',
    product_options: [],
    is_product_dropdown_open: false,
    highlighted_product_index: -1,
    selected_product_name: productData ? productData.nama : '',
    custom_price_display_value: '',
    is_editing_custom_price: false,
  };

  if (productData) {
    newItem.custom_price_display_value = `Rp ${productData.harga_jual.toLocaleString('id-ID')}`;
    if (transactionItemData && typeof transactionItemData.harga_jual === 'number' && transactionItemData.harga_jual !== productData.harga_jual) {
      newItem.custom_price_input = transactionItemData.harga_jual;
      newItem.final_price = transactionItemData.harga_jual;
      newItem.custom_price_display_value = `Rp ${transactionItemData.harga_jual.toLocaleString('id-ID')}`;
    }
  } else if (transactionItemData && typeof transactionItemData.harga_jual === 'number') {
    newItem.final_price = transactionItemData.harga_jual;
    newItem.custom_price_display_value = `Rp ${transactionItemData.harga_jual.toLocaleString('id-ID')} (harga transaksi)`;
    newItem.selected_product_name = `Produk ID ${transactionItemData.product_id}`;
    newItem.product_search_term = `Produk ID ${transactionItemData.product_id}`;
  }
  return newItem;
};


const form = ref({
  customer_id: '',
  user_id: 2,
  items: [createNewItem()],
});

const itemRefs = ref([]);
onBeforeUpdate(() => {
  // Kosongkan array refs sebelum setiap update agar Vue dapat mengisinya kembali dengan benar
  // Ini membantu menjaga konsistensi, terutama jika item dihapus.
  itemRefs.value.forEach(itemRef => {
    if (itemRef) { // Pastikan itemRef itu sendiri tidak null/undefined
      itemRef.customPriceInput = null; // Hapus referensi DOM lama
    }
  });
  // Meskipun kita mengosongkan properti di atas, cara yang lebih aman untuk menangani penghapusan item
  // adalah dengan mengandalkan Vue untuk menghapus elemen ref dari array jika item-nya hilang.
  // Yang penting adalah inisialisasi objek saat ref function dipanggil.
});


const addItem = () => {
  form.value.items.push(createNewItem());
  // Tidak perlu secara eksplisit menambahkan ke itemRefs di sini karena
  // fungsi ref akan dipanggil saat item baru dirender.
};

const removeItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1);
    // Hapus juga referensi terkait jika ada, atau biarkan Vue menangani saat onBeforeUpdate
    // Jika menggunakan itemRefs.value[index] = {} pada inisialisasi ref,
    // mungkin perlu membersihkan itemRefs.value.splice(index, 1) juga
    // tapi biasanya Vue akan mengelola ref yang tidak lagi ada di DOM.
    // Untuk amannya, dan karena kita menggunakan `key` pada `v-for`,
    // `onBeforeUpdate` dan logika inisialisasi di ref function seharusnya cukup.
  } else {
    form.value.items[0] = createNewItem();
    if(itemRefs.value[0]) itemRefs.value[0] = {}; // Reset juga refnya jika hanya satu item
  }
};

let productSearchTimeout = null;
const onProductSearch = (itemIndex, searchTerm) => {
  const item = form.value.items[itemIndex];
  item.product_search_term = searchTerm;
  item.is_product_dropdown_open = true;
  item.highlighted_product_index = -1;

  if (item.selected_product_name && searchTerm !== item.selected_product_name) {
    item.product_id = null;
    item.original_price = 0;
    item.satuan = '';
    item.max_quantity = Infinity;
    item.custom_price_input = null;
    item.custom_price_display_value = '';
    item.selected_product_name = '';
    item.final_price = 0;
  }

  if (productSearchTimeout) clearTimeout(productSearchTimeout);
  loadingProducts.value[itemIndex] = true;
  productSearchTimeout = setTimeout(async () => {
    try {
      if (searchTerm.trim() !== '') {
        const response = await getProdukList({ search: searchTerm.trim(), page: 1, limit: 10 });
        item.product_options = response.data && Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        item.product_options = [];
      }
    } catch (error) {
      console.error("Error fetching products for item " + itemIndex + ":", error);
      item.product_options = [];
    } finally {
      loadingProducts.value[itemIndex] = false;
    }
  }, 500);
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
  item.original_price = product.harga_jual;
  item.satuan = product.satuan;
  item.max_quantity = product.jumlah;
  item.quantity = 1;
  item.custom_price_input = null;
  item.custom_price_display_value = `Rp ${product.harga_jual.toLocaleString('id-ID')}`;
  item.final_price = product.harga_jual;
  item.is_product_dropdown_open = false;
  item.product_options = [];
  item.highlighted_product_index = -1;
};

const clearProduct = (itemIndex) => {
  const item = form.value.items[itemIndex];
  Object.assign(item, {
      ...createNewItem(),
      key: item.key
  });
  item.product_search_term = '';
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
  }
};

const onFocusCustomPrice = (itemIndex) => {
  const item = form.value.items[itemIndex];
  item.is_editing_custom_price = true;
  if (item.custom_price_input === null || item.custom_price_input === undefined) {
      item.custom_price_input = '';
  }
};

const focusCustomPriceInput = async (itemIndex) => {
  const item = form.value.items[itemIndex];
  onFocusCustomPrice(itemIndex);

  await nextTick();
  // Pastikan itemRefs.value[index] dan itemRefs.value[index].customPriceInput ada
  if (itemRefs.value[index] && itemRefs.value[index].customPriceInput) {
    itemRefs.value[index].customPriceInput.focus();
    if (itemRefs.value[index].customPriceInput.value) {
        itemRefs.value[index].customPriceInput.select();
    }
  }
};

const formatCustomPriceDisplay = (itemIndex) => {
  const item = form.value.items[itemIndex];
  item.is_editing_custom_price = false;
  if (item.custom_price_input !== null && item.custom_price_input !== '' && !isNaN(Number(item.custom_price_input)) && Number(item.custom_price_input) >= 0) {
    item.custom_price_display_value = `Rp ${Number(item.custom_price_input).toLocaleString('id-ID')}`;
    item.final_price = Number(item.custom_price_input);
  } else {
    item.custom_price_display_value = typeof item.original_price === 'number' ? `Rp ${item.original_price.toLocaleString('id-ID')}` : 'Rp 0';
    item.final_price = item.original_price || 0;
    item.custom_price_input = null;
  }
};

const updateCustomPriceDisplayOnInput = (itemIndex) => { /* Handled by v-model */ };

const validateQuantity = (itemIndex) => {
    const item = form.value.items[itemIndex];
    if (!item.product_id) return;

    if (item.quantity > item.max_quantity) {
        item.quantity = item.max_quantity;
        alert(`Stok produk ${item.selected_product_name || 'yang dipilih'} hanya tersisa ${item.max_quantity}.`);
    }
    if (item.quantity < 1) {
        item.quantity = 1;
    }
};

watch(() => props.transaction, async (newVal) => {
  if (newVal && newVal.id) {
    isSubmitting.value = true;
    form.value.customer_id = newVal.customer_id || '';
    form.value.user_id = newVal.user_id || 2;

    if (newVal.items && newVal.items.length > 0) {
      const mappedItems = await Promise.all(newVal.items.map(async (txItem) => {
        try {
          const productDetailResponse = await getProdukDetail(txItem.product_id);
          if (productDetailResponse.success && productDetailResponse.data) {
            const productDetails = productDetailResponse.data;
            return createNewItem(productDetails, txItem);
          } else {
            console.warn(`Gagal mendapatkan detail untuk produk ID: ${txItem.product_id}. Response:`, productDetailResponse);
            const fallbackProductData = { id: txItem.product_id, nama: `Produk ID ${txItem.product_id} (Detail Gagal Dimuat)`, harga_jual: txItem.harga_jual, jumlah: txItem.quantity, satuan: '?' };
            return createNewItem(fallbackProductData, txItem);
          }
        } catch (error) {
          console.error(`Error fetching product details for ID ${txItem.product_id} during edit:`, error);
          const errorFallbackProductData = { id: txItem.product_id, nama: `Produk ID ${txItem.product_id} (Error Fetch Detail)`, harga_jual: txItem.harga_jual, jumlah: txItem.quantity, satuan: '?' };
          return createNewItem(errorFallbackProductData, txItem);
        }
      }));
      form.value.items = mappedItems.filter(item => item.product_id);
      if(form.value.items.length === 0) form.value.items = [createNewItem()];
    } else {
      form.value.items = [createNewItem()];
    }
    isSubmitting.value = false;
  } else {
    form.value.customer_id = '';
    form.value.user_id = 2;
    form.value.items = [createNewItem()];
  }
}, { immediate: true, deep: true });


const totalEstimatedPrice = computed(() => {
    return form.value.items.reduce((total, item) => {
        const price = item.final_price || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
    },0);
});

const onSubmit = () => {
  isSubmitting.value = true;

  if (!form.value.customer_id) {
    alert('Mohon masukkan ID Customer.');
    isSubmitting.value = false;
    return;
  }

  const validItems = form.value.items.filter(
    (item) => item.product_id && Number(item.quantity) > 0
  );

  if (validItems.length === 0) {
    alert('Mohon tambahkan setidaknya satu produk yang valid dengan jumlah lebih dari 0.');
    isSubmitting.value = false;
    return;
  }

  for (const item of validItems) {
      if (item.quantity > item.max_quantity) {
          alert(`Jumlah produk "${item.selected_product_name || 'ID ' + item.product_id}" (${item.quantity}) melebihi stok (${item.max_quantity}).`);
          isSubmitting.value = false;
          return;
      }
  }

  const payloadItems = validItems.map(item => ({
    product_id: item.product_id,
    quantity: Number(item.quantity),
    harga_jual: item.final_price,
  }));

  const payload = {
    customer_id: Number(form.value.customer_id),
    user_id: form.value.user_id,
    items: payloadItems,
  };

  console.log('Submitting transaction payload:', JSON.stringify(payload, null, 2));

  emit('submit', payload, () => {
    isSubmitting.value = false;
  });
};
</script>

<style scoped>
.opacity-0 { opacity: 0; }
.w-0 { width: 0; }
.h-0 { height: 0; }
</style>