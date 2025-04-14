import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';

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
    ],
    history: createWebHistory()
})

createApp(App).use(pinia).use(router).mount('#app')