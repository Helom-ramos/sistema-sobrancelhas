<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Configurações</h1>

      <div v-if="loading" class="text-center text-gray-400 py-8">Carregando...</div>

      <form v-else @submit.prevent="save" class="space-y-6">
        <!-- Dados do salão -->
        <div class="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 class="font-semibold text-gray-900">Dados do Salão</h2>
          <div>
            <label class="label">Nome do Salão</label>
            <input v-model="form.salonName" type="text" class="input" />
          </div>
          <div>
            <label class="label">Telefone/WhatsApp da Proprietária</label>
            <input v-model="form.phone" type="tel" placeholder="5511999999999" class="input" />
            <p class="text-xs text-gray-400 mt-1">Formato: código do país + DDD + número (sem espaços)</p>
          </div>
          <div>
            <label class="label">Endereço</label>
            <input v-model="form.address" type="text" class="input" />
          </div>
        </div>

        <!-- Horários de funcionamento -->
        <div class="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 class="font-semibold text-gray-900">Horário de Funcionamento</h2>
          <div
            v-for="(h, idx) in form.workingHours"
            :key="h.day"
            class="flex items-center gap-3"
          >
            <div class="w-8 text-center">
              <input type="checkbox" v-model="h.active" class="rounded" />
            </div>
            <span class="w-20 text-sm text-gray-700 font-medium">{{ dayNames[h.day] }}</span>
            <input
              v-model="h.start"
              type="time"
              :disabled="!h.active"
              class="input w-28 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <span class="text-gray-400 text-sm">até</span>
            <input
              v-model="h.end"
              type="time"
              :disabled="!h.active"
              class="input w-28 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <!-- Parâmetros de agendamento -->
        <div class="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 class="font-semibold text-gray-900">Parâmetros</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Intervalo entre atendimentos (min)</label>
              <input v-model.number="form.breakBetweenAppointments" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="label">Dias de antecedência para agendamento</label>
              <input v-model.number="form.advanceBookingDays" type="number" min="1" class="input" />
            </div>
            <div>
              <label class="label">Lembrete WhatsApp (min antes)</label>
              <input v-model.number="form.reminderMinutesBefore" type="number" min="1" class="input" />
            </div>
            <div>
              <label class="label">Alerta sem resposta (min)</label>
              <input v-model.number="form.noResponseAlertMinutes" type="number" min="1" class="input" />
            </div>
          </div>
        </div>

        <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {{ successMsg }}
        </div>
        <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="saving"
          class="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {{ saving ? 'Salvando...' : 'Salvar Configurações' }}
        </button>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/services/api.js'

const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const defaultWorkingHours = () =>
  [0,1,2,3,4,5,6].map(day => ({
    day,
    active: day >= 1 && day <= 5,
    start: '09:00',
    end: '18:00'
  }))

const form = ref({
  salonName: '',
  phone: '',
  address: '',
  workingHours: defaultWorkingHours(),
  breakBetweenAppointments: 10,
  advanceBookingDays: 30,
  reminderMinutesBefore: 30,
  noResponseAlertMinutes: 15
})

onMounted(async () => {
  try {
    const res = await api.get('/settings')
    if (res.data) {
      const s = res.data
      form.value.salonName = s.salonName || ''
      form.value.phone = s.phone || ''
      form.value.address = s.address || ''
      form.value.breakBetweenAppointments = s.breakBetweenAppointments ?? 10
      form.value.advanceBookingDays = s.advanceBookingDays ?? 30
      form.value.reminderMinutesBefore = s.reminderMinutesBefore ?? 30
      form.value.noResponseAlertMinutes = s.noResponseAlertMinutes ?? 15
      if (s.workingHours?.length) form.value.workingHours = s.workingHours
    }
  } catch {
    errorMsg.value = 'Erro ao carregar configurações.'
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    await api.put('/settings', form.value)
    successMsg.value = 'Configurações salvas com sucesso!'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch {
    errorMsg.value = 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.label { @apply block text-sm font-medium text-gray-700 mb-1; }
.input { @apply w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100; }
</style>
