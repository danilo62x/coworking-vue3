<template>
  <ModalBase
    :open="open"
    :title="member ? t('members.edit') : t('members.new')"
    size="md"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('members.name') }}</label>
          <input v-model="name" class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('members.company') }}</label>
          <input v-model="company" class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('members.email') }}</label>
          <input v-model="email" type="email" class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('members.phone') }}</label>
          <input v-model="phone" class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('members.plan') }}</label>
          <select v-model="planId" class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body">
            <option v-for="p in store.plans" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('members.status') }}</label>
          <select v-model="status" class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2.5 text-sm text-body">
            <option v-for="s in MEMBER_STATUSES" :key="s" :value="s">{{ t(`memberStatuses.${s}`) }}</option>
          </select>
        </div>
      </div>
    </div>

    <template #footer="{ close }">
      <button
        type="button"
        class="focus-ring rounded-lg border border-themed px-4 py-2 text-sm font-medium text-body"
        @click="close"
      >
        {{ t('common.cancel') }}
      </button>
      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="submit"
      >
        {{ t('common.save') }}
      </button>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { MEMBER_STATUSES } from '@/data/query'
import type { Member, MemberStatus } from '@/data/types'
import ModalBase from '@/components/ui/ModalBase.vue'

const props = defineProps<{
  open: boolean
  member: Member | null
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t } = useI18n()
const store = useSpaceStore()
const ui = useUiStore()

const name = ref('')
const company = ref('')
const email = ref('')
const phone = ref('')
const planId = ref<number>(store.plans[0]?.id ?? 1)
const status = ref<MemberStatus>('ativo')

watch(
  () => props.open,
  (open) => {
    if (!open) return
    if (props.member) {
      const m = props.member
      name.value = m.name
      company.value = m.company
      email.value = m.email
      phone.value = m.phone
      planId.value = m.planId
      status.value = m.status
    } else {
      name.value = ''
      company.value = ''
      email.value = ''
      phone.value = ''
      planId.value = store.plans[0]?.id ?? 1
      status.value = 'ativo'
    }
  }
)

function submit() {
  if (!name.value || !email.value) {
    ui.notifyError(t('members.fillRequired'))
    return
  }
  const plan = store.plans.find((p) => p.id === planId.value)!
  if (props.member) {
    store.updateMember(props.member.id, {
      name: name.value,
      company: company.value,
      email: email.value,
      phone: phone.value,
      planId: planId.value,
      status: status.value,
    })
    ui.notifySuccess(t('members.updated'))
  } else {
    store.addMember({
      name: name.value,
      company: company.value,
      email: email.value,
      phone: phone.value,
      planId: planId.value,
      status: status.value,
      credits: plan.credits,
    })
    ui.notifySuccess(t('members.created'))
  }
  emit('close')
}
</script>
