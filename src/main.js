import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// Import Pages
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import DataBarang from './pages/DasboardBarang.vue';

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
      path: '/data_barang',
      name: 'DataBarang',
      component: DataBarang,
      meta: { title: 'Data Barang' },
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
