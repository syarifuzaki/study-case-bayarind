<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import FloatingConfigurator from '@/components/FloatingConfigurator.vue'
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { type FormLogin } from '@/types'

// Setup
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const form: FormLogin = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const checked = ref(false)

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Invalid email address', email)
  },
  password: {
    required: helpers.withMessage('Password is required', required)
  }
}

const v$ = useVuelidate(rules, form)

const login = async () => {
  try {
    isLoading.value = true
    await authStore.login(form.email, form.password)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Login Successfully',
      life: 3000
    })

    if (route.query.redirect) {
      router.push({
        path: route.query.redirect as string
      })
    } else {
      router.push({
        name: 'dashboard'
      })
    }
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: `Error ${err.status}`,
      detail: err?.message,
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <FloatingConfigurator />
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
        "
      >
        <div
          class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
          style="border-radius: 53px"
        >
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
              Welcome!
            </div>
            <span class="text-muted-color font-medium"
              >Enter your email and password to log in.</span
            >
          </div>

          <form>
            <div class="flex flex-col mb-4">
              <label
                for="email1"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                >Email</label
              >
              <InputText
                id="email1"
                type="text"
                placeholder="Email address"
                class="w-full md:w-[30rem] mb-2"
                v-model="form.email"
                :invalid="v$.email.$dirty && v$.email.$invalid"
                @blur="v$.email.$touch"
              />
              <small v-if="v$.email.$dirty && v$.email.$invalid" class="text-red-500">{{
                v$.email?.$silentErrors[0]?.$message
              }}</small>
            </div>

            <div class="flex flex-col mb-4">
              <label
                for="password1"
                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                >Password</label
              >
              <Password
                id="password1"
                v-model="form.password"
                placeholder="Password"
                :toggleMask="true"
                class="mb-2"
                fluid
                :feedback="false"
                :invalid="v$.password.$dirty && v$.password.$invalid"
                @blur="v$.password.$touch"
              ></Password>
              <small v-if="v$.password.$dirty && v$.password.$invalid" class="text-red-500">{{
                v$.password?.$silentErrors[0]?.$message
              }}</small>
            </div>

            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
                >Forgot password?</span
              >
            </div>
            <Button
              label="Log In"
              class="w-full"
              type="submit"
              @click.prevent="login"
              :disabled="v$.$invalid || isLoading"
              :loading="isLoading"
            ></Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
