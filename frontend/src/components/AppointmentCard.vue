<template>
  <div class="rounded-xl p-4" style="border:1px solid #2a2a2a;background:#1a1a1a">
    <div class="flex items-start gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <p class="font-semibold text-white text-sm truncate">{{ appointment.client?.name }}</p>
          <span :class="statusClass">{{ statusLabel }}</span>
        </div>
        <p class="text-xs text-zinc-400 mt-0.5">{{ appointment.service?.name }}</p>
        <p class="text-xs text-zinc-500 mt-0.5">{{ formatTime(appointment.datetime) }}</p>
        <p v-if="appointment.client?.phone" class="text-xs text-zinc-500">
          📱 {{ formatPhone(appointment.client.phone) }}
        </p>
        <p v-if="appointment.status === 'cancelled' && appointment.cancelledBy"
           class="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
           :style="cancelledByStyle(appointment.cancelledBy)">
          {{ cancelledByLabel(appointment.cancelledBy) }}
        </p>
      </div>
    </div>
    <div class="mt-3">
      <select
        :value="appointment.status"
        @change="changeStatus($event.target.value)"
        class="w-full text-sm rounded-xl px-3 py-2 focus:outline-none border text-white"
        style="background:#0d0d0d;border-color:#2a2a2a"
      >
        <option value="pending">Pendente</option>
        <option value="confirmed">Confirmado</option>
        <option value="cancelled">Cancelado</option>
        <option value="completed">Concluído</option>
        <option value="no_show">Não compareceu</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import api from '@/services/api.js'

const props = defineProps({ appointment: Object })
const emit = defineEmits(['status-change'])

const statusMap = {
  pending:   { label: 'Pendente',   cls: 'bg-yellow-900 text-yellow-300' },
  confirmed: { label: 'Confirmado', cls: 'bg-green-900 text-green-300' },
  cancelled: { label: 'Cancelado',  cls: 'bg-red-900 text-red-300' },
  completed: { label: 'Concluído',  cls: 'bg-blue-900 text-blue-300' },
  no_show:   { label: 'Faltou',     cls: 'bg-zinc-800 text-zinc-400' }
}

const statusLabel = computed(() => statusMap[props.appointment.status]?.label || props.appointment.status)
const statusClass = computed(() =>
  `text-xs px-2 py-0.5 rounded-full font-medium ${statusMap[props.appointment.status]?.cls || 'bg-zinc-800 text-zinc-400'}`
)

function formatTime(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

function cancelledByLabel(by) {
  return { client: '👤 Cancelado pelo cliente', admin: '⚙️ Cancelado pelo admin', whatsapp: '📱 Cancelado via WhatsApp' }[by] || ''
}
function cancelledByStyle(by) {
  return { client: 'background:#1a0a10;color:#f9a8d4;border:1px solid #e8557a40', admin: 'background:#1a1a2e;color:#a5b4fc;border:1px solid #6366f140', whatsapp: 'background:#0a1a0f;color:#86efac;border:1px solid #22c55e40' }[by] || ''
}

function formatPhone(p) {
  let d = p.replace(/\D/g, '')
  if ((d.length === 13 || d.length === 12) && d.startsWith('55')) d = d.slice(2)
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return p
}

async function changeStatus(status) {
  try {
    await api.patch(`/appointments/${props.appointment._id}/status`, { status })
    emit('status-change')
  } catch { /* silencioso */ }
}
</script>
