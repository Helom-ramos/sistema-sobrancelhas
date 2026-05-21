<template>
  <AdminLayout>
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <h1 class="text-2xl font-bold text-white">Agenda</h1>
        <div class="flex items-center gap-2">
          <button @click="prevDay" class="p-2 rounded-xl border" style="background:#1a1a1a;border-color:#2a2a2a">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <input type="date" v-model="selectedDate" @change="load"
            class="rounded-xl px-3 py-2 text-sm text-white border focus:outline-none"
            style="background:#1a1a1a;border-color:#2a2a2a;color-scheme:dark"
          />
          <button @click="nextDay" class="p-2 rounded-xl border" style="background:#1a1a1a;border-color:#2a2a2a">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1">
        <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
          class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border"
          :style="activeFilter === f.value
            ? 'background:#e8557a;color:#fff;border-color:#e8557a'
            : 'background:#1a1a1a;color:#a1a1aa;border-color:#2a2a2a'"
        >{{ f.label }}</button>
      </div>

      <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <div v-if="loading" class="text-center text-zinc-500 py-8">Carregando...</div>
        <div v-else-if="filtered.length === 0" class="text-center text-zinc-500 py-8">
          Nenhum agendamento para esta data.
        </div>
        <div v-else class="space-y-3">
          <AppointmentCard v-for="a in filtered" :key="a._id" :appointment="a" @status-change="load" />
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

const selectedDate = ref(new Date().toISOString().split('T')[0])
const appointments = ref([])
const loading = ref(true)
const activeFilter = ref('all')

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'cancelled', label: 'Cancelados' },
  { value: 'completed', label: 'Concluídos' }
]

const filtered = computed(() =>
  activeFilter.value === 'all' ? appointments.value
    : appointments.value.filter(a => a.status === activeFilter.value)
)

function prevDay() {
  const d = new Date(selectedDate.value); d.setDate(d.getDate() - 1)
  selectedDate.value = d.toISOString().split('T')[0]; load()
}
function nextDay() {
  const d = new Date(selectedDate.value); d.setDate(d.getDate() + 1)
  selectedDate.value = d.toISOString().split('T')[0]; load()
}

async function load() {
  loading.value = true
  try {
    const res = await api.get('/appointments', { params: { date: selectedDate.value } })
    appointments.value = res.data
  } catch { appointments.value = [] } finally { loading.value = false }
}

onMounted(load)
</script>
