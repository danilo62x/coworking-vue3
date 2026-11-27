<template>
  <div class="relative">
    <span v-if="icon" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
      <IconBase :name="icon" :size="15" />
    </span>
    <select
      :value="modelValue"
      :class="[
        'focus-ring appearance-none rounded-lg border border-themed bg-transparent py-2 pr-8 text-sm text-body',
        icon ? 'pl-8' : 'pl-3',
      ]"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted">
      <IconBase name="chevron-down" :size="14" />
    </span>
  </div>
</template>

<script setup lang="ts">
import IconBase from '@/components/ui/IconBase.vue'

defineProps<{
  modelValue: string
  icon?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
