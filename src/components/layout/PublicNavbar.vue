<template>
  <header
    class="sticky top-0 z-40 border-b border-themed transition-colors surface-header"
    :class="scrolled ? 'backdrop-blur' : ''"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-theme-md">
          <IconBase name="building" :size="18" />
        </span>
        <span class="text-lg font-bold text-heading">{{ t('brand') }}</span>
      </RouterLink>

      <nav class="ml-6 hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="l in LINKS"
          :key="l.to"
          :to="l.to"
          class="rounded-lg px-3 py-2 text-sm font-medium transition"
          :class="isActive(l.to) ? 'text-brand-600 dark:text-brand-400' : 'text-body hover:text-heading'"
        >
          {{ t(l.key) }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          :aria-label="t('common.theme')"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-themed text-body transition hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="ui.toggleDarkMode()"
        >
          <IconBase :name="ui.darkMode ? 'sun' : 'moon'" :size="18" />
        </button>
        <LanguageSwitcher />

        <RouterLink
          to="/espacos"
          class="hidden h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:flex"
        >
          <IconBase name="calendar" :size="16" /> {{ t('nav.book') }}
        </RouterLink>

        <RouterLink
          v-if="isAuth"
          to="/app"
          class="hidden h-10 items-center rounded-lg border border-themed px-4 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:flex"
        >
          {{ t('nav.dashboard') }}
        </RouterLink>
        <RouterLink
          v-else
          to="/login"
          class="hidden h-10 items-center rounded-lg border border-themed px-4 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:flex"
        >
          {{ t('nav.login') }}
        </RouterLink>

        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-body lg:hidden"
          aria-label="Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <IconBase :name="mobileOpen ? 'x' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="surface-card border-t border-themed lg:hidden">
      <nav class="flex flex-col gap-1 px-4 py-4 sm:px-6">
        <RouterLink
          v-for="l in LINKS"
          :key="l.to"
          :to="l.to"
          class="rounded-lg px-3 py-2.5 text-sm font-medium text-body hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {{ t(l.key) }}
        </RouterLink>
        <div class="mt-2 flex flex-col gap-2 border-t border-themed pt-3">
          <RouterLink to="/espacos" class="flex h-11 items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white">
            {{ t('nav.book') }}
          </RouterLink>
          <RouterLink
            v-if="isAuth"
            to="/app"
            class="flex h-11 items-center justify-center rounded-lg border border-themed text-sm font-medium text-body"
          >
            {{ t('nav.dashboard') }}
          </RouterLink>
          <RouterLink
            v-else
            to="/login"
            class="flex h-11 items-center justify-center rounded-lg border border-themed text-sm font-medium text-body"
          >
            {{ t('nav.login') }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import IconBase from '@/components/ui/IconBase.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

const LINKS = [
  { to: '/espacos', key: 'nav.spaces' },
  { to: '/planos', key: 'nav.plans' },
  { to: '/sobre', key: 'nav.about' },
  { to: '/contato', key: 'nav.contact' },
]

const { t } = useI18n()
const route = useRoute()
const ui = useUiStore()
const auth = useAuthStore()
const mobileOpen = ref(false)
const scrolled = ref(false)

const isAuth = computed(() => auth.user !== null)
const isActive = (to: string) => route.path === to

function onScroll() {
  scrolled.value = window.scrollY > 8
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
  }
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
