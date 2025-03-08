'use client'

import db from "@/app/db"
import { Agent, CredentialSession } from '@atproto/api'
import { blueskyClientMetadata } from "@/lib/bluesky"
import { useLiveQuery } from "dexie-react-hooks"
import { OAuthSession, BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { ATPROTO_DEFAULT_SINK, ATPROTO_DEFAULT_SOURCE, REQUIRED_ATPROTO_SCOPE } from "@/lib/constants";
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Secp256k1Keypair } from "@atproto/crypto"
import * as ui8 from "uint8arrays"

type LoginFn = (identifier: string, password: string, options?: { server?: string }) => Promise<void>

interface LoginForm {
  handle: string
  password: string
  server: string
}

interface AtprotoLoginFormProps {
  login: LoginFn
  defaultServer?: string
}

type CreateAccountFn = (handle: string, password: string, email: string, options?: { server?: string, inviteCode?: string }) => Promise<void>

type CreateAccountForm = LoginForm & {
  email: string
  inviteCode?: string
}

interface AtprotoCreateAccountFormProps {
  createAccount: CreateAccountFn
  defaultServer?: string
}


export async function oauthToPds (pdsUrl: string, handle: string) {
  const bskyAuthClient = new BrowserOAuthClient({
    clientMetadata: blueskyClientMetadata,
    handleResolver: pdsUrl,
  });
  const result = await bskyAuthClient.init(true);
  const { session } = result as {
    session: OAuthSession;
  };
  const agent = new Agent(session)
  await bskyAuthClient.signIn(handle, {
    scope: REQUIRED_ATPROTO_SCOPE,
  })
  return { client: bskyAuthClient, session, agent }
}
export default function RestoreButton ({ backupId }: { backupId: string }) {
  const repos = useLiveQuery(() => db.
    repos.where('backupId').equals(parseInt(backupId)).toArray())

  const [sourceSession, setSourceSession] = useState<CredentialSession>()
  const [sourceAgent, setSourceAgent] = useState<Agent>()
  const [sinkSession, setSinkSession] = useState<CredentialSession>()
  const [sinkAgent, setSinkAgent] = useState<Agent>()
  // const [plcToken, setPlcToken] = useState<string>("")

  const loginToSource: LoginFn = async (identifier: string, password: string, { server = ATPROTO_DEFAULT_SOURCE } = { server: ATPROTO_DEFAULT_SOURCE }) => {
    const session = new CredentialSession(new URL(server))
    await session.login({ identifier, password })
    const agent = new Agent(session)
    setSourceSession(session)
    setSourceAgent(agent)
  }

  const loginToSink: LoginFn = async (identifier, password, { server = ATPROTO_DEFAULT_SINK } = { server: ATPROTO_DEFAULT_SINK }) => {
    const session = new CredentialSession(new URL(server))
    await session.login({ identifier, password })
    const agent = new Agent(session)
    setSinkSession(session)
    setSinkAgent(agent)
  }

  const createAccount: CreateAccountFn = async (handle, password, email, { server = ATPROTO_DEFAULT_SINK, inviteCode } = { server: ATPROTO_DEFAULT_SINK }) => {
    if (sourceAgent && sourceSession) {
      const session = new CredentialSession(new URL(server))
      const agent = new Agent(session)

      const describeRes = await agent.com.atproto.server.describeServer()
      const newServerDid = describeRes.data.did

      // right now we need to talk to the source server to create this account with the given account DID
      const serviceJwtRes = await sourceAgent.com.atproto.server.getServiceAuth({
        aud: newServerDid,
        lxm: 'com.atproto.server.createAccount',
      })
      const serviceJwt = serviceJwtRes.data.token
      await agent.com.atproto.server.createAccount(
        {
          handle,
          email,
          password,
          did: sourceSession.did,
          inviteCode: inviteCode,
        },
        {
          headers: { authorization: `Bearer ${serviceJwt}` },
          encoding: 'application/json',
        },
      )
      await session.login({
        identifier: handle,
        password: password,
      })
      setSinkSession(session)
      setSinkAgent(agent)
    } else {
      console.warn("source agent not defined, need it to create a new account")
    }
  }

  async function restore () {
    if (repos && sinkAgent && sourceAgent && sourceSession) {
      for (const repo of repos) {
        console.log("restoring", repo.cid)
        const response = await fetch(`https://w3s.link/ipfs/${repo.cid}`)
        await sinkAgent.com.atproto.repo.importRepo(new Uint8Array(await response.arrayBuffer()), {
          encoding: 'application/vnd.ipld.car',
        })
      }

      const recoveryKey = await Secp256k1Keypair.create({ exportable: true });
      const privateKeyBytes = await recoveryKey.export()
      const privateKey = ui8.toString(privateKeyBytes, "hex")

      // at this point, the token for the public ledger chain Op
      // is sent to the email address associated with `sourceAgent` (pretty-much the Old PDS)
      await sourceAgent.com.atproto.identity.requestPlcOperationSignature()
      const getDidCredentials = await sinkAgent.com.atproto.identity.getRecommendedDidCredentials();
      const rotationKeys = getDidCredentials.data.rotationKeys ?? []
      if (!rotationKeys) {
        throw new Error("No rotation keys provided")
      }
      const credentials = {
        ...getDidCredentials.data,
        rotationKeys: [recoveryKey.did(), ...rotationKeys]
      }

      const TOKEN = "HAGSKABaaajkqtyi81" // we'll obtain this via user input.
      const plcOp = await sourceAgent.com.atproto.identity.signPlcOperation({
        token: TOKEN,
        ...credentials,
      })

      // we should probably show this in a modal with a clipborad icon which allows
      // people to copy to their clipboard via `navigator.clipboard`
      console.log(
        `❗ Your private recovery key is: ${privateKey}. Please store this in a secure location! ❗`,
      )

      await sinkAgent.com.atproto.identity.submitPlcOperation({
        operation: plcOp.data.operation
      })
      await sinkAgent.com.atproto.server.activateAccount()

    } else {
      console.log('not restoring:')
      console.log('repos', repos)
    }
  }
  return (
    <div>
      <h3>Restore this backup to a new server:</h3>
      <div className="flex flex-row justify-evenly">
        <div>
          {sourceSession ? (
            <h3 className="text-lg uppercase">
              Authenticated to your old Bluesky host {sourceSession.pdsUrl?.toString()}
            </h3>
          ) : (
            <div className="my-4">
              <h3 className="font-bold">Authenticate to current Bluesky server</h3>
              <AtprotoLoginForm login={loginToSource} defaultServer={ATPROTO_DEFAULT_SOURCE} />
            </div>
          )}
        </div>
        <div>
          {sinkSession ? (
            <div>
              Authenticated to your new Bluesky host {sinkSession.pdsUrl?.toString()}
            </div>
          ) : (
            <div className="my-4">
              <h3 className="font-bold">Authenticate to new Bluesky server</h3>
              <AtprotoLoginForm login={loginToSink} defaultServer={ATPROTO_DEFAULT_SINK} />
              <h4 className="font-bold">OR</h4>
              <h3 className="font-bold">Create a new Bluesky account</h3>
              <AtprotoCreateAccountForm createAccount={createAccount} defaultServer={ATPROTO_DEFAULT_SINK} />
            </div>
          )}
        </div>
      </div>
      {(sourceSession && sinkSession) ? (
        <button onClick={restore} className='btn'>Restore</button>
      ) : (
        <div>
          Please log in to your old and new Bluesky servers.
        </div>
      )}
    </div>
  )
}

