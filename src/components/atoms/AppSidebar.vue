<template>
  <aside class="hidden md:flex flex-col w-64 bg-[#f9ffee] border-r border-gray-200">
    <div class="h-20 flex items-center justify-center border-b border-gray-200 bg-[#e9f7d3]">
      <h1 class="text-2xl font-bold text-lime-600">Nick Nie Apps</h1>
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        to="/dashboard"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Dashboard
      </router-link>

      <router-link
        to="/produk"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Data Produk
      </router-link>

      <router-link
        to="data_pelanggan"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Data Pelanggan
      </router-link>

      <router-link
        to="data_supplier"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Data Pemasok
      </router-link>

      <router-link
        to="pembelian"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Pembelian
      </router-link>

      <router-link
        to="penjualan"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Penjualan
      </router-link>

      <router-link
        v-if="isOwner"
        to="akun"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Akun
      </router-link>
    </nav>
  </aside>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import Cookies from 'js-cookie';

const isOwner = ref(false);

onMounted(() => {
  // Cek apakah pengguna adalah pemilik
  isOwner.value = Cookies.get('role') === 'owner';
});
</script>
