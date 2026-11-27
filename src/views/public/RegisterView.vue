<template>
  <AuthShell :title="t('auth.registerTitle')" :subtitle="t('auth.registerSubtitle')">
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-2 block text-sm font-medium text-heading" for="name">{{ t('auth.name') }}</label>
        <div class="relative">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconBase name="user" :size="18" />
          </span>
          <input id="name" v-model="name" required :class="field" />
        </div>
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-heading" for="email">{{ t('auth.email') }}</label>
        <div class="relative">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconBase name="mail" :size="18" />
          </span>
          <input id="email" v-model="email" type="email" required :class="field" />
        </div>
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-heading" for="password">{{ t('auth.password') }}</label>
        <div class="relative">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconBase name="lock" :size="18" />
          </span>
          <input id="password" v-model="password" type="password" required :class="field" />
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {{ t('auth.registering') }}
        </span>
        <span v-else>{{ t('auth.registerCta') }}</span>
      </button>
    </form>

    <template #footer>
      {{ t('auth.haveAccount') }}
      <RouterLink to="/login" class="font-medium text-brand-500 hover:text-brand-600">{{ t('auth.loginCta') }}</RouterLink>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import IconBase from '@/components/ui/IconBase.vue'
import AuthShell from '@/components/layout/AuthShell.vue'

const { t } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const field =
  'h-11 w-full rounded-lg border border-themed bg-gray-50 pl-10 pr-3 text-sm text-body outline-none focus:border-brand-300 focus-ring dark:bg-gray-900'

async function handleSubmit() {
  loading.value = true
  const ok = await auth.register(name.value, email.value, password.value)
  loading.value = false
  if (ok) {
    ui.notifySuccess(t('auth.registerSuccess'))
    router.push('/app')
  }
}
</script>
