<template>
  <div class="min-h-screen flex flex-col" style="background:#0d0d0d">

    <!-- Header simples -->
    <header class="px-5 py-3 flex items-center justify-between" style="border-bottom:1px solid #1a1a1a">
      <p class="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Déborah Cristhiany</p>
      <button @click="$router.push('/login')" class="text-xs text-zinc-600 hover:text-pink-400 transition-colors">
        Admin
      </button>
    </header>

    <!-- Banner: fundo preto, filter:invert(1) → letras brancas -->
    <div style="background:#000000; padding:24px 20px 16px; display:flex; justify-content:center">
      <img
        src="/banner.png"
        alt="Déborah Cristhiany Designer de Sobrancelhas"
        style="display:block; width:100%; max-width:380px; height:auto; filter:invert(1)"
      />
    </div>

    <!-- Linha rosa divisória -->
    <div style="height:1px; background:linear-gradient(to right,#0d0d0d,#e8557a,#0d0d0d)"></div>

    <!-- CTA e conteúdo -->
    <main class="flex-1 flex flex-col items-center px-5 pt-8 pb-10">

      <p class="text-zinc-500 text-center text-sm mb-7 max-w-xs">
        Agende seu horário em poucos cliques,<br/>sem precisar criar conta.
      </p>

      <button
        @click="$router.push('/agendar')"
        class="w-full max-w-xs font-semibold py-4 rounded-2xl text-base transition-all active:scale-95 mb-10"
        style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff"
      >
        Agendar Agora
      </button>

      <!-- Seção de serviços -->
      <p class="text-xs text-zinc-600 tracking-widest uppercase font-medium self-start mb-4 w-full max-w-xs">
        Nossos Serviços
      </p>

      <div v-if="loading" class="text-zinc-600 text-sm py-4">Carregando...</div>
      <div v-else class="w-full max-w-xs space-y-3">
        <div
          v-for="s in services"
          :key="s._id"
          class="rounded-2xl overflow-hidden flex items-center"
          style="background:#161616; border:1px solid #222"
        >
          <div class="w-20 h-20 shrink-0 overflow-hidden" style="background:#1f1f1f">
            <img
              v-if="s.image"
              :src="s.image"
              :alt="s.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-2xl opacity-30">💆</span>
            </div>
          </div>
          <div class="flex-1 px-4 py-3">
            <p class="font-semibold text-white text-sm">{{ s.name }}</p>
            <p class="text-xs text-zinc-500 mt-0.5">{{ s.duration }} min</p>
          </div>
          <div class="pr-4 shrink-0">
            <p class="text-sm font-bold" style="color:#e8557a">R$ {{ s.price }}</p>
          </div>
        </div>
      </div>

      <!-- Info salão -->
      <div
        v-if="settings"
        class="w-full max-w-xs mt-5 rounded-2xl p-4 space-y-2"
        style="background:#161616; border:1px solid #222"
      >
        <p v-if="settings.address" class="text-xs text-zinc-500">📍 {{ settings.address }}</p>
        <p v-if="settings.phone" class="text-xs text-zinc-500">📞 (38) 99924-3577</p>
        <a
          v-if="settings.instagram"
          :href="settings.instagram"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1.5 text-xs transition-colors"
          style="color:#e8557a"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          @deboraahcr
        </a>
      </div>
    </main>

    <footer class="text-center text-xs py-4" style="color:#2a2a2a; border-top:1px solid #1a1a1a">
      © Déborah Cristhiany · Designer de Sobrancelhas
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

const services = ref([])
const settings = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [svcRes, setRes] = await Promise.all([
      api.get('/services'),
      api.get('/settings')
    ])
    services.value = svcRes.data
    settings.value = setRes.data
  } catch { /* silencioso */ }
  finally { loading.value = false }
})
</script>
