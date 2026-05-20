<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar desktop -->
    <aside class="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 fixed inset-y-0 left-0">
      <div class="p-5 border-b border-gray-100">
        <p class="text-xs font-semibold text-brand-600 uppercase tracking-wide">Studio</p>
        <p class="font-bold text-gray-900 text-lg leading-tight">Sobrancelhas</p>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="$route.path.startsWith(link.to) ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'"
        >
          <span>{{ link.icon }}</span>
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="p-3 border-t border-gray-100">
        <button @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span>🚪</span> Sair
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 md:ml-56 flex flex-col min-h-screen">
      <!-- Mobile header -->
      <header class="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <p class="font-bold text-gray-900">Studio de Sobrancelhas</p>
        <button @click="mobileOpen = !mobileOpen" class="p-2 rounded-lg hover:bg-gray-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </header>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="md:hidden fixed inset-0 z-20 bg-black/50" @click="mobileOpen = false">
        <div class="bg-white w-64 h-full" @click.stop>
          <div class="p-5 border-b border-gray-100">
            <p class="font-bold text-gray-900">Studio de Sobrancelhas</p>
          </div>
          <nav class="p-3 space-y-1">
            <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
              :class="$route.path.startsWith(link.to) ? 'bg-brand-50 text-brand-700' : 'text-gray-600'"
            >
              <span>{{ link.icon }}</span> {{ link.label }}
            </RouterLink>
          </nav>
          <div class="p-3 border-t border-gray-100">
            <button @click="logout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500">
              <span>🚪</span> Sair
            </button>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()
const mobileOpen = ref(false)

const navLinks = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/agenda', icon: '📅', label: 'Agenda' },
  { to: '/admin/clientes', icon: '👥', label: 'Clientes' },
  { to: '/admin/servicos', icon: '💆', label: 'Serviços' },
  { to: '/admin/configuracoes', icon: '⚙️', label: 'Configurações' }
]

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
