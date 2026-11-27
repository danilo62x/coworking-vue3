<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-bold text-heading">{{ t('contact.title') }}</h1>
      <p class="mt-3 text-muted">{{ t('contact.subtitle') }}</p>
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-2">
      <div class="space-y-5">
        <div v-for="i in INFO" :key="i.key" class="surface-card flex items-start gap-4 rounded-2xl border p-5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
            <IconBase :name="i.icon" :size="20" />
          </span>
          <div>
            <p class="text-sm font-semibold text-heading">{{ t(`contact.${i.key}`) }}</p>
            <p class="mt-0.5 text-sm text-muted">{{ t(`contact.${i.key}Value`) }}</p>
          </div>
        </div>
      </div>

      <form class="surface-card space-y-4 rounded-2xl border p-6" @submit.prevent="submit">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('contact.name') }}</label>
          <input v-model="name" required :class="field" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('contact.email') }}</label>
          <input v-model="email" required type="email" :class="field" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('contact.message') }}</label>
          <textarea v-model="message" required :rows="5" :class="field" />
        </div>
        <button type="submit" class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600">
          <IconBase name="mail" :size="16" /> {{ t('contact.send') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import IconBase from '@/components/ui/IconBase.vue'

const { t } = useI18n()
const ui = useUiStore()

const name = ref('')
const email = ref('')
const message = ref('')

const field = 'focus-ring w-full rounded-lg border border-themed bg-transparent px-3.5 py-2.5 text-sm text-body'

const INFO = [
  { icon: 'map-pin', key: 'address' },
  { icon: 'phone', key: 'phone' },
  { icon: 'mail', key: 'email' },
  { icon: 'clock', key: 'hours' },
]

function submit() {
  ui.notifySuccess(t('contact.sent'))
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>
