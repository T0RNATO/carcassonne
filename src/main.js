import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
    history: createWebHistory(),
    routes: [

    ],
})

createApp(App).use(router).mount('#app');
