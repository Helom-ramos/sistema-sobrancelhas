<template>
  <div class="border border-gray-100 rounded-xl p-4">
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <p class="font-semibold text-gray-900 text-sm truncate">{{ appointment.client?.name }}</p>
          <span :class="statusClass">{{ statusLabel }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">{{ appointment.service?.name }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ formatTime(appointment.datetime) }}</p>
        <p v-if="appointment.client?.phone" class="text-xs text-gray-400">
          📱 {{ formatPhone(appointment.client.phone) }}
        </p>
      </div>
      <div class="shrink-0">
        <select
          :value="appointment.status"
          @change="changeStatus($event.target.value)"
          class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-brand-400"
        >
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="cancelled">Cancelado</option>
          <option value="completed">Concluído</option>
          <option value="no_show">Não compareceu</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import api from '@/services/api.js'

const props = defineProps({ appointment: Object })
const emit = defineEmits(['status-change'])

const statusMap = {
  pending:   { label: 'Pendente',   cls: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmado', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado',  cls: 'bg-red-100 text-red-600' },
  completed: { label: 'Concluído',  cls: 'bg-blue-100 text-blue-700' },
  no_show:   { label: 'Faltou',     cls: 'bg-gray-100 text-gray-500' }
}

const statusLabel = computed(() => statusMap[props.appointment.status]?.label || props.appointment.status)
const statusClass = computed(() =>
  `text-xs px-2 py-0.5 rounded-full font-medium ${statusMap[props.appointment.status]?.cls || 'bg-gray-100'}`
)

function formatTime(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

function formatPhone(p) {
  if (!p) return ''
  const d = p.replace(/\D/g, '')
  return d.length === 11 ? `(${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}` : p
}

async function changeStatus(status) {
  try {
    await api.patch(`/appointments/${props.appointment._id}/status`, { status })
    emit('status-change')
  } catch {
    // revert handled by parent reload
  }
}
</script>
