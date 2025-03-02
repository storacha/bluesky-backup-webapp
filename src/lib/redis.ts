import Redis from "ioredis";
import { NodeSavedSession, NodeSavedState } from "@atproto/oauth-client-node";

if (!process.env.REDIS_URL) {
  throw new Error('Missing REDIS_URL');
}

export const redis = new Redis(process.env.REDIS_URL);

export const setStateStore = async (key: string, internalState: NodeSavedState): Promise<void> => {
  await redis.set(key, JSON.stringify(internalState));
}

export const getStateStore = async (key: string): Promise<NodeSavedState | undefined> => {
  const state = await redis.get(key);
  if (!state) {
    return;
  }
  return JSON.parse(state);
}

export const delStateStore = async (key: string): Promise<void> => {
  await redis.del(key);
}

export const setSessionStore = async (sub: string, session: NodeSavedSession): Promise<void> => {
  await redis.set(sub, JSON.stringify(session));
}

export const getSessionStore = async (sub: string): Promise<NodeSavedSession | undefined> => {
  const session = await redis.get(sub);
  if (!session) {
    return;
  }
  return JSON.parse(session);
}

export const delSessionStore = async (sub: string): Promise<void> => {
  await redis.del(sub);
}
