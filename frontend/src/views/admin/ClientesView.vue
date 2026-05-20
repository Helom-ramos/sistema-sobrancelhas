<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
        <span class="text-sm text-gray-500">{{ clients.length }} clientes</span>
      </div>

      <!-- Busca -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nome ou telefone..."
          class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
        <div v-if="loading" class="text-center text-gray-400 py-8">Carregando...</div>
        <div v-else-if="filtered.length === 0" class="text-center text-gray-400 py-8">
          Nenhum cliente encontrado.
        </div>
        <div
          v-for="c in filtered"
          :key="c._id"
          class="flex items-center gap-3 px-4 py-3"
        >
          <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <span class="text-brand-700 font-semibold text-sm">{{ initials(c.name) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 text-sm truncate">{{ c.name }}</p>
            <p class="text-xs text-gray-500">📱 {{ formatPhone(c.phone) }}</p>
            <p v-if="c.email" class="text-xs text-gray-400">{{ c.email }}</p>
          </div>
          <p v-if="c.notes" class="text-xs text-gray-400 italic truncate max-w-24">{{ c.notes }}</p>
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
  return clients.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.phone.includes(q)
  )
})

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function formatPhone(p) {
  const d = p.replace(/\D/g, '')
  return d.length === 11 ? `(${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}` : p
}

onMounted(async () => {
  try {
    const res = await api.get('/clients')
    clients.value = res.data
  } catch {
    clients.value = []
  } finally {
    loading.value = false
  }
})
</script>
