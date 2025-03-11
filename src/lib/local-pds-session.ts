import { CredentialSession, Agent } from "@atproto/api";
import { useState } from "react";

export type LocalSession = {
  pdSession: CredentialSession;
  pdAgent: Agent;
};

export const useLocalPdsSession = () => {
  const getSession = (): LocalSession | undefined => {
    if (typeof window === "undefined") return undefined
    const localSesh = localStorage.getItem("localSession")
    if (!localSesh) return undefined

    try {
      const sessionData = JSON.parse(localSesh)
      const serviceUrl = new URL(sessionData.serviceUrl)
      const session = new CredentialSession(serviceUrl)
      session.session = sessionData.session
      const agent = new Agent(session)
      return { pdSession: session, pdAgent: agent }
    } catch (error) {
      console.error("Error restoring session:", error)
      return undefined
    }
  }

  const [session] = useState<LocalSession | undefined>(getSession())

  return { session }
}
