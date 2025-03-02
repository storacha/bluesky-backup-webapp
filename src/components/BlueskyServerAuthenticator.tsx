"use client";

import { redirect } from "next/navigation";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
export default function BlueskyServerAuthenticator() {
  const [handle, setHandle] = useState<string>("");

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

    // const url = new URL(await url.text());

    console.log("login");
  }, [handle]);

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
