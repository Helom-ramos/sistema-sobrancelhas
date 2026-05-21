<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden" style="background:#0d0b12">

    <!-- Glows -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
         style="width:300px;height:200px;background:radial-gradient(ellipse,rgba(232,85,122,0.08) 0%,transparent 70%);z-index:0"/>
    <div class="absolute bottom-0 left-0 pointer-events-none"
         style="width:160px;height:160px;background:radial-gradient(ellipse,rgba(201,168,112,0.06) 0%,transparent 70%);z-index:0"/>

    <!-- Botanical -->
    <svg class="absolute top-0 right-0 pointer-events-none select-none" width="90" height="180" viewBox="0 0 90 180" fill="none" style="opacity:0.12;z-index:0">
      <path d="M78 4 C70 44 55 84 40 124 C30 150 18 168 6 180" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M72 30 C84 16 90 34 74 44 C63 38 72 30 72 30Z" fill="#e8557a"/>
      <path d="M60 62 C72 48 80 64 64 74 C53 68 60 62 60 62Z" fill="#c9a870"/>
      <path d="M50 94 C40 76 24 82 30 100 C36 114 50 104 50 94Z" fill="#e8557a"/>
    </svg>

    <div class="relative z-10 w-full max-w-xs">

      <!-- Carregando -->
      <div v-if="loading" class="text-center py-12 text-sm" style="color:#4a3a4a">Carregando...</div>

      <!-- Erro -->
      <div v-else-if="error" class="text-center">
        <div class="relative mb-6 inline-flex">
          <div class="absolute inset-0 rounded-full blur-xl" style="background:rgba(232,85,122,0.15);transform:scale(1.4)"/>
          <div class="relative w-16 h-16 rounded-full flex items-center justify-center"
               style="background:linear-gradient(135deg,#1e0e18,#2a0e1a);border:1px solid rgba(232,85,122,0.3)">
            <span class="text-xl">⚠️</span>
          </div>
        </div>
        <h2 class="text-lg font-bold mb-2" style="color:#f0ecf5">Ops!</h2>
        <p class="text-sm mb-8" style="color:#6a5a7a;line-height:1.7">{{ error }}</p>
        <button @click="$router.push('/')"
                class="w-full font-semibold py-4 rounded-2xl text-sm tracking-wide transition-all active:scale-95"
                style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;box-shadow:0 8px 32px rgba(232,85,122,0.25)">
          Voltar ao início
        </button>
      </div>

      <!-- Cancelado com sucesso -->
      <div v-else-if="cancelled" class="text-center">
        <div class="relative mb-6 inline-flex">
          <div class="absolute inset-0 rounded-full blur-xl" style="background:rgba(201,168,112,0.12);transform:scale(1.4)"/>
          <div class="relative w-20 h-20 rounded-full flex items-center justify-center"
               style="background:linear-gradient(135deg,#14120e,#1a1810);border:1.5px solid rgba(201,168,112,0.25)">
            <svg class="w-9 h-9" style="color:#c9a870" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold mb-2" style="color:#f0ecf5">Agendamento Cancelado</h2>
        <p class="text-sm mb-8" style="color:#6a5a7a;line-height:1.8">
          Sentimos muito! Será um prazer<br/>receber você outra hora. 🌸
        </p>
        <button @click="$router.push('/agendar')"
                class="w-full font-semibold py-4 rounded-2xl mb-3 text-sm tracking-wide transition-all active:scale-95"
                style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;box-shadow:0 8px 32px rgba(232,85,122,0.25)">
          Reagendar
        </button>
        <button @click="$router.push('/')"
                class="w-full font-semibold py-4 rounded-2xl text-sm transition-all"
                style="background:rgba(255,255,255,0.03);color:#4a3a5a;border:1px solid rgba(255,255,255,0.06)">
          Voltar ao início
        </button>
      </div>

      <!-- Confirmação de cancelamento -->
      <div v-else-if="appt">
        <div class="text-center mb-8">
          <p class="text-xs tracking-widest uppercase mb-1" style="color:#c9a870;opacity:0.6;letter-spacing:0.2em">Cancelamento</p>
          <h2 class="text-xl font-bold mb-1" style="color:#f0ecf5">Cancelar Agendamento</h2>
          <p class="text-sm" style="color:#5a4a6a">Tem certeza? Esta ação não pode ser desfeita.</p>
        </div>

        <!-- Card do agendamento -->
        <div class="rounded-2xl p-5 mb-6 relative overflow-hidden"
             style="background:linear-gradient(135deg,#141220,#171525);border:1px solid rgba(255,255,255,0.07)">
          <div class="absolute top-0 right-0 w-20 h-20 pointer-events-none"
               style="background:radial-gradient(circle,rgba(201,168,112,0.05),transparent 70%)"/>
          <p class="text-xs uppercase tracking-widest mb-3" style="color:#4a3a5a;letter-spacing:0.15em">Seu agendamento</p>
          <p class="text-base font-semibold mb-3" style="color:#f0ecf5">{{ appt.service.name }}</p>
          <div class="space-y-1.5">
            <p class="text-sm" style="color:#6a5a7a">📅 {{ fmtDate(appt.datetime) }}</p>
            <p class="text-sm" style="color:#6a5a7a">⏰ {{ fmtTime(appt.datetime) }}</p>
            <p class="text-sm" style="color:#6a5a7a">👤 {{ appt.client.name }}</p>
          </div>
          <div class="mt-4 pt-3" style="border-top:1px solid rgba(255,255,255,0.05)">
            <span class="text-xs px-3 py-1 rounded-full font-medium"
                  style="background:rgba(74,222,128,0.08);color:#4ade80;border:1px solid rgba(74,222,128,0.15)">
              Agendado
            </span>
          </div>
        </div>

        <button @click="confirmCancel" :disabled="cancelling"
                class="w-full font-semibold py-4 rounded-2xl mb-3 text-sm tracking-wide transition-all active:scale-95"
                style="background:rgba(127,29,29,0.6);color:#fca5a5;border:1px solid rgba(239,68,68,0.2)">
          {{ cancelling ? 'Cancelando...' : 'Confirmar Cancelamento' }}
        </button>

        <button @click="$router.push('/')"
                class="w-full font-semibold py-4 rounded-2xl text-sm transition-all"
                style="background:rgba(255,255,255,0.03);color:#4a3a5a;border:1px solid rgba(255,255,255,0.06)">
          Manter agendamento
        </button>
      </div>

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
    if (data.status === 'cancelled')      error.value = 'Este agendamento já foi cancelado.'
    else if (data.status === 'completed') error.value = 'Este agendamento já foi realizado.'
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
