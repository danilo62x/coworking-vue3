<template>
  <div class="surface-card mb-5 flex flex-wrap items-center gap-3 rounded-xl border p-3">
    <div v-if="hasSearch" class="relative min-w-[200px] flex-1">
      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <IconBase name="search" :size="16" />
      </span>
      <input
        :value="search ?? ''"
        :placeholder="searchPlaceholder ?? t('common.search')"
        class="focus-ring w-full rounded-lg border border-themed bg-transparent py-2 pl-9 pr-3 text-sm text-body"
        @input="emit('search', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <slot />
    <button
      v-if="hasClear"
      type="button"
      class="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-themed px-3 py-2 text-sm font-medium text-muted transition hover:text-body"
      @click="emit('clear')"
    >
      <IconBase name="refresh-cw" :size="15" /> {{ t('common.clear') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'

withDefaults(
  defineProps<{
    search?: string
    searchPlaceholder?: string
    hasSearch?: boolean
    hasClear?: boolean
  }>(),
  { hasSearch: true, hasClear: true }
)

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'clear'): void
}>()

const { t } = useI18n()
</script>
