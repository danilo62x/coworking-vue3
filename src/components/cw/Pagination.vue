<template>
  <div v-if="total !== 0" class="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-muted">
    <span>{{ t('common.pageOf', { page, count: pageCount, total }) }}</span>
    <div class="flex items-center gap-1">
      <button
        type="button"
        :disabled="page <= 1"
        class="focus-ring inline-flex items-center gap-1 rounded-lg border border-themed px-3 py-1.5 disabled:opacity-40"
        @click="emit('page', page - 1)"
      >
        <IconBase name="chevron-left" :size="14" /> {{ t('common.previous') }}
      </button>
      <button
        type="button"
        :disabled="page >= pageCount"
        class="focus-ring inline-flex items-center gap-1 rounded-lg border border-themed px-3 py-1.5 disabled:opacity-40"
        @click="emit('page', page + 1)"
      >
        {{ t('common.next') }} <IconBase name="chevron-right" :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'

defineProps<{
  page: number
  pageCount: number
  total: number
}>()

const emit = defineEmits<{ (e: 'page', page: number): void }>()

const { t } = useI18n()
</script>
