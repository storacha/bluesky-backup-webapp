import { CredentialSession, Agent } from "@atproto/api";

export type LocalSession = {
  pdSession: CredentialSession;
  pdAgent: Agent;
};

export const useLocalPdsSession = () => {
  if (typeof window === "undefined") return { session: undefined };

  const localSesh = localStorage.getItem("localSession");
  if (!localSesh) return { session: undefined };

  try {
    const sessionData = JSON.parse(localSesh);
    const serviceUrl = new URL(sessionData.serviceUrl);
    const session = new CredentialSession(serviceUrl);

    session.session = sessionData.session;
    const agent = new Agent(session);

    return { session: { pdSession: session, pdAgent: agent } };
  } catch (error) {
    console.error("Error restoring session:", error);
    return { session: undefined };
  }
};
