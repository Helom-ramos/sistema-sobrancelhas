<template>
  <div class="min-h-screen bg-brand-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
      <button @click="handleBack" class="p-1 rounded-lg hover:bg-gray-100">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-base font-bold text-gray-900">Agendar Horário</h1>
        <div class="flex gap-1 mt-1">
          <div
            v-for="n in 3"
            :key="n"
            :class="['h-1 rounded-full transition-all', n <= step ? 'bg-brand-500 w-8' : 'bg-gray-200 w-4']"
          />
        </div>
      </div>
      <span class="text-xs text-gray-400">{{ step }}/3</span>
    </header>

    <!-- Step 1 — Escolher Serviço -->
    <div v-if="step === 1" class="flex-1 px-4 py-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Escolha o serviço</h2>
      <div v-if="loadingServices" class="text-center text-gray-400 py-12">Carregando serviços...</div>
      <div v-else class="space-y-3">
        <button
          v-for="s in services"
          :key="s._id"
          @click="selectService(s)"
          :class="[
            'w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border-2 transition-all text-left',
            selectedService?._id === s._id ? 'border-brand-500 bg-brand-50' : 'border-transparent'
          ]"
        >
          <div class="w-16 h-16 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover" />
            <span v-else class="text-3xl">💆</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900">{{ s.name }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ s.description }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs text-gray-400">⏱ {{ s.duration }} min</span>
              <span class="text-sm font-bold text-brand-600">R$ {{ s.price }}</span>
            </div>
          </div>
          <div v-if="selectedService?._id === s._id" class="text-brand-500">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </button>
      </div>
      <button
        v-if="selectedService"
        @click="step = 2"
        class="fixed bottom-6 left-4 right-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-colors"
      >
        Continuar → {{ selectedService.name }}
      </button>
    </div>

    <!-- Step 2 — Escolher Data e Horário -->
    <div v-if="step === 2" class="flex-1 px-4 py-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Escolha a data</h2>

      <!-- Seleção de data -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <input
          type="date"
          v-model="selectedDate"
          :min="minDate"
          :max="maxDate"
          @change="loadSlots"
          class="w-full text-gray-900 text-base focus:outline-none"
        />
      </div>

      <!-- Horários -->
      <div v-if="selectedDate">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Horários disponíveis</h2>
        <div v-if="loadingSlots" class="text-center text-gray-400 py-8">Verificando horários...</div>
        <div v-else-if="slots.length === 0" class="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
          Nenhum horário disponível nessa data.<br/>Tente outro dia.
        </div>
        <div v-else class="grid grid-cols-3 gap-2">
          <button
            v-for="slot in slots"
            :key="slot"
            @click="selectedTime = slot"
            :class="[
              'py-3 rounded-xl text-sm font-medium transition-all border-2',
              selectedTime === slot
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-700 border-transparent shadow-sm'
            ]"
          >
            {{ slot }}
          </button>
        </div>
      </div>

      <button
        v-if="selectedTime"
        @click="step = 3"
        class="fixed bottom-6 left-4 right-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-colors"
      >
        Continuar → {{ selectedTime }}
      </button>
    </div>

    <!-- Step 3 — Dados do cliente -->
    <div v-if="step === 3" class="flex-1 px-4 py-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Confirme seus dados</h2>

      <!-- Resumo -->
      <div class="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6">
        <p class="text-sm font-semibold text-brand-800">{{ selectedService?.name }}</p>
        <p class="text-xs text-brand-600 mt-1">{{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <p class="text-xs text-brand-600">R$ {{ selectedService?.price }} · {{ selectedService?.duration }} min</p>
      </div>

      <!-- Formulário -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
          <input
            v-model="clientName"
            type="text"
            placeholder="Ex: Maria Silva"
            class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            v-model="clientPhone"
            type="tel"
            placeholder="(11) 99999-9999"
            @input="formatPhone"
            class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <p class="text-xs text-gray-400 mt-1">Você receberá a confirmação por WhatsApp</p>
        </div>
      </div>

      <button
        @click="submitBooking"
        :disabled="!canSubmit || submitting"
        class="mt-8 w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-2xl shadow-lg transition-colors"
      >
        {{ submitting ? 'Agendando...' : 'Confirmar Agendamento' }}
      </button>
    </div>

    <!-- Step 4 — Sucesso -->
    <div v-if="step === 4" class="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Agendamento Confirmado!</h2>
      <p class="text-gray-500 text-center text-sm mb-2">
        {{ clientName }}, seu agendamento foi realizado com sucesso.
      </p>
      <div class="bg-brand-50 border border-brand-200 rounded-2xl p-4 w-full max-w-xs mt-4 mb-8">
        <p class="text-sm font-semibold text-brand-800">{{ selectedService?.name }}</p>
        <p class="text-xs text-brand-600 mt-1">{{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        <p class="text-xs text-brand-600">R$ {{ selectedService?.price }}</p>
      </div>
      <p class="text-xs text-gray-400 text-center mb-8">
        Você receberá uma confirmação no WhatsApp.<br/>
        30 minutos antes enviaremos um lembrete.
      </p>
      <button
        @click="$router.push('/')"
        class="w-full max-w-xs bg-brand-500 text-white font-semibold py-4 rounded-2xl"
      >
        Voltar ao início
      </button>
    </div>

    <!-- Toast de erro -->
    <div
      v-if="errorMsg"
      class="fixed bottom-24 left-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl text-sm text-center shadow-lg z-50"
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
    showError('Erro ao carregar serviços. Tente novamente.')
  } finally {
    loadingServices.value = false
  }
})

function selectService(s) {
  selectedService.value = s
  selectedDate.value = ''
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
    const [hour, minute] = selectedTime.value.split(':')
    const dt = new Date(`${selectedDate.value}T${hour}:${minute}:00`)
    // Ajuste para horário de Brasília (UTC-3)
    const utcDate = new Date(dt.getTime() + 3 * 60 * 60 * 1000)

    await api.post('/appointments', {
      clientName: clientName.value.trim(),
      clientPhone: clientPhone.value.replace(/\D/g, ''),
      serviceId: selectedService.value._id,
      datetime: utcDate.toISOString()
    })
    step.value = 4
  } catch (err) {
    const msg = err.response?.data?.error || 'Erro ao agendar. Tente novamente.'
    showError(msg)
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
