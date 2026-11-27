<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-brand-100/60 dark:from-gray-900 dark:via-gray-dark dark:to-gray-900" />
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <IconBase name="building" :size="15" /> {{ t('home.badge') }}
          </span>
          <h1 class="mt-5 text-4xl font-bold leading-tight text-heading sm:text-5xl">{{ t('home.heroTitle') }}</h1>
          <p class="mt-5 max-w-lg text-lg text-muted">{{ t('home.heroSubtitle') }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/espacos" class="inline-flex h-12 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600">
              <IconBase name="calendar" :size="18" /> {{ t('home.ctaBook') }}
            </RouterLink>
            <RouterLink to="/contato" class="inline-flex h-12 items-center gap-2 rounded-lg border border-themed px-6 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800">
              {{ t('home.ctaVisit') }}
            </RouterLink>
          </div>
          <dl class="mt-10 grid grid-cols-4 gap-4">
            <div v-for="s in STATS" :key="s.key">
              <dt class="text-2xl font-bold text-heading">{{ s.value }}</dt>
              <dd class="text-xs text-muted">{{ t(`home.stats.${s.key}`) }}</dd>
            </div>
          </dl>
        </div>
        <div class="relative">
          <img :src="spaceImage('hero', 1200, 900)" alt="" class="aspect-[4/3] w-full rounded-3xl object-cover shadow-theme-xl" />
          <div class="surface-card absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border p-4 shadow-theme-lg sm:block">
            <p class="flex items-center gap-2 text-sm font-semibold text-heading">
              <span class="h-2.5 w-2.5 rounded-full bg-success-500" /> {{ t('home.liveAvailability') }}
            </p>
            <p class="mt-1 text-xs text-muted">{{ t('home.liveDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Space types -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold text-heading">{{ t('home.spacesTitle') }}</h2>
        <p class="mt-3 text-muted">{{ t('home.spacesSubtitle') }}</p>
      </div>
      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SpaceCard v-for="info in SPACE_TYPES" :key="info.type" :info="info" />
      </div>
    </section>

    <!-- Amenities -->
    <section class="border-y border-themed bg-card-bg surface-card">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold text-heading">{{ t('home.amenitiesTitle') }}</h2>
          <p class="mt-3 text-muted">{{ t('home.amenitiesSubtitle') }}</p>
        </div>
        <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="a in AMENITIES" :key="a" class="surface-card flex flex-col items-center gap-3 rounded-2xl border p-6 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
              <IconBase :name="AMENITY_ICON[a] ?? 'check'" :size="22" />
            </span>
            <span class="text-sm font-medium text-heading">{{ t(`amenities.${a}`) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Plans -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold text-heading">{{ t('home.plansTitle') }}</h2>
        <p class="mt-3 text-muted">{{ t('home.plansSubtitle') }}</p>
      </div>
      <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <PlanCard v-for="plan in store.plans" :key="plan.id" :plan="plan">
          <template #action>
            <RouterLink
              to="/planos"
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
    </section>

    <!-- Testimonials -->
    <section class="border-t border-themed bg-card-bg surface-card">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-bold text-heading">{{ t('home.testimonialsTitle') }}</h2>
        <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <figure v-for="tm in TESTIMONIALS" :key="tm.seed" class="surface-card rounded-2xl border p-6">
            <div class="flex gap-0.5 text-warning-400">
              <IconBase v-for="i in 5" :key="i" name="star" :size="16" class="fill-current" />
            </div>
            <blockquote class="mt-4 text-sm text-body">{{ t(`home.testimonials.${tm.seed}`) }}</blockquote>
            <figcaption class="mt-5 flex items-center gap-3">
              <img :src="av(tm.seed)" alt="" class="h-10 w-10 rounded-full object-cover" />
              <span>
                <span class="block text-sm font-semibold text-heading">{{ tm.name }}</span>
                <span class="block text-xs text-muted">{{ tm.role }}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Location + CTA -->
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-3xl bg-brand-500">
        <div class="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
          <div class="text-white">
            <h2 class="text-3xl font-bold">{{ t('home.ctaTitle') }}</h2>
            <p class="mt-3 text-white/90">{{ t('home.ctaSubtitle') }}</p>
            <p class="mt-5 flex items-center gap-2 text-sm text-white/90">
              <IconBase name="map-pin" :size="16" /> {{ t('contact.addressValue') }}
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <RouterLink to="/espacos" class="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-brand-600 transition hover:bg-white/90">
                {{ t('home.ctaBook') }}
              </RouterLink>
              <RouterLink to="/contato" class="inline-flex h-12 items-center gap-2 rounded-lg border border-white/40 px-6 text-sm font-medium text-white transition hover:bg-white/10">
                {{ t('home.ctaVisit') }}
              </RouterLink>
            </div>
          </div>
          <img :src="spaceImage('location', 900, 600)" alt="" class="aspect-[3/2] w-full rounded-2xl object-cover" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { SPACE_TYPES, spaceImage, av } from '@/data/mock'
import IconBase from '@/components/ui/IconBase.vue'
import SpaceCard from '@/components/cw/SpaceCard.vue'
import PlanCard from '@/components/cw/PlanCard.vue'

const { t } = useI18n()
const store = useSpaceStore()

const AMENITIES = ['wifi', 'coffee', 'power', 'lounge', 'locker', 'phoneBooth', 'ac', 'parking']

const AMENITY_ICON: Record<string, string> = {
  wifi: 'wifi',
  coffee: 'coffee',
  power: 'zap',
  lounge: 'armchair',
  locker: 'key',
  phoneBooth: 'phone',
  ac: 'activity',
  parking: 'car',
}

const STATS = [
  { value: '32', key: 'spaces' },
  { value: '240+', key: 'members' },
  { value: '98%', key: 'satisfaction' },
  { value: '3', key: 'floors' },
]

const TESTIMONIALS = [
  { name: 'Marina Costa', role: 'Studio Bossa', seed: 't1' },
  { name: 'Rafael Andrade', role: 'Andrade Dev', seed: 't2' },
  { name: 'Diego Martins', role: 'Lumina Labs', seed: 't3' },
]
</script>
