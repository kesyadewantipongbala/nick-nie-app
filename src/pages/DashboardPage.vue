<script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';

  const router = useRouter();
  const pageTitle = ref('Dashboard');
  const username = ref('John Doe');

  const logout = () => {
    console.log('Logging out...');
    router.push('/login');
  };
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <div class="flex flex-col flex-1 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <div class="text-2xl font-bold text-gray-800 mb-6">{{ pageTitle }}</div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <div class="text-gray-600">Total Users</div>
            <div class="text-3xl font-bold text-lime-600">1,234</div>
          </div>
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <div class="text-gray-600">Total Orders</div>
            <div class="text-3xl font-bold text-lime-600">567</div>
          </div>
          <div class="p-6 rounded-2xl bg-white shadow-md">
            <div class="text-gray-600">Revenue</div>
            <div class="text-3xl font-bold text-lime-600">$8,900</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
