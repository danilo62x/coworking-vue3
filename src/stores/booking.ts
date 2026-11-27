import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Customer details captured on the public booking flow. */
export interface BookingContact {
  name: string
  email: string
  phone: string
  company: string
  notes: string
}

const EMPTY_CONTACT = (): BookingContact => ({ name: '', email: '', phone: '', company: '', notes: '' })

/**
 * Draft for the public /espacos/:slug reservation flow. Persisted so a
 * half-finished booking survives a refresh. Steps:
 *   0 date+time → 1 your data → 2 confirmation
 */
export const useBookingStore = defineStore(
  'cw-booking',
  () => {
    const step = ref(0)
    const spaceId = ref<number | null>(null)
    /** YYYY-MM-DD */
    const date = ref<string | null>(null)
    /** "HH:mm" start */
    const startTime = ref<string | null>(null)
    /** number of hours / days */
    const duration = ref(1)
    const contact = ref<BookingContact>(EMPTY_CONTACT())

    function setStep(s: number) {
      step.value = s
    }
    function next() {
      step.value = Math.min(step.value + 1, 2)
    }
    function back() {
      step.value = Math.max(step.value - 1, 0)
    }
    function setSpace(id: number) {
      const changed = spaceId.value !== id
      spaceId.value = id
      if (changed) {
        date.value = null
        startTime.value = null
        step.value = 0
      }
    }
    function setDate(d: string | null) {
      date.value = d
      startTime.value = null
    }
    function setStartTime(time: string | null) {
      startTime.value = time
    }
    function setDuration(hours: number) {
      duration.value = Math.max(1, hours)
    }
    function setContact(patch: Partial<BookingContact>) {
      contact.value = { ...contact.value, ...patch }
    }
    function reset() {
      step.value = 0
      spaceId.value = null
      date.value = null
      startTime.value = null
      duration.value = 1
      contact.value = EMPTY_CONTACT()
    }

    return {
      step,
      spaceId,
      date,
      startTime,
      duration,
      contact,
      setStep,
      next,
      back,
      setSpace,
      setDate,
      setStartTime,
      setDuration,
      setContact,
      reset,
    }
  },
  {
    persist: { key: 'cw-booking' },
  }
)
