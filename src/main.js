import { createApp } from 'vue';
// import './style.css'
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import DataBarang from './pages/DasboardBarang.vue';
import RegisterPage from './pages/RegisterPage.vue';
import DashboardPage from './pages/DashboardPage.vue';

const pinia = createPinia();
const router = createRouter({
  routes: [
    {
      path: '/',
      component: LoginPage,
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/data_barang',
      component: DataBarang,
    },
    {
      path: '/register',
      component: RegisterPage,
    },
    {
      path: '/dashboard',
      component: DashboardPage,
    },
  ],
  history: createWebHistory(),
});

createApp(App).use(pinia).use(router).mount('#app');
