'use client'

import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { Loader } from "./Loader"

import { shortenDID } from "@/lib/ui"
import { KeyPair } from "@/lib/crypto/keys"
import { KeychainContextProps, useKeychainContext } from "@/contexts/keychain"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import CopyButton from "./CopyButton"

interface KeyDetailsProps {
  keyPair: KeyPair
  onDone?: () => unknown
}

function KeyDetails ({ keyPair, onDone }: KeyDetailsProps) {
  const [secret, setSecret] = useState<string>()

  async function showSecret () {
    if (keyPair?.toSecret) {
      setSecret(await keyPair?.toSecret())
    } else {
      console.warn("can't show secret", keyPair)
    }
  }
  function hideSecret () {
    setSecret(undefined)
  }
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="font-bold text-xs uppercase">Key DID: {shortenDID(keyPair.did())}</h3>
      {keyPair?.toSecret && (secret ? (
        <div className="flex flex-col">
          <div className="whitespace-pre w-96 h-24 font-mono text-xs overflow-scroll">{secret}</div>
          <div className="flex flex-row space-x-2">
            <button className="btn" onClick={hideSecret}>
              Hide Secret
            </button>
            <div className="btn flex flex-col justify-center items-center">
              <CopyButton text={secret} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn" onClick={showSecret}>
            Show Secret
          </button>
          {onDone && (
            <button className="btn" onClick={onDone}>
              Done
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

type KeychainProps = KeychainContextProps & {
  className?: string
}

export function KeychainView ({
  keyPairs = [],
  generateKeyPair,
  setSelectedKeyPair,
  className
}: KeychainProps) {
  const [generatingKeyPair, setGeneratingKeyPair] = useState(false)
  const [newKeyPair, setNewKeyPair] = useState<KeyPair>()
  async function onClickAdd () {
    if (generateKeyPair) {
      setGeneratingKeyPair(true)
      setNewKeyPair(await generateKeyPair())
      setGeneratingKeyPair(false)
    } else {
      console.warn('could not generate key pair, generator function is not defined')
    }
  }

  return (
    <div className={className}>
      {newKeyPair ? (
        generatingKeyPair ? (
          <Loader />
        ) : (
          <div>
            <h3>We&apos;ve created your new key!</h3>
            <KeyDetails keyPair={newKeyPair} onDone={() => { setNewKeyPair(undefined) }} />
          </div>
        )
      ) : (
        <>
          <PlusIcon onClick={onClickAdd} className="w-6 h-6 cursor-pointer hover:bg-gray-200" />
          <div className="flex flex-col">
            {
              keyPairs.map((keyPair, i) => (
                <div key={i} className="flex flex-row space-x-2 items-center odd:bg-gray-100/80">
                  <div className="w-52 hover:bg-gray-200 cursor-pointer"
                    onClick={() => { setSelectedKeyPair(keyPair) }}>
                    {shortenDID(keyPair.did())}
                  </div>
                  <CopyButton text={keyPair.did()} />
                  <Popover className="relative flex items-center">
                    <PopoverButton className="outline-none cursor-pointer hover:bg-gray-100 p-2">
                      <Cog8ToothIcon className="w-4 h-4" />
                    </PopoverButton>
                    <PopoverPanel anchor="bottom" className="flex flex-col bg-white border rounded p-2">
                      <KeyDetails keyPair={keyPair} />
                    </PopoverPanel>
                  </Popover>
                </div>
              ))
            }
          </div>
        </>
      )
      }
    </div >
  )
}

export default function Keychain () {
  const props = useKeychainContext()
  return <KeychainView {...props} />
}