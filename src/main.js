import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';

// axios.defaults.baseURL = 'https://robert-praise-calculate-singer.trycloudflare.com';
axios.defaults.baseURL = 'http://localhost:3000';

const token = Cookies.get('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Import Pages
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import ProdukPage from './pages/produk/ProdukPage.vue';
import PelangganPage from './pages/pelanggan/PelangganPage.vue';
import SupplierPage from './pages/supplier/SupplierPage.vue';
import PembelianPage from './pages/pembelian/PembelianPage.vue';
import PenjualanPage from './pages/penjualan/PenjualanPage.vue';
import AkunPage from './pages/akun/AkunPage.vue';
import PrintNota from './components/prints/PrintablePurchaseNote.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

const pinia = createPinia();

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Login', component: LoginPage, meta: { title: 'Login' } },
    { path: '/login', name: 'LoginPage', component: LoginPage, meta: { title: 'Login' } },
    { path: '/register', name: 'Register', component: RegisterPage, meta: { title: 'Register' } },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardPage,
      meta: { title: 'Dashboard' },
    },
    {
      path: '/produk',
      name: 'ProdukPage',
      component: ProdukPage,
      meta: { title: 'Data Produk' },
    },
    {
      path: '/data_pelanggan',
      name: 'PelangganPage',
      component: PelangganPage,
      meta: { title: 'Data Pelanggan' },
    },
    {
      path: '/data_supplier',
      name: 'SupplierPage',
      component: SupplierPage,
      meta: { title: 'Data Supplier' },
    },
    {
      path: '/pembelian',
      name: 'PembelianPage',
      component: PembelianPage,
      meta: { title: 'Data Pembelian' },
    },
    {
      path: '/penjualan',
      name: 'PenjualanPage',
      component: PenjualanPage,
      meta: { title: 'Data Penjualan' },
    },
    {
      path: '/akun',
      name: 'AkunPage',
      component: AkunPage,
      meta: { title: 'Data Akun Pegawai' },
    },
    {
      path: '/print/purchase-note/:id',
      name: 'PrintableTransactionNote',
      component: PrintNota,
      meta: { isPrintPage: true, title: 'Print Nota Pembelian' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundPage,
      meta: { title: 'Not Found' },
    },
  ],
});

app.use(pinia).use(router).mount('#app');
