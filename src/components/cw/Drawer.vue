<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[80] flex justify-end">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="emit('close')" />
      <aside
        :class="['surface-card relative flex h-full w-full flex-col border-l shadow-theme-xl', WIDTH[width]]"
      >
        <header class="flex items-start justify-between border-b border-themed px-5 py-4">
          <div>
            <h3 v-if="title" class="text-base font-semibold text-heading">{{ title }}</h3>
            <p v-if="subtitle" class="mt-0.5 text-xs text-muted">{{ subtitle }}</p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            class="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
            @click="emit('close')"
          >
            <IconBase name="x" :size="20" />
          </button>
        </header>
        <div class="flex-1 overflow-y-auto px-5 py-5"><slot /></div>
        <footer v-if="$slots.footer" class="flex items-center justify-end gap-2 border-t border-themed px-5 py-3">
          <slot name="footer" />
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import IconBase from '@/components/ui/IconBase.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    subtitle?: string
    width?: 'sm' | 'md' | 'lg'
  }>(),
  { width: 'md' }
)

const emit = defineEmits<{ (e: 'close'): void }>()

const WIDTH = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' } as const

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})
</script>
