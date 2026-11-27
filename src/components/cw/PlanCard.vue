<template>
  <div
    class="surface-card relative flex flex-col rounded-2xl border p-6"
    :class="plan.featured ? 'border-brand-500 shadow-theme-lg ring-1 ring-brand-500' : ''"
  >
    <span
      v-if="plan.featured"
      class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white"
    >
      {{ t('plans.popular') }}
    </span>
    <h3 class="text-lg font-semibold text-heading">{{ plan.name }}</h3>
    <p class="mt-1 text-sm text-muted">{{ t(`planTiers.${plan.tier}`) }}</p>
    <div class="mt-4 flex items-end gap-1">
      <span class="text-3xl font-bold text-heading">{{ formatCurrency(plan.price, lang) }}</span>
      <span class="mb-1 text-sm text-muted">/{{ t(`priceUnits.${plan.priceUnit}`) }}</span>
    </div>
    <p class="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400">
      <IconBase name="calendar" :size="15" /> {{ t('plans.creditsIncluded', { count: plan.credits }) }}
    </p>
    <ul class="mt-5 flex-1 space-y-2.5">
      <li v-for="b in plan.benefits" :key="b" class="flex items-start gap-2 text-sm text-body">
        <IconBase name="check" :size="16" class="mt-0.5 shrink-0 text-success-500" :stroke-width="2.4" />
        {{ t(`planBenefits.${b}`) }}
      </li>
    </ul>
    <div v-if="$slots.action" class="mt-6"><slot name="action" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { formatCurrency } from '@/lib/format'
import type { Plan } from '@/data/types'

defineProps<{ plan: Plan }>()

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
</script>
