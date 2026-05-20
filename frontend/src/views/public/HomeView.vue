<template>
  <div class="min-h-screen bg-brand-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-brand-800">Studio de Sobrancelhas</h1>
        <p class="text-xs text-gray-500">Beleza que realça o seu olhar</p>
      </div>
      <button
        @click="$router.push('/login')"
        class="text-xs text-gray-400 hover:text-brand-600 transition-colors"
      >
        Admin
      </button>
    </header>

    <!-- Hero -->
    <main class="flex-1 flex flex-col items-center px-4 pt-10 pb-8">
      <div class="w-24 h-24 rounded-full bg-brand-200 flex items-center justify-center mb-6 shadow-md">
        <span class="text-5xl">✨</span>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 text-center leading-tight mb-2">
        Sobrancelhas perfeitas<br />para você
      </h2>
      <p class="text-gray-500 text-center text-sm mb-8 max-w-xs">
        Agende seu horário em poucos cliques, sem precisar criar conta.
      </p>

      <button
        @click="$router.push('/agendar')"
        class="w-full max-w-xs bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transition-colors"
      >
        Agendar Agora
      </button>

      <!-- Serviços -->
      <section class="w-full max-w-xs mt-12">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Nossos Serviços</h3>
        <div v-if="loading" class="text-center text-gray-400 py-8">Carregando...</div>
        <div v-else class="space-y-3">
          <div
            v-for="s in services"
            :key="s._id"
            class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
          >
            <div class="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover" />
              <span v-else class="text-2xl">💆</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm truncate">{{ s.name }}</p>
              <p class="text-xs text-gray-500">{{ s.duration }} min</p>
            </div>
            <p class="text-brand-600 font-bold text-sm shrink-0">R$ {{ s.price }}</p>
          </div>
        </div>
      </section>

      <!-- Info -->
      <section class="w-full max-w-xs mt-8">
        <div v-if="settings" class="bg-white rounded-xl p-4 shadow-sm space-y-2">
          <p class="text-sm font-semibold text-gray-700">{{ settings.salonName }}</p>
          <p v-if="settings.address" class="text-xs text-gray-500">📍 {{ settings.address }}</p>
          <p v-if="settings.phone" class="text-xs text-gray-500">📞 {{ settings.phone }}</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="text-center text-xs text-gray-400 py-4">
      Agendamento online · Studio de Sobrancelhas
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
  } catch {
    // silencioso — mostrar página mesmo sem dados
  } finally {
    loading.value = false
  }
})
</script>
