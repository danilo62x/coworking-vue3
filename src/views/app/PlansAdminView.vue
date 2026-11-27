<template>
  <div>
    <PageHeader :title="t('plansAdmin.title')" :subtitle="t('plansAdmin.subtitle')" />

    <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="surface-card rounded-2xl border p-5">
        <p class="text-sm text-muted">{{ t('plansAdmin.activePlans') }}</p>
        <p class="mt-1 text-2xl font-bold text-heading">{{ store.plans.length }}</p>
      </div>
      <div class="surface-card rounded-2xl border p-5">
        <p class="text-sm text-muted">{{ t('plansAdmin.subscribers') }}</p>
        <p class="mt-1 text-2xl font-bold text-heading">{{ store.members.length }}</p>
      </div>
      <div class="surface-card rounded-2xl border p-5">
        <p class="text-sm text-muted">{{ t('plansAdmin.mrr') }}</p>
        <p class="mt-1 text-2xl font-bold text-heading">{{ formatCurrency(mrr, lang) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <PlanCard v-for="plan in store.plans" :key="plan.id" :plan="plan">
        <template #action>
          <div class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <IconBase name="users" :size="14" /> {{ t('plansAdmin.subscribersCount', { count: subsByPlan.get(plan.id) ?? 0 }) }}
            </span>
          </div>
        </template>
      </PlanCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { formatCurrency } from '@/lib/format'
import PageHeader from '@/components/app/PageHeader.vue'
import PlanCard from '@/components/cw/PlanCard.vue'
import IconBase from '@/components/ui/IconBase.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()

const subsByPlan = computed(() => {
  const map = new Map<number, number>()
  for (const m of store.members) map.set(m.planId, (map.get(m.planId) ?? 0) + 1)
  return map
})

const mrr = computed(() =>
  store.members.reduce((sum, m) => {
    const plan = store.plans.find((p) => p.id === m.planId)
    if (!plan || plan.priceUnit !== 'mes' || m.status !== 'ativo') return sum
    return sum + plan.price
  }, 0)
)
</script>
