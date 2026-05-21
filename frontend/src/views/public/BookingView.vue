<template>
  <div class="min-h-screen flex flex-col" style="background:#0d0d0d">
    <!-- Header -->
    <header class="px-5 py-4 flex items-center gap-3 sticky top-0 z-10 border-b border-zinc-800"
            style="background:#0d0d0d">
      <button @click="handleBack" class="p-1 rounded-lg" style="background:#1a1a1a">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-sm font-bold text-white">Agendar Horário</h1>
        <div class="flex gap-1 mt-1">
          <div v-for="n in 3" :key="n"
            :class="['h-1 rounded-full transition-all', n <= step ? 'w-8' : 'w-4 bg-zinc-700']"
            :style="n <= step ? 'width:2rem;background:#e8557a' : ''"
          />
        </div>
      </div>
      <span class="text-xs text-zinc-500">{{ step }}/3</span>
    </header>

    <!-- Step 1 — Escolher Serviço -->
    <div v-if="step === 1" class="flex-1 px-4 py-6 pb-28">
      <h2 class="text-lg font-semibold text-white mb-4">Escolha o serviço</h2>
      <div v-if="loadingServices" class="text-center text-zinc-500 py-12">Carregando...</div>
      <div v-else class="space-y-3">
        <button
          v-for="s in services"
          :key="s._id"
          @click="selectService(s)"
          :class="['w-full rounded-2xl p-4 flex items-center gap-4 border-2 transition-all text-left']"
          :style="selectedService?._id === s._id
            ? 'background:#1a0a10;border-color:#e8557a'
            : 'background:#1a1a1a;border-color:#2a2a2a'"
        >
          <div class="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
               style="background:#2a2a2a">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover" />
            <span v-else class="text-3xl">💆</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-white">{{ s.name }}</p>
            <p class="text-sm text-zinc-400 mt-0.5">{{ s.description }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs text-zinc-500">⏱ {{ s.duration }} min</span>
              <span class="text-sm font-bold" style="color:#e8557a">R$ {{ s.price }}</span>
            </div>
          </div>
          <div v-if="selectedService?._id === s._id">
            <svg class="w-6 h-6" style="color:#e8557a" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </button>
      </div>

      <button
        v-if="selectedService"
        @click="step = 2; loadSlots()"
        class="fixed bottom-6 left-4 right-4 font-semibold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        style="background:#e8557a;color:#fff"
      >
        Continuar → {{ selectedService.name }}
      </button>
    </div>

    <!-- Step 2 — Data e Horário -->
    <div v-if="step === 2" class="flex-1 px-4 py-6 pb-28">
      <h2 class="text-lg font-semibold text-white mb-4">Escolha a data</h2>

      <div class="rounded-2xl p-4 mb-6" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <label class="block text-xs font-medium text-zinc-500 mb-2">Toque para selecionar</label>
        <input
          type="date"
          v-model="selectedDate"
          :min="minDate"
          :max="maxDate"
          @change="loadSlots"
          class="w-full text-white text-base focus:outline-none rounded-xl px-3 py-2.5 border border-zinc-700"
          style="background:#2a2a2a;color-scheme:dark"
        />
      </div>

      <div v-if="selectedDate">
        <h2 class="text-lg font-semibold text-white mb-3">Horários disponíveis</h2>
        <div v-if="loadingSlots" class="text-center text-zinc-500 py-8">Verificando horários...</div>
        <div v-else-if="slots.length === 0" class="rounded-2xl p-6 text-center text-zinc-400"
             style="background:#1a1a1a;border:1px solid #2a2a2a">
          Nenhum horário disponível nessa data.<br/>Tente outro dia.
        </div>
        <div v-else class="grid grid-cols-3 gap-2">
          <button
            v-for="slot in slots"
            :key="slot"
            @click="selectedTime = slot"
            class="py-3 rounded-xl text-sm font-medium transition-all"
            :style="selectedTime === slot
              ? 'background:#e8557a;color:#fff;border:2px solid #e8557a'
              : 'background:#1a1a1a;color:#d1d1d1;border:2px solid #2a2a2a'"
          >
            {{ slot }}
          </button>
        </div>
      </div>

      <button
        v-if="selectedTime"
        @click="step = 3"
        class="fixed bottom-6 left-4 right-4 font-semibold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        style="background:#e8557a;color:#fff"
      >
        Continuar → {{ selectedTime }}
      </button>
    </div>

    <!-- Step 3 — Dados do cliente -->
    <div v-if="step === 3" class="flex-1 px-4 py-6">
      <h2 class="text-lg font-semibold text-white mb-4">Confirme seus dados</h2>

      <!-- Resumo -->
      <div class="rounded-2xl p-4 mb-6" style="background:#1a0a10;border:1px solid #e8557a40">
        <p class="text-sm font-semibold" style="color:#e8557a">{{ selectedService?.name }}</p>
        <p class="text-xs text-zinc-400 mt-1">{{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <p class="text-xs text-zinc-400">R$ {{ selectedService?.price }} · {{ selectedService?.duration }} min</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Seu nome</label>
          <input
            v-model="clientName"
            type="text"
            placeholder="Ex: Maria Silva"
            class="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none border"
            style="background:#1a1a1a;border-color:#2a2a2a"
            @focus="$event.target.style.borderColor='#e8557a'"
            @blur="$event.target.style.borderColor='#2a2a2a'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">WhatsApp</label>
          <input
            v-model="clientPhone"
            type="tel"
            placeholder="(11) 99999-9999"
            @input="formatPhone"
            class="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none border"
            style="background:#1a1a1a;border-color:#2a2a2a"
            @focus="$event.target.style.borderColor='#e8557a'"
            @blur="$event.target.style.borderColor='#2a2a2a'"
          />
          <p class="text-xs text-zinc-600 mt-1">Você receberá a confirmação por WhatsApp</p>
        </div>
      </div>

      <button
        @click="submitBooking"
        :disabled="!canSubmit || submitting"
        class="mt-8 w-full font-semibold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        :style="canSubmit && !submitting
          ? 'background:#e8557a;color:#fff'
          : 'background:#2a2a2a;color:#555'"
      >
        {{ submitting ? 'Agendando...' : 'Confirmar Agendamento' }}
      </button>
    </div>

    <!-- Step 4 — Sucesso -->
    <div v-if="step === 4" class="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div class="w-20 h-20 rounded-full flex items-center justify-center mb-6"
           style="background:#1a0a10;border:2px solid #e8557a">
        <svg class="w-10 h-10" style="color:#e8557a" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-white text-center mb-2">Tudo certo! 🌸</h2>
      <p class="text-zinc-400 text-center text-sm mb-2">
        {{ clientName }}, seu horário está reservado.<br/>Mal podemos esperar para te receber!
      </p>
      <div class="rounded-2xl p-4 w-full max-w-xs mt-4 mb-4"
           style="background:#1a0a10;border:1px solid #e8557a40">
        <p class="text-sm font-semibold" style="color:#e8557a">{{ selectedService?.name }}</p>
        <p class="text-xs text-zinc-400 mt-1">{{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <p class="text-xs text-zinc-400">R$ {{ selectedService?.price }}</p>
      </div>
      <p class="text-xs text-zinc-500 text-center mb-8">
        A confirmação chegará no seu WhatsApp em instantes.<br/>
        Enviaremos um lembrete 30 minutos antes do seu horário.
      </p>
      <button
        @click="$router.push('/')"
        class="w-full max-w-xs font-semibold py-4 rounded-2xl mb-3"
        style="background:#e8557a;color:#fff"
      >
        Voltar ao início
      </button>
      <button
        v-if="appointmentId"
        @click="$router.push(`/cancelar/${appointmentId}`)"
        class="w-full max-w-xs text-xs py-3 rounded-2xl"
        style="background:transparent;color:#555;border:1px solid #2a2a2a"
      >
        Precisar cancelar? Clique aqui
      </button>
    </div>

    <!-- Toast de erro -->
    <div
      v-if="errorMsg"
      class="fixed bottom-24 left-4 right-4 px-4 py-3 rounded-xl text-sm text-center shadow-lg z-50"
      style="background:#7f1d1d;border:1px solid #ef4444;color:#fca5a5"
    >
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
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
})

const canSubmit = computed(() =>
  clientName.value.trim().length >= 2 && clientPhone.value.replace(/\D/g, '').length >= 10
)

onMounted(async () => {
  try {
    const res = await api.get('/services')
    services.value = res.data
  } catch {
    showError('Erro ao carregar serviços.')
  } finally {
    loadingServices.value = false
  }
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
    const res = await api.get('/slots', {
      params: { date: selectedDate.value, serviceId: selectedService.value._id }
    })
    slots.value = res.data
  } catch {
    showError('Erro ao carregar horários.')
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
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
  } finally {
    submitting.value = false
  }
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
