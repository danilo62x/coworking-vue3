<template>
  <ModalBase
    :open="open"
    :title="reservation ? t('reservations.edit') : t('reservations.new')"
    size="md"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('reservations.space') }}</label>
        <select
          v-model="spaceId"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body"
        >
          <option value="">{{ t('common.select') }}</option>
          <option v-for="s in store.spaces" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('reservations.member') }}</label>
        <select
          v-model="memberId"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body"
        >
          <option value="">{{ t('common.select') }}</option>
          <option v-for="m in store.members" :key="m.id" :value="m.id">{{ m.name }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('reservations.start') }}</label>
          <input
            v-model="start"
            type="datetime-local"
            class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('reservations.duration') }}</label>
          <input
            :value="hours"
            type="number"
            :min="1"
            class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body"
            @input="hours = Math.max(1, Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('reservations.status') }}</label>
        <select
          v-model="status"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body"
        >
          <option v-for="s in RESERVATION_STATUSES" :key="s" :value="s">{{ t(`reservationStatuses.${s}`) }}</option>
        </select>
      </div>
    </div>

    <template #footer="{ close }">
      <button
        type="button"
        class="focus-ring rounded-lg border border-themed px-4 py-2 text-sm font-medium text-body"
        @click="close"
      >
        {{ t('common.cancel') }}
      </button>
      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="submit"
      >
        {{ t('common.save') }}
      </button>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { RESERVATION_STATUSES } from '@/data/query'
import type { Reservation, ReservationStatus } from '@/data/types'
import ModalBase from '@/components/ui/ModalBase.vue'

const props = defineProps<{
  open: boolean
  reservation: Reservation | null
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t } = useI18n()
const store = useSpaceStore()
const ui = useUiStore()

const spaceId = ref<number | ''>('')
const memberId = ref<number | ''>('')
const start = ref('')
const hours = ref(2)
const status = ref<ReservationStatus>('confirmada')

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    if (props.reservation) {
      const r = props.reservation
      spaceId.value = r.spaceId
      memberId.value = r.memberId
      start.value = toLocalInput(r.start)
      hours.value = Math.max(1, Math.round((+new Date(r.end) - +new Date(r.start)) / 3_600_000))
      status.value = r.status
    } else {
      spaceId.value = ''
      memberId.value = ''
      start.value = ''
      hours.value = 2
      status.value = 'confirmada'
    }
  }
)

function submit() {
  if (!spaceId.value || !memberId.value || !start.value) {
    ui.notifyError(t('reservations.fillRequired'))
    return
  }
  const space = store.spaces.find((s) => s.id === spaceId.value)!
  const startIso = new Date(start.value).toISOString()
  const endIso = new Date(new Date(start.value).getTime() + hours.value * 3_600_000).toISOString()
  const value = space.priceUnit === 'hora' ? space.price * hours.value : space.price
  if (props.reservation) {
    store.updateReservation(props.reservation.id, {
      spaceId: Number(spaceId.value),
      memberId: Number(memberId.value),
      start: startIso,
      end: endIso,
      status: status.value,
      value,
    })
    ui.notifySuccess(t('reservations.updated'))
  } else {
    store.createReservation({
      spaceId: Number(spaceId.value),
      memberId: Number(memberId.value),
      start: startIso,
      end: endIso,
      status: status.value,
      value,
      checkedIn: false,
      notes: '',
    })
    ui.notifySuccess(t('reservations.created'))
  }
  emit('close')
}
</script>
