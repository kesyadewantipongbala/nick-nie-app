import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import DataBarang from './components/DataBarang.vue';
import RegisterPage from './components/RegisterPage.vue';
import Dashoard from './components/Dashoard.vue';

const pinia = createPinia();
const router = createRouter({
    routes: [
        {
            path: "/",
            component: LoginPage
        },
        {
            path: "/login",
            component: LoginPage
        },
        {
            path: "/data_barang",
            component: DataBarang
        },
        {
            path: "/register",
            component: RegisterPage
        },
        {
            path: "/dashboard",
            component: Dashoard
        },
    ],
    history: createWebHistory()
})

createApp(App).use(pinia).use(router).mount('#app')