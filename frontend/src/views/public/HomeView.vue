<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden" style="background:#0d0b12">

    <!-- Glow rosa topo -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
         style="width:340px;height:220px;background:radial-gradient(ellipse,rgba(232,85,122,0.13) 0%,transparent 70%);z-index:0"/>

    <!-- Botanical topo-direita -->
    <svg class="absolute top-0 right-0 pointer-events-none select-none" width="130" height="260" viewBox="0 0 130 260" fill="none" style="opacity:0.18;z-index:0">
      <path d="M115 5 C105 55 82 100 65 150 C52 188 42 228 32 260" stroke="#e8557a" stroke-width="1.2" fill="none"/>
      <path d="M108 38 C128 18 138 42 116 56 C101 48 108 38 108 38Z" fill="#e8557a"/>
      <path d="M94 72 C114 52 128 72 106 86 C91 78 94 72 94 72Z" fill="#c9a870"/>
      <path d="M82 108 C70 83 50 90 57 112 C63 128 82 118 82 108Z" fill="#e8557a"/>
      <path d="M72 144 C92 124 105 146 83 160 C69 152 72 144 72 144Z" fill="#c9a870"/>
      <path d="M62 180 C46 157 26 168 35 190 C43 206 62 192 62 180Z" fill="#e8557a"/>
      <path d="M52 216 C68 196 78 218 58 230 C45 224 52 216 52 216Z" fill="#c9a870"/>
    </svg>

    <!-- Botanical baixo-esquerda -->
    <svg class="absolute bottom-0 left-0 pointer-events-none select-none" width="120" height="240" viewBox="0 0 120 240" fill="none" style="opacity:0.15;z-index:0">
      <path d="M18 240 C28 192 50 155 62 115 C72 80 76 48 84 8" stroke="#c9a870" stroke-width="1.2" fill="none"/>
      <path d="M28 212 C8 228 3 206 20 196 C33 202 28 212 28 212Z" fill="#c9a870"/>
      <path d="M40 176 C20 190 12 170 30 162 C43 165 40 176 40 176Z" fill="#e8557a"/>
      <path d="M52 140 C34 126 38 105 55 114 C65 123 52 140 52 140Z" fill="#c9a870"/>
      <path d="M62 105 C44 90 50 70 67 80 C76 90 62 105 62 105Z" fill="#e8557a"/>
      <path d="M72 70 C55 55 62 36 77 48 C86 57 72 70 72 70Z" fill="#c9a870"/>
    </svg>

    <!-- Glow dourado baixo-esquerda -->
    <div class="absolute bottom-0 left-0 pointer-events-none"
         style="width:200px;height:200px;background:radial-gradient(ellipse,rgba(201,168,112,0.08) 0%,transparent 70%);z-index:0"/>

    <!-- Header -->
    <header class="relative z-10 px-5 py-3 flex items-center justify-between"
            style="border-bottom:1px solid rgba(255,255,255,0.05)">
      <p class="text-xs font-semibold tracking-widest uppercase" style="color:#c9a870;letter-spacing:0.2em">
        Déborah Cristhiany
      </p>
      <button @click="$router.push('/login')"
              class="text-xs transition-colors"
              style="color:#333;letter-spacing:0.05em"
              onmouseover="this.style.color='#e8557a'"
              onmouseout="this.style.color='#333'">
        Admin
      </button>
    </header>

    <!-- Logo / Banner -->
    <div class="relative z-10 flex flex-col items-center pt-8 pb-4 px-5">
      <div style="background:#0d0b12;padding:16px 20px 10px;display:flex;justify-content:center;width:100%;max-width:360px">
        <img src="/banner.png" alt="Déborah Cristhiany Designer de Sobrancelhas"
             style="display:block;width:100%;max-width:260px;height:auto;filter:invert(1);opacity:0.92"/>
      </div>

      <!-- Linha decorativa ouro -->
      <div class="flex items-center gap-3 w-full max-w-xs mt-3 mb-1">
        <div class="flex-1 h-px" style="background:linear-gradient(to right,transparent,#c9a870)"/>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#c9a870" style="opacity:0.7">
          <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z"/>
        </svg>
        <div class="flex-1 h-px" style="background:linear-gradient(to left,transparent,#c9a870)"/>
      </div>

      <p class="text-xs tracking-widest uppercase text-center mt-2" style="color:#c9a870;opacity:0.6;letter-spacing:0.18em">
        Designer de Sobrancelhas
      </p>
    </div>

    <!-- CTA e conteúdo -->
    <main class="relative z-10 flex-1 flex flex-col items-center px-5 pt-2 pb-10">

      <p class="text-center text-sm mb-7 max-w-xs" style="color:#8a7a8a;line-height:1.7">
        Agende seu horário com exclusividade,<br/>sem precisar criar conta.
      </p>

      <!-- Botão principal -->
      <button
        @click="$router.push('/agendar')"
        class="w-full max-w-xs font-semibold py-4 rounded-2xl text-sm tracking-wide transition-all active:scale-95 relative overflow-hidden mb-10"
        style="background:linear-gradient(135deg,#e8557a 0%,#c93d65 60%,#a82e52 100%);color:#fff;letter-spacing:0.08em;box-shadow:0 8px 32px rgba(232,85,122,0.3),0 2px 8px rgba(0,0,0,0.4)"
      >
        <span class="relative z-10">Agendar Agora</span>
        <!-- shimmer -->
        <div class="absolute inset-0 opacity-20" style="background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.5) 50%,transparent 60%);animation:shimmer 3s infinite"/>
      </button>

      <!-- Serviços -->
      <div class="flex items-center gap-3 w-full max-w-xs mb-5">
        <div class="h-px flex-1" style="background:rgba(255,255,255,0.06)"/>
        <p class="text-xs tracking-widest uppercase font-medium" style="color:#e8557a;opacity:0.7;letter-spacing:0.2em">
          Serviços
        </p>
        <div class="h-px flex-1" style="background:rgba(255,255,255,0.06)"/>
      </div>

      <div v-if="loading" class="text-sm py-6" style="color:#4a3a4a">Carregando...</div>

      <div v-else class="w-full max-w-xs space-y-3">
        <div
          v-for="s in services"
          :key="s._id"
          class="rounded-2xl overflow-hidden flex items-center transition-all"
          style="background:linear-gradient(135deg,#141220 0%,#171525 100%);border:1px solid rgba(232,85,122,0.1)"
        >
          <div class="w-20 h-20 shrink-0 overflow-hidden" style="background:#1a1528">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-2xl" style="opacity:0.25">💆</span>
            </div>
          </div>
          <div class="flex-1 px-4 py-3">
            <p class="font-semibold text-sm" style="color:#f0ecf5">{{ s.name }}</p>
            <p class="text-xs mt-0.5" style="color:#5a4a5a">{{ s.duration }} min</p>
          </div>
          <div class="pr-4 shrink-0">
            <p class="text-sm font-bold" style="color:#c9a870">R$ {{ s.price }}</p>
          </div>
        </div>
      </div>

      <!-- Info salão -->
      <div
        v-if="settings"
        class="w-full max-w-xs mt-6 rounded-2xl p-4"
        style="background:linear-gradient(135deg,#141220 0%,#171525 100%);border:1px solid rgba(201,168,112,0.12)"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="h-px flex-1" style="background:rgba(201,168,112,0.15)"/>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="#c9a870" style="opacity:0.5">
            <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"/>
          </svg>
          <div class="h-px flex-1" style="background:rgba(201,168,112,0.15)"/>
        </div>
        <div class="space-y-2">
          <p v-if="settings.address" class="text-xs flex items-start gap-2" style="color:#7a6a7a">
            <span style="color:#c9a870;opacity:0.7">📍</span>
            {{ settings.address }}
          </p>
          <p v-if="settings.phone" class="text-xs flex items-center gap-2" style="color:#7a6a7a">
            <span style="color:#c9a870;opacity:0.7">📞</span>
            (38) 99924-3577
          </p>
          <a v-if="settings.instagram"
             :href="settings.instagram"
             target="_blank" rel="noopener"
             class="flex items-center gap-2 text-xs transition-all"
             style="color:#e8557a;opacity:0.8"
             onmouseover="this.style.opacity='1'"
             onmouseout="this.style.opacity='0.8'">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @deboraahcr
          </a>
        </div>
      </div>
    </main>

    <footer class="relative z-10 text-center py-4 px-5" style="border-top:1px solid rgba(255,255,255,0.04)">
      <p class="text-xs" style="color:#2a1f2a;letter-spacing:0.12em">© Déborah Cristhiany · Designer de Sobrancelhas</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

const services = ref([])
const settings = ref(null)
const loading  = ref(true)

onMounted(async () => {
  try {
    const [svcRes, setRes] = await Promise.all([api.get('/services'), api.get('/settings')])
    services.value = svcRes.data
    settings.value = setRes.data
  } catch { /* silencioso */ }
  finally { loading.value = false }
})
</script>

<style scoped>
@keyframes shimmer {
  0%   { transform: translateX(-100%) }
  100% { transform: translateX(200%) }
}
</style>
