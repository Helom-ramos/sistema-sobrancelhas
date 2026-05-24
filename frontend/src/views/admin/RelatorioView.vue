<template>
  <AdminLayout>
    <div class="space-y-5">

      <!-- Cabeçalho -->
      <div>
        <h1 class="text-2xl font-bold text-white">Relatório</h1>
        <p class="text-sm text-zinc-500 mt-1">{{ periodLabel }}</p>
      </div>

      <!-- Seletor de período -->
      <div class="flex flex-wrap gap-2">
        <button v-for="p in PERIODS" :key="p.key" @click="setPeriod(p.key)"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition border"
          :style="activePeriod === p.key
            ? 'background:#e8557a;color:#fff;border-color:#e8557a'
            : 'background:#1a1a1a;color:#a1a1aa;border-color:#2a2a2a'">
          {{ p.label }}
        </button>
      </div>

      <!-- Datas personalizadas -->
      <div v-if="activePeriod === 'custom'" class="flex flex-wrap items-center gap-2">
        <input type="date" v-model="customStart"
          class="h-9 px-3 rounded-xl text-sm text-white border focus:outline-none shrink-0"
          style="background:#1a1a1a;border-color:#2a2a2a;color-scheme:dark;min-width:0" />
        <span class="text-zinc-500 text-sm shrink-0">até</span>
        <input type="date" v-model="customEnd"
          class="h-9 px-3 rounded-xl text-sm text-white border focus:outline-none shrink-0"
          style="background:#1a1a1a;border-color:#2a2a2a;color-scheme:dark;min-width:0" />
        <button @click="loadData"
          class="h-9 px-4 rounded-xl text-xs font-medium text-white"
          style="background:#6d28d9">
          Buscar
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-zinc-500 text-sm">Carregando...</div>

      <template v-else>

        <!-- Cards de estatísticas -->
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
            <p class="text-xs text-zinc-500 font-medium">Total</p>
            <p class="text-3xl font-bold text-white mt-1">{{ stats.total }}</p>
          </div>
          <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
            <p class="text-xs text-zinc-500 font-medium">Realizados</p>
            <p class="text-3xl font-bold text-green-400 mt-1">{{ stats.done }}</p>
            <p class="text-[10px] text-zinc-600 mt-0.5">confirmados + concluídos</p>
          </div>
          <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
            <p class="text-xs text-zinc-500 font-medium">Cancelados</p>
            <p class="text-3xl font-bold text-red-400 mt-1">{{ stats.cancelled }}</p>
          </div>
          <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
            <p class="text-xs text-zinc-500 font-medium">Taxa cancelamento</p>
            <p class="text-3xl font-bold text-yellow-400 mt-1">{{ cancelRate }}%</p>
          </div>
        </div>

        <!-- Receita -->
        <div class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs text-zinc-500 font-medium">Receita estimada</p>
              <p class="text-3xl font-bold text-white mt-1">R$ {{ fmtMoney(stats.revenue) }}</p>
              <p class="text-[10px] text-zinc-600 mt-0.5">agendamentos não cancelados</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-zinc-500 font-medium">Ticket médio</p>
              <p class="text-2xl font-bold text-purple-400 mt-1">R$ {{ fmtMoney(stats.avgTicket) }}</p>
            </div>
          </div>
        </div>

        <!-- Gráfico (só aparece quando há mais de 1 dia) -->
        <div v-if="byDay.length > 1" class="rounded-2xl p-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="text-sm font-semibold text-white mb-1">
            Agendamentos por {{ byDay.length > 31 ? 'semana' : 'dia' }}
          </h2>
          <p v-if="stats.total === 0" class="text-zinc-500 text-xs py-4 text-center">
            Nenhum agendamento no período.
          </p>
          <div v-else class="mt-3 overflow-x-auto">
            <svg :viewBox="`0 0 ${CHART_W} 165`" class="w-full min-w-48" style="overflow:visible">
              <!-- Linhas de grade -->
              <line v-for="i in 4" :key="`g${i}`"
                x1="0" :y1="120 - (i/4)*116"
                :x2="CHART_W" :y2="120 - (i/4)*116"
                stroke="#252525" stroke-width="1" stroke-dasharray="3,3"/>

              <!-- Barras -->
              <g v-for="(d, i) in byDay" :key="d.key">
                <!-- Barra de ativos (rosa) -->
                <rect v-if="d.active > 0"
                  :x="barX(i) + 1" :y="120 - barH(d.active)"
                  :width="barW - 2" :height="barH(d.active)"
                  fill="#e8557a" rx="2"/>
                <!-- Barra de cancelados (empilhada, vermelho escuro) -->
                <rect v-if="d.cancelled > 0"
                  :x="barX(i) + 1"
                  :y="120 - barH(d.active) - barH(d.cancelled)"
                  :width="barW - 2" :height="barH(d.cancelled)"
                  fill="#7f1d1d" rx="2"/>
                <!-- Traço vazio -->
                <rect v-if="d.total === 0"
                  :x="barX(i) + 1" y="118"
                  :width="barW - 2" height="2"
                  fill="#2a2a2a" rx="1"/>
                <!-- Total acima da barra -->
                <text v-if="d.total > 0 && barW >= 14"
                  :x="barX(i) + barW / 2"
                  :y="120 - barH(d.total) - 5"
                  text-anchor="middle" fill="#a1a1aa" font-size="9">
                  {{ d.total }}
                </text>
                <!-- Label do eixo X -->
                <text v-if="showBarLabel(i)"
                  :x="barX(i) + barW / 2" y="148"
                  text-anchor="middle" fill="#52525b" font-size="9">
                  {{ d.label }}
                </text>
              </g>
            </svg>
          </div>
          <!-- Legenda -->
          <div class="flex gap-4 mt-2 text-xs text-zinc-500">
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm" style="background:#e8557a;display:inline-block"></span>
              Ativos ({{ stats.total - stats.cancelled }})
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm" style="background:#7f1d1d;display:inline-block"></span>
              Cancelados ({{ stats.cancelled }})
            </span>
          </div>
        </div>

        <!-- Por serviço -->
        <div class="rounded-2xl overflow-hidden" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <div class="px-4 py-3 border-b" style="border-color:#2a2a2a">
            <h2 class="text-sm font-semibold text-white">Por serviço</h2>
          </div>
          <div v-if="byService.length === 0"
            class="px-4 py-8 text-center text-zinc-500 text-sm">
            Nenhum agendamento no período.
          </div>
          <div v-else class="divide-y" style="border-color:#2a2a2a">
            <div v-for="s in byService" :key="s.name"
              class="flex items-center gap-3 px-4 py-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white font-medium truncate">{{ s.name }}</p>
                <div class="mt-1.5 h-1.5 rounded-full overflow-hidden" style="background:#2a2a2a">
                  <div class="h-full rounded-full transition-all"
                    style="background:#e8557a"
                    :style="`width:${maxServiceCount > 0 ? (s.count / maxServiceCount) * 100 : 0}%`">
                  </div>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm text-white font-bold">{{ s.count }}x</p>
                <p class="text-xs text-zinc-500 mt-0.5">R$ {{ fmtMoney(s.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Insight: dia mais movimentado -->
        <div v-if="busiestDay" class="rounded-2xl p-4 flex gap-3 items-start"
          style="background:#1a0a10;border:1px solid #3a1020">
          <span class="text-2xl">📈</span>
          <div>
            <p class="text-sm font-semibold text-white">Dia mais movimentado</p>
            <p class="text-xs text-zinc-400 mt-0.5">
              {{ busiestDay.label }} com {{ busiestDay.total }}
              agendamento{{ busiestDay.total > 1 ? 's' : '' }}
            </p>
          </div>
        </div>

      </template>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/services/api.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function todayBrazil() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}
function addDays(dateStr, delta) {
  const d = new Date(`${dateStr}T12:00:00-03:00`)
  d.setDate(d.getDate() + delta)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d)
}
function fmtMoney(v) {
  return v.toFixed(2).replace('.', ',')
}
function dateBR(str) {
  return new Date(`${str}T12:00:00-03:00`)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─── Estado ──────────────────────────────────────────────────────────────────
const PERIODS = [
  { key: '7d',       label: '7 dias' },
  { key: '30d',      label: '30 dias' },
  { key: 'month',    label: 'Mês atual' },
  { key: 'lastmonth',label: 'Mês anterior' },
  { key: 'custom',   label: 'Personalizado' }
]

const activePeriod = ref('7d')
const customStart  = ref(addDays(todayBrazil(), -6))
const customEnd    = ref(todayBrazil())
const appointments = ref([])
const loading      = ref(true)

// ─── Período ─────────────────────────────────────────────────────────────────
const startDate = computed(() => {
  const today = todayBrazil()
  switch (activePeriod.value) {
    case '7d':        return addDays(today, -6)
    case '30d':       return addDays(today, -29)
    case 'month':     return today.slice(0, 7) + '-01'
    case 'lastmonth': {
      const d = new Date(`${today}T12:00:00-03:00`)
      d.setDate(1); d.setMonth(d.getMonth() - 1)
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d)
    }
    default: return customStart.value
  }
})

const endDate = computed(() => {
  const today = todayBrazil()
  switch (activePeriod.value) {
    case 'lastmonth': {
      const d = new Date(`${today}T12:00:00-03:00`)
      d.setDate(0)
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d)
    }
    case 'custom': return customEnd.value
    default:       return today
  }
})

