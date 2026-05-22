<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
       style="background:linear-gradient(180deg,#120b10 0%,#0c070a 50%,#120b10 100%)">

    <!-- Glows -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
         style="width:320px;height:220px;background:radial-gradient(ellipse,rgba(232,85,122,0.18) 0%,transparent 70%);z-index:0"/>
    <div class="fixed bottom-0 left-0 pointer-events-none"
         style="width:240px;height:240px;background:radial-gradient(ellipse,rgba(232,85,122,0.1) 0%,transparent 70%);z-index:0"/>

    <!-- Botanical -->
    <svg class="absolute pointer-events-none select-none" style="top:60px;right:-5px;width:90px;height:180px;opacity:0.22;z-index:0" viewBox="0 0 90 180" fill="none">
      <path d="M78 4 C70 44 55 84 40 124 C30 150 18 168 6 180" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M72 30 C84 16 90 34 74 44 C63 38 72 30 72 30Z" fill="#e8557a"/>
      <path d="M60 62 C72 48 80 64 64 74 C53 68 60 62 60 62Z" fill="#e8557a" opacity="0.7"/>
      <path d="M50 94 C40 76 24 82 30 100 C36 114 50 104 50 94Z" fill="#e8557a"/>
    </svg>
    <svg class="absolute pointer-events-none select-none" style="bottom:60px;left:-5px;width:80px;height:160px;opacity:0.2;z-index:0" viewBox="0 0 80 160" fill="none">
      <path d="M14 160 C22 125 36 90 44 60 C52 35 56 18 60 4" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M24 132 C8 142 4 124 18 118 C26 122 24 132 24 132Z" fill="#e8557a"/>
      <path d="M34 100 C18 106 12 90 26 86 C34 90 34 100 34 100Z" fill="#e8557a" opacity="0.7"/>
      <path d="M44 70 C28 60 32 42 44 52 C52 60 44 70 44 70Z" fill="#e8557a"/>
    </svg>

    <!-- Sparkles -->
    <div class="absolute twinkle-1 pointer-events-none" style="top:120px;left:30px;z-index:1">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="#e8557a" opacity="0.6"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"/></svg>
    </div>
    <div class="absolute twinkle-2 pointer-events-none" style="top:30%;right:40px;z-index:1">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="#d4af74" opacity="0.5"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"/></svg>
    </div>

    <div class="relative z-10 w-full max-w-xs">

      <!-- Carregando -->
      <div v-if="loading" class="text-center py-12 text-sm" style="color:#9a8aa4">Carregando...</div>

      <!-- Erro -->
      <div v-else-if="error" class="text-center">
        <div class="relative mb-6 inline-flex">
          <div class="absolute inset-0 rounded-full blur-xl" style="background:rgba(232,85,122,0.2);transform:scale(1.5)"/>
          <div class="relative w-20 h-20 rounded-full flex items-center justify-center"
               style="background:linear-gradient(135deg,#2a0f1a,#36101e);border:1.5px solid rgba(232,85,122,0.4)">
            <span class="text-2xl">⚠️</span>
          </div>
        </div>
        <h2 class="text-xl font-bold mb-2" style="color:#f5ecf0">Ops!</h2>
        <p class="text-sm mb-8" style="color:#d4c4d4;line-height:1.7">{{ error }}</p>
        <button @click="$router.push('/')"
                class="w-full font-semibold py-4 rounded-2xl text-sm tracking-wide transition-all active:scale-95"
                style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;box-shadow:0 8px 32px rgba(232,85,122,0.3)">
          Voltar ao início
        </button>
      </div>

      <!-- Cancelado com sucesso -->
      <div v-else-if="cancelled" class="text-center">
        <div class="relative mb-6 inline-flex">
          <div class="absolute inset-0 rounded-full blur-xl" style="background:rgba(232,85,122,0.2);transform:scale(1.5)"/>
          <div class="relative w-24 h-24 rounded-full flex items-center justify-center"
               style="background:linear-gradient(135deg,#2a0f1a,#36101e);border:1.5px solid rgba(232,85,122,0.4)">
            <svg class="w-10 h-10" style="color:#e8557a" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold mb-2" style="color:#f5ecf0">Agendamento Cancelado</h2>
        <p class="text-sm mb-8" style="color:#d4c4d4;line-height:1.8">
          Sentimos muito! Será um prazer<br/>receber você outra hora. 🌸
        </p>
        <button @click="$router.push('/agendar')"
                class="w-full font-semibold py-4 rounded-2xl mb-3 text-sm tracking-wide transition-all active:scale-95"
                style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;box-shadow:0 8px 32px rgba(232,85,122,0.3)">
          Reagendar
        </button>
        <button @click="$router.push('/')"
                class="w-full font-semibold py-4 rounded-2xl text-sm transition-all"
                style="background:rgba(232,85,122,0.05);color:#b89eb0;border:1px solid rgba(232,85,122,0.18)">
          Voltar ao início
        </button>
      </div>

      <!-- Confirmação -->
      <div v-else-if="appt">
        <div class="text-center mb-8">
          <p class="text-xs tracking-widest uppercase mb-2 font-semibold" style="color:#e8557a;letter-spacing:0.22em">Cancelamento</p>
          <h2 class="text-xl font-bold mb-2" style="color:#f5ecf0">Cancelar Agendamento</h2>
          <p class="text-sm" style="color:#b89eb0;line-height:1.6">Tem certeza? Esta ação não pode ser desfeita.</p>
        </div>

        <!-- Card do agendamento -->
        <div class="rounded-2xl p-5 mb-6 relative overflow-hidden"
             style="background:linear-gradient(135deg,#1a0f14,#1f1018);border:1px solid rgba(232,85,122,0.22)">
          <div class="absolute top-0 right-0 w-24 h-24 pointer-events-none"
               style="background:radial-gradient(circle,rgba(232,85,122,0.08),transparent 70%)"/>
          <p class="text-xs uppercase tracking-widest mb-3 font-semibold" style="color:#e8557a;letter-spacing:0.18em">Seu agendamento</p>
          <p class="text-base font-semibold mb-3" style="color:#f5ecf0">{{ appt.service.name }}</p>
          <div class="space-y-1.5">
            <p class="text-sm flex items-center gap-2" style="color:#d4c4d4"><span style="color:#e8557a">📅</span> {{ fmtDate(appt.datetime) }}</p>
            <p class="text-sm flex items-center gap-2" style="color:#d4c4d4"><span style="color:#e8557a">⏰</span> {{ fmtTime(appt.datetime) }}</p>
            <p class="text-sm flex items-center gap-2" style="color:#d4c4d4"><span style="color:#e8557a">👤</span> {{ appt.client.name }}</p>
          </div>
          <div class="mt-4 pt-3" style="border-top:1px solid rgba(232,85,122,0.15)">
            <span class="text-xs px-3 py-1 rounded-full font-medium"
                  style="background:rgba(74,222,128,0.12);color:#4ade80;border:1px solid rgba(74,222,128,0.3)">
              Agendado
            </span>
          </div>
        </div>

        <button @click="confirmCancel" :disabled="cancelling"
                class="w-full font-semibold py-4 rounded-2xl mb-3 text-sm tracking-wide transition-all active:scale-95"
                style="background:rgba(127,29,29,0.5);color:#fca5a5;border:1px solid rgba(239,68,68,0.3)">
          {{ cancelling ? 'Cancelando...' : 'Confirmar Cancelamento' }}
        </button>

        <button @click="$router.push('/')"
                class="w-full font-semibold py-4 rounded-2xl text-sm transition-all"
                style="background:rgba(232,85,122,0.05);color:#b89eb0;border:1px solid rgba(232,85,122,0.18)">
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

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.9) }
  50%      { opacity: 1;   transform: scale(1.2) }
}
.twinkle-1 { animation: twinkle 3s ease-in-out infinite }
.twinkle-2 { animation: twinkle 4s ease-in-out infinite 0.5s }
</style>
