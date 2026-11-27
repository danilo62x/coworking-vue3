<template>
  <ul class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
    <li v-for="status in SPACE_STATUSES" :key="status" class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full" :class="SPACE_STATUS_META[status].dot" />
      <span class="text-body">{{ t(`spaceStatuses.${status}`) }}</span>
      <span v-if="counts" class="text-xs font-semibold text-muted">{{ counts[status] }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SPACE_STATUS_META } from './spaceStatusMeta'
import { SPACE_STATUSES } from '@/data/query'
import type { SpaceStatus } from '@/data/types'

defineProps<{
  counts?: Record<SpaceStatus, number>
}>()

const { t } = useI18n()
</script>
