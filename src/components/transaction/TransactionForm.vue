<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 max-w-md mx-auto p-4 bg-white rounded-md shadow"
  >
    <!-- Customer ID -->
    <div>
      <label for="customer" class="block text-sm font-medium text-gray-700">Nama Customer</label>
      <input
        id="customer"
        v-model="form.customer_id"
        type="number"
        required
        placeholder="Masukkan ID customer"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Product (Dropdown Search) -->
    <div v-for="(item, index) in form.items" :key="index">
      <label for="product" class="block text-sm font-medium text-gray-700">Produk</label>
      <div class="flex gap-2">
        <input
          v-model="item.product_id"
          type="number"
          required
          placeholder="Masukkan ID produk"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          v-model="item.quantity"
          type="number"
          required
          placeholder="Jumlah produk"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <button @click="removeItem(index)" type="button" class="text-red-500 text-sm">
        Hapus Produk
      </button>
    </div>

    <button
      @click="addItem"
      type="button"
      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
    >
      Tambah Produk
    </button>

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
    transaction: Object,
  });

  const emit = defineEmits(['submit']);

  const loading = ref(false);

  const form = ref({
    customer_id: '',
    user_id: 2, // Assuming logged in user id
    items: [
      {
        product_id: '',
        quantity: '',
      },
    ],
  });

  const addItem = () => {
    form.value.items.push({
      product_id: '',
      quantity: '',
    });
  };

  const removeItem = (index) => {
    form.value.items.splice(index, 1);
  };

  watch(
    () => props.transaction,
    (newVal) => {
      if (newVal) {
        form.value = {
          customer_id: newVal.customer_id || '',
          user_id: newVal.user_id || 2,
          items: newVal.items || [
            {
              product_id: '',
              quantity: '',
            },
          ],
        };
      } else {
        form.value = {
          customer_id: '',
          user_id: 2,
          items: [
            {
              product_id: '',
              quantity: '',
            },
          ],
        };
      }
    },
    { immediate: true }
  );

  const onSubmit = () => {
    loading.value = true;

    if (!form.value.customer_id || !form.value.items.length) {
      alert('Mohon lengkapi customer dan produk.');
      loading.value = false;
      return;
    }

    emit('submit', { ...form.value }, () => {
      loading.value = false;
    });
  };
</script>
