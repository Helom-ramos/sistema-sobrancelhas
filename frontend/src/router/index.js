import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/public/HomeView.vue')
  },
  {
    path: '/agendar',
    name: 'booking',
    component: () => import('@/views/public/BookingView.vue')
  },
  {
    path: '/cancelar/:id',
    name: 'cancelar',
    component: () => import('@/views/public/CancelView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/DashboardView.vue')
      },
      {
        path: 'agenda',
        name: 'agenda',
        component: () => import('@/views/admin/AgendaView.vue')
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/views/admin/ClientesView.vue')
      },
      {
        path: 'servicos',
        name: 'servicos',
        component: () => import('@/views/admin/ServicosView.vue')
      },
      {
        path: 'configuracoes',
        name: 'configuracoes',
        component: () => import('@/views/admin/ConfigView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
