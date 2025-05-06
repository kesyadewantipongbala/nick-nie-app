import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// Import Pages
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import DataBarang from './pages/DasboardBarang.vue';

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardPage,
    },
    {
      path: '/data_barang',
      name: 'DataBarang',
      component: DataBarang,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: {
        template: '<div class="p-8 text-red-600">404 - Halaman Tidak Ditemukan</div>',
      },
    },
  ],
});

createApp(App).use(pinia).use(router).mount('#app');
