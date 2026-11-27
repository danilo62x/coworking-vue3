<template>
  <div class="surface-card rounded-2xl border p-5">
    <div class="flex items-end justify-between">
      <div>
        <span class="text-xs text-muted">{{ t('common.from') }}</span>
        <p class="text-2xl font-bold text-heading">
          {{ formatCurrency(space.price, lang) }}
          <span class="text-sm font-normal text-muted">/{{ t(`priceUnits.${space.priceUnit}`) }}</span>
        </p>
      </div>
      <span class="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
        <IconBase name="users" :size="13" /> {{ space.capacity }}
      </span>
    </div>

    <label class="mt-5 block text-sm font-medium text-heading" for="bw-date">{{ t('booking.chooseDate') }}</label>
    <input
      id="bw-date"
      type="date"
      :min="today"
      :value="date ?? ''"
      class="focus-ring mt-1.5 w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body"
      @input="emit('date', ($event.target as HTMLInputElement).value)"
    />

    <template v-if="!perDay">
      <p class="mt-4 text-sm font-medium text-heading">{{ t('booking.chooseTime') }}</p>
      <p v-if="!date" class="mt-2 text-xs text-muted">{{ t('booking.pickDateFirst') }}</p>
      <div v-else class="mt-2 grid grid-cols-4 gap-2">
        <button
          v-for="slot in SLOTS"
          :key="slot"
          type="button"
          :disabled="takenSet.has(slot)"
          :class="[
            'h-10 rounded-lg border text-sm font-medium transition',
            startTime === slot
              ? 'border-brand-500 bg-brand-500 text-white'
              : takenSet.has(slot)
                ? 'cursor-not-allowed border-transparent text-gray-300 line-through dark:text-gray-700'
                : 'border-themed text-body hover:border-brand-300 hover:text-brand-600',
          ]"
          @click="emit('startTime', slot)"
        >
          {{ slot }}
        </button>
      </div>
    </template>

    <label class="mt-4 block text-sm font-medium text-heading">
      {{ perDay ? t('booking.days') : t('booking.hours') }}
    </label>
    <div class="mt-1.5 flex items-center gap-3">
      <button
        type="button"
        class="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-themed text-body disabled:opacity-40"
        :disabled="duration <= 1"
        @click="emit('duration', duration - 1)"
      >
        <IconBase name="minus" :size="16" />
      </button>
      <span class="w-8 text-center text-sm font-semibold text-heading">{{ duration }}</span>
      <button
        type="button"
        class="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-themed text-body"
        @click="emit('duration', duration + 1)"
      >
        <IconBase name="plus" :size="16" />
      </button>
    </div>

    <div class="mt-5 flex items-center justify-between border-t border-themed pt-4">
      <span class="text-sm text-muted">{{ t('booking.estimated') }}</span>
      <span class="text-lg font-bold text-heading">{{ formatCurrency(total, lang) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { ymd } from '@/data/query'
import { formatCurrency } from '@/lib/format'
import type { Space } from '@/data/types'

const props = defineProps<{
  space: Space
  date: string | null
  startTime: string | null
  duration: number
}>()

const emit = defineEmits<{
  (e: 'date', date: string): void
  (e: 'startTime', time: string): void
  (e: 'duration', hours: number): void
}>()

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const today = ymd(new Date())

// Open hours rendered as selectable start slots (08:00–19:00).
const SLOTS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

const perDay = computed(() => props.space.priceUnit === 'dia')
const total = computed(() => props.space.price * props.duration)

// Deterministically mark a few slots as taken so the picker feels alive.
const takenSet = computed(() => {
  if (!props.date) return new Set<string>()
  const seed = props.date.split('-').reduce((a, b) => a + Number(b), props.space.id)
  return new Set(SLOTS.filter((_, i) => (i + seed) % 5 === 0))
})
</script>
