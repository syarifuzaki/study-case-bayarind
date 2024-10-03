import { createRouter, createWebHistory } from 'vue-router'
import registerRouteGuard from './interceptor'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

registerRouteGuard(router)

export default router
