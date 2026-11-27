<template>
  <div>
    <PageHeader :title="t('finance.title')" :subtitle="t('finance.subtitle')" />

    <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <KpiCard :title="t('finance.paid')" :value="formatCurrency(totals.paid, lang)" icon="check-circle" accent="success" />
      <KpiCard :title="t('finance.pending')" :value="formatCurrency(totals.pending, lang)" icon="clock" accent="warning" />
      <KpiCard :title="t('finance.overdue')" :value="formatCurrency(totals.overdue, lang)" icon="info" accent="error" />
    </div>

    <DataTable :columns="columns" :data="store.invoices" :page-size="12" />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import { useSpaceStore } from '@/stores/space'
import { invoiceTotals, memberById, planById } from '@/data/query'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Invoice } from '@/data/types'
import PageHeader from '@/components/app/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import KpiCard from '@/components/cw/KpiCard.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Badge from '@/components/ui/Badge.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()

const totals = computed(() => invoiceTotals(store.invoices))

const col = createColumnHelper<Invoice>()

const columns = computed<ColumnDef<Invoice, any>[]>(() => [
  col.accessor('memberId', {
    header: () => t('finance.member'),
    cell: (c) => {
      const m = memberById(store.members, c.getValue())
      return h('span', { class: 'flex items-center gap-2' }, [
        h(Avatar, { src: m?.avatar, name: m?.name, size: 'xs' }),
        m?.name ?? '',
      ])
    },
  }),
  col.accessor('planId', {
    header: () => t('finance.plan'),
    cell: (c) => planById(store.plans, c.getValue())?.name ?? '—',
  }),
  col.accessor('reference', { header: () => t('finance.reference') }),
  col.accessor('dueDate', {
    header: () => t('finance.dueDate'),
    cell: (c) => formatDate(c.getValue(), lang.value),
  }),
  col.accessor('amount', {
    header: () => t('finance.amount'),
    cell: (c) => formatCurrency(c.getValue(), lang.value),
  }),
  col.accessor('status', {
    header: () => t('finance.status'),
    cell: (c) => {
      const v = c.getValue()
      return h(
        Badge,
        { color: v === 'paga' ? 'success' : v === 'pendente' ? 'warning' : 'error', dot: true },
        () => t(`invoiceStatuses.${v}`)
      )
    },
  }),
])
</script>
