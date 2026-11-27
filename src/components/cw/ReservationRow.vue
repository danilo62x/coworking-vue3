<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
    @click="emit('click', reservation)"
  >
    <Avatar :src="member?.avatar" :name="member?.name" size="sm" />
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-heading">{{ space?.name }}</p>
      <p class="truncate text-xs text-muted">
        {{ member?.name }} · {{ formatDate(reservation.start, lang) }} ·
        {{ formatTime(reservation.start, lang) }}–{{ formatTime(reservation.end, lang) }}
      </p>
    </div>
    <div class="flex flex-col items-end gap-1">
      <StatusPill :status="reservation.status" />
      <span class="inline-flex items-center gap-1 text-xs text-muted">
        <IconBase v-if="reservation.checkedIn" name="check-circle" :size="12" class="text-success-500" />
        {{ formatCurrency(reservation.value, lang) }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import Avatar from '@/components/ui/Avatar.vue'
import StatusPill from './StatusPill.vue'
import { formatTime, formatDate, formatCurrency } from '@/lib/format'
import { memberById, spaceById } from '@/data/query'
import { useSpaceStore } from '@/stores/space'
import type { Reservation } from '@/data/types'

const props = defineProps<{ reservation: Reservation }>()
const emit = defineEmits<{ (e: 'click', r: Reservation): void }>()

const { t: _t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()
const space = computed(() => spaceById(store.spaces, props.reservation.spaceId))
const member = computed(() => memberById(store.members, props.reservation.memberId))
</script>
