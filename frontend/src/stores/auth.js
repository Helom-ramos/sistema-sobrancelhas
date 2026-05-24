import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password, rememberMe = false) {
    const { data } = await api.post('/auth/login', { email, password, rememberMe })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    if (rememberMe) {
      localStorage.setItem('savedEmail', email)
    } else {
      localStorage.removeItem('savedEmail')
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, login, logout }
})
