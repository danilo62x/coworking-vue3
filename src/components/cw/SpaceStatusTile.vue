<template>
  <button
    type="button"
    :title="space.name"
    :class="[
      'focus-ring group flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-center transition',
      meta.tile,
      isRoom ? 'col-span-2 aspect-[2/1]' : 'aspect-square',
    ]"
    @click="emit('click', space)"
  >
    <IconBase :name="TYPE_ICON[space.type]" :size="isRoom ? 22 : 18" />
    <span class="line-clamp-1 text-[11px] font-semibold leading-tight">{{ shortName }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconBase from '@/components/ui/IconBase.vue'
import { SPACE_STATUS_META } from './spaceStatusMeta'
import type { Space, SpaceType } from '@/data/types'

const props = defineProps<{ space: Space }>()
const emit = defineEmits<{ (e: 'click', space: Space): void }>()

const TYPE_ICON: Record<SpaceType, string> = {
  'mesa-flex': 'armchair',
  'mesa-fixa': 'desk',
  'sala-reuniao': 'presentation',
  'sala-privativa': 'door',
  auditorio: 'building',
}

const meta = computed(() => SPACE_STATUS_META[props.space.status])
const isRoom = computed(() => props.space.type !== 'mesa-flex' && props.space.type !== 'mesa-fixa')
const shortName = computed(() =>
  isRoom.value
    ? props.space.name.replace('Sala de Reunião ', '').replace('Sala Privativa ', '')
    : props.space.name.replace('Mesa Flex ', '').replace('Mesa Fixa ', '')
)
</script>
