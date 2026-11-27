<template>
  <Badge :color="COLOR[status]" dot>{{ t(`reservationStatuses.${status}`) }}</Badge>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/Badge.vue'
import type { ReservationStatus } from '@/data/types'

defineProps<{ status: ReservationStatus }>()

const { t } = useI18n()

const COLOR: Record<ReservationStatus, 'brand' | 'success' | 'warning' | 'error'> = {
  confirmada: 'brand',
  'em-uso': 'warning',
  concluida: 'success',
  cancelada: 'error',
}
</script>
