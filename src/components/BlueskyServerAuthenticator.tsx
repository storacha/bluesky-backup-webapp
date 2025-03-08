"use client";

import { redirect } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface BlueskySession {
  did: string;
  handle: string;
}

export default function BlueskyServerAuthenticator() {
  const [handle, setHandle] = useState<string>("");
  const [session, setSession] = useState<BlueskySession | null>(null);

  useEffect(() => {
    // Check if we have a session cookie on mount
    const checkSession = async () => {
      const response = await fetch("/api/bluesky-auth/session");
      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setSession(data.session);
        }
      }
    };

    checkSession();
  }, []);

  const signIn = useCallback(async () => {
    const state = uuidv4();

    const response = await fetch(
      `/api/bluesky-auth/login?handle=${handle}&state=${state}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    redirect(data.url);
  }, [handle]);

  const signOut = useCallback(async () => {
    const response = await fetch("/api/bluesky-auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      setSession(null);
    }
  }, []);

  if (session) {
    return (
      <div className="flex flex-col gap-2">
        <div>Logged in as: {session.handle}</div>
        <div>DID: {session.did}</div>
        <button onClick={signOut} className="btn">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <input
          onChange={(e) => {
            e.preventDefault();
            setHandle(e.target.value);
          }}
          value={handle}
          placeholder="Bluesky Handle"
          className="ipt"
        />
        <button onClick={signIn} className="btn">
          Sign in
        </button>
      </div>
    </div>
  );
}
