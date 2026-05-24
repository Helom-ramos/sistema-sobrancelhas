<template>
  <AdminLayout>
    <div class="space-y-5">
      <h1 class="text-2xl font-bold text-white">Horários Disponíveis</h1>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-2">
        <input type="date" v-model="selectedDate" @change="load"
          class="h-10 px-3 rounded-xl text-sm text-white border focus:outline-none"
          style="background:#1a1a1a;border-color:#2a2a2a;color-scheme:dark" />

        <select v-model="selectedServiceId" @change="load"
          class="h-10 px-3 rounded-xl text-sm text-white border focus:outline-none flex-1 min-w-0"
          style="background:#1a1a1a;border-color:#2a2a2a">
          <option value="">Selecione um serviço</option>
          <option v-for="s in services" :key="s._id" :value="s._id">
            {{ s.name }} ({{ s.duration }}min)
          </option>
        </select>
      </div>

      <!-- Estado vazio -->
      <div v-if="!selectedServiceId" class="rounded-2xl p-8 text-center text-zinc-500 text-sm"
        style="background:#1a1a1a;border:1px solid #2a2a2a">
        Selecione um serviço para ver os horários do dia.
      </div>

      <!-- Carregando -->
      <div v-else-if="loading" class="rounded-2xl p-8 text-center text-zinc-500 text-sm"
        style="background:#1a1a1a;border:1px solid #2a2a2a">
        Carregando...
      </div>

      <!-- Dia fechado -->
      <div v-else-if="timeline.length === 0" class="rounded-2xl p-8 text-center text-zinc-500 text-sm"
        style="background:#1a1a1a;border:1px solid #2a2a2a">
        Nenhum horário disponível neste dia (salão fechado ou sem slots para este serviço).
      </div>

      <!-- Timeline -->
      <div v-else class="rounded-2xl overflow-hidden" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <div class="px-4 py-3 border-b flex items-center justify-between" style="border-color:#2a2a2a">
          <span class="text-sm font-medium text-white">{{ dateLabel }}</span>
          <div class="flex gap-3 text-xs text-zinc-500">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full inline-block" style="background:#16a34a"></span> Disponível ({{ availableCount }})
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full inline-block" style="background:#dc2626"></span> Ocupado ({{ occupiedCount }})
            </span>
          </div>
        </div>

        <div class="divide-y" style="border-color:#2a2a2a">
          <div v-for="item in timeline" :key="item.time"
            class="flex items-start gap-3 px-4 py-3">
            <!-- Horário -->
            <span class="text-sm font-mono text-zinc-400 shrink-0 pt-0.5 w-12">{{ item.time }}</span>

            <!-- Disponível -->
            <div v-if="item.type === 'available'"
              class="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
              style="background:#052e16;border:1px solid #166534">
              <span class="w-2 h-2 rounded-full shrink-0" style="background:#16a34a"></span>
              <span class="text-sm text-green-400 font-medium">Disponível</span>
            </div>

            <!-- Ocupado -->
            <div v-else class="flex-1 rounded-xl px-3 py-2" style="background:#1f0707;border:1px solid #7f1d1d">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="w-2 h-2 rounded-full shrink-0" style="background:#dc2626"></span>
                <span class="text-sm text-white font-medium">{{ item.appt.client?.name }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full" :style="statusStyle(item.appt.status)">
                  {{ statusLabel(item.appt.status) }}
                </span>
              </div>
              <p class="text-xs text-zinc-400 mt-1 ml-4">
                {{ item.appt.service?.name }} · {{ item.appt.service?.duration }}min
                <span v-if="item.appt.client?.phone"> · {{ formatPhone(item.appt.client.phone) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/services/api.js'

function todayBrazil() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

const selectedDate = ref(todayBrazil())
const selectedServiceId = ref('')
const services = ref([])
const availableSlots = ref([])
const appointments = ref([])
const loading = ref(false)

const dateLabel = computed(() => {
  const d = new Date(`${selectedDate.value}T12:00:00-03:00`)
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const timeline = computed(() => {
  if (!selectedServiceId.value) return []

  // Coleta todos os horários distintos: disponíveis + de agendamentos ativos do dia
  const availableSet = new Set(availableSlots.value)

  // Gera a lista ordenada unindo slots disponíveis e horários dos agendamentos
  const allTimes = new Set([
    ...availableSlots.value,
    ...appointments.value
      .filter(a => a.status !== 'cancelled')
      .map(a => {
        const d = new Date(a.datetime)
        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
      })
  ])

  return [...allTimes].sort().map(time => {
    if (availableSet.has(time)) {
      return { time, type: 'available' }
    }
    const appt = appointments.value.find(a => {
      const t = new Date(a.datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
      return t === time && a.status !== 'cancelled'
    })
    return { time, type: 'occupied', appt: appt || null }
  }).filter(item => item.type === 'available' || item.appt)
})

const availableCount = computed(() => timeline.value.filter(i => i.type === 'available').length)
const occupiedCount = computed(() => timeline.value.filter(i => i.type === 'occupied').length)

async function load() {
  if (!selectedServiceId.value) return
  loading.value = true
  try {
    const [slotsRes, apptRes] = await Promise.all([
      api.get('/slots', { params: { date: selectedDate.value, serviceId: selectedServiceId.value } }),
      api.get('/appointments', { params: { date: selectedDate.value } })
    ])
    availableSlots.value = slotsRes.data
    appointments.value = apptRes.data
  } catch {
    availableSlots.value = []
    appointments.value = []
  } finally {
    loading.value = false
  }
}

function statusLabel(s) {
  return { pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado', completed: 'Concluído' }[s] || s
}

function statusStyle(s) {
  const map = {
    pending: 'background:#3f2a00;color:#fbbf24',
    confirmed: 'background:#052e16;color:#4ade80',
    cancelled: 'background:#3f0606;color:#f87171',
    completed: 'background:#1e1b4b;color:#a5b4fc'
  }
  return map[s] || ''
}

function formatPhone(p) {
  const d = p.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return p
}

onMounted(async () => {
  const res = await api.get('/services/all')
  services.value = res.data.filter(s => s.active)
})
</script>
