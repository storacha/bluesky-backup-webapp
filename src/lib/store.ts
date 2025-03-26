import { create } from 'zustand'
import { Key } from '@/contexts/keychain'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface StoreValues {
  secretKey: string
  rsaKey: Key | null
  clearSecretKey: () => void
  setRsaKey: (key: Key) => void
  setSecretKey: (key: string) => void
}

export const useStore = create<StoreValues>()(
  persist(
    (set) => ({
      rsaKey: null,
      secretKey: '',

      clearSecretKey: () => set({ secretKey: '' }),
      setRsaKey: (rsaKey) => set({ rsaKey }),
      setSecretKey: (secretKey) => set({ secretKey }),
    }),
    {
      name: 'key-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rsaKey: state.rsaKey,
        secretKey: state.secretKey,
      }),
      // in case our store structure changes
      migrate: (persistedState) => {
        return persistedState as StoreValues
      },
    }
  )
)
