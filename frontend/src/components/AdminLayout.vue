<template>
  <div class="min-h-screen flex" style="background:#0d0d0d">
    <!-- Sidebar desktop -->
    <aside class="hidden md:flex flex-col w-56 fixed inset-y-0 left-0 border-r"
           style="background:#111111;border-color:#222222">
      <div class="p-4 border-b flex items-center gap-3" style="border-color:#222222">
        <img src="/logo.png" alt="DC" class="w-10 h-10 rounded-full object-cover shrink-0" />
        <div>
          <p class="font-bold text-white text-xs leading-tight">DÉBORAH CRISTHIANY</p>
          <p class="text-[10px] tracking-widest text-zinc-500 uppercase">Designer de Sobrancelhas</p>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :style="$route.path.startsWith(link.to)
            ? 'background:#1a0a10;color:#e8557a'
            : 'color:#a1a1aa'"
          @mouseover="e => { if(!$route.path.startsWith(link.to)) e.currentTarget.style.background='#1a1a1a' }"
          @mouseleave="e => { if(!$route.path.startsWith(link.to)) e.currentTarget.style.background='transparent' }"
        >
          <span>{{ link.icon }}</span>
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="p-3 border-t" style="border-color:#222222">
        <button @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors"
        >
          <span>🚪</span> Sair
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 md:ml-56 flex flex-col min-h-screen">
      <!-- Mobile header -->
      <header class="md:hidden px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b"
              style="background:#111111;border-color:#222222">
        <p class="font-bold text-white text-sm">DÉBORAH CRISTHIANY</p>
        <button @click="mobileOpen = !mobileOpen" class="p-2 rounded-lg" style="background:#1a1a1a">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </header>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="md:hidden fixed inset-0 z-20" style="background:rgba(0,0,0,0.8)" @click="mobileOpen = false">
        <div class="w-64 h-full border-r" style="background:#111111;border-color:#222222" @click.stop>
          <div class="p-4 border-b flex items-center gap-3" style="border-color:#222222">
            <img src="/logo.png" alt="DC" class="w-8 h-8 rounded-full object-cover" />
            <p class="font-bold text-white text-sm">DÉBORAH CRISTHIANY</p>
          </div>
          <nav class="p-3 space-y-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
              :style="$route.path.startsWith(link.to) ? 'color:#e8557a;background:#1a0a10' : 'color:#a1a1aa'"
            >
              <span>{{ link.icon }}</span> {{ link.label }}
            </RouterLink>
          </nav>
          <div class="p-3 border-t" style="border-color:#222222">
            <button @click="logout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500">
              <span>🚪</span> Sair
            </button>
          </div>
        </div>
      </div>

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
  { to: '/admin/horarios', icon: '🕐', label: 'Horários' },
  { to: '/admin/configuracoes', icon: '⚙️', label: 'Configurações' }
]

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
