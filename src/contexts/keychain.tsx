'use client'

import { generateNewKey, KeyPair } from "@/lib/crypto/keys";
import type { ReactNode } from "react";
import { createContext, useContext, useState, } from "react";

export type KeychainContextProps = {
  keyPairs: KeyPair[]
  selectedKeyPair?: KeyPair
  setSelectedKeyPair: (key: KeyPair) => unknown
  generateKeyPair?: () => Promise<KeyPair>
};

export const KeychainContext = createContext<KeychainContextProps>({
  keyPairs: [],
  setSelectedKeyPair: () => { console.warn('setSelectedKeyPair is unimplemented') },
  // @ts-expect-error this is supposed to return a KeyPair but we'll just warn if it's not implemented
  generateKeyPair: () => { console.warn('generateKeyPair is unimplemented') }
});

export const KeychainProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [keyPairs, setKeyPairs] = useState<KeyPair[]>([])
  const [selectedKeyPair, setSelectedKeyPair] = useState<KeyPair>()
  async function generateKeyPair () {
    const keyPair = await generateNewKey()
    setSelectedKeyPair(keyPair)
    setKeyPairs(keys => [...keys, keyPair])
    return keyPair
  }
  return (
    <KeychainContext.Provider value={{
      keyPairs, selectedKeyPair, setSelectedKeyPair, generateKeyPair,
    }}>
      {children}
    </KeychainContext.Provider>
  )
}

export const useKeychainContext = () => {
  return useContext(KeychainContext);
};
