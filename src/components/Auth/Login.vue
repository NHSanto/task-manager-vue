<template>
  <div id="auth-screens">
    <div id="login-screen" class="auth-screen">
      <div class="auth-container">
        <h1>Login to Task Manager</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input type="email" v-model="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input type="password" v-model="password" placeholder="Password" required>
          </div>
          <button type="submit" class="auth-btn">Login</button>
          <p class="auth-link">Don't have an account? <router-link to="/register">Register</router-link></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/tasks')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
/* Auth screen styles from your original CSS */
#auth-screens {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.auth-screen {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}
.auth-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.auth-container h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.auth-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.auth-btn:hover {
  background-color: #45a049;
}

.auth-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.auth-link a {
  color: #4CAF50;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>