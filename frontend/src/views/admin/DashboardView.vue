<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Cabeçalho + navegação de data -->
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <button @click="changeDay(-1)"
            class="flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white transition"
            style="background:#1a1a1a;border:1px solid #2a2a2a">
            ‹
          </button>
          <input type="date" v-model="selectedDate" @change="reload"
            class="h-9 px-3 rounded-xl text-sm text-white bg-transparent outline-none"
            style="background:#1a1a1a;border:1px solid #2a2a2a;color-scheme:dark;min-width:0;width:0;flex:1 1 0%" />
          <button @click="changeDay(1)"
            class="flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white transition"
            style="background:#1a1a1a;border:1px solid #2a2a2a">
            ›
          </button>
          <button v-if="!isToday" @click="goToday"
            class="h-9 px-4 rounded-xl text-xs font-medium text-white transition"
            style="background:#6d28d9">
            Hoje
          </button>
          <span class="text-sm text-zinc-400 ml-1">{{ dateLabel }}</span>
        </div>
      </div>

      <!-- Cards de estatísticas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <p class="text-xs text-zinc-500 font-medium">Total</p>
          <p class="text-3xl font-bold text-white mt-1">{{ stats.total }}</p>
        </div>
        <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <p class="text-xs text-zinc-500 font-medium">Pendentes</p>
          <p class="text-3xl font-bold text-yellow-400 mt-1">{{ stats.pending }}</p>
        </div>
        <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <p class="text-xs text-zinc-500 font-medium">Confirmados</p>
          <p class="text-3xl font-bold text-green-400 mt-1">{{ stats.confirmed }}</p>
        </div>
        <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <p class="text-xs text-zinc-500 font-medium">Cancelados</p>
          <p class="text-3xl font-bold text-red-400 mt-1">{{ stats.cancelled }}</p>
        </div>
      </div>

      <!-- Lista de agendamentos -->
      <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <h2 class="font-semibold text-white mb-4">Agendamentos — {{ dateLabel }}</h2>
        <div v-if="loading" class="text-center text-zinc-500 py-8">Carregando...</div>
        <div v-else-if="appointments.length === 0" class="text-center text-zinc-500 py-8">
          Nenhum agendamento neste dia.
        </div>
        <div v-else class="space-y-3">
          <AppointmentCard v-for="a in appointments" :key="a._id" :appointment="a" @status-change="reload" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import AppointmentCard from '@/components/AppointmentCard.vue'
import api from '@/services/api.js'

const appointments = ref([])
const loading = ref(true)
let refreshTimer = null

function todayBrazil() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

const todayStr = ref(todayBrazil())
const selectedDate = ref(todayBrazil())

const isToday = computed(() => selectedDate.value === todayStr.value)

const dateLabel = computed(() => {
  const d = new Date(`${selectedDate.value}T12:00:00-03:00`)
  const label = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return isToday.value ? `Hoje, ${label}` : label
})

const stats = computed(() => ({
  total: appointments.value.length,
  pending: appointments.value.filter(a => a.status === 'pending').length,
  confirmed: appointments.value.filter(a => a.status === 'confirmed').length,
  cancelled: appointments.value.filter(a => a.status === 'cancelled').length
}))

function changeDay(delta) {
  const d = new Date(`${selectedDate.value}T12:00:00`)
  d.setDate(d.getDate() + delta)
  selectedDate.value = d.toISOString().split('T')[0]
  reload()
}

function goToday() {
  selectedDate.value = todayBrazil()
  reload()
}

async function reload() {
  loading.value = true
  try {
    const res = await api.get('/appointments', { params: { date: selectedDate.value } })
    appointments.value = res.data
  } catch { /* silencioso */ } finally { loading.value = false }
}

async function silentReload() {
  todayStr.value = todayBrazil()
  try {
    const res = await api.get('/appointments', { params: { date: selectedDate.value } })
    appointments.value = res.data
  } catch { /* silencioso */ }
}

onMounted(() => {
  reload()
  refreshTimer = setInterval(silentReload, 30000)
})

onUnmounted(() => clearInterval(refreshTimer))
</script>