const periodLabel = computed(() => {
  if (startDate.value === endDate.value) return dateBR(startDate.value)
  return `${dateBR(startDate.value)} → ${dateBR(endDate.value)}`
})

// ─── Estatísticas ─────────────────────────────────────────────────────────────
const stats = computed(() => {
  const a = appointments.value
  const done      = a.filter(x => ['confirmed', 'completed'].includes(x.status)).length
  const cancelled = a.filter(x => x.status === 'cancelled').length
  const active    = a.filter(x => x.status !== 'cancelled')
  const revenue   = active.reduce((s, x) => s + (x.service?.price || 0), 0)
  const avgTicket = active.length > 0 ? revenue / active.length : 0
  return { total: a.length, done, cancelled, revenue, avgTicket }
})

const cancelRate = computed(() =>
  stats.value.total === 0 ? 0 : Math.round((stats.value.cancelled / stats.value.total) * 100)
)

// ─── Por serviço ─────────────────────────────────────────────────────────────
const byService = computed(() => {
  const map = {}
  appointments.value
    .filter(a => a.status !== 'cancelled')
    .forEach(a => {
      const name = a.service?.name || '?'
      if (!map[name]) map[name] = { name, count: 0, revenue: 0 }
      map[name].count++
      map[name].revenue += a.service?.price || 0
    })
  return Object.values(map).sort((a, b) => b.count - a.count)
})

