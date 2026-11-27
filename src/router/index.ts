import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public site (navbar + footer)
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/public/HomeView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/espacos',
      name: 'spaces',
      component: () => import('@/views/public/SpacesView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/espacos/:slug',
      name: 'space-detail',
      component: () => import('@/views/public/SpaceDetailView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/planos',
      name: 'plans',
      component: () => import('@/views/public/PlansView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('@/views/public/AboutView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/contato',
      name: 'contact',
      component: () => import('@/views/public/ContactView.vue'),
      meta: { layout: 'public' },
    },

    // Auth (blank layout)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/LoginView.vue'),
      meta: { layout: 'blank' },
    },
    {
      path: '/registro',
      name: 'register',
      component: () => import('@/views/public/RegisterView.vue'),
      meta: { layout: 'blank' },
    },

    // App (guarded, sidebar layout)
    {
      path: '/app',
      name: 'dashboard',
      component: () => import('@/views/app/DashboardView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/reservas',
      name: 'reservations',
      component: () => import('@/views/app/ReservationsView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/mapa',
      name: 'space-map',
      component: () => import('@/views/app/SpaceMapView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/membros',
      name: 'members',
      component: () => import('@/views/app/MembersView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/planos',
      name: 'plans-admin',
      component: () => import('@/views/app/PlansAdminView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/financeiro',
      name: 'finance',
      component: () => import('@/views/app/FinanceView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/configuracoes',
      name: 'settings',
      component: () => import('@/views/app/SettingsView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },

    // 404 (blank layout)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/app/NotFoundView.vue'),
      meta: { layout: 'blank' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
