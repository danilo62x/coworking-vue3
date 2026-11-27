<template>
  <div>
    <PageHeader :title="t('reservations.title')" :subtitle="t('reservations.subtitle')">
      <template #action>
        <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
          @click="openCreate"
        >
          <IconBase name="plus" :size="16" /> {{ t('reservations.new') }}
        </button>
      </template>
    </PageHeader>

    <FilterBar
      :search="store.reservationFilters.query"
      :search-placeholder="t('reservations.searchPlaceholder')"
      @search="(v) => store.setReservationFilters({ query: v })"
      @clear="store.setReservationFilters({ spaceId: 'all', status: 'all', from: '', to: '', query: '' })"
    >
      <FilterSelect
        icon="layout-grid"
        :model-value="String(store.reservationFilters.spaceId ?? 'all')"
        @update:model-value="(v) => store.setReservationFilters({ spaceId: v === 'all' ? 'all' : Number(v) })"
      >
        <option value="all">{{ t('reservations.allSpaces') }}</option>
        <option v-for="s in store.spaces" :key="s.id" :value="s.id">{{ s.name }}</option>
      </FilterSelect>
      <FilterSelect
        icon="filter"
        :model-value="String(store.reservationFilters.status ?? 'all')"
        @update:model-value="(v) => store.setReservationFilters({ status: v === 'all' ? 'all' : (v as ReservationStatus) })"
      >
        <option value="all">{{ t('reservations.allStatuses') }}</option>
        <option v-for="s in RESERVATION_STATUSES" :key="s" :value="s">{{ t(`reservationStatuses.${s}`) }}</option>
      </FilterSelect>
    </FilterBar>

    <DataTable :columns="columns" :data="filtered" :page-size="10" :searchable="false" />

    <ReservationModal :open="modalOpen" :reservation="editing" @close="modalOpen = false" />

    <Drawer
      :open="detail !== null"
      :title="detailSpace?.name"
      :subtitle="detail ? formatDate(detail.start, lang) : undefined"
      @close="detail = null"
    >
      <div v-if="detail" class="space-y-5 text-sm">
        <div class="flex items-center gap-3">
          <Avatar :src="detailMember?.avatar" :name="detailMember?.name" size="lg" />
          <div>
            <p class="font-semibold text-heading">{{ detailMember?.name }}</p>
            <p class="text-muted">{{ detailMember?.company }}</p>
          </div>
        </div>
        <dl class="space-y-3">
          <div class="flex justify-between"><dt class="text-muted">{{ t('reservations.when') }}</dt><dd class="font-medium text-heading">{{ formatTime(detail.start, lang) }}–{{ formatTime(detail.end, lang) }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">{{ t('reservations.status') }}</dt><dd><StatusPill :status="detail.status" /></dd></div>
          <div class="flex justify-between"><dt class="text-muted">{{ t('reservations.value') }}</dt><dd class="font-semibold text-heading">{{ formatCurrency(detail.value, lang) }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">{{ t('reservations.checkInStatus') }}</dt><dd class="font-medium text-heading">{{ detail.checkedIn ? t('common.yes') : t('common.no') }}</dd></div>
        </dl>
      </div>

      <template v-if="detail" #footer>
        <div class="flex w-full items-center justify-between gap-2">
          <button
            v-if="!detail.checkedIn && detail.status !== 'cancelada' && detail.status !== 'concluida'"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-success-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-success-600"
            @click="doCheckIn"
          >
            <IconBase name="check-circle" :size="16" /> {{ t('reservations.checkIn') }}
          </button>
          <button
            v-if="detail.status !== 'cancelada'"
            type="button"
            class="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-themed px-3 py-2 text-sm font-medium text-error-600 transition hover:bg-error-50 dark:hover:bg-error-500/10"
            @click="doCancel"
          >
            {{ t('reservations.cancel') }}
          </button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { filterReservations, memberById, spaceById, RESERVATION_STATUSES } from '@/data/query'
import { formatCurrency, formatDate, formatTime } from '@/lib/format'
import type { Reservation, ReservationStatus } from '@/data/types'
import PageHeader from '@/components/app/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import IconBase from '@/components/ui/IconBase.vue'
import StatusPill from '@/components/cw/StatusPill.vue'
import Avatar from '@/components/ui/Avatar.vue'
import FilterBar from '@/components/cw/FilterBar.vue'
import FilterSelect from '@/components/cw/FilterSelect.vue'
import ReservationModal from '@/components/cw/ReservationModal.vue'
import Drawer from '@/components/cw/Drawer.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()
const ui = useUiStore()

const modalOpen = ref(false)
const editing = ref<Reservation | null>(null)
const detail = ref<Reservation | null>(null)

const filtered = computed(() =>
  filterReservations(store.reservations, store.reservationFilters, store.spaces, store.members)
)

const detailSpace = computed(() => (detail.value ? spaceById(store.spaces, detail.value.spaceId) : undefined))
const detailMember = computed(() => (detail.value ? memberById(store.members, detail.value.memberId) : undefined))

const col = createColumnHelper<Reservation>()

const columns = computed<ColumnDef<Reservation, any>[]>(() => [
  col.accessor('spaceId', {
    header: () => t('reservations.space'),
    cell: (c) => {
      const space = spaceById(store.spaces, c.getValue())
      return h('span', { class: 'font-medium text-heading' }, space?.name ?? '')
    },
  }),
  col.accessor('memberId', {
    header: () => t('reservations.member'),
    cell: (c) => {
      const member = memberById(store.members, c.getValue())
      return h('span', { class: 'flex items-center gap-2' }, [
        h(Avatar, { src: member?.avatar, name: member?.name, size: 'xs' }),
        member?.name ?? '',
      ])
    },
  }),
  col.accessor('start', {
    header: () => t('reservations.when'),
    cell: (c) =>
      h(
        'span',
        { class: 'whitespace-nowrap' },
        `${formatDate(c.getValue(), lang.value)} · ${formatTime(c.getValue(), lang.value)}–${formatTime(c.row.original.end, lang.value)}`
      ),
  }),
  col.accessor('value', {
    header: () => t('reservations.value'),
    cell: (c) => formatCurrency(c.getValue(), lang.value),
  }),
  col.accessor('status', {
    header: () => t('reservations.status'),
    cell: (c) => h(StatusPill, { status: c.getValue() }),
  }),
  col.display({
    id: 'actions',
    header: () => '',
    cell: (c) =>
      h('div', { class: 'flex items-center justify-end gap-1' }, [
        h(
          'button',
          {
            type: 'button',
            class: 'rounded-lg p-1.5 text-muted hover:bg-gray-100 dark:hover:bg-gray-800',
            title: t('common.viewDetails'),
            onClick: () => (detail.value = c.row.original),
          },
          h(IconBase, { name: 'eye', size: 16 })
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'rounded-lg p-1.5 text-muted hover:bg-gray-100 dark:hover:bg-gray-800',
            title: t('common.edit'),
            onClick: () => openEdit(c.row.original),
          },
          h(IconBase, { name: 'edit', size: 16 })
        ),
      ]),
  }),
])

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(r: Reservation) {
  editing.value = r
  modalOpen.value = true
}

function doCheckIn() {
  if (!detail.value) return
  store.checkIn(detail.value.id)
  ui.notifySuccess(t('reservations.checkedIn'))
  detail.value = { ...detail.value, checkedIn: true, status: 'em-uso' }
}

function doCancel() {
  if (!detail.value) return
  store.setReservationStatus(detail.value.id, 'cancelada')
  ui.notifySuccess(t('reservations.cancelled'))
  detail.value = { ...detail.value, status: 'cancelada' }
}
</script>
