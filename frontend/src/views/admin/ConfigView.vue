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

        <section class="rounded-2xl p-5 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Horário de Funcionamento</h2>
          <p class="text-xs -mt-2" style="color:#f9a8d4">⚠️ Estes dias se repetem TODA semana. Para folgar em uma data específica (ex.: só dia 23/06), NÃO desmarque o dia aqui — use a seção "Folgas / Dias Bloqueados" mais abaixo.</p>
          <div v-for="h in form.workingHours" :key="h.day" class="space-y-2">
            <!-- Linha principal: dia + horário de expediente -->
            <div class="flex items-center gap-2 flex-wrap">
              <input type="checkbox" v-model="h.active" class="rounded shrink-0" />
              <span class="w-9 text-sm text-zinc-300 font-medium shrink-0">{{ dayNames[h.day] }}</span>
              <input v-model="h.start" type="time" :disabled="!h.active" class="inp" style="padding:0.5rem 0.75rem;width:7.5rem;min-width:0" />
              <span class="text-zinc-600 text-sm shrink-0">até</span>
              <input v-model="h.end" type="time" :disabled="!h.active" class="inp" style="padding:0.5rem 0.75rem;width:7.5rem;min-width:0" />
            </div>
            <!-- Linha de intervalo (visível só quando o dia está ativo) -->
            <div v-if="h.active" class="flex items-center gap-2 flex-wrap pl-11">
              <span class="text-xs text-zinc-500 shrink-0">☕ Intervalo:</span>
              <input v-model="h.breakStart" type="time" class="inp" placeholder="--:--"
                style="padding:0.4rem 0.6rem;width:7rem;min-width:0;font-size:0.75rem" />
              <span class="text-zinc-600 text-xs shrink-0">às</span>
              <input v-model="h.breakEnd" type="time" class="inp" placeholder="--:--"
                style="padding:0.4rem 0.6rem;width:7rem;min-width:0;font-size:0.75rem" />
              <button v-if="h.breakStart || h.breakEnd" type="button"
                @click="h.breakStart = ''; h.breakEnd = ''"
                class="text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0">✕ limpar</button>
            </div>
          </div>
        </section>

        <section class="rounded-2xl p-5 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Folgas / Dias Bloqueados</h2>
          <p class="text-xs text-zinc-500 -mt-2">Bloqueie uma data específica (feriado ou folga) sem mexer no horário semanal. Os clientes não conseguem agendar nesse dia — as outras semanas continuam normais.</p>
          <div class="flex items-center gap-2 flex-wrap">
            <input v-model="newBlockedDate" type="date" class="inp" style="width:11rem;min-width:0" />
            <button type="button" @click="addBlockedDate"
              class="text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0"
              style="background:#2a2a2a;color:#e8557a">+ Bloquear dia</button>
          </div>
          <div v-if="form.blockedDates.length" class="flex flex-wrap gap-2">
            <span v-for="d in sortedBlockedDates" :key="d"
              class="inline-flex items-center gap-2 text-sm rounded-lg px-3 py-1.5"
              style="background:#1a0a10;border:1px solid #e8557a40;color:#f9a8d4">
              {{ formatDate(d) }}
              <button type="button" @click="removeBlockedDate(d)"
                class="hover:text-white transition-colors" title="Desbloquear">✕</button>
            </span>
          </div>
          <p v-else class="text-xs text-zinc-600">Nenhuma data bloqueada.</p>
        </section>

        <section class="rounded-2xl p-5 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Horários Especiais (datas)</h2>
          <p class="text-xs text-zinc-500 -mt-2">Defina um horário diferente para datas específicas (ex.: festival) sem mudar a agenda semanal. Vale só nos dias escolhidos. Use o campo "até" para aplicar o mesmo horário a vários dias seguidos.</p>
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-zinc-500 w-12 shrink-0">Data</span>
              <input v-model="ov.date" type="date" class="inp" style="width:10rem;min-width:0" />
              <span class="text-zinc-600 text-xs shrink-0">até (opcional)</span>
              <input v-model="ov.dateEnd" type="date" class="inp" style="width:10rem;min-width:0" />
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-zinc-500 w-12 shrink-0">Horário</span>
              <input v-model="ov.start" type="time" class="inp" style="padding:0.5rem 0.75rem;width:7.5rem;min-width:0" />
              <span class="text-zinc-600 text-sm shrink-0">até</span>
              <input v-model="ov.end" type="time" class="inp" style="padding:0.5rem 0.75rem;width:7.5rem;min-width:0" />
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-zinc-500 w-12 shrink-0">☕</span>
              <input v-model="ov.breakStart" type="time" class="inp" placeholder="--:--" style="padding:0.4rem 0.6rem;width:7rem;min-width:0;font-size:0.75rem" />
              <span class="text-zinc-600 text-xs shrink-0">às</span>
              <input v-model="ov.breakEnd" type="time" class="inp" placeholder="--:--" style="padding:0.4rem 0.6rem;width:7rem;min-width:0;font-size:0.75rem" />
              <span class="text-xs text-zinc-600 shrink-0">intervalo (opcional)</span>
              <button type="button" @click="addOverride"
                class="text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0"
                style="background:#2a2a2a;color:#e8557a">+ Adicionar horário</button>
            </div>
          </div>
          <div v-if="form.dateOverrides.length" class="flex flex-wrap gap-2">
            <span v-for="o in sortedOverrides" :key="o.date"
              class="inline-flex items-center gap-2 text-sm rounded-lg px-3 py-1.5"
              style="background:#0a1a14;border:1px solid #16a34a55;color:#86efac">
              {{ formatDate(o.date) }} · {{ o.start }}–{{ o.end }}<template v-if="o.breakStart && o.breakEnd"> (☕ {{ o.breakStart }}–{{ o.breakEnd }})</template>
              <button type="button" @click="removeOverride(o.date)" class="hover:text-white transition-colors" title="Remover">✕</button>
            </span>
          </div>
          <p v-else class="text-xs text-zinc-600">Nenhum horário especial.</p>
        </section>

        <section class="rounded-2xl p-5 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
          <h2 class="font-semibold text-white">Parâmetros</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/services/api.js'

