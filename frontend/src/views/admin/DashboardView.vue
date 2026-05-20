<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">{{ today }}</p>
      </div>

      <!-- Cards de resumo -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 font-medium">Hoje</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.today }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 font-medium">Pendentes</p>
          <p class="text-3xl font-bold text-yellow-500 mt-1">{{ stats.pending }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 font-medium">Confirmados</p>
          <p class="text-3xl font-bold text-green-500 mt-1">{{ stats.confirmed }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500 font-medium">Cancelados</p>
          <p class="text-3xl font-bold text-red-400 mt-1">{{ stats.cancelled }}</p>
        </div>
      </div>

      <!-- Agendamentos de hoje -->
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 mb-4">Agendamentos de hoje</h2>
        <div v-if="loading" class="text-center text-gray-400 py-8">Carregando...</div>
        <div v-else-if="appointments.length === 0" class="text-center text-gray-400 py-8">
          Nenhum agendamento hoje.
        </div>
        <div v-else class="space-y-3">
          <AppointmentCard
            v-for="a in appointments"
            :key="a._id"
            :appointment="a"
            @status-change="reload"
          />
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

const today = computed(() => {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

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
  } catch {
    // silencioso
  } finally {
    loading.value = false
  }
}

onMounted(reload)
</script>
