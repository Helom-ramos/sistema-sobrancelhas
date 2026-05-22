<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden"
       style="background:linear-gradient(180deg,#120b10 0%,#0c070a 50%,#120b10 100%)">

    <!-- Glows rosa -->
    <div class="fixed top-0 right-0 pointer-events-none"
         style="width:280px;height:280px;background:radial-gradient(ellipse,rgba(232,85,122,0.18) 0%,transparent 70%);z-index:0"/>
    <div class="fixed bottom-0 left-0 pointer-events-none"
         style="width:240px;height:240px;background:radial-gradient(ellipse,rgba(232,85,122,0.12) 0%,transparent 70%);z-index:0"/>

    <!-- Botanical -->
    <svg class="absolute pointer-events-none select-none" style="top:80px;right:-5px;width:80px;height:170px;opacity:0.22;z-index:0" viewBox="0 0 80 170" fill="none">
      <path d="M70 5 C62 40 50 75 38 110 C30 135 20 150 10 165" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M65 28 C78 14 84 30 68 40 C58 34 65 28 65 28Z" fill="#e8557a"/>
      <path d="M56 58 C68 44 76 60 60 70 C50 64 56 58 56 58Z" fill="#e8557a" opacity="0.7"/>
      <path d="M47 88 C38 70 24 76 30 94 C35 106 47 96 47 88Z" fill="#e8557a"/>
    </svg>
    <svg class="absolute pointer-events-none select-none" style="bottom:80px;left:-5px;width:70px;height:150px;opacity:0.2;z-index:0" viewBox="0 0 70 150" fill="none">
      <path d="M12 150 C20 115 32 80 40 50 C46 30 50 12 54 2" stroke="#e8557a" stroke-width="1" fill="none"/>
      <path d="M22 122 C5 132 0 116 12 110 C20 114 22 122 22 122Z" fill="#e8557a"/>
      <path d="M32 90 C16 96 10 80 24 76 C32 80 32 90 32 90Z" fill="#e8557a" opacity="0.7"/>
      <path d="M42 60 C26 50 30 32 42 42 C50 50 42 60 42 60Z" fill="#e8557a"/>
    </svg>

    <!-- Sparkles -->
    <div class="absolute twinkle-1 pointer-events-none" style="top:140px;left:20px;z-index:1">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="#e8557a" opacity="0.6"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"/></svg>
    </div>
    <div class="absolute twinkle-2 pointer-events-none" style="top:50%;right:30px;z-index:1">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="#d4af74" opacity="0.5"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"/></svg>
    </div>

    <!-- ============ HEADER ============ -->
    <header class="relative z-10 px-5 py-4 flex items-center gap-3 sticky top-0"
            style="background:rgba(12,7,10,0.92);border-bottom:1px solid rgba(232,85,122,0.18);backdrop-filter:blur(12px)">
      <button @click="handleBack"
              class="p-2 rounded-xl transition-all"
              style="background:rgba(232,85,122,0.1);border:1px solid rgba(232,85,122,0.2)">
        <svg class="w-4 h-4" style="color:#e8557a" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-sm font-semibold tracking-wide" style="color:#f5ecf0;letter-spacing:0.05em">Agendar Horário</h1>
        <div class="flex gap-1.5 mt-1.5">
          <div v-for="n in 3" :key="n"
            class="h-1 rounded-full transition-all duration-500"
            :style="n <= step
              ? 'width:2.5rem;background:linear-gradient(to right,#e8557a,#c93d65);box-shadow:0 0 8px rgba(232,85,122,0.4)'
              : 'width:1.2rem;background:rgba(232,85,122,0.15)'"
          />
        </div>
      </div>
      <span class="text-xs font-medium" style="color:#b89eb0;font-variant-numeric:tabular-nums">{{ step }}/3</span>
    </header>

    <!-- ============ STEP 1 — Serviço ============ -->
    <div v-if="step === 1" class="relative z-10 flex-1 px-4 py-6 pb-28">
      <div class="mb-6">
        <p class="text-xs tracking-widest uppercase mb-1 font-semibold" style="color:#e8557a;opacity:0.9;letter-spacing:0.22em">Passo 1</p>
        <h2 class="text-xl font-semibold" style="color:#f5ecf0">Escolha o serviço</h2>
      </div>

      <div v-if="loadingServices" class="text-center py-12 text-sm" style="color:#9a8aa4">Carregando...</div>
      <div v-else class="space-y-3">
        <button v-for="s in services" :key="s._id"
          @click="selectService(s)"
          class="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all duration-200"
          :style="selectedService?._id === s._id
            ? 'background:linear-gradient(135deg,#2a0f1a,#36101e);border:1.5px solid rgba(232,85,122,0.6);box-shadow:0 0 28px rgba(232,85,122,0.18)'
            : 'background:linear-gradient(135deg,#1a0f14,#1f1018);border:1.5px solid rgba(232,85,122,0.15)'"
        >
          <div class="w-16 h-16 rounded-xl shrink-0 overflow-hidden" style="background:#150a0e">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-2xl opacity-30">💆</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm" style="color:#f5ecf0">{{ s.name }}</p>
            <p class="text-xs mt-1 leading-relaxed" style="color:#a094a8">{{ s.description }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs" style="color:#9a8aa4">⏱ {{ s.duration }} min</span>
              <span class="text-sm font-bold" style="color:#e8557a">R$ {{ s.price }}</span>
            </div>
          </div>
          <div v-if="selectedService?._id === s._id" class="shrink-0">
            <div class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(232,85,122,0.25)">
              <svg class="w-4 h-4" style="color:#e8557a" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </button>
      </div>

      <button v-if="selectedService"
        @click="step = 2; loadSlots()"
        class="fixed bottom-6 left-4 right-4 font-semibold py-4 rounded-2xl transition-all active:scale-95 text-sm tracking-wide"
        style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.4)">
        Continuar →
      </button>
    </div>

    <!-- ============ STEP 2 — Data e Horário ============ -->
    <div v-if="step === 2" class="relative z-10 flex-1 px-4 py-6 pb-28">
      <div class="mb-6">
        <p class="text-xs tracking-widest uppercase mb-1 font-semibold" style="color:#e8557a;opacity:0.9;letter-spacing:0.22em">Passo 2</p>
        <h2 class="text-xl font-semibold" style="color:#f5ecf0">Escolha a data</h2>
      </div>

      <div class="rounded-2xl p-4 mb-6"
           style="background:linear-gradient(135deg,#1a0f14,#1f1018);border:1px solid rgba(232,85,122,0.18)">
        <label class="block text-xs font-medium mb-2 uppercase" style="color:#b89eb0;letter-spacing:0.1em">Selecione o dia</label>
        <input type="date" v-model="selectedDate"
               :min="minDate" :max="maxDate"
               @change="loadSlots"
               class="w-full text-base focus:outline-none rounded-xl px-3 py-2.5 border transition-colors"
               style="background:#1e1019;color:#f5ecf0;border-color:rgba(232,85,122,0.2);color-scheme:dark"/>
      </div>

      <div v-if="selectedDate">
        <h2 class="text-base font-semibold mb-3" style="color:#f5ecf0">Horários disponíveis</h2>
        <div v-if="loadingSlots" class="text-center py-8 text-sm" style="color:#9a8aa4">Verificando horários...</div>
        <div v-else-if="slots.length === 0"
             class="rounded-2xl p-6 text-center text-sm"
             style="background:linear-gradient(135deg,#1a0f14,#1f1018);border:1px solid rgba(232,85,122,0.15);color:#a094a8">
          Nenhum horário disponível nessa data.<br/>Tente outro dia.
        </div>
        <div v-else class="grid grid-cols-3 gap-2">
          <button v-for="slot in slots" :key="slot"
            @click="selectedTime = slot"
            class="py-3 rounded-xl text-sm font-medium transition-all duration-200"
            :style="selectedTime === slot
              ? 'background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;border:1.5px solid transparent;box-shadow:0 4px 16px rgba(232,85,122,0.3)'
              : 'background:linear-gradient(135deg,#1a0f14,#1f1018);color:#e8557a;border:1.5px solid rgba(232,85,122,0.22)'"
          >{{ slot }}</button>
        </div>
      </div>

      <button v-if="selectedTime"
        @click="step = 3"
        class="fixed bottom-6 left-4 right-4 font-semibold py-4 rounded-2xl transition-all active:scale-95 text-sm tracking-wide"
        style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.4)">
        Continuar — {{ selectedTime }}
      </button>
    </div>

    <!-- ============ STEP 3 — Dados ============ -->
    <div v-if="step === 3" class="relative z-10 flex-1 px-4 py-6">
      <div class="mb-6">
        <p class="text-xs tracking-widest uppercase mb-1 font-semibold" style="color:#e8557a;opacity:0.9;letter-spacing:0.22em">Passo 3</p>
        <h2 class="text-xl font-semibold" style="color:#f5ecf0">Confirme seus dados</h2>
      </div>

      <!-- Resumo -->
      <div class="rounded-2xl p-4 mb-6 relative overflow-hidden"
           style="background:linear-gradient(135deg,#2a0f1a,#36101e);border:1px solid rgba(232,85,122,0.3)">
        <div class="absolute top-0 right-0 w-24 h-24 pointer-events-none"
             style="background:radial-gradient(circle,rgba(232,85,122,0.12),transparent 70%)"/>
        <p class="text-sm font-semibold" style="color:#e8557a">{{ selectedService?.name }}</p>
        <p class="text-xs mt-1.5" style="color:#d4c4d4">{{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <div class="flex items-center gap-3 mt-2">
          <span class="text-xs" style="color:#a094a8">{{ selectedService?.duration }} min</span>
          <span class="text-xs font-bold" style="color:#e8557a">R$ {{ selectedService?.price }}</span>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium mb-1.5 uppercase" style="color:#b89eb0;letter-spacing:0.1em">Seu nome</label>
          <input v-model="clientName" type="text" placeholder="Ex: Maria Silva"
                 class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors"
                 style="background:#1a0f14;color:#f5ecf0;border-color:rgba(232,85,122,0.18)"
                 @focus="$event.target.style.borderColor='rgba(232,85,122,0.6)'"
                 @blur="$event.target.style.borderColor='rgba(232,85,122,0.18)'"/>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 uppercase" style="color:#b89eb0;letter-spacing:0.1em">WhatsApp</label>
          <input v-model="clientPhone" type="tel" inputmode="tel" placeholder="(38) 99999-9999"
                 @input="formatPhone"
                 class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors"
                 style="background:#1a0f14;color:#f5ecf0;border-color:rgba(232,85,122,0.18)"
                 @focus="$event.target.style.borderColor='rgba(232,85,122,0.6)'"
                 @blur="$event.target.style.borderColor='rgba(232,85,122,0.18)'"/>
          <p class="text-xs mt-1.5" style="color:#9a8aa4">A confirmação chegará no seu WhatsApp</p>
        </div>
      </div>

      <button @click="submitBooking"
        :disabled="!canSubmit || submitting"
        class="mt-8 w-full font-semibold py-4 rounded-2xl transition-all active:scale-95 text-sm tracking-wide"
        :style="canSubmit && !submitting
          ? 'background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.4)'
          : 'background:rgba(232,85,122,0.08);color:#7a5a7a;border:1px solid rgba(232,85,122,0.1)'">
        {{ submitting ? 'Agendando...' : 'Confirmar Agendamento' }}
      </button>
    </div>

    <!-- ============ STEP 4 — Sucesso ============ -->
    <div v-if="step === 4" class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">

      <!-- Sparkles ao redor do check -->
      <div class="absolute twinkle-1" style="top:25%;left:25%">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="#e8557a" opacity="0.7"><path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6Z"/></svg>
      </div>
      <div class="absolute twinkle-2" style="top:22%;right:25%">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="#d4af74" opacity="0.7"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"/></svg>
      </div>
      <div class="absolute twinkle-3" style="top:35%;left:20%">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#e8557a" opacity="0.6"><path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"/></svg>
      </div>

      <!-- Ícone check com glow -->
      <div class="relative mb-6">
        <div class="absolute inset-0 rounded-full blur-xl" style="background:rgba(232,85,122,0.35);transform:scale(1.6)"/>
        <div class="relative w-24 h-24 rounded-full flex items-center justify-center"
             style="background:linear-gradient(135deg,#2a0f1a,#3a1224);border:2px solid rgba(232,85,122,0.5);box-shadow:0 0 32px rgba(232,85,122,0.4)">
          <svg class="w-12 h-12" style="color:#e8557a" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-center mb-1" style="color:#f5ecf0">Tudo certo! 🌸</h2>
      <p class="text-center text-sm mb-6" style="color:#d4c4d4;line-height:1.7">
        {{ clientName }}, seu horário está reservado.<br/>Mal podemos esperar para te receber!
      </p>

      <!-- Card resumo -->
      <div class="w-full max-w-xs rounded-2xl p-5 mb-4 relative overflow-hidden"
           style="background:linear-gradient(135deg,#2a0f1a,#36101e);border:1px solid rgba(232,85,122,0.3)">
        <div class="absolute top-0 right-0 w-24 h-24 pointer-events-none"
             style="background:radial-gradient(circle,rgba(232,85,122,0.1),transparent 70%)"/>
        <p class="text-sm font-semibold" style="color:#e8557a">{{ selectedService?.name }}</p>
        <p class="text-xs mt-2" style="color:#d4c4d4">📅 {{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <p class="text-xs mt-1" style="color:#e8557a">💰 R$ {{ selectedService?.price }}</p>
      </div>

      <p class="text-xs text-center mb-8" style="color:#9a8aa4;line-height:1.8">
        A confirmação chegará no seu WhatsApp em instantes.<br/>
        Enviaremos um lembrete 30 minutos antes.
      </p>

      <button @click="$router.push('/')"
              class="w-full max-w-xs font-semibold py-4 rounded-2xl mb-3 text-sm tracking-wide transition-all active:scale-95"
              style="background:linear-gradient(135deg,#e8557a,#c93d65);color:#fff;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(232,85,122,0.3)">
        Voltar ao início
      </button>

      <button v-if="appointmentId"
              @click="$router.push(`/cancelar/${appointmentId}`)"
              class="w-full max-w-xs text-xs py-3 rounded-2xl transition-all"
              style="background:transparent;color:#9a8aa4;border:1px solid rgba(232,85,122,0.15)">
        Precisar cancelar? Clique aqui
      </button>
    </div>

    <!-- Toast erro -->
    <div v-if="errorMsg"
         class="fixed bottom-24 left-4 right-4 px-4 py-3 rounded-xl text-sm text-center shadow-lg z-50"
         style="background:#1a0808;border:1px solid rgba(239,68,68,0.4);color:#fca5a5">
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

const minDate = computed(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })
const maxDate = computed(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] })
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
  const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
  let v = ''
  if (raw.length === 0)       v = ''
  else if (raw.length <= 2)   v = `(${raw}`
  else if (raw.length <= 6)   v = `(${raw.slice(0,2)}) ${raw.slice(2)}`
  else if (raw.length <= 10)  v = `(${raw.slice(0,2)}) ${raw.slice(2,6)}-${raw.slice(6)}`
  else                        v = `(${raw.slice(0,2)}) ${raw.slice(2,7)}-${raw.slice(7)}`
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

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.9) }
  50%      { opacity: 1;   transform: scale(1.2) }
}
.twinkle-1 { animation: twinkle 3s ease-in-out infinite }
.twinkle-2 { animation: twinkle 4s ease-in-out infinite 0.5s }
.twinkle-3 { animation: twinkle 5s ease-in-out infinite 1s }
</style>