function AtprotoLoginForm ({ login, defaultServer }: AtprotoLoginFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<LoginForm>()

  return (
    <form onSubmit={handleSubmit((data) => login(data.handle, data.password, { server: data.server || `https://${defaultServer}` }))}
      className="flex flex-col space-y-2">
      <label>
        <h4 className="text-xs uppercase font-bold">Server</h4>
        <input {...register('server')}
          className="ipt w-full" placeholder={`https://${defaultServer}`} />
      </label>
      <label>
        <h4 className="text-xs uppercase font-bold">Handle</h4>
        <input {...register('handle')}
          className="ipt w-full" placeholder={`racha.${defaultServer}`} />
      </label>
      <label>
        <h4 className="text-xs uppercase font-bold">Password</h4>
        <input type="password" {...register('password')}
          className="ipt w-full" />
      </label>
      <input className="btn" type="submit" value="Log In" />
    </form>
  )
}

function AtprotoCreateAccountForm ({ createAccount, defaultServer }: AtprotoCreateAccountFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<CreateAccountForm>()

  return (
    <form onSubmit={handleSubmit((data) => createAccount(data.handle, data.password, data.email, {
      server: data.server || `https://${defaultServer}`,
      inviteCode: data.inviteCode
    }))}
      className="flex flex-col space-y-2">
      <label>
        <h4 className="text-xs uppercase font-bold">Server</h4>
        <input {...register('server')}
          className="ipt w-full w-full" placeholder={`https://${defaultServer}`} />
      </label>
      <label>
        <h4 className="text-xs uppercase font-bold">Handle</h4>
        <input {...register('handle')}
          className="ipt w-full w-full" placeholder={`racha.${defaultServer}`} />
      </label>
      <label>
        <h4 className="text-xs uppercase font-bold">Email</h4>
        <input {...register('email')}
          className="ipt w-full w-full" placeholder={`racha@storacha.network`} />
      </label>
      <label>
        <h4 className="text-xs uppercase font-bold">Password</h4>
        <input type="password" {...register('password')}
          className="ipt w-full w-full" />
      </label>
      <label>
        <h4 className="text-xs uppercase font-bold">Invite Code</h4>
        <input {...register('inviteCode')}
          className="ipt w-full w-full" />
      </label>
      <input className="btn" type="submit" value="Log In" />
    </form>
  )
}
