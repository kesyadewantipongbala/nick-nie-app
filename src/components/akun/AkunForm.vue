<template>
    <form @submit.prevent="onSubmit" class="space-y-4 max-w-md mx-auto p-4 bg-white rounded-md shadow">
        <!-- Username -->
        <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" v-model="form.username" type="text" required placeholder="Masukkan username"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" required
                    placeholder="Masukkan password"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                <button type="button" @click="togglePasswordVisibility"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.055 10.055 0 013.45-4.588m2.642-1.285A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.972 9.972 0 01-1.563 2.693M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
            <button type="submit" :disabled="loading"
                class="bg-[#007bff] hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50">
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
const showPassword = ref(false); // ✅ INI WAJIB ADA

const form = ref({
  username: '',
  password: ''
});

watch(
  () => props.supplier,
  (newVal) => {
    if (newVal) {
      form.value = {
        username: newVal.username || '',
        password: newVal.password || '',
      };
    } else {
      form.value = {
        username: '',
        password: '',
      };
    }
  },
  { immediate: true }
);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = () => {
  loading.value = true;

  if (!form.value.username || !form.value.password) {
    alert('Mohon lengkapi username dan password');
    loading.value = false;
    return;
  }

  emit('submit', { ...form.value }, () => {
    loading.value = false;
  });
};
</script>

