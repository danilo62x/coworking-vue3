<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-bold text-heading">{{ t('plans.title') }}</h1>
      <p class="mt-3 text-muted">{{ t('plans.subtitle') }}</p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <PlanCard v-for="plan in store.plans" :key="plan.id" :plan="plan">
        <template #action>
          <RouterLink
            to="/contato"
            :class="[
              'flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition',
              plan.featured ? 'bg-brand-500 text-white hover:bg-brand-600' : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800',
            ]"
          >
            {{ t('plans.choose') }}
          </RouterLink>
        </template>
      </PlanCard>
    </div>

    <!-- Comparison -->
    <div class="surface-card mt-14 overflow-x-auto rounded-2xl border">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-themed">
            <th class="px-5 py-4 font-medium text-muted">{{ t('plans.compareTitle') }}</th>
            <th v-for="p in store.plans" :key="p.id" class="px-5 py-4 text-center font-semibold text-heading">
              {{ p.name }}
              <span class="block text-xs font-normal text-muted">{{ formatCurrency(p.price, lang) }}/{{ t(`priceUnits.${p.priceUnit}`) }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in COMPARE_ROWS" :key="row" class="border-b border-themed last:border-0">
            <td class="px-5 py-3 text-body">{{ t(`planBenefits.${row}`) }}</td>
            <td v-for="p in store.plans" :key="p.id" class="px-5 py-3 text-center">
              <span v-if="row === 'credits'" class="font-medium text-heading">{{ p.credits }}</span>
              <IconBase v-else-if="p.benefits.includes(row)" name="check" :size="18" class="mx-auto text-success-500" :stroke-width="2.4" />
              <IconBase v-else name="minus" :size="16" class="mx-auto text-gray-300 dark:text-gray-600" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { formatCurrency } from '@/lib/format'
import PlanCard from '@/components/cw/PlanCard.vue'
import IconBase from '@/components/ui/IconBase.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const store = useSpaceStore()

const COMPARE_ROWS = ['credits', 'fixedDesk', 'meetingHours', 'lockers', 'mail', 'parking', 'support24']
</script>
