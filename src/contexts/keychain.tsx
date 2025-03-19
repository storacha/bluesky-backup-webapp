'use client'

import { generateNewKeyPair, generateNewSymkey, KeyPair, keyParams, keysToKeypair } from "@/lib/crypto/keys";
import type { ReactNode } from "react";
import { createContext, useContext, useState, } from "react";
import { useBackupsContext } from "./backups";
import { useLiveQuery } from "dexie-react-hooks";
import { useW3 } from "@w3ui/react";
import { Key } from "@/lib/db";

export type KeyImportFn = (key: Key, keyMaterial: string) => Promise<void>

export type KeychainContextProps = {
  keys: Key[]
  keyPairs: Record<string, KeyPair>
  selectedKey?: Key
  setSelectedKey: (key: Key) => unknown
  generateKeyPair?: () => Promise<Key | undefined>
  importKey: KeyImportFn
  forgetKey: (key: Key) => Promise<unknown>
};

export const KeychainContext = createContext<KeychainContextProps>({
  keys: [],
  keyPairs: {},
  setSelectedKeyPair: () => { console.warn('setSelectedKeyPair is unimplemented') },
  // @ts-expect-error this is supposed to return a KeyPair but we'll just warn if it's not implemented
  generateKeyPair: () => { console.warn('generateKeyPair is unimplemented') }
});

export const KeychainProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const { backupsStore } = useBackupsContext()
  const [keyPairIndex, setKeyPairIndex] = useState<Record<string, KeyPair>>({})
  const [selectedKey, setSelectedKey] = useState<Key>()
  const [storacha] = useW3()
  async function generateKeyPair () {
    if (storacha.client) {
      const keyPair = await generateNewKeyPair()
      if (keyPair.publicKey) {
        const symkey = await generateNewSymkey()
        const cid = await storacha.client.uploadFile(
          new Blob([await crypto.subtle.encrypt(keyParams, keyPair.publicKey,
            await crypto.subtle.exportKey('raw', symkey)
          )])
        )
        const newKey = await backupsStore.addKey(keyPair.did(), cid.toString())
        setSelectedKey(newKey)
        setKeyPairIndex(m => {
          m[newKey.id] = keyPair
          return m
        })
        return newKey
      } else {
        console.warn("keypair was generated without a public key, that's weird")
      }
    } else {
      console.warn('could not create symmetric key, no storacha client to store it with')
    }

  }
  const keys = useLiveQuery(() => backupsStore.listKeys())
  async function importKey (key: Key, keyMaterial: string) {
    const keys = JSON.parse(keyMaterial)
    const privateKey = await crypto.subtle.importKey('jwk', keys.privateKey, keyParams, true, ['decrypt'])
    const publicKey = await crypto.subtle.importKey('jwk', keys.publicKey, keyParams, true, ['encrypt'])
    const keyPair = await keysToKeypair({ key, publicKey, privateKey })
    setSelectedKey(key)
    setKeyPairIndex(m => {
      m[key.id] = keyPair
      return m
    })
  }
  async function forgetKey (key: Key) {
    setKeyPairIndex(m => {
      delete m[key.id]
      return m
    })
    await backupsStore.deleteKey(key.id)
  }
  return (
    <KeychainContext.Provider value={{
      keys: keys ?? [], keyPairs: keyPairIndex, selectedKey, 
      setSelectedKey, generateKeyPair,
      importKey, forgetKey
    }}>
      {children}
    </KeychainContext.Provider >
  )
}

export const useKeychainContext = () => {
  return useContext(KeychainContext);
};
