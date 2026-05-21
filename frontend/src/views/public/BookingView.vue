<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden" style="background:#0d0b12">

    <!-- Glow decorativo -->
    <div class="absolute top-0 right-0 pointer-events-none"
         style="width:200px;height:200px;background:radial-gradient(ellipse,rgba(232,85,122,0.1) 0%,transparent 70%);z-index:0"/>
    <div class="absolute bottom-0 left-0 pointer-events-none"
         style="width:180px;height:180px;background:radial-gradient(ellipse,rgba(201,168,112,0.07) 0%,transparent 70%);z-index:0"/>

    <!-- Botanical sutil -->
    <svg class="absolute top-0 right-0 pointer-events-none select-none" width="80" height="160" viewBox="0 0 80 160" fill="none" style="opacity:0.1;z-index:0">
      <path d="M70 5 C62 40 50 75 38 110 C30 135 20 150 10 160" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M65 28 C78 14 84 30 68 40 C58 34 65 28 65 28Z" fill="#e8557a"/>
      <path d="M56 58 C68 44 76 60 60 70 C50 64 56 58 56 58Z" fill="#c9a870"/>
      <path d="M47 88 C38 70 24 76 30 94 C35 106 47 96 47 88Z" fill="#e8557a"/>
    </svg>

    <!-- Header -->
    <header class="relative z-10 px-5 py-4 flex items-center gap-3 sticky top-0"
            style="background:rgba(13,11,18,0.92);border-bottom:1px solid rgba(255,255,255,0.05);backdrop-filter:blur(12px)">
      <button @click="handleBack"
              class="p-2 rounded-xl transition-all"
              style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.06)">
        <svg class="w-4 h-4" style="color:#c9a870" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-sm font-semibold tracking-wide" style="color:#f0ecf5;letter-spacing:0.05em">Agendar Horário</h1>
        <div class="flex gap-1.5 mt-1.5">
          <div v-for="n in 3" :key="n"
            class="h-0.5 rounded-full transition-all duration-500"
            :style="n <= step
              ? 'width:2rem;background:linear-gradient(to right,#e8557a,#c9a870)'
              : 'width:1rem;background:rgba(255,255,255,0.1)'"
          />
        </div>
      </div>
      <span class="text-xs" style="color:#4a3a4a;font-variant-numeric:tabular-nums">{{ step }}/3</span>
    </header>

    <!-- Step 1 — Serviço -->
    <div v-if="step === 1" class="relative z-10 flex-1 px-4 py-6 pb-28">
      <div class="mb-6">
        <p class="text-xs tracking-widest uppercase mb-1" style="color:#c9a870;opacity:0.7;letter-spacing:0.2em">Passo 1</p>
        <h2 class="text-lg font-semibold" style="color:#f0ecf5">Escolha o serviço</h2>
      </div>

      <div v-if="loadingServices" class="text-center py-12 text-sm" style="color:#4a3a4a">Carregando...</div>
      <div v-else class="space-y-3">
        <button
          v-for="s in services" :key="s._id"
          @click="selectService(s)"
          class="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all duration-200"
          :style="selectedService?._id === s._id
            ? 'background:linear-gradient(135deg,#1e0e18,#22101c);border:1.5px solid rgba(232,85,122,0.5);box-shadow:0 0 24px rgba(232,85,122,0.1)'
            : 'background:linear-gradient(135deg,#141220,#171525);border:1.5px solid rgba(255,255,255,0.06)'"
        >
          <div class="w-16 h-16 rounded-xl shrink-0 overflow-hidden" style="background:#1a1528">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-2xl opacity-20">💆</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm" style="color:#f0ecf5">{{ s.name }}</p>
            <p class="text-xs mt-1 leading-relaxed" style="color:#5a4a6a">{{ s.description }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs" style="color:#4a3a5a">⏱ {{ s.duration }} min</span>
              <span class="text-sm font-semibold" style="color:#c9a870">R$ {{ s.price }}</span>
            </div>
          </div>
          <div v-if="selectedService?._id === s._id" class="shrink-0">
            <div class="w-6 h-6 rounded-full flex items-center justify-center" style="background:rgba(232,85,122,0.2)">
              <svg class="w-3.5 h-3.5" style="color:#e8557a" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </button>
      </div>

      <button v-if="selectedService"
        @click="step = 2; loadSlots()"
        class="fixed bottom-6 left-4 right-4 font-semibold py-4 rounded-2xl transition-all active:scale-95 text-sm tracking-wide"
        style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.3)">
        Continuar
      </button>
    </div>

    <!-- Step 2 — Data e Horário -->
    <div v-if="step === 2" class="relative z-10 flex-1 px-4 py-6 pb-28">
      <div class="mb-6">
        <p class="text-xs tracking-widest uppercase mb-1" style="color:#c9a870;opacity:0.7;letter-spacing:0.2em">Passo 2</p>
        <h2 class="text-lg font-semibold" style="color:#f0ecf5">Escolha a data</h2>
      </div>

      <div class="rounded-2xl p-4 mb-6"
           style="background:linear-gradient(135deg,#141220,#171525);border:1px solid rgba(255,255,255,0.07)">
        <label class="block text-xs font-medium mb-2" style="color:#5a4a6a;letter-spacing:0.08em">Selecione o dia</label>
        <input type="date" v-model="selectedDate"
               :min="minDate" :max="maxDate"
               @change="loadSlots"
               class="w-full text-base focus:outline-none rounded-xl px-3 py-2.5 border transition-colors"
               style="background:#1e1a2e;color:#f0ecf5;border-color:rgba(255,255,255,0.08);color-scheme:dark"/>
      </div>

      <div v-if="selectedDate">
        <h2 class="text-base font-semibold mb-3" style="color:#f0ecf5">Horários disponíveis</h2>
        <div v-if="loadingSlots" class="text-center py-8 text-sm" style="color:#4a3a4a">Verificando horários...</div>
        <div v-else-if="slots.length === 0"
             class="rounded-2xl p-6 text-center text-sm"
             style="background:linear-gradient(135deg,#141220,#171525);border:1px solid rgba(255,255,255,0.06);color:#5a4a6a">
          Nenhum horário disponível nessa data.<br/>Tente outro dia.
        </div>
        <div v-else class="grid grid-cols-3 gap-2">
          <button v-for="slot in slots" :key="slot"
            @click="selectedTime = slot"
            class="py-3 rounded-xl text-sm font-medium transition-all duration-200"
            :style="selectedTime === slot
              ? 'background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;border:1.5px solid transparent;box-shadow:0 4px 16px rgba(232,85,122,0.25)'
              : 'background:linear-gradient(135deg,#141220,#171525);color:#c9a870;border:1.5px solid rgba(201,168,112,0.15)'"
          >{{ slot }}</button>
        </div>
      </div>

      <button v-if="selectedTime"
        @click="step = 3"
        class="fixed bottom-6 left-4 right-4 font-semibold py-4 rounded-2xl transition-all active:scale-95 text-sm tracking-wide"
        style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.3)">
        Continuar — {{ selectedTime }}
      </button>
    </div>

    <!-- Step 3 — Dados -->
    <div v-if="step === 3" class="relative z-10 flex-1 px-4 py-6">
      <div class="mb-6">
        <p class="text-xs tracking-widest uppercase mb-1" style="color:#c9a870;opacity:0.7;letter-spacing:0.2em">Passo 3</p>
        <h2 class="text-lg font-semibold" style="color:#f0ecf5">Confirme seus dados</h2>
      </div>

      <!-- Resumo -->
      <div class="rounded-2xl p-4 mb-6 relative overflow-hidden"
           style="background:linear-gradient(135deg,#1e0e18,#22101c);border:1px solid rgba(232,85,122,0.2)">
        <div class="absolute top-0 right-0 w-20 h-20 pointer-events-none"
             style="background:radial-gradient(circle,rgba(232,85,122,0.08),transparent 70%)"/>
        <p class="text-sm font-semibold" style="color:#e8557a">{{ selectedService?.name }}</p>
        <p class="text-xs mt-1.5" style="color:#7a5a6a">{{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <div class="flex items-center gap-3 mt-2">
          <span class="text-xs" style="color:#5a3a4a">{{ selectedService?.duration }} min</span>
          <span class="text-xs font-semibold" style="color:#c9a870">R$ {{ selectedService?.price }}</span>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color:#7a6a8a;letter-spacing:0.08em">Seu nome</label>
          <input v-model="clientName" type="text" placeholder="Ex: Maria Silva"
                 class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors"
                 style="background:#141220;color:#f0ecf5;border-color:rgba(255,255,255,0.07);placeholder-color:#3a2a3a"
                 @focus="$event.target.style.borderColor='rgba(232,85,122,0.4)'"
                 @blur="$event.target.style.borderColor='rgba(255,255,255,0.07)'"/>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color:#7a6a8a;letter-spacing:0.08em">WhatsApp</label>
          <input v-model="clientPhone" type="tel" placeholder="(38) 99999-9999"
                 @input="formatPhone"
                 class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors"
                 style="background:#141220;color:#f0ecf5;border-color:rgba(255,255,255,0.07)"
                 @focus="$event.target.style.borderColor='rgba(232,85,122,0.4)'"
                 @blur="$event.target.style.borderColor='rgba(255,255,255,0.07)'"/>
          <p class="text-xs mt-1.5" style="color:#3a2a3a">A confirmação chegará no seu WhatsApp</p>
        </div>
      </div>

      <button @click="submitBooking"
        :disabled="!canSubmit || submitting"
        class="mt-8 w-full font-semibold py-4 rounded-2xl transition-all active:scale-95 text-sm tracking-wide"
        :style="canSubmit && !submitting
          ? 'background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.25)'
          : 'background:rgba(255,255,255,0.04);color:#3a2a3a;border:1px solid rgba(255,255,255,0.05)'">
        {{ submitting ? 'Agendando...' : 'Confirmar Agendamento' }}
      </button>
    </div>

    <!-- Step 4 — Sucesso -->
    <div v-if="step === 4" class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">

      <!-- Ícone check com glow -->
      <div class="relative mb-6">
        <div class="absolute inset-0 rounded-full blur-xl" style="background:rgba(232,85,122,0.25);transform:scale(1.5)"/>
        <div class="relative w-20 h-20 rounded-full flex items-center justify-center"
             style="background:linear-gradient(135deg,#1e0e18,#2a0e1a);border:1.5px solid rgba(232,85,122,0.4)">
          <svg class="w-10 h-10" style="color:#e8557a" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-center mb-1" style="color:#f0ecf5">Tudo certo! 🌸</h2>
      <p class="text-center text-sm mb-6" style="color:#6a5a7a;line-height:1.7">
        {{ clientName }}, seu horário está reservado.<br/>Mal podemos esperar para te receber!
      </p>

      <!-- Card resumo -->
      <div class="w-full max-w-xs rounded-2xl p-5 mb-4 relative overflow-hidden"
           style="background:linear-gradient(135deg,#1e0e18,#22101c);border:1px solid rgba(232,85,122,0.2)">
        <div class="absolute top-0 right-0 w-24 h-24 pointer-events-none"
             style="background:radial-gradient(circle,rgba(232,85,122,0.07),transparent 70%)"/>
        <p class="text-sm font-semibold" style="color:#e8557a">{{ selectedService?.name }}</p>
        <p class="text-xs mt-2" style="color:#7a5a6a">📅 {{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <p class="text-xs mt-1" style="color:#c9a870">💰 R$ {{ selectedService?.price }}</p>
      </div>

      <p class="text-xs text-center mb-8" style="color:#3a2a4a;line-height:1.8">
        A confirmação chegará no seu WhatsApp em instantes.<br/>
        Enviaremos um lembrete 30 minutos antes.
      </p>

      <button @click="$router.push('/')"
              class="w-full max-w-xs font-semibold py-4 rounded-2xl mb-3 text-sm tracking-wide transition-all active:scale-95"
              style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.25)">
        Voltar ao início
      </button>

      <button v-if="appointmentId"
              @click="$router.push(`/cancelar/${appointmentId}`)"
              class="w-full max-w-xs text-xs py-3 rounded-2xl transition-all"
              style="background:transparent;color:#3a2a4a;border:1px solid rgba(255,255,255,0.05)">
        Precisar cancelar? Clique aqui
      </button>
    </div>

    <!-- Toast erro -->
    <div v-if="errorMsg"
         class="fixed bottom-24 left-4 right-4 px-4 py-3 rounded-xl text-sm text-center shadow-lg z-50"
         style="background:#1a0808;border:1px solid rgba(239,68,68,0.3);color:#fca5a5">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'

const router = useRouter()
const step = ref(1)
const services = ref([])
const loadingServices = ref(true)
const selectedService = ref(null)
const selectedDate = ref('')
const slots = ref([])
const loadingSlots = ref(false)
const selectedTime = ref('')
const clientName = ref('')
const clientPhone = ref('')
const submitting = ref(false)
const errorMsg = ref('')
const appointmentId = ref('')

const minDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]
})
const maxDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
})
const canSubmit = computed(() =>
  clientName.value.trim().length >= 2 && clientPhone.value.replace(/\D/g, '').length >= 10
)

