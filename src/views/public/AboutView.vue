<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <h1 class="text-3xl font-bold text-heading sm:text-4xl">{{ t('about.title') }}</h1>
        <p class="mt-5 text-lg text-muted">{{ t('about.lead') }}</p>
        <p class="mt-4 text-body">{{ t('about.body') }}</p>
      </div>
      <img :src="spaceImage('about', 1000, 700)" alt="" class="aspect-[4/3] w-full rounded-2xl object-cover shadow-theme-lg" />
    </div>

    <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="v in VALUES" :key="v.key" class="surface-card rounded-2xl border p-6">
        <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
          <IconBase :name="v.icon" :size="22" />
        </span>
        <h3 class="mt-4 font-semibold text-heading">{{ t(`about.values.${v.key}.title`) }}</h3>
        <p class="mt-2 text-sm text-muted">{{ t(`about.values.${v.key}.desc`) }}</p>
      </div>
    </div>

    <div class="mt-16">
      <h2 class="text-center text-2xl font-bold text-heading">{{ t('about.teamTitle') }}</h2>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div v-for="m in TEAM" :key="m.seed" class="surface-card rounded-2xl border p-6 text-center">
          <img :src="av(m.seed)" alt="" class="mx-auto h-24 w-24 rounded-full object-cover" />
          <h3 class="mt-4 font-semibold text-heading">{{ m.name }}</h3>
          <p class="text-sm text-muted">{{ t(`about.roles.${m.role}`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { spaceImage, av } from '@/data/mock'
import IconBase from '@/components/ui/IconBase.vue'

const { t } = useI18n()

const VALUES = [
  { icon: 'users', key: 'community' },
  { icon: 'zap', key: 'productivity' },
  { icon: 'heart', key: 'wellbeing' },
  { icon: 'shield-check', key: 'security' },
]

const TEAM = [
  { name: 'Marina Costa', role: 'founder', seed: 'a1' },
  { name: 'Rafael Andrade', role: 'community', seed: 'a2' },
  { name: 'Diego Martins', role: 'operations', seed: 'a3' },
]
</script>
