import BlueskyAuthenticator from "@/components/BlueskyAuthenticator";
import StorachaAuthenticator from "@/components/StorachaAuthenticator";
import { Backups } from "@/components/Backups";
import BackupUI from "@/components/BackupUI";

export default function Home () {
  return (
    <div className="bg-white/80 p-10 h-full min-h-screen">
      <h1 className="text-lg mb-8 font-bold font-mono uppercase">Bluesky Backups</h1>
      <div className="mb-4">
        <h4 className="text-sm font-bold font-mono uppercase">Bluesky Auth</h4>
        <div className="p-2 bg-white/50 rounded-lg">
          <BlueskyAuthenticator />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-bold font-mono uppercase">Storacha Auth</h4>
        <div className="p-2 bg-white/50 rounded-lg">
          <StorachaAuthenticator />
        </div>
      </div>

      <BackupUI />

      <Backups className="mt-16" />
    </div>
  )
}
