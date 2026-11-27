<template>
  <div>
    <PageHeader :title="t('members.title')" :subtitle="t('members.subtitle')">
      <template #action>
        <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
          @click="openCreate"
        >
          <IconBase name="plus" :size="16" /> {{ t('members.new') }}
        </button>
      </template>
    </PageHeader>

    <FilterBar
      :search="store.memberFilters.query"
      :search-placeholder="t('members.searchPlaceholder')"
      @search="(v) => store.setMemberFilters({ query: v })"
      @clear="store.setMemberFilters({ planId: 'all', status: 'all', query: '' })"
    >
      <FilterSelect
        icon="package"
        :model-value="String(store.memberFilters.planId ?? 'all')"
        @update:model-value="(v) => store.setMemberFilters({ planId: v === 'all' ? 'all' : Number(v) })"
      >
        <option value="all">{{ t('members.allPlans') }}</option>
        <option v-for="p in store.plans" :key="p.id" :value="p.id">{{ p.name }}</option>
      </FilterSelect>
      <FilterSelect
        icon="filter"
        :model-value="String(store.memberFilters.status ?? 'all')"
        @update:model-value="(v) => store.setMemberFilters({ status: v === 'all' ? 'all' : (v as MemberStatus) })"
      >
        <option value="all">{{ t('members.allStatuses') }}</option>
        <option v-for="s in MEMBER_STATUSES" :key="s" :value="s">{{ t(`memberStatuses.${s}`) }}</option>
      </FilterSelect>
    </FilterBar>

    <DataTable :columns="columns" :data="filtered" :page-size="10" :searchable="false" />

    <MemberModal :open="modalOpen" :member="editing" @close="modalOpen = false" />

    <Drawer :open="detail !== null" :title="detail?.name" :subtitle="detail?.company" width="lg" @close="detail = null">
      <div v-if="detail" class="space-y-6 text-sm">
        <div class="flex items-center gap-4">
          <Avatar :src="detail.avatar" :name="detail.name" size="xl" :status="detail.status === 'ativo' ? 'online' : 'offline'" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <MemberStatusPill :status="detail.status" />
              <Badge color="brand">{{ detailPlan?.name }}</Badge>
            </div>
            <p class="mt-2 text-muted">{{ detail.email }}</p>
            <p class="text-muted">{{ detail.phone }}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-xl border border-themed p-3 text-center">
            <p class="text-xs text-muted">{{ t('members.credits') }}</p>
            <p class="text-lg font-bold text-heading">{{ detail.credits }}</p>
          </div>
          <div class="rounded-xl border border-themed p-3 text-center">
            <p class="text-xs text-muted">{{ t('members.reservationsLabel') }}</p>
            <p class="text-lg font-bold text-heading">{{ reservationsForMember(store.reservations, detail.id).length }}</p>
          </div>
          <div class="rounded-xl border border-themed p-3 text-center">
            <p class="text-xs text-muted">{{ t('members.since') }}</p>
            <p class="text-sm font-bold text-heading">{{ formatDate(detail.since, lang) }}</p>
          </div>
        </div>

        <div>
          <h4 class="mb-2 font-semibold text-heading">{{ t('members.recentReservations') }}</h4>
          <p v-if="detailReservations.length === 0" class="text-muted">{{ t('members.noReservations') }}</p>
          <ul v-else class="divide-y divide-themed">
            <li v-for="r in detailReservations" :key="r.id" class="flex items-center justify-between py-2">
              <span class="text-body">{{ spaceById(store.spaces, r.spaceId)?.name }}</span>
              <div class="flex items-center gap-2">
                <span class="text-muted">{{ formatDate(r.start, lang) }}</span>
                <StatusPill :status="r.status" />
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="mb-2 font-semibold text-heading">{{ t('members.invoices') }}</h4>
          <ul class="divide-y divide-themed">
            <li v-for="inv in detailInvoices" :key="inv.id" class="flex items-center justify-between py-2">
              <span class="text-body">{{ inv.reference }}</span>
              <div class="flex items-center gap-2">
                <span class="font-medium text-heading">{{ formatCurrency(inv.amount, lang) }}</span>
                <Badge :color="inv.status === 'paga' ? 'success' : inv.status === 'pendente' ? 'warning' : 'error'" dot>
                  {{ t(`invoiceStatuses.${inv.status}`) }}
                </Badge>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import { useSpaceStore } from '@/stores/space'
import {
  filterMembers,
  planById,
  invoicesForMember,
  reservationsForMember,
  spaceById,
  MEMBER_STATUSES,
} from '@/data/query'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Member, MemberStatus } from '@/data/types'
import PageHeader from '@/components/app/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import IconBase from '@/components/ui/IconBase.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Badge from '@/components/ui/Badge.vue'
import MemberStatusPill from '@/components/cw/MemberStatusPill.vue'
import FilterBar from '@/components/cw/FilterBar.vue'
import FilterSelect from '@/components/cw/FilterSelect.vue'
import MemberModal from '@/components/cw/MemberModal.vue'
import Drawer from '@/components/cw/Drawer.vue'
import StatusPill from '@/components/cw/StatusPill.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()

const modalOpen = ref(false)
const editing = ref<Member | null>(null)
const detail = ref<Member | null>(null)

const filtered = computed(() => filterMembers(store.members, store.memberFilters))

const detailPlan = computed(() => (detail.value ? planById(store.plans, detail.value.planId) : undefined))
const detailReservations = computed(() =>
  detail.value ? reservationsForMember(store.reservations, detail.value.id).slice(0, 5) : []
)
const detailInvoices = computed(() => (detail.value ? invoicesForMember(store.invoices, detail.value.id) : []))

const col = createColumnHelper<Member>()

const columns = computed<ColumnDef<Member, any>[]>(() => [
  col.accessor('name', {
    header: () => t('members.name'),
    cell: (c) =>
      h('span', { class: 'flex items-center gap-2.5' }, [
        h(Avatar, { src: c.row.original.avatar, name: c.getValue(), size: 'sm' }),
        h('span', {}, [
          h('span', { class: 'block font-medium text-heading' }, c.getValue()),
          h('span', { class: 'block text-xs text-muted' }, c.row.original.company),
        ]),
      ]),
  }),
  col.accessor('planId', {
    header: () => t('members.plan'),
    cell: (c) => planById(store.plans, c.getValue())?.name ?? '—',
  }),
  col.accessor('credits', {
    header: () => t('members.credits'),
    cell: (c) => h('span', { class: 'font-medium text-heading' }, String(c.getValue())),
  }),
  col.accessor('since', {
    header: () => t('members.since'),
    cell: (c) => formatDate(c.getValue(), lang.value),
  }),
  col.accessor('status', {
    header: () => t('members.status'),
    cell: (c) => h(MemberStatusPill, { status: c.getValue() }),
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
            title: t('members.openFile'),
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

function openEdit(m: Member) {
  editing.value = m
  modalOpen.value = true
}
</script>
