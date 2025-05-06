import { defineStore } from 'pinia'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        currentUser: authService.currentUser,
    }),
    getters: {
        isAuthenticated: () => authService.isAuthenticated()
    },
    actions: {
        async login(email, password) {
            try {
                this.currentUser = await authService.login(email, password)
                return true
            } catch (error) {
                throw error
            }
        },
        async register(name, email, password) {
            try {
                this.currentUser = await authService.register(name, email, password)
                return true
            } catch (error) {
                throw error
            }
        },
        async logout() {
            await authService.logout()
            this.currentUser = null
        }
    }
})