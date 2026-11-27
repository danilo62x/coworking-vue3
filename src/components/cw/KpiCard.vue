<template>
  <StatsCard
    :title="title"
    :value="value"
    :icon="icon"
    :accent="accent"
    :trend="trend"
    :trend-value="trendValue"
  />
</template>

<script setup lang="ts">
import StatsCard from '@/components/ui/StatsCard.vue'

type Accent = 'brand' | 'success' | 'warning' | 'error' | 'info'

withDefaults(
  defineProps<{
    title: string
    value: string | number
    icon: string
    accent?: Accent
    trend?: 'up' | 'down'
    trendValue?: string
  }>(),
  { accent: 'brand' }
)
</script>
