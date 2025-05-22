import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';

const routes = [
  { path: '/login', component: LoginPage },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  { path: '/', redirect: '/dashboard' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token'); // cek token

  if (to.meta.requiresAuth && !isLoggedIn) {
    // jika route butuh auth dan user belum login
    next('/login'); // redirect ke login
  } else if (to.path === '/login' && isLoggedIn) {
    // jika sudah login tapi ke login page, redirect ke dashboard
    next('/dashboard');
  } else {
    next(); // lanjut ke halaman yang diminta
  }
});

export default router;
