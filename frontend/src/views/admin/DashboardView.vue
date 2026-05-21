<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-sm text-zinc-500 mt-1">{{ today }}</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <p class="text-xs text-zinc-500 font-medium">Hoje</p>
          <p class="text-3xl font-bold text-white mt-1">{{ stats.today }}</p>
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

      <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <h2 class="font-semibold text-white mb-4">Agendamentos de hoje</h2>
        <div v-if="loading" class="text-center text-zinc-500 py-8">Carregando...</div>
        <div v-else-if="appointments.length === 0" class="text-center text-zinc-500 py-8">
          Nenhum agendamento hoje.
        </div>
        <div v-else class="space-y-3">
          <AppointmentCard v-for="a in appointments" :key="a._id" :appointment="a" @status-change="reload" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import AppointmentCard from '@/components/AppointmentCard.vue'
import api from '@/services/api.js'

const appointments = ref([])
const loading = ref(true)

const today = computed(() =>
  new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)
const stats = computed(() => ({
  today: appointments.value.length,
  pending: appointments.value.filter(a => a.status === 'pending').length,
  confirmed: appointments.value.filter(a => a.status === 'confirmed').length,
  cancelled: appointments.value.filter(a => a.status === 'cancelled').length
}))

async function reload() {
  loading.value = true
  try {
    const date = new Date().toISOString().split('T')[0]
    const res = await api.get('/appointments', { params: { date } })
    appointments.value = res.data
  } catch { /* silencioso */ } finally { loading.value = false }
}

onMounted(reload)
</script>
