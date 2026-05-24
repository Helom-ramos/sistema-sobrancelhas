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

        <label class="flex items-center gap-2 cursor-pointer select-none">
          <div class="relative shrink-0">
            <input type="checkbox" v-model="rememberMe" class="sr-only" />
            <div class="w-5 h-5 rounded-md border flex items-center justify-center transition-colors"
                 :style="rememberMe ? 'background:#e8557a;border-color:#e8557a' : 'background:#0d0d0d;border-color:#3a3a3a'">
              <svg v-if="rememberMe" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
          <span class="text-sm text-zinc-400">Lembrar acesso</span>
        </label>

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

const savedEmail = localStorage.getItem('savedEmail') || ''
const email = ref(savedEmail)
const password = ref('')
const rememberMe = ref(!!savedEmail)
const loading = ref(false)
const errorMsg = ref('')

async function doLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(email.value, password.value, rememberMe.value)
    router.push('/admin/dashboard')
  } catch {
    errorMsg.value = 'E-mail ou senha incorretos.'
  } finally {
    loading.value = false
  }
}
</script>
