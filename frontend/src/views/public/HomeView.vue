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
        v-if="settings && (settings.address || settings.phone)"
        class="w-full max-w-xs mt-5 rounded-2xl p-4 space-y-1.5"
        style="background:#161616; border:1px solid #222"
      >
        <p v-if="settings.address" class="text-xs text-zinc-500">📍 {{ settings.address }}</p>
        <p v-if="settings.phone" class="text-xs text-zinc-500">📞 {{ settings.phone }}</p>
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
