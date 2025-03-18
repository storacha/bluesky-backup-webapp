'use client'

import { generateNewKey, KeyPair, keyParams, keysToKeypair } from "@/lib/crypto/keys";
import type { ReactNode } from "react";
import { createContext, useContext, useState, } from "react";
import { useBackupsContext } from "./backups";
import { useLiveQuery } from "dexie-react-hooks";

export type KeyImportFn = (keyMaterial: string) => Promise<void>

export type KeychainContextProps = {
  keyPairs: KeyPair[]
  selectedKeyPair?: KeyPair
  setSelectedKeyPair: (key: KeyPair) => unknown
  generateKeyPair?: () => Promise<KeyPair>
  importKey: KeyImportFn
  forgetKey: (key: KeyPair) => Promise<unknown>
};

export const KeychainContext = createContext<KeychainContextProps>({
  keyPairs: [],
  setSelectedKeyPair: () => { console.warn('setSelectedKeyPair is unimplemented') },
  // @ts-expect-error this is supposed to return a KeyPair but we'll just warn if it's not implemented
  generateKeyPair: () => { console.warn('generateKeyPair is unimplemented') }
});

export const KeychainProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const { backupsStore } = useBackupsContext()
  const [keyPairIndex, setKeyPairIndex] = useState<Record<string, KeyPair>>({})
  const [selectedKeyPair, setSelectedKeyPair] = useState<KeyPair>()
  function updateKeyPair (k: KeyPair) {
    setKeyPairIndex(m => {
      m[k.did()] = k
      return m
    })
  }
  async function generateKeyPair () {
    const keyPair = await generateNewKey()
    await backupsStore.addKey(keyPair.did())
    setSelectedKeyPair(keyPair)
    updateKeyPair(keyPair)
    return keyPair
  }
  const keys = useLiveQuery(() => backupsStore.listKeys())
  const keyPairs = (keys || []).map(k => keyPairIndex[k.id] || { did: () => k.id })
  async function importKey (keyMaterial: string) {
    const keys = JSON.parse(keyMaterial)
    const privateKey = await crypto.subtle.importKey('jwk', keys.privateKey, keyParams, true, ['decrypt'])
    const publicKey = await crypto.subtle.importKey('jwk', keys.publicKey, keyParams, true, ['encrypt'])
    const keyPair = await keysToKeypair({ publicKey, privateKey })
    setSelectedKeyPair(keyPair)
    updateKeyPair(keyPair)
  }
  async function forgetKey(keyPair: KeyPair) {
    await backupsStore.deleteKey(keyPair.did())
  }
  return (
    <KeychainContext.Provider value={{
      keyPairs, selectedKeyPair, setSelectedKeyPair, generateKeyPair,
      importKey, forgetKey
    }}>
      {children}
    </KeychainContext.Provider >
  )
}

export const useKeychainContext = () => {
  return useContext(KeychainContext);
};
