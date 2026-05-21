<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12" style="background:#0d0d0d">

    <div v-if="loading" class="text-zinc-500 text-sm">Carregando...</div>

    <!-- Erro -->
    <div v-else-if="error" class="w-full max-w-xs text-center">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
           style="background:#1a0a10;border:2px solid #e8557a">
        <span class="text-2xl">⚠️</span>
      </div>
      <h2 class="text-lg font-bold text-white mb-2">Ops!</h2>
      <p class="text-zinc-400 text-sm mb-6">{{ error }}</p>
      <button @click="$router.push('/')" class="w-full font-semibold py-4 rounded-2xl" style="background:#e8557a;color:#fff">
        Voltar ao início
      </button>
    </div>

    <!-- Cancelado com sucesso -->
    <div v-else-if="cancelled" class="w-full max-w-xs text-center">
      <div class="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto"
           style="background:#1a1a1a;border:2px solid #3f3f3f">
        <svg class="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">Agendamento Cancelado</h2>
      <p class="text-zinc-400 text-sm mb-8">Sentimos muito! Será um prazer receber você outra hora. 🌸</p>
      <button @click="$router.push('/agendar')" class="w-full font-semibold py-4 rounded-2xl mb-3 transition-all active:scale-95" style="background:#e8557a;color:#fff">
        Reagendar
      </button>
      <button @click="$router.push('/')" class="w-full font-semibold py-4 rounded-2xl" style="background:#1a1a1a;color:#aaa;border:1px solid #2a2a2a">
        Voltar ao início
      </button>
    </div>

    <!-- Confirmação de cancelamento -->
    <div v-else-if="appt" class="w-full max-w-xs">
      <div class="text-center mb-8">
        <h2 class="text-xl font-bold text-white mb-1">Cancelar Agendamento</h2>
        <p class="text-zinc-500 text-sm">Tem certeza? Esta ação não pode ser desfeita.</p>
      </div>

      <div class="rounded-2xl p-5 mb-6" style="background:#161616;border:1px solid #2a2a2a">
        <p class="text-xs text-zinc-500 uppercase tracking-widest mb-3">Seu agendamento</p>
        <p class="text-base font-semibold text-white mb-2">{{ appt.service.name }}</p>
        <p class="text-sm text-zinc-400 mb-1">📅 {{ fmtDate(appt.datetime) }}</p>
        <p class="text-sm text-zinc-400 mb-1">⏰ {{ fmtTime(appt.datetime) }}</p>
        <p class="text-sm text-zinc-400">👤 {{ appt.client.name }}</p>
        <div class="mt-3 pt-3" style="border-top:1px solid #2a2a2a">
          <span class="text-xs px-2 py-1 rounded-full" style="background:#14532d22;color:#4ade80;border:1px solid #4ade8033">
            Agendado
          </span>
        </div>
      </div>

      <button
        @click="confirmCancel"
        :disabled="cancelling"
        class="w-full font-semibold py-4 rounded-2xl mb-3 transition-all active:scale-95"
        style="background:#7f1d1d;color:#fca5a5;border:1px solid #ef444433"
      >
        {{ cancelling ? 'Cancelando...' : 'Confirmar Cancelamento' }}
      </button>

      <button @click="$router.push('/')" class="w-full font-semibold py-4 rounded-2xl" style="background:#1a1a1a;color:#aaa;border:1px solid #2a2a2a">
        Manter agendamento
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api.js'

const route      = useRoute()
const router     = useRouter()
const appt       = ref(null)
const loading    = ref(true)
const error      = ref('')
const cancelling = ref(false)
const cancelled  = ref(false)

onMounted(async () => {
  try {
    const res  = await api.get(`/appointments/${route.params.id}/public`)
    const data = res.data
    if (data.status === 'cancelled')       error.value = 'Este agendamento já foi cancelado.'
    else if (data.status === 'completed')  error.value = 'Este agendamento já foi realizado.'
    else if (new Date(data.datetime) < new Date()) error.value = 'Não é possível cancelar um agendamento passado.'
    else appt.value = data
  } catch {
    error.value = 'Agendamento não encontrado.'
  } finally {
    loading.value = false
  }
})

async function confirmCancel() {
  cancelling.value = true
  try {
    await api.post(`/appointments/${route.params.id}/cancel`)
    cancelled.value = true
    appt.value = null
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao cancelar. Tente novamente.'
  } finally {
    cancelling.value = false
  }
}

function fmtDate(dt) {
  return new Date(dt).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit'
  })
}

function fmtTime(dt) {
  return new Date(dt).toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit'
  })
}
</script>
