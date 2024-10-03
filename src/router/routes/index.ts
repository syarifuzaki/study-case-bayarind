import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/employee',
        name: 'employee',
        component: () => import('@/views/employee/EmployeeIndex.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/auth/AuthLogin.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue')
  }
]

export default routes
