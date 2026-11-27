import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  /** coworking unit / brand shown in settings */
  unit?: string
}

/** Suggested demo account shown on the login screen. Any email/password works. */
export const DEMO_CREDENTIALS = { email: 'gestor@coworking.com', password: 'demo123' }

export const useAuthStore = defineStore(
  'cw-auth',
  () => {
    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => user.value !== null)

    // Mock auth: any non-empty email/password logs in.
    async function login(email: string, password: string): Promise<boolean> {
      await new Promise((r) => setTimeout(r, 500))
      if (!email || !password) return false
      const isDemo = email === DEMO_CREDENTIALS.email
      const raw = email.split('@')[0].replace(/[._-]/g, ' ') || 'Gestor'
      const name = isDemo ? 'Marina Costa' : raw.charAt(0).toUpperCase() + raw.slice(1)
      user.value = {
        id: 1,
        name,
        email,
        role: 'Gestora',
        phone: '+55 11 98800-3001',
        unit: 'Hub Coworking — Paulista',
      }
      return true
    }

    async function register(name: string, email: string, password: string): Promise<boolean> {
      await new Promise((r) => setTimeout(r, 500))
      if (!name || !email || !password) return false
      user.value = { id: 1, name, email, role: 'Gestora', phone: '', unit: 'Meu coworking' }
      return true
    }

    function logout() {
      user.value = null
    }

    function updateProfile(patch: Partial<User>) {
      if (!user.value) return
      user.value = { ...user.value, ...patch }
    }

    return { user, isAuthenticated, login, register, logout, updateProfile }
  },
  {
    persist: {
      key: 'cw-auth',
      pick: ['user'],
    },
  }
)