const maxServiceCount = computed(() =>
  byService.value.length > 0 ? byService.value[0].count : 1
)

// ─── Dados do gráfico ────────────────────────────────────────────────────────
const byDay = computed(() => {
  const s = new Date(`${startDate.value}T12:00:00-03:00`)
  const e = new Date(`${endDate.value}T12:00:00-03:00`)
  const totalDays = Math.round((e - s) / 86400000) + 1
  const groupWeeks = totalDays > 31

  if (!groupWeeks) {
    const result = []
    const cur = new Date(s)
    while (cur <= e) {
      const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(cur)
      const dayAppts = appointments.value.filter(a =>
        new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date(a.datetime)) === key
      )
      result.push({
        key,
        label: cur.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }),
        total:     dayAppts.length,
        active:    dayAppts.filter(a => a.status !== 'cancelled').length,
        cancelled: dayAppts.filter(a => a.status === 'cancelled').length
      })
      cur.setDate(cur.getDate() + 1)
    }
    return result
  }

  // Agrupar por semana
  const buckets = []
  const cur = new Date(s)
  while (cur <= e) {
    const wEnd = new Date(cur); wEnd.setDate(wEnd.getDate() + 6)
    if (wEnd > e) wEnd.setTime(e.getTime())
    const wsKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(cur)
    const weKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(wEnd)
    const wAppts = appointments.value.filter(a => {
      const dk = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date(a.datetime))
      return dk >= wsKey && dk <= weKey
    })
    buckets.push({
      key:   wsKey,
      label: cur.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }),
      total:     wAppts.length,
      active:    wAppts.filter(a => a.status !== 'cancelled').length,
      cancelled: wAppts.filter(a => a.status === 'cancelled').length
    })
    cur.setDate(cur.getDate() + 7)
  }
  return buckets
})

const busiestDay = computed(() => {
  if (byDay.value.length <= 1) return null
  const best = [...byDay.value].sort((a, b) => b.total - a.total)[0]
  return best?.total > 0 ? best : null
})

// ─── Chart helpers ────────────────────────────────────────────────────────────
const CHART_W = 560
const maxDayCount = computed(() => Math.max(...byDay.value.map(d => d.total), 1))
const barW        = computed(() => CHART_W / Math.max(byDay.value.length, 1))

function barX(i)     { return i * barW.value }
function barH(count) { return count > 0 ? Math.max(3, (count / maxDayCount.value) * 116) : 0 }
function showBarLabel(i) {
  const n = byDay.value.length
  if (n <= 10) return true
  if (n <= 20) return i % 2 === 0
  return i % Math.ceil(n / 7) === 0 || i === n - 1
}

// ─── Carregar dados ───────────────────────────────────────────────────────────
async function loadData() {
  loading.value = true
  try {
    const res = await api.get('/appointments', {
      params: { startDate: startDate.value, endDate: endDate.value }
    })
    appointments.value = res.data
  } catch {
    appointments.value = []
  } finally {
    loading.value = false
  }
}

function setPeriod(key) {
  activePeriod.value = key
  if (key !== 'custom') loadData()
}

onMounted(loadData)
</script>
