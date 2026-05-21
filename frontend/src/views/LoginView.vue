<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background:#0d0d0d">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="mx-auto mb-4" style="width:112px;height:112px;border-radius:50%;overflow:hidden;background:#000">
          <img src="/logo.png" alt="Déborah Cristhiany" style="width:100%;height:100%;object-fit:cover;display:block" />
        </div>
        <h1 class="text-lg font-bold text-white tracking-wide">DÉBORAH CRISTHIANY</h1>
        <p class="text-xs text-zinc-500 tracking-widest uppercase mt-1">Área Administrativa</p>
      </div>

      <form @submit.prevent="doLogin" class="rounded-2xl p-6 space-y-4"
            style="background:#1a1a1a;border:1px solid #2a2a2a">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            placeholder="admin@exemplo.com"
            class="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none border"
            style="background:#0d0d0d;border-color:#2a2a2a"
            @focus="$event.target.style.borderColor='#e8557a'"
            @blur="$event.target.style.borderColor='#2a2a2a'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="••••••••"
            class="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none border"
            style="background:#0d0d0d;border-color:#2a2a2a"
            @focus="$event.target.style.borderColor='#e8557a'"
            @blur="$event.target.style.borderColor='#2a2a2a'"
          />
        </div>

        <div v-if="errorMsg" class="text-sm rounded-xl px-4 py-3"
             style="background:#1a0a10;border:1px solid #e8557a60;color:#f9a8d4">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full font-semibold py-3.5 rounded-xl transition-all"
          :style="loading ? 'background:#2a2a2a;color:#555' : 'background:#e8557a;color:#fff'"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="text-center text-xs text-zinc-600 mt-6">
        <button @click="$router.push('/')" class="hover:text-zinc-400 transition-colors">
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
