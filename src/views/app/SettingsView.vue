<template>
  <div>
    <PageHeader :title="t('settings.title')" :subtitle="t('settings.subtitle')" />
    <div class="surface-card rounded-2xl border p-5">
      <Tabs
        v-model="tab"
        :tabs="[
          { label: t('settings.tabProfile'), icon: 'user' },
          { label: t('settings.tabUnit'), icon: 'building' },
          { label: t('settings.tabNotifications'), icon: 'bell' },
        ]"
      >
        <!-- Profile -->
        <template #tab-0>
          <div class="max-w-2xl space-y-5">
            <div class="flex items-center gap-4">
              <Avatar :name="name" size="xl" />
              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-themed px-3 py-2 text-sm font-medium text-body">
                <IconBase name="upload" :size="15" /> {{ t('settings.changePhoto') }}
              </button>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.name') }}</label>
                <input v-model="name" :class="field" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.email') }}</label>
                <input v-model="email" type="email" :class="field" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.phone') }}</label>
                <input v-model="phone" :class="field" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.role') }}</label>
                <input :value="auth.user?.role ?? ''" disabled :class="`${field} opacity-60`" />
              </div>
            </div>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600" @click="saveProfile">
              {{ t('common.save') }}
            </button>
          </div>
        </template>

        <!-- Unit -->
        <template #tab-1>
          <div class="max-w-2xl space-y-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.unitName') }}</label>
              <input v-model="unit" :class="field" />
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.unitAddress') }}</label>
                <input value="Av. Paulista, 1000 — São Paulo" :class="field" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.unitHours') }}</label>
                <input value="Seg–Sex 08:00–20:00" :class="field" />
              </div>
            </div>
            <div class="rounded-xl border border-themed p-4">
              <p class="mb-3 text-sm font-medium text-heading">{{ t('settings.spacesOverview') }}</p>
              <StatusLegend :counts="counts" />
              <p class="mt-3 text-sm text-muted">{{ t('settings.totalSpaces', { count: store.spaces.length }) }}</p>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-themed p-4">
              <div>
                <p class="text-sm font-medium text-heading">{{ t('settings.darkMode') }}</p>
                <p class="text-xs text-muted">{{ t('settings.darkModeDesc') }}</p>
              </div>
              <SwitchToggle :model-value="ui.darkMode" @update:model-value="ui.setDarkMode" />
            </div>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600" @click="saveProfile">
              {{ t('common.save') }}
            </button>
          </div>
        </template>

        <!-- Notifications -->
        <template #tab-2>
          <div class="max-w-2xl space-y-4">
            <div class="flex items-center justify-between rounded-xl border border-themed p-4">
              <div>
                <p class="text-sm font-medium text-heading">{{ t('settings.notifReservations') }}</p>
                <p class="text-xs text-muted">{{ t('settings.notifReservationsDesc') }}</p>
              </div>
              <SwitchToggle v-model="notifReservations" />
            </div>
            <div class="flex items-center justify-between rounded-xl border border-themed p-4">
              <div>
                <p class="text-sm font-medium text-heading">{{ t('settings.notifOverdue') }}</p>
                <p class="text-xs text-muted">{{ t('settings.notifOverdueDesc') }}</p>
              </div>
              <SwitchToggle v-model="notifOverdue" />
            </div>
            <div class="flex items-center justify-between rounded-xl border border-themed p-4">
              <div>
                <p class="text-sm font-medium text-heading">{{ t('settings.notifNewsletter') }}</p>
                <p class="text-xs text-muted">{{ t('settings.notifNewsletterDesc') }}</p>
              </div>
              <SwitchToggle v-model="notifNewsletter" />
            </div>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600" @click="ui.notifySuccess(t('settings.savedNotifs'))">
              {{ t('common.save') }}
            </button>
          </div>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useSpaceStore } from '@/stores/space'
import { statusCounts } from '@/data/query'
import PageHeader from '@/components/app/PageHeader.vue'
import Tabs from '@/components/ui/Tabs.vue'
import SwitchToggle from '@/components/ui/SwitchToggle.vue'
import Avatar from '@/components/ui/Avatar.vue'
import IconBase from '@/components/ui/IconBase.vue'
import StatusLegend from '@/components/cw/StatusLegend.vue'

const { t } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const store = useSpaceStore()

const tab = ref(0)
const name = ref(auth.user?.name ?? '')
const email = ref(auth.user?.email ?? '')
const phone = ref(auth.user?.phone ?? '')
const unit = ref(auth.user?.unit ?? '')

const notifReservations = ref(true)
const notifOverdue = ref(true)
const notifNewsletter = ref(false)

const counts = computed(() => statusCounts(store.spaces))
const field = 'focus-ring w-full rounded-lg border border-themed bg-transparent px-3.5 py-2.5 text-sm text-body'

function saveProfile() {
  auth.updateProfile({ name: name.value, email: email.value, phone: phone.value, unit: unit.value })
  ui.notifySuccess(t('settings.savedProfile'))
}
</script>
