import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

function registerRouteGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next({ path: '/auth/login' })
    }

    if (to.meta.guestOnly && isAuthenticated) {
      return next({ path: '/' })
    }

    next()
  })
}

export default registerRouteGuard
