<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4 max-w-md mx-auto p-4 bg-white rounded-md shadow"
  >
    <!-- Nama Supplier -->
    <div>
      <label for="nama" class="block text-sm font-medium text-gray-700">Nama Supplier</label>
      <input
        id="nama"
        v-model="form.nama"
        type="text"
        required
        placeholder="Masukkan nama supplier"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <!-- Alamat -->
    <div>
      <label for="alamat" class="block text-sm font-medium text-gray-700">Alamat</label>
      <textarea
        id="alamat"
        v-model="form.alamat"
        rows="3"
        required
        placeholder="Masukkan alamat supplier"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      ></textarea>
    </div>

    <!-- Kontak -->
    <div>
      <label for="kontak" class="block text-sm font-medium text-gray-700">Kontak</label>
      <input
        id="kontak"
        v-model="form.kontak"
        type="text"
        placeholder="Masukkan nomor kontak"
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
        placeholder="Masukkan deskripsi supplier"
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
    supplier: Object,
  });

  const emit = defineEmits(['submit']);

  const loading = ref(false);

  const form = ref({
    nama: '',
    alamat: '',
    kontak: '',
    description: '',
  });

  watch(
    () => props.supplier,
    (newVal) => {
      if (newVal) {
        form.value = {
          nama: newVal.nama || '',
          alamat: newVal.alamat || '',
          kontak: newVal.kontak || '',
          description: newVal.description || '',
        };
      } else {
        form.value = {
          nama: '',
          alamat: '',
          kontak: '',
          description: '',
        };
      }
    },
    { immediate: true }
  );

  const onSubmit = () => {
    loading.value = true;

    if (!form.value.nama || !form.value.alamat ) {
      alert('Mohon lengkapi nama, alamat, dan kontak supplier.');
      loading.value = false;
      return;
    }

    emit('submit', { ...form.value }, () => {
      loading.value = false;
    });
  };
</script>
