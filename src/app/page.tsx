"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [handle, setHandle] = useState<string>("");

  const signIn = async () => {
    const state = uuidv4();
    await fetch(`/api/bluesky-auth/login?handle=${handle}&state=${state}`, {
      method: "POST",
    });
  };

  return (
    <>
      <h1>Blusky Backup Webapp</h1>
      <p>Lets get started</p>
      <div>
        <h4>Bluesky Auth</h4>
        <input
          onChange={(e) => {
            e.preventDefault();
            setHandle(e.target.value);
          }}
          value={handle}
          placeholder="Handler"
        />
        <button onClick={signIn}>Sign in</button>
      </div>
    </>
  );
}
