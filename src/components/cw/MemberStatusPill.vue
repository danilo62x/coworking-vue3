<template>
  <Badge :color="STATUS_COLOR[status]" dot>{{ t(`memberStatuses.${status}`) }}</Badge>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/Badge.vue'
import type { MemberStatus } from '@/data/types'

defineProps<{ status: MemberStatus }>()

const { t } = useI18n()

const STATUS_COLOR: Record<MemberStatus, 'success' | 'error' | 'warning'> = {
  ativo: 'success',
  inadimplente: 'error',
  pausado: 'warning',
}
</script>
