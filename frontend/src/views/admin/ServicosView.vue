<template>
  <AdminLayout>
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-white">Serviços</h1>
        <button @click="openNew"
          class="text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          style="background:#e8557a;color:#fff">
          + Novo
        </button>
      </div>

      <div class="space-y-3">
        <div v-if="loading" class="text-center text-zinc-500 py-8">Carregando...</div>
        <div v-for="s in services" :key="s._id" class="rounded-2xl p-4 flex items-center gap-4"
             style="background:#1a1a1a;border:1px solid #2a2a2a">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
               style="background:#2a2a2a">
            <img v-if="s.image" :src="s.image" :alt="s.name" class="w-full h-full object-cover" />
            <span v-else class="text-2xl">💆</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-semibold text-white text-sm truncate">{{ s.name }}</p>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                    :style="s.active ? 'background:#14532d;color:#86efac' : 'background:#1a1a1a;color:#52525b;border:1px solid #3f3f46'">
                {{ s.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            <p class="text-xs text-zinc-500 mt-0.5 truncate">{{ s.description }}</p>
            <div class="flex gap-3 mt-1">
              <span class="text-xs text-zinc-500">⏱ {{ s.duration }} min</span>
              <span class="text-xs font-semibold" style="color:#e8557a">R$ {{ s.price }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 shrink-0">
            <button @click="openEdit(s)" class="text-xs text-zinc-400 hover:text-white transition-colors">✏️ Editar</button>
            <button @click="toggle(s)" class="text-xs text-zinc-400 hover:text-white transition-colors">
              {{ s.active ? '🔴 Desativar' : '🟢 Ativar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
         style="background:rgba(0,0,0,0.8)">
      <div class="w-full max-w-md rounded-2xl p-6 space-y-4" style="background:#1a1a1a;border:1px solid #2a2a2a">
        <h2 class="font-bold text-lg text-white">{{ editing ? 'Editar Serviço' : 'Novo Serviço' }}</h2>

        <div v-for="field in fields" :key="field.key">
          <label class="block text-sm font-medium text-zinc-300 mb-1">{{ field.label }}</label>
          <textarea v-if="field.type === 'textarea'" v-model="form[field.key]" rows="2"
            class="w-full rounded-xl px-4 py-2.5 text-sm text-white border focus:outline-none resize-none"
            style="background:#0d0d0d;border-color:#2a2a2a" />
          <input v-else :type="field.type" v-model="form[field.key]"
            :min="field.min" :step="field.step"
            class="w-full rounded-xl px-4 py-2.5 text-sm text-white border focus:outline-none"
            style="background:#0d0d0d;border-color:#2a2a2a" />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Imagem</label>
          <input type="file" accept="image/*" @change="onFile" class="text-sm text-zinc-400" />
        </div>

        <div v-if="formError" class="text-sm rounded-xl px-4 py-3"
             style="background:#1a0a10;border:1px solid #e8557a60;color:#f9a8d4">
          {{ formError }}
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="modal = false" class="flex-1 py-3 rounded-xl text-sm font-medium text-zinc-300 border"
                  style="border-color:#2a2a2a;background:#0d0d0d">Cancelar</button>
          <button @click="save" :disabled="saving" class="flex-1 py-3 rounded-xl text-sm font-semibold"
                  :style="saving ? 'background:#2a2a2a;color:#555' : 'background:#e8557a;color:#fff'">
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

const fields = [
  { key: 'name', label: 'Nome *', type: 'text' },
  { key: 'description', label: 'Descrição', type: 'textarea' },
  { key: 'duration', label: 'Duração (min) *', type: 'number', min: '1' },
  { key: 'price', label: 'Preço (R$) *', type: 'number', min: '0', step: '0.01' }
]

function openNew() {
  editing.value = null
  form.value = { name: '', description: '', duration: 60, price: 0 }
  imageFile.value = null; formError.value = ''; modal.value = true
}
function openEdit(s) {
  editing.value = s
  form.value = { name: s.name, description: s.description || '', duration: s.duration, price: s.price }
  imageFile.value = null; formError.value = ''; modal.value = true
}
function onFile(e) { imageFile.value = e.target.files[0] || null }

async function save() {
  if (!form.value.name || !form.value.duration) { formError.value = 'Preencha nome e duração.'; return }
  saving.value = true; formError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (imageFile.value) fd.append('image', imageFile.value)
    const opts = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (editing.value) await api.put(`/services/${editing.value._id}`, fd, opts)
    else await api.post('/services', fd, opts)
    modal.value = false; await loadServices()
  } catch (err) { formError.value = err.response?.data?.error || 'Erro ao salvar.' }
  finally { saving.value = false }
}

async function toggle(s) {
  try { await api.patch(`/services/${s._id}/toggle`); await loadServices() } catch { /* silencioso */ }
}

async function loadServices() {
  loading.value = true
  try { const res = await api.get('/services/all'); services.value = res.data }
  catch { services.value = [] } finally { loading.value = false }
}

onMounted(loadServices)
</script>
