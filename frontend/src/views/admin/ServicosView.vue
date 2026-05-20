<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Serviços</h1>
        <button
          @click="openNew"
          class="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Novo
        </button>
      </div>

      <div class="space-y-3">
        <div v-if="loading" class="text-center text-gray-400 py-8">Carregando...</div>
        <div
          v-for="s in services"
          :key="s._id"
          class="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
        >
          <div class="w-14 h-14 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover" />
            <span v-else class="text-2xl">💆</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-gray-900 text-sm truncate">{{ s.name }}</p>
              <span :class="s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0">
                {{ s.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5 truncate">{{ s.description }}</p>
            <div class="flex gap-3 mt-1">
              <span class="text-xs text-gray-400">⏱ {{ s.duration }} min</span>
              <span class="text-xs font-semibold text-brand-600">R$ {{ s.price }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 shrink-0">
            <button @click="openEdit(s)" class="text-xs text-gray-500 hover:text-brand-600 transition-colors">✏️ Editar</button>
            <button @click="toggle(s)" class="text-xs text-gray-500 hover:text-brand-600 transition-colors">
              {{ s.active ? '🔴 Desativar' : '🟢 Ativar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <h2 class="font-bold text-lg text-gray-900">{{ editing ? 'Editar Serviço' : 'Novo Serviço' }}</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input v-model="form.name" type="text" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea v-model="form.description" rows="2" class="input resize-none" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Duração (min) *</label>
            <input v-model.number="form.duration" type="number" min="1" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" class="input" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
          <input type="file" accept="image/*" @change="onFile" class="text-sm text-gray-600" />
        </div>

        <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {{ formError }}
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="modal = false" class="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium">
            Cancelar
          </button>
          <button @click="save" :disabled="saving" class="flex-1 bg-brand-500 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/services/api.js'

const services = ref([])
const loading = ref(true)
const modal = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')
const imageFile = ref(null)

const form = ref({ name: '', description: '', duration: 60, price: 0 })

function openNew() {
  editing.value = null
  form.value = { name: '', description: '', duration: 60, price: 0 }
  imageFile.value = null
  formError.value = ''
  modal.value = true
}

function openEdit(s) {
  editing.value = s
  form.value = { name: s.name, description: s.description || '', duration: s.duration, price: s.price }
  imageFile.value = null
  formError.value = ''
  modal.value = true
}

function onFile(e) {
  imageFile.value = e.target.files[0] || null
}

async function save() {
  if (!form.value.name || !form.value.duration || form.value.price === '') {
    formError.value = 'Preencha nome, duração e preço.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('description', form.value.description)
    fd.append('duration', form.value.duration)
    fd.append('price', form.value.price)
    if (imageFile.value) fd.append('image', imageFile.value)

    if (editing.value) {
      await api.put(`/services/${editing.value._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    modal.value = false
    await loadServices()
  } catch (err) {
    formError.value = err.response?.data?.error || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function toggle(s) {
  try {
    await api.patch(`/services/${s._id}/toggle`)
    await loadServices()
  } catch {
    // silencioso
  }
}

async function loadServices() {
  loading.value = true
  try {
    const res = await api.get('/services/all')
    services.value = res.data
  } catch {
    services.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadServices)
</script>

<style scoped>
.input {
  @apply w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100;
}
</style>
