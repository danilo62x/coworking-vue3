<template>
  <div>
    <PageHeader :title="t('dashboard.title')" :subtitle="t('dashboard.welcome', { name: auth.user?.name ?? '' })" />

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard :title="t('dashboard.kpis.occupancy')" :value="`${m.occupancy}%`" icon="layout-grid" accent="brand" trend="up" trend-value="5%" />
      <KpiCard :title="t('dashboard.kpis.activeMembers')" :value="m.activeMembers" icon="users" accent="info" trend="up" trend-value="3%" />
      <KpiCard :title="t('dashboard.kpis.todayReservations')" :value="m.todayReservations" icon="calendar" accent="warning" />
      <KpiCard :title="t('dashboard.kpis.revenue')" :value="formatCurrency(m.revenue, lang)" icon="dollar" accent="success" trend="up" trend-value="9%" />
    </div>

    <div class="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div class="surface-card rounded-2xl border p-5 xl:col-span-2">
        <h3 class="text-base font-semibold text-heading">{{ t('dashboard.occupancyTitle') }}</h3>
        <p class="text-sm text-muted">{{ t('dashboard.occupancySubtitle') }}</p>
        <div class="mt-4">
          <ApexChart
            type="area"
            :height="300"
            :series="[{ name: t('dashboard.legendOccupancy'), data: OCCUPANCY_SERIES.occupancy }]"
            :options="occupancyArea"
          />
        </div>
      </div>

      <div class="surface-card rounded-2xl border p-5">
        <h3 class="text-base font-semibold text-heading">{{ t('dashboard.byTypeTitle') }}</h3>
        <div class="mt-4">
          <ApexChart type="donut" :height="300" :series="byType.map((x) => x.count)" :options="typeDonut" />
        </div>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div class="surface-card rounded-2xl border p-5 xl:col-span-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-heading">{{ t('dashboard.todayTitle') }}</h3>
          <RouterLink to="/app/reservas" class="text-sm font-medium text-brand-600 hover:text-brand-700">{{ t('common.viewAll') }}</RouterLink>
        </div>
        <EmptyState v-if="today.length === 0" icon="calendar" :title="t('dashboard.noToday')" />
        <ul v-else class="mt-2 divide-y divide-themed">
          <li v-for="r in today" :key="r.id">
            <ReservationRow :reservation="r" />
          </li>
        </ul>
      </div>

      <div class="surface-card rounded-2xl border p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-heading">{{ t('dashboard.mostUsedTitle') }}</h3>
          <RouterLink to="/app/mapa" class="text-sm font-medium text-brand-600 hover:text-brand-700">{{ t('common.viewAll') }}</RouterLink>
        </div>
        <ul class="mt-4 space-y-3">
          <li v-for="(x, i) in mostUsed" :key="x.space.id" class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              {{ i + 1 }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-heading">{{ x.space.name }}</p>
              <p class="text-xs text-muted">{{ t(`spaceTypes.${x.space.type}`) }}</p>
            </div>
            <span class="text-sm font-semibold text-brand-600 dark:text-brand-400">
              {{ x.count }} {{ t('dashboard.usesLabel') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApexOptions } from 'apexcharts'
import { useAuthStore } from '@/stores/auth'
import { useSpaceStore } from '@/stores/space'
import { OCCUPANCY_SERIES } from '@/data/mock'
import { computeMetrics, countByType, mostUsedSpaces, todayReservations } from '@/data/query'
import { formatCurrency } from '@/lib/format'
import PageHeader from '@/components/app/PageHeader.vue'
import KpiCard from '@/components/cw/KpiCard.vue'
import ApexChart from '@/components/ui/ApexChart.vue'
import ReservationRow from '@/components/cw/ReservationRow.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const auth = useAuthStore()
const store = useSpaceStore()

const m = computed(() => computeMetrics(store.spaces, store.reservations, store.members, store.invoices))
const today = computed(() => todayReservations(store.reservations))
const mostUsed = computed(() => mostUsedSpaces(store.reservations, store.spaces, 5))
const byType = computed(() => countByType(store.spaces))

const occupancyArea = computed<ApexOptions>(() => ({
  chart: { type: 'area' },
  xaxis: { categories: OCCUPANCY_SERIES.categories },
  yaxis: { max: 100, labels: { formatter: (v: number) => `${Math.round(v)}%` } },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#465fff'],
}))

const typeDonut = computed<ApexOptions>(() => ({
  labels: byType.value.map((x) => t(`spaceTypes.${x.type}`)),
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: '62%' } } },
  colors: ['#465fff', '#12b76a', '#f79009', '#0ba5ec', '#f04438'],
}))
</script>