onMounted(async () => {
  try {
    const res = await api.get('/services')
    services.value = res.data
  } catch { showError('Erro ao carregar serviços.') }
  finally { loadingServices.value = false }
})

function selectService(s) {
  selectedService.value = s
  selectedDate.value = minDate.value
  slots.value = []
  selectedTime.value = ''
}

async function loadSlots() {
  if (!selectedDate.value || !selectedService.value) return
  loadingSlots.value = true
  selectedTime.value = ''
  try {
    const res = await api.get('/slots', { params: { date: selectedDate.value, serviceId: selectedService.value._id } })
    slots.value = res.data
  } catch { showError('Erro ao carregar horários.'); slots.value = [] }
  finally { loadingSlots.value = false }
}

function formatPhone(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11)
  if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
  else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`
  else if (v.length > 0) v = `(${v}`
  clientPhone.value = v
}

async function submitBooking() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    const res = await api.post('/appointments', {
      name: clientName.value.trim(),
      phone: clientPhone.value.replace(/\D/g, ''),
      serviceId: selectedService.value._id,
      date: selectedDate.value,
      time: selectedTime.value
    })
    appointmentId.value = res.data.id
    step.value = 4
  } catch (err) {
    showError(err.response?.data?.error || 'Erro ao agendar. Tente novamente.')
  } finally { submitting.value = false }
}

function handleBack() {
  if (step.value === 1) router.push('/')
  else step.value -= 1
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function showError(msg) {
  errorMsg.value = msg
  setTimeout(() => { errorMsg.value = '' }, 4000)
}
</script>
