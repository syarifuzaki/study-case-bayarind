<script setup lang="ts">
import AppMenu from './AppMenu.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="layout-sidebar">
    <div class="flex flex-col items-center p-4">
      <Avatar
        label="B"
        class="mb-3"
        size="xlarge"
        style="background-color: #ece9fc; color: #2a1261"
        shape="circle"
      />
      <div class="text-2xl font-semibold">
        {{ authStore.user?.name }}
      </div>
      <div class="text-base font-medium text-primary-500">
        {{ authStore.user?.email }}
      </div>
    </div>
    <Divider />
    <app-menu></app-menu>
  </div>
</template>

<style lang="scss" scoped></style>
