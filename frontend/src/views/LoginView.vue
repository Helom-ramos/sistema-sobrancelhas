<template>
  <div class="min-h-screen bg-brand-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">✨</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Área Administrativa</h1>
        <p class="text-sm text-gray-500 mt-1">Studio de Sobrancelhas</p>
      </div>

      <form @submit.prevent="doLogin" class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            placeholder="admin@exemplo.com"
            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="••••••••"
            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="text-center text-xs text-gray-400 mt-6">
        <button @click="$router.push('/')" class="hover:text-brand-600 transition-colors">
          ← Voltar ao site
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function doLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/admin/dashboard')
  } catch {
    errorMsg.value = 'E-mail ou senha incorretos.'
  } finally {
    loading.value = false
  }
}
</script>
