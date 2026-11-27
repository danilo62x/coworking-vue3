<template>
  <button
    type="button"
    class="surface-card flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:shadow-theme-md"
    @click="emit('click', member)"
  >
    <Avatar :src="member.avatar" :name="member.name" size="md" :status="member.status === 'ativo' ? 'online' : 'offline'" />
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-heading">{{ member.name }}</p>
      <p class="truncate text-xs text-muted">{{ member.company }}</p>
    </div>
    <div class="flex flex-col items-end gap-1">
      <MemberStatusPill :status="member.status" />
      <span class="text-[11px] text-muted">{{ plan?.name ?? t('common.none') }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Avatar from '@/components/ui/Avatar.vue'
import MemberStatusPill from './MemberStatusPill.vue'
import { planById } from '@/data/query'
import { useSpaceStore } from '@/stores/space'
import type { Member } from '@/data/types'

const props = defineProps<{ member: Member }>()
const emit = defineEmits<{ (e: 'click', member: Member): void }>()

const { t } = useI18n()
const store = useSpaceStore()
const plan = computed(() => planById(store.plans, props.member.planId))
</script>
