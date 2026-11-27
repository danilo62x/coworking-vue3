import { defineStore } from 'pinia'
import { ref } from 'vue'
import { INVOICES, MEMBERS, PLANS, RESERVATIONS, SPACES, av } from '@/data/mock'
import type {
  Invoice,
  Member,
  Plan,
  Reservation,
  ReservationStatus,
  Space,
  SpaceStatus,
  SpaceType,
} from '@/data/types'
import type { MemberFilters, ReservationFilters } from '@/data/query'

let seq = 9000
const nextId = () => ++seq

const EMPTY_RES_FILTERS = (): ReservationFilters => ({ spaceId: 'all', status: 'all', from: '', to: '', query: '' })
const EMPTY_MEMBER_FILTERS = (): MemberFilters => ({ planId: 'all', status: 'all', query: '' })

export const useSpaceStore = defineStore(
  'cw-space',
  () => {
    const spaces = ref<Space[]>(SPACES)
    const reservations = ref<Reservation[]>(RESERVATIONS)
    const members = ref<Member[]>(MEMBERS)
    const plans = ref<Plan[]>(PLANS)
    const invoices = ref<Invoice[]>(INVOICES)

    // Persisted filters (rehydrate the admin tables)
    const reservationFilters = ref<ReservationFilters>(EMPTY_RES_FILTERS())
    const memberFilters = ref<MemberFilters>(EMPTY_MEMBER_FILTERS())

    // Reservations
    function createReservation(r: Omit<Reservation, 'id'>): Reservation {
      const id = nextId()
      const reservation: Reservation = { ...r, id }
      reservations.value = [reservation, ...reservations.value]
      return reservation
    }
    function updateReservation(id: number, patch: Partial<Reservation>) {
      reservations.value = reservations.value.map((r) => (r.id === id ? { ...r, ...patch } : r))
    }
    function setReservationStatus(id: number, status: ReservationStatus) {
      reservations.value = reservations.value.map((r) =>
        r.id === id
          ? { ...r, status, checkedIn: status === 'em-uso' || status === 'concluida' ? true : r.checkedIn }
          : r
      )
      // Reflect on the floor map.
      const res = reservations.value.find((r) => r.id === id)
      if (res) {
        const mapStatus: SpaceStatus =
          status === 'em-uso' ? 'ocupado' : status === 'confirmada' ? 'reservado' : 'livre'
        setSpaceStatus(res.spaceId, mapStatus)
      }
    }
    function checkIn(id: number) {
      const res = reservations.value.find((r) => r.id === id)
      if (!res) return
      reservations.value = reservations.value.map((r) =>
        r.id === id ? { ...r, checkedIn: true, status: 'em-uso' } : r
      )
      setSpaceStatus(res.spaceId, 'ocupado')
    }
    function setReservationFilters(patch: Partial<ReservationFilters>) {
      reservationFilters.value = { ...reservationFilters.value, ...patch }
    }

    // Spaces
    function setSpaceStatus(id: number, status: SpaceStatus) {
      spaces.value = spaces.value.map((s) => (s.id === id ? { ...s, status } : s))
    }

    // Members
    function addMember(m: Omit<Member, 'id' | 'avatar' | 'since'> & { avatar?: string }): Member {
      const id = nextId()
      const member: Member = {
        ...m,
        id,
        avatar: m.avatar ?? av(String(id)),
        since: new Date().toISOString().slice(0, 10),
      }
      members.value = [member, ...members.value]
      return member
    }
    function updateMember(id: number, patch: Partial<Member>) {
      members.value = members.value.map((m) => (m.id === id ? { ...m, ...patch } : m))
    }
    function setMemberFilters(patch: Partial<MemberFilters>) {
      memberFilters.value = { ...memberFilters.value, ...patch }
    }

    // Plans
    function addPlan(p: Omit<Plan, 'id'>): Plan {
      const id = nextId()
      const plan: Plan = { ...p, id }
      plans.value = [...plans.value, plan]
      return plan
    }
    function updatePlan(id: number, patch: Partial<Plan>) {
      plans.value = plans.value.map((p) => (p.id === id ? { ...p, ...patch } : p))
    }

    function reset() {
      spaces.value = SPACES
      reservations.value = RESERVATIONS
      members.value = MEMBERS
      plans.value = PLANS
      invoices.value = INVOICES
      reservationFilters.value = EMPTY_RES_FILTERS()
      memberFilters.value = EMPTY_MEMBER_FILTERS()
    }

    return {
      spaces,
      reservations,
      members,
      plans,
      invoices,
      reservationFilters,
      memberFilters,
      createReservation,
      updateReservation,
      setReservationStatus,
      checkIn,
      setReservationFilters,
      setSpaceStatus,
      addMember,
      updateMember,
      setMemberFilters,
      addPlan,
      updatePlan,
      reset,
    }
  },
  {
    persist: {
      key: 'cw-space',
      pick: ['spaces', 'reservations', 'members', 'plans', 'invoices', 'reservationFilters', 'memberFilters'],
    },
  }
)

export type { SpaceType }
