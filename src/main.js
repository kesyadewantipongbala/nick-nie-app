import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = 'http://13.239.133.55:5000';
const token = Cookies.get('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Import Pages
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import ProdukPage from './pages/produk/ProdukPage.vue';

// import store from './store';

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
      component: ProdukPage,
      meta: { title: 'Data Pelanggan' },
    },
    {
      path: '/data_supplier',
      name: 'SupplierPage',
      component: ProdukPage,
      meta: { title: 'Data Supplier' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: {
        template: '<div class="p-8 text-red-600">404 - Halaman Tidak Ditemukan</div>',
      },
      meta: { title: 'Not Found' },
    },
  ],
});

// app.use(store);
app.use(pinia).use(router).mount('#app');
