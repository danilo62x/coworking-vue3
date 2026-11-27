<template>
  <div>
    <PageHeader :title="t('map.title')" :subtitle="t('map.subtitle')">
      <template #action>
        <FilterSelect icon="layout-grid" :model-value="typeFilter" @update:model-value="(v) => (typeFilter = v as SpaceType | 'all')">
          <option value="all">{{ t('map.allTypes') }}</option>
          <option v-for="tp in SPACE_TYPES_ORDER" :key="tp" :value="tp">{{ t(`spaceTypes.${tp}`) }}</option>
        </FilterSelect>
      </template>
    </PageHeader>

    <div class="surface-card mb-5 rounded-xl border p-4">
      <StatusLegend :counts="counts" />
    </div>

    <div class="space-y-6">
      <section v-for="[floor, list] in floors" :key="floor" class="surface-card rounded-2xl border p-5">
        <div class="mb-4 flex items-center gap-2">
          <IconBase name="building" :size="18" class="text-brand-500" />
          <h3 class="text-base font-semibold text-heading">{{ floor }}</h3>
          <span class="text-xs text-muted">· {{ t('map.spacesCount', { count: list.length }) }}</span>
        </div>
        <div class="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          <SpaceStatusTile v-for="space in list" :key="space.id" :space="space" @click="selected = space" />
        </div>
      </section>
    </div>

    <ModalBase
      :open="selected !== null"
      :title="selected?.name"
      :subtitle="selected ? t(`spaceTypes.${selected.type}`) : undefined"
      size="sm"
      @close="selected = null"
    >
      <div v-if="selected" class="space-y-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">{{ t('map.currentStatus') }}</span>
          <Badge :color="SPACE_STATUS_META[selected.status].badge" dot>{{ t(`spaceStatuses.${selected.status}`) }}</Badge>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">{{ t('spaces.capacity') }}</span>
          <span class="font-medium text-heading">{{ selected.capacity }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">{{ t('common.price') }}</span>
          <span class="font-medium text-heading">
            {{ formatCurrency(selected.price, lang) }}/{{ t(`priceUnits.${selected.priceUnit}`) }}
          </span>
        </div>

        <div class="grid grid-cols-1 gap-2 pt-2">
          <button
            type="button"
            :disabled="selected.status === 'reservado'"
            class="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
            @click="act('reservado', 'map.reservedToast')"
          >
            <IconBase name="calendar" :size="16" /> {{ t('map.actionReserve') }}
          </button>
          <button
            type="button"
            :disabled="selected.status === 'ocupado'"
            class="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-success-600 disabled:opacity-40"
            @click="act('ocupado', 'map.checkedInToast')"
          >
            <IconBase name="check-circle" :size="16" /> {{ t('map.actionCheckIn') }}
          </button>
          <button
            type="button"
            :disabled="selected.status === 'livre'"
            class="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-themed px-4 py-2.5 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
            @click="act('livre', 'map.releasedToast')"
          >
            <IconBase name="door-open" :size="16" /> {{ t('map.actionRelease') }}
          </button>
          <button
            type="button"
            class="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-themed px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-gray-50 dark:hover:bg-gray-800"
            @click="act('manutencao', 'map.maintenanceToast')"
          >
            <IconBase name="settings" :size="16" /> {{ t('map.actionMaintenance') }}
          </button>
        </div>
      </div>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { statusCounts, spacesByType, SPACE_TYPES_ORDER } from '@/data/query'
import { formatCurrency } from '@/lib/format'
import type { Space, SpaceType } from '@/data/types'
import PageHeader from '@/components/app/PageHeader.vue'
import SpaceStatusTile from '@/components/cw/SpaceStatusTile.vue'
import StatusLegend from '@/components/cw/StatusLegend.vue'
import FilterSelect from '@/components/cw/FilterSelect.vue'
import ModalBase from '@/components/ui/ModalBase.vue'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import { SPACE_STATUS_META } from '@/components/cw/spaceStatusMeta'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()
const ui = useUiStore()

const typeFilter = ref<SpaceType | 'all'>('all')
const selected = ref<Space | null>(null)

const counts = computed(() => statusCounts(store.spaces))

const floors = computed<[string, Space[]][]>(() => {
  const visible = spacesByType(store.spaces, typeFilter.value)
  const map = new Map<string, Space[]>()
  for (const s of visible) {
    const arr = map.get(s.floor)
    if (arr) arr.push(s)
    else map.set(s.floor, [s])
  }
  return [...map.entries()]
})

function act(status: Space['status'], messageKey: string) {
  if (!selected.value) return
  store.setSpaceStatus(selected.value.id, status)
  ui.notifySuccess(t(messageKey, { name: selected.value.name }))
  selected.value = { ...selected.value, status }
}
</script>
