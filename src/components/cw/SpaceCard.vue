<template>
  <RouterLink
    :to="`/espacos/${info.slug}`"
    class="surface-card group flex flex-col overflow-hidden rounded-2xl border transition hover:shadow-theme-lg"
  >
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="info.photos[0]"
        :alt="t(`spaceTypes.${info.type}`)"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-heading backdrop-blur dark:bg-gray-900/80">
        {{ info.count }} {{ t('spaces.unitsLabel') }}
      </span>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-lg font-semibold text-heading">{{ t(`spaceTypes.${info.type}`) }}</h3>
      <p class="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <IconBase name="users" :size="15" />
        {{ info.capacity === 1 ? t('spaces.oneSeat') : t('spaces.seats', { count: info.capacity }) }}
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="a in info.amenities.slice(0, 4)"
          :key="a"
          class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <IconBase :name="AMENITY_ICON[a] ?? 'check'" :size="11" /> {{ t(`amenities.${a}`) }}
        </span>
      </div>
      <div class="mt-auto flex items-end justify-between pt-5">
        <div>
          <span class="text-xs text-muted">{{ t('common.from') }}</span>
          <p class="text-xl font-bold text-heading">
            {{ formatCurrency(info.price, lang) }}
            <span class="text-sm font-normal text-muted">/{{ t(`priceUnits.${info.priceUnit}`) }}</span>
          </p>
        </div>
        <span class="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition group-hover:gap-2 dark:text-brand-400">
          {{ t('spaces.viewSpace') }} <IconBase name="arrow-right" :size="16" />
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { formatCurrency } from '@/lib/format'
import type { SpaceTypeInfo } from '@/data/mock'

defineProps<{ info: SpaceTypeInfo }>()

const { t, locale } = useI18n()
const lang = computed(() => locale.value)

const AMENITY_ICON: Record<string, string> = {
  wifi: 'wifi',
  coffee: 'coffee',
  power: 'zap',
  lounge: 'armchair',
  locker: 'key',
  monitor: 'layout-grid',
  tv: 'presentation',
  whiteboard: 'edit',
  video: 'globe',
  ac: 'activity',
  phoneBooth: 'phone',
  projector: 'presentation',
  sound: 'activity',
  stage: 'building',
  catering: 'coffee',
}
</script>
