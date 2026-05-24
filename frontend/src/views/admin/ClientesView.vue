<template>
  <AdminLayout>
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-white">Clientes</h1>
        <span class="text-sm text-zinc-500">{{ clients.length }} clientes</span>
      </div>

      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Buscar por nome ou telefone..."
          class="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 border focus:outline-none"
          style="background:#1a1a1a;border-color:#2a2a2a"
        />
      </div>

      <div class="rounded-2xl overflow-hidden" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <div v-if="loading" class="text-center text-zinc-500 py-8">Carregando...</div>
        <div v-else-if="filtered.length === 0" class="text-center text-zinc-500 py-8">Nenhum cliente encontrado.</div>
        <div v-else>
          <div v-for="c in filtered" :key="c._id"
            class="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
            style="border-color:#2a2a2a"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                 style="background:#1a0a10">
              <span class="font-semibold text-sm" style="color:#e8557a">{{ initials(c.name) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-white text-sm truncate">{{ c.name }}</p>
              <p class="text-xs text-zinc-500">📱 {{ formatPhone(c.phone) }}</p>
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

const clients = ref([])
const loading = ref(true)
const search = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return clients.value
  return clients.value.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
})

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
function formatPhone(p) {
  let d = p.replace(/\D/g, '')
  if ((d.length === 13 || d.length === 12) && d.startsWith('55')) d = d.slice(2)
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return p
}

onMounted(async () => {
  try {
    const res = await api.get('/clients')
    clients.value = res.data
  } catch { clients.value = [] } finally { loading.value = false }
})
</script>
