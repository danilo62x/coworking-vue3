<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center" :style="{ backgroundColor: 'var(--tx-body-bg)' }">
    <span class="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
      <IconBase name="layout-grid" :size="40" />
    </span>
    <h1 class="mt-6 text-6xl font-bold text-heading">404</h1>
    <p class="mt-2 text-lg font-semibold text-heading">{{ t('notFound.title') }}</p>
    <p class="mt-2 max-w-md text-sm text-muted">{{ t('notFound.desc') }}</p>
    <div class="mt-8 flex gap-3">
      <RouterLink to="/" class="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600">
        <IconBase name="home" :size="16" /> {{ t('notFound.home') }}
      </RouterLink>
      <RouterLink to="/app" class="inline-flex h-11 items-center gap-2 rounded-lg border border-themed px-5 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800">
        {{ t('notFound.dashboard') }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'

const { t } = useI18n()
</script>
