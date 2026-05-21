<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Configurações</h1>
      <div v-if="loading" class="text-center text-zinc-500 py-8">Carregando...</div>

      <form v-else @submit.prevent="save" class="space-y-5">
        <section class="rounded-2xl p-5 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Dados do Salão</h2>
          <div>
            <label class="lbl">Nome do Salão</label>
            <input v-model="form.salonName" type="text" class="inp" />
          </div>
          <div>
            <label class="lbl">WhatsApp da Proprietária</label>
            <input v-model="form.phone" type="tel" placeholder="5538999999999" class="inp" />
            <p class="text-xs text-zinc-600 mt-1">Código do país + DDD + número</p>
          </div>
          <div>
            <label class="lbl">Endereço</label>
            <input v-model="form.address" type="text" class="inp" />
          </div>
        </section>

        <section class="rounded-2xl p-5 space-y-3" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Horário de Funcionamento</h2>
          <div v-for="h in form.workingHours" :key="h.day" class="flex items-center gap-3">
            <input type="checkbox" v-model="h.active" class="rounded" />
            <span class="w-10 text-sm text-zinc-300 font-medium">{{ dayNames[h.day] }}</span>
            <input v-model="h.start" type="time" :disabled="!h.active" class="inp w-28" style="padding:0.5rem 0.75rem" />
            <span class="text-zinc-600 text-sm">até</span>
            <input v-model="h.end" type="time" :disabled="!h.active" class="inp w-28" style="padding:0.5rem 0.75rem" />
          </div>
        </section>

        <section class="rounded-2xl p-5 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Parâmetros</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="lbl">Intervalo entre atend. (min)</label>
              <input v-model.number="form.breakBetweenAppointments" type="number" min="0" class="inp" />
            </div>
            <div>
              <label class="lbl">Dias de antecedência</label>
              <input v-model.number="form.advanceBookingDays" type="number" min="1" class="inp" />
            </div>
            <div>
              <label class="lbl">Lembrete WhatsApp (min antes)</label>
              <input v-model.number="form.reminderMinutesBefore" type="number" min="1" class="inp" />
            </div>
            <div>
              <label class="lbl">Alerta sem resposta (min)</label>
              <input v-model.number="form.noResponseAlertMinutes" type="number" min="1" class="inp" />
            </div>
          </div>
        </section>

        <div v-if="successMsg" class="rounded-xl px-4 py-3 text-sm"
             style="background:#052e16;border:1px solid #16a34a60;color:#86efac">{{ successMsg }}</div>
        <div v-if="errorMsg" class="rounded-xl px-4 py-3 text-sm"
             style="background:#1a0a10;border:1px solid #e8557a60;color:#f9a8d4">{{ errorMsg }}</div>

        <button type="submit" :disabled="saving"
          class="w-full font-semibold py-3.5 rounded-xl transition-colors"
          :style="saving ? 'background:#2a2a2a;color:#555' : 'background:#e8557a;color:#fff'">
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

const loading = ref(true), saving = ref(false)
const successMsg = ref(''), errorMsg = ref('')
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const form = ref({
  salonName: '', phone: '', address: '',
  workingHours: [0,1,2,3,4,5,6].map(day => ({ day, active: day >= 1 && day <= 5, start: '09:00', end: '18:00' })),
  breakBetweenAppointments: 10, advanceBookingDays: 30,
  reminderMinutesBefore: 30, noResponseAlertMinutes: 15
})

onMounted(async () => {
  try {
    const res = await api.get('/settings')
    if (res.data) {
      const s = res.data
      Object.assign(form.value, {
        salonName: s.salonName || '', phone: s.phone || '', address: s.address || '',
        breakBetweenAppointments: s.breakBetweenAppointments ?? 10,
        advanceBookingDays: s.advanceBookingDays ?? 30,
        reminderMinutesBefore: s.reminderMinutesBefore ?? 30,
        noResponseAlertMinutes: s.noResponseAlertMinutes ?? 15,
      })
      if (s.workingHours?.length) form.value.workingHours = s.workingHours
    }
  } catch { errorMsg.value = 'Erro ao carregar.' } finally { loading.value = false }
})

async function save() {
  saving.value = true; successMsg.value = ''; errorMsg.value = ''
  try {
    await api.put('/settings', form.value)
    successMsg.value = 'Configurações salvas!'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch { errorMsg.value = 'Erro ao salvar.' } finally { saving.value = false }
}
</script>

<style scoped>
.lbl { @apply block text-sm font-medium text-zinc-400 mb-1; }
.inp {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: white;
  outline: none;
}
.inp:disabled { opacity: 0.4; }
.inp:focus { border-color: #e8557a; }
</style>
