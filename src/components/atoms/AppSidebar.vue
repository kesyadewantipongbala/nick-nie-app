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
        to="/data_barang"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
        active-class="bg-lime-100 font-semibold text-lime-600"
      >
        Data Produk
      </router-link>

      <router-link
        to="data_pelanggan"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
      >
        Data Pelanggan
      </router-link>

      <router-link
        to="data_pemasok"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
      >
        Data Pemasok
      </router-link>

      <router-link
        to="pembelian"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
      >
        Pembelian
      </router-link>

      <router-link
        to="penjualan"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
      >
        Penjualan
      </router-link>

      <router-link
        to="pengaturan"
        class="block py-2 px-4 rounded-xl text-gray-700 hover:bg-lime-100 transition"
      >
        Pengaturan
      </router-link>
    </nav>
  </aside>
</template>
