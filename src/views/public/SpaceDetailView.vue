<template>
  <div v-if="!space" class="mx-auto max-w-3xl px-4 py-20">
    <EmptyState icon="layout-grid" :title="t('spaces.notFound')" :description="t('spaces.notFoundDesc')">
      <template #action>
        <RouterLink to="/espacos" class="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white">
          {{ t('spaces.backToSpaces') }}
        </RouterLink>
      </template>
    </EmptyState>
  </div>

  <div v-else class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <Breadcrumb
      :items="[
        { label: t('nav.home'), href: '/', icon: 'home' },
        { label: t('nav.spaces'), href: '/espacos' },
        { label: t(`spaceTypes.${space.type}`) },
      ]"
    />

    <div class="mt-6 grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <!-- Gallery -->
        <div class="overflow-hidden rounded-2xl">
          <img :src="space.photos[gallery]" alt="" class="aspect-[16/10] w-full object-cover" />
        </div>
        <div class="mt-3 flex gap-3">
          <button
            v-for="(p, i) in space.photos"
            :key="i"
            type="button"
            :class="['overflow-hidden rounded-lg border-2 transition', i === gallery ? 'border-brand-500' : 'border-transparent']"
            @click="gallery = i"
          >
            <img :src="p" alt="" class="h-16 w-24 object-cover" />
          </button>
        </div>

        <div class="mt-8">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            {{ t(`spaceTypes.${space.type}`) }}
          </span>
          <h1 class="mt-3 text-3xl font-bold text-heading">{{ t(`spaceTypes.${space.type}`) }}</h1>
          <p class="mt-2 flex items-center gap-4 text-sm text-muted">
            <span class="inline-flex items-center gap-1.5"><IconBase name="users" :size="15" /> {{ space.capacity }}</span>
            <span class="inline-flex items-center gap-1.5"><IconBase name="building" :size="15" /> {{ space.floor }}</span>
          </p>
          <p class="mt-5 text-body">{{ space.description }}</p>

          <h2 class="mt-8 text-lg font-semibold text-heading">{{ t('spaces.amenitiesTitle') }}</h2>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <span v-for="a in space.amenities" :key="a" class="flex items-center gap-2 rounded-lg border border-themed px-3 py-2 text-sm text-body">
              <IconBase :name="AMENITY_ICON[a] ?? 'check'" :size="16" class="text-brand-500" /> {{ t(`amenities.${a}`) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Booking column -->
      <div class="lg:sticky lg:top-24 lg:self-start">
        <div v-if="step === 0" class="space-y-4">
          <BookingWidget
            :space="space"
            :date="draft.date"
            :start-time="draft.startTime"
            :duration="draft.duration"
            @date="draft.setDate"
            @start-time="draft.setStartTime"
            @duration="draft.setDuration"
          />
          <button
            type="button"
            :disabled="!canProceed"
            class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            @click="step = 1"
          >
            {{ t('booking.continue') }} <IconBase name="arrow-right" :size="16" />
          </button>
        </div>

        <div v-else-if="step === 1" class="surface-card space-y-4 rounded-2xl border p-5">
          <h3 class="text-base font-semibold text-heading">{{ t('booking.yourData') }}</h3>
          <input :placeholder="t('booking.fullName')" :value="draft.contact.name" :class="field" @input="draft.setContact({ name: ($event.target as HTMLInputElement).value })" />
          <input :placeholder="t('booking.email')" type="email" :value="draft.contact.email" :class="field" @input="draft.setContact({ email: ($event.target as HTMLInputElement).value })" />
          <input :placeholder="t('booking.phone')" :value="draft.contact.phone" :class="field" @input="draft.setContact({ phone: ($event.target as HTMLInputElement).value })" />
          <input :placeholder="t('booking.company')" :value="draft.contact.company" :class="field" @input="draft.setContact({ company: ($event.target as HTMLInputElement).value })" />
          <textarea :placeholder="t('booking.notes')" :value="draft.contact.notes" :rows="3" :class="field" @input="draft.setContact({ notes: ($event.target as HTMLTextAreaElement).value })" />
          <div class="flex gap-2">
            <button type="button" class="h-11 flex-1 rounded-lg border border-themed text-sm font-medium text-body" @click="step = 0">{{ t('common.back') }}</button>
            <button type="button" class="h-11 flex-1 rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600" @click="submitContact">{{ t('booking.review') }}</button>
          </div>
        </div>

        <div v-else-if="step === 2" class="surface-card space-y-4 rounded-2xl border p-5">
          <div class="flex items-center gap-2 text-success-600">
            <IconBase name="check-circle" :size="20" /> <h3 class="text-base font-semibold">{{ t('booking.confirmTitle') }}</h3>
          </div>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between"><dt class="text-muted">{{ t('booking.space') }}</dt><dd class="font-medium text-heading">{{ space.name }}</dd></div>
            <div class="flex justify-between"><dt class="text-muted">{{ t('booking.date') }}</dt><dd class="font-medium text-heading">{{ draft.date }}</dd></div>
            <div v-if="draft.startTime" class="flex justify-between"><dt class="text-muted">{{ t('booking.time') }}</dt><dd class="font-medium text-heading">{{ draft.startTime }}</dd></div>
            <div class="flex justify-between"><dt class="text-muted">{{ space.priceUnit === 'dia' ? t('booking.days') : t('booking.hours') }}</dt><dd class="font-medium text-heading">{{ draft.duration }}</dd></div>
            <div class="flex justify-between"><dt class="text-muted">{{ t('booking.name') }}</dt><dd class="font-medium text-heading">{{ draft.contact.name }}</dd></div>
            <div class="flex justify-between border-t border-themed pt-2 text-base"><dt class="font-semibold text-heading">{{ t('booking.total') }}</dt><dd class="font-bold text-brand-600">{{ formatCurrency(space.price * draft.duration, lang) }}</dd></div>
          </dl>
          <button type="button" class="h-12 w-full rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600" @click="finish">{{ t('booking.confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { useBookingStore } from '@/stores/booking'
import { useUiStore } from '@/stores/ui'
import { spaceBySlug } from '@/data/query'
import { formatCurrency } from '@/lib/format'
import IconBase from '@/components/ui/IconBase.vue'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
import BookingWidget from '@/components/cw/BookingWidget.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t, locale } = useI18n()
const lang = computed(() => locale.value)
const route = useRoute()
const router = useRouter()
const store = useSpaceStore()
const draft = useBookingStore()
const ui = useUiStore()

const field = 'focus-ring w-full rounded-lg border border-themed bg-transparent px-3.5 py-2.5 text-sm text-body'

const space = computed(() => {
  const slug = route.params.slug as string | undefined
  return slug ? spaceBySlug(store.spaces, slug) : undefined
})

const gallery = ref(0)
const step = ref<0 | 1 | 2>(0)

watch(
  () => space.value?.id,
  (id) => {
    if (id) draft.setSpace(id)
    step.value = 0
    gallery.value = 0
  },
  { immediate: true }
)

const canProceed = computed(() =>
  space.value?.priceUnit === 'dia' ? Boolean(draft.date) : Boolean(draft.date && draft.startTime)
)

function submitContact() {
  if (!draft.contact.name || !draft.contact.email) {
    ui.notifyError(t('booking.fillContact'))
    return
  }
  step.value = 2
}

function finish() {
  ui.notifySuccess(t('booking.requestSent'))
  draft.reset()
  router.push('/espacos')
}

const AMENITY_ICON: Record<string, string> = {
  wifi: 'wifi', coffee: 'coffee', power: 'zap', lounge: 'armchair', locker: 'key', monitor: 'layout-grid',
  tv: 'presentation', whiteboard: 'edit', video: 'globe', ac: 'activity', phoneBooth: 'phone',
  projector: 'presentation', sound: 'activity', stage: 'building', catering: 'coffee',
}
</script>
