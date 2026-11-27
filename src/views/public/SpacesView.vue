<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-2xl">
      <h1 class="text-3xl font-bold text-heading">{{ t('spaces.title') }}</h1>
      <p class="mt-3 text-muted">{{ t('spaces.subtitle') }}</p>
    </div>

    <div class="mt-8 flex flex-wrap gap-2">
      <button
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition',
          filter === 'all' ? 'bg-brand-500 text-white' : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800',
        ]"
        @click="filter = 'all'"
      >
        <IconBase name="layout-grid" :size="15" /> {{ t('common.all') }}
      </button>
      <button
        v-for="tp in SPACE_TYPES_ORDER"
        :key="tp"
        type="button"
        :class="[
          'rounded-full px-4 py-2 text-sm font-medium transition',
          filter === tp ? 'bg-brand-500 text-white' : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800',
        ]"
        @click="filter = tp"
      >
        {{ t(`spaceTypes.${tp}`) }}
      </button>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <SpaceCard v-for="info in visible" :key="info.type" :info="info" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SPACE_TYPES } from '@/data/mock'
import { SPACE_TYPES_ORDER } from '@/data/query'
import type { SpaceType } from '@/data/types'
import SpaceCard from '@/components/cw/SpaceCard.vue'
import IconBase from '@/components/ui/IconBase.vue'

const { t } = useI18n()
const filter = ref<SpaceType | 'all'>('all')

const visible = computed(() =>
  filter.value === 'all' ? SPACE_TYPES : SPACE_TYPES.filter((s) => s.type === filter.value)
)
</script>
