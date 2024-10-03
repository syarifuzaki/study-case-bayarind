<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppMenuItem from './AppMenuItem.vue'
import { useRouter } from 'vue-router'
import { type MenuItem } from '@/types'

const authStore = useAuthStore()
const router = useRouter()

const model = ref<MenuItem[]>([
  {
    label: 'Menu',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
      { label: 'Employee', icon: 'pi pi-fw pi-users', to: '/employee' }
    ]
  }
])

const logout = async () => {
  try {
    await authStore.logout()
    router.push({
      name: 'login'
    })
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <ul class="layout-menu flex h-[calc(100%-200px)] justify-between flex-col">
    <template v-for="(item, i) in model" :key="item.label">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
    <Button
      label="Log Out"
      icon="pi pi-power-off"
      severity="danger"
      class="w-full"
      @click.prevent="logout"
    />
  </ul>
</template>

<style lang="scss" scoped></style>
