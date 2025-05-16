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

    <!-- Kategori -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700">Kategori</label>
      <input
        id="category"
        v-model="form.category"
        type="text"
        required
        placeholder="Masukkan kategori"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
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

  const form = ref({
    nama: '',
    category: '',
    description: '',
  });

  watch(
    () => props.pelanggan,
    (newVal) => {
      if (newVal) {
        form.value = {
          nama: newVal.nama || '',
          category: newVal.category || '',
          description: newVal.description || '',
        };
      } else {
        form.value = {
          nama: '',
          category: '',
          description: '',
        };
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