const loading = ref(true), saving = ref(false)
const successMsg = ref(''), errorMsg = ref('')
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const form = ref({
  salonName: '', phone: '', address: '',
  workingHours: [0,1,2,3,4,5,6].map(day => ({ day, active: day >= 1 && day <= 5, start: '09:00', end: '18:00', breakStart: '', breakEnd: '' })),
  breakBetweenAppointments: 10, advanceBookingDays: 30,
  reminderMinutesBefore: 30, noResponseAlertMinutes: 15,
  blockedDates: [], dateOverrides: []
})

const newBlockedDate = ref('')
const sortedBlockedDates = computed(() => [...form.value.blockedDates].sort())

function addBlockedDate() {
  const d = newBlockedDate.value
  if (!d) return
  if (!form.value.blockedDates.includes(d)) form.value.blockedDates.push(d)
  newBlockedDate.value = ''
}
function removeBlockedDate(d) {
  form.value.blockedDates = form.value.blockedDates.filter(x => x !== d)
}
function formatDate(d) {
  const dt = new Date(`${d}T12:00:00-03:00`)
  const wd = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dt.getDay()]
  const [y, m, day] = d.split('-')
  return `${wd} ${day}/${m}/${y}`
}

// Horários especiais por data (ex.: festival)
const ov = ref({ date: '', dateEnd: '', start: '09:00', end: '19:00', breakStart: '', breakEnd: '' })
const sortedOverrides = computed(() => [...form.value.dateOverrides].sort((a, b) => a.date.localeCompare(b.date)))

// Lista de datas YYYY-MM-DD de start a end (inclusive). Usa UTC só p/ rótulo de calendário.
function eachDate(start, end) {
  const dates = []
  let d = new Date(`${start}T00:00:00Z`)
  const last = new Date(`${end}T00:00:00Z`)
  while (d <= last) {
    dates.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return dates
}

function addOverride() {
  if (!ov.value.date || !ov.value.start || !ov.value.end) return
  const end = ov.value.dateEnd && ov.value.dateEnd >= ov.value.date ? ov.value.dateEnd : ov.value.date
  for (const iso of eachDate(ov.value.date, end)) {
    const entry = { date: iso, start: ov.value.start, end: ov.value.end, breakStart: ov.value.breakStart, breakEnd: ov.value.breakEnd }
    const idx = form.value.dateOverrides.findIndex(o => o.date === iso)
    if (idx >= 0) form.value.dateOverrides[idx] = entry
    else form.value.dateOverrides.push(entry)
  }
  ov.value = { date: '', dateEnd: '', start: '09:00', end: '19:00', breakStart: '', breakEnd: '' }
}
function removeOverride(d) {
  form.value.dateOverrides = form.value.dateOverrides.filter(o => o.date !== d)
}

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
        blockedDates: Array.isArray(s.blockedDates) ? s.blockedDates : [],
        dateOverrides: Array.isArray(s.dateOverrides)
          ? s.dateOverrides.map(o => ({ date: o.date, start: o.start, end: o.end, breakStart: o.breakStart || '', breakEnd: o.breakEnd || '' }))
          : [],
      })
      if (s.workingHours?.length) {
        form.value.workingHours = s.workingHours.map(h => ({
          ...h,
          breakStart: h.breakStart || '',
          breakEnd: h.breakEnd || ''
        }))
      }
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
.lbl { display: block; font-size: 0.875rem; font-weight: 500; color: #a1a1aa; margin-bottom: 0.25rem; }
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
