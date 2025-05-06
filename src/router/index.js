import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Auth/Login.vue'
import Register from '@/components/Auth/Register.vue'
import TaskManager from '@/views/TaskManager.vue'
import {useAuthStore} from "@/stores/auth.js";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: TaskManager,
        meta: { requiresAuth: true }
    },
    {
        path: '/',
        redirect: '/tasks'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
        next('/tasks')
    } else {
        next()
    }
})

export default router