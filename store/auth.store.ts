'use client'

import { create } from 'zustand'
import type { User } from 'firebase/auth'
import { onAuthChange } from '@/lib/firebase'

interface AuthState {
  user: User | null
  loading: boolean
  /** Call once on app mount to subscribe to auth state changes */
  init: () => () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init() {
    const unsubscribe = onAuthChange((user) => {
      set({ user, loading: false })
    })
    return unsubscribe
  },
}))
